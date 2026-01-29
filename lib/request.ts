import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ==========================================
// 请求层封装 (Standard Axios with Interceptors)
// ==========================================

// 定义通用响应结构
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 扩展 AxiosRequestConfig 以支持自定义属性
interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 内部标记，防止无限重试
}

class RequestLayer {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private requestsQueue: ((token: string) => void)[] = [];

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // 允许跨域携带 Cookie (关键: 用于发送 Refresh Token)
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // --- 请求拦截器 ---
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('starstudy_token');
          if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // --- 响应拦截器 ---
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 直接返回 data 字段中的 payload (假设后端返回格式为 { code, data, message })
        // 如果后端返回的就是标准 AxiosResponse，这里可以根据约定解包
        // 这里我们约定：只要 HTTP 状态码是 200，就认为请求成功，但业务状态码(code)可能不是 200
        const resData = response.data;
        
        // 如果业务状态码也是 200，直接返回数据部分
        if (resData.code === 200) {
            return resData.data;
        }
        
        // 兼容处理：有些接口可能直接返回数据没有 code 包装，或者 code 不在顶层
        // 这里根据项目约定，假设所有接口都遵循 ApiResponse 结构
        // 如果遇到非 200 的业务错误，抛出异常
        return Promise.reject(new Error(resData.message || '业务处理失败'));
      },
      async (error) => {
        const originalRequest = error.config as CustomRequestConfig;

        // 处理 401 未授权 (Token 过期)
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // 如果正在刷新，将当前请求加入队列
            return new Promise((resolve) => {
              this.requestsQueue.push((newToken) => {
                originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
                resolve(this.instance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // 尝试刷新 Token
            const newToken = await this.refreshToken();
            
            // 刷新成功，更新本地存储
            if (typeof window !== 'undefined') {
              localStorage.setItem('starstudy_token', newToken);
            }

            // 执行队列中的请求
            this.requestsQueue.forEach((cb) => cb(newToken));
            this.requestsQueue = [];

            // 重试当前请求
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
            return this.instance(originalRequest);
          } catch (refreshError) {
            // 刷新失败，清除状态并跳转登录
            this.requestsQueue = [];
            if (typeof window !== 'undefined') {
              localStorage.removeItem('starstudy_token');
              localStorage.removeItem('starstudy_user');
              // 避免在服务端执行跳转
              window.location.href = '/login';
            }
            return Promise.reject(new Error('会话已失效，请重新登录'));
          } finally {
            this.isRefreshing = false;
          }
        }

        // 处理其他错误
        const message = error.response?.data?.message || error.message || '网络请求异常';
        return Promise.reject(new Error(message));
      }
    );
  }

  // 刷新 Token 的具体实现
  private async refreshToken(): Promise<string> {
    // 使用一个新的 axios 实例来刷新，避免拦截器死循环
    // 注意：这里必须带上 withCredentials: true 以发送 HttpOnly Cookie
    const res = await axios.post<ApiResponse<{ token: string }>>(
      '/api/auth/refresh', 
      {}, 
      { withCredentials: true }
    );
    
    if (res.data.code === 200 && res.data.data?.token) {
        return res.data.data.token;
    }
    throw new Error(res.data.message || '刷新失败');
  }

  // --- 公共方法 ---

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config) as Promise<T>;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config) as Promise<T>;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config) as Promise<T>;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config) as Promise<T>;
  }
}

// 导出单例，BaseURL 默认为 /api
export const request = new RequestLayer('/api');
