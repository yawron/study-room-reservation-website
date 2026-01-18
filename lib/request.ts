import { User } from '../types';

// ==========================================
// 请求层封装 (Simulated Axios with Interceptors)
// ==========================================

interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

interface RequestConfig {
  headers?: Record<string, string>;
  _retry?: boolean; // 内部标记，防止无限重试
}

class RequestLayer {
  private baseUrl: string;
  // --- JWT 双令牌刷新逻辑核心变量 ---
  private isRefreshing = false;
  private requestsQueue: ((token: string) => void)[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // --- 1. 请求拦截器 (Request Interceptor) ---
  private async requestInterceptor(config: RequestConfig): Promise<RequestConfig> {
    const newConfig = { ...config, headers: { ...config.headers } };
    
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('starstudy_token');
        if (token) {
           newConfig.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    return newConfig;
  }

  // --- 2. 响应拦截器 (Response Interceptor) ---
  private async responseInterceptor(response: ApiResponse, originalRequestConfig: RequestConfig, url: string, method: string, data?: any): Promise<any> {
    // Case 1: 正常成功
    if (response.code === 200) {
      return response.data;
    } 
    
    // Case 2: Token 过期 (401) 且未重试过
    else if (response.code === 401 && !originalRequestConfig._retry) {
      if (this.isRefreshing) {
        return new Promise((resolve) => {
          this.requestsQueue.push((newToken) => {
            originalRequestConfig.headers = { ...originalRequestConfig.headers, Authorization: `Bearer ${newToken}` };
            resolve(this.requestLogic(url, method, data, originalRequestConfig));
          });
        });
      }

      originalRequestConfig._retry = true;
      this.isRefreshing = true;

      try {
        const newToken = await this.refreshTokenNetwork();
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('starstudy_token', newToken);
        }
        
        this.requestsQueue.forEach(cb => cb(newToken));
        this.requestsQueue = [];
        
        originalRequestConfig.headers = { ...originalRequestConfig.headers, Authorization: `Bearer ${newToken}` };
        return this.requestLogic(url, method, data, originalRequestConfig);
      } catch (refreshErr) {
        this.requestsQueue = [];
        if (typeof window !== 'undefined') {
            localStorage.removeItem('starstudy_token');
            localStorage.removeItem('starstudy_user');
            window.location.href = '/login'; 
        }
        throw new Error('会话已失效，请重新登录');
      } finally {
        this.isRefreshing = false;
      }
    } 
    
    // Case 3: 其他错误
    else {
      throw new Error(response.message || '网络请求异常');
    }
  }

  private async refreshTokenNetwork(): Promise<string> {
      const base =
        typeof window !== 'undefined'
          ? window.location.origin
          : (process.env.NEXT_PUBLIC_BASE_URL ||
             (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));
      const resp = await fetch(`${base}/api/auth/refresh`, { method: 'POST', credentials: 'same-origin' });
      const json = await resp.json().catch(() => ({ code: 500, data: null, message: '刷新失败' }));
      if (json.code === 200 && json.data?.token) {
        return json.data.token as string;
      }
      throw new Error(json.message || '刷新失败');
  }

  // --- 核心请求逻辑 ---
  private async requestLogic<T>(url: string, method: string, data: any, config: RequestConfig): Promise<T> {
    const finalConfig = await this.requestInterceptor(config);
    
    await new Promise(resolve => setTimeout(resolve, method === 'GET' ? 200 : 500));

    let mockResponse: ApiResponse;
    try {
        const networkEligible =
          url.startsWith('/auth/') || url === '/rooms';
        if (networkEligible) {
          mockResponse = await this.networkRouter(url, method, data, finalConfig);
        } else {
          mockResponse = await this.mockRouter(url, method, data, finalConfig);
        }
    } catch (e: any) {
        mockResponse = { code: 500, data: null, message: e.message };
    }

    return this.responseInterceptor(mockResponse, config, url, method, data);
  }

  public async get<T>(url: string, config: RequestConfig = {}): Promise<T> {
    return this.requestLogic(url, 'GET', null, config);
  }

  public async post<T>(url: string, data: any, config: RequestConfig = {}): Promise<T> {
    return this.requestLogic(url, 'POST', data, config);
  }

  private async networkRouter(url: string, method: string, body: any, config: RequestConfig): Promise<ApiResponse> {
     const base =
       typeof window !== 'undefined'
         ? window.location.origin
         : (process.env.NEXT_PUBLIC_BASE_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));
     const map: Record<string, string> = {
       '/auth/login': '/api/auth/login',
       '/auth/register': '/api/auth/register',
       '/rooms': '/api/rooms',
     };
     const path = map[url] ?? url;
     const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(config.headers || {}) };
     const resp = await fetch(`${base}${path}`, {
       method,
       headers,
       body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
       credentials: 'same-origin',
     });
     const json = await resp.json().catch(() => ({ code: 500, data: null, message: '网络错误' }));
     return json as ApiResponse;
  }

  // --- Mock 路由表 ---
  private async mockRouter(url: string, method: string, body: any, config: RequestConfig): Promise<ApiResponse> {
     // Dynamic import to avoid SSR issues with mockData localstorage
     const { MOCK_ROOMS, getStoredUsers, addUser } = await import('../services/mockData');
     
     // Auth Routes
     if (url === '/auth/login' && method === 'POST') {
         const users = getStoredUsers();
         const user = users.find(u => u.email === body.email);
         if (user) {
             return { code: 200, data: { user, token: 'jwt_' + Date.now() }, message: '登录成功' };
         }
         return { code: 400, data: null, message: '账号不存在或密码错误' };
     }

     if (url === '/auth/register' && method === 'POST') {
         const users = getStoredUsers();
         if (users.find(u => u.email === body.email)) {
             return { code: 400, data: null, message: '该邮箱已被注册' };
         }
         const newUser = addUser(body);
         return { code: 200, data: { user: newUser, token: 'jwt_' + Date.now() }, message: '注册成功' };
     }

     const authHeader = config.headers?.['Authorization'];
     if (!authHeader) {
         if (url !== '/rooms' && method === 'GET') { 
             return { code: 401, data: null, message: '未授权' };
         }
     }

     if (url === '/rooms' && method === 'GET') {
         return { code: 200, data: MOCK_ROOMS, message: '获取成功' };
     }

     return { code: 200, data: { success: true }, message: '操作成功' };
  }
}

export const request = new RequestLayer('/api/v1');
