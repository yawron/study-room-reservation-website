import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from './token';

// ==========================================
// 类型定义
// ==========================================

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

export class ApiError extends Error {
  code: number;
  data: any;

  constructor(message: string, code: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.data = data;
  }
}

// 扩展 AxiosRequestConfig
interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RequestLayerConfig {
  baseURL: string;
  authHeader?: string;
  tokenKey?: string;
  loginUrl?: string;
  refreshTokenUrl?: string;
}

// ==========================================
// 请求层封装
// ==========================================

class RequestLayer {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private requestsQueue: ((token: string) => void)[] = [];
  private config: RequestLayerConfig;

  constructor(config: RequestLayerConfig) {
    this.config = {
      authHeader: 'Authorization',
      tokenKey: 'starstudy_token', // 这里的 tokenKey 仅作为配置保留，主要用于兼容或未来扩展，实际 AccessToken 走内存
      loginUrl: '/login',
      refreshTokenUrl: '/auth/refresh', // 相对 baseURL 的路径
      ...config,
    };

    this.instance = axios.create({
      baseURL: this.config.baseURL,
      timeout: 15000, // 增加一点超时时间
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // --- 请求拦截器 ---
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 从内存中获取 Token
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.set(this.config.authHeader!, `Bearer ${token}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // --- 响应拦截器 ---
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 解包逻辑：约定后端返回结构 { code, data, message }
        const resData = response.data;
        
        // 1. 如果 HTTP 200 且 业务 Code 200 -> 成功
        if (resData.code === 200) {
            return resData.data;
        }
        
        // 2. 业务逻辑错误 -> 抛出 ApiError
        return Promise.reject(new ApiError(resData.message || '业务处理失败', resData.code, resData.data));
      },
      async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config as CustomRequestConfig;

        // 处理 401 未授权 (Token 过期)
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          if (this.isRefreshing) {
            // 如果正在刷新，将当前请求加入队列
            return new Promise((resolve) => {
              this.requestsQueue.push((newToken) => {
                if (originalRequest.headers) {
                    originalRequest.headers.set(this.config.authHeader!, `Bearer ${newToken}`);
                }
                resolve(this.instance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            
            // 刷新成功，更新内存中的 Token
            setAccessToken(newToken);

            // 执行队列中的请求
            this.requestsQueue.forEach((cb) => cb(newToken));
            this.requestsQueue = [];

            // 重试当前请求
            if (originalRequest.headers) {
                originalRequest.headers.set(this.config.authHeader!, `Bearer ${newToken}`);
            }
            return this.instance(originalRequest);
          } catch (refreshError) {
            // 刷新失败，清除状态并跳转
            this.handleSessionExpired();
            return Promise.reject(new ApiError('会话已失效，请重新登录', 401));
          } finally {
            this.isRefreshing = false;
          }
        }

        // 处理其他网络/服务器错误
        const message = error.response?.data?.message || error.message || '网络请求异常';
        const code = error.response?.status || 500;
        return Promise.reject(new ApiError(message, code));
      }
    );
  }

  private async refreshToken(): Promise<string> {
    // 使用一个新的 axios 实例来刷新，避免拦截器死循环
    // 注意：baseURL 需要与主实例一致，或者手动拼接
    // 这里我们假设 refreshTokenUrl 是相对于 baseURL 的
    const refreshUrl = `${this.config.baseURL}${this.config.refreshTokenUrl}`;
    
    try {
        const res = await axios.post<ApiResponse<{ token: string }>>(
            refreshUrl, 
            {}, 
            { withCredentials: true }
        );
        
        if (res.data.code === 200 && res.data.data?.token) {
            return res.data.data.token;
        }
        throw new Error(res.data.message || '刷新失败');
    } catch (e) {
        throw e;
    }
  }

  private handleSessionExpired() {
    this.requestsQueue = [];
    clearAccessToken();
    if (typeof window !== 'undefined') {
      // 清理其他可能的用户信息
      localStorage.removeItem('starstudy_user');
      // 避免服务端执行
      window.location.href = this.config.loginUrl!;
    }
  }

  // --- 公共方法 (泛型增强) ---

  public async get<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.get(url, config) as Promise<R>;
  }

  public async post<T = any, R = T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.post(url, data, config) as Promise<R>;
  }

  public async put<T = any, R = T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.put(url, data, config) as Promise<R>;
  }

  public async delete<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.delete(url, config) as Promise<R>;
  }
}

// 导出单例
export const request = new RequestLayer({
    baseURL: '/api'
});
