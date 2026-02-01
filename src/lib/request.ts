import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from './token';

// 类型定义

// API 响应体结构
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// API 错误类
// 继承 Error 类，添加状态码和数据字段
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
  // 标记是否已重试，避免无限循环
  _retry?: boolean;
  // 是否跳过 Token 注入（如登录/注册接口）
  skipAuth?: boolean;
}

// 导出给外部使用的配置类型
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

interface RequestLayerConfig {
  // 基础 URL
  baseURL: string;
  // 认证头字段，默认 Authorization
  authHeader?: string;
  // 登录页面路径
  loginUrl?: string;
  refreshTokenUrl?: string;
}

// 请求层封装

class RequestLayer {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private requestsQueue: ((token: string) => void)[] = [];
  private config: RequestLayerConfig;

  constructor(config: RequestLayerConfig) {
    this.config = {
      authHeader: 'Authorization',
      loginUrl: '/login',
      refreshTokenUrl: '/auth/refresh', // 相对 baseURL 的路径
      ...config,
    };

    this.instance = axios.create({
      baseURL: this.config.baseURL,
      timeout: 15000, // 增加一点超时时间
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 从内存获取 Access Token 并注入请求头
        const token = getAccessToken();
        const customConfig = config as CustomRequestConfig;
        
        if (token && config.headers && !customConfig.skipAuth) {
            config.headers.set(this.config.authHeader!, `Bearer ${token}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
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

        // 捕获 401 错误，触发 Token 刷新逻辑
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          if (this.isRefreshing) {
            // 并发处理：若正在刷新，将后续请求加入队列等待
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
            // 发起刷新请求，获取新 Token (Cookie 会自动携带 RT)
            const newToken = await this.refreshToken();
            
            // 刷新成功，更新内存中的 Token
            setAccessToken(newToken);

            // 执行队列中的挂起请求
            this.requestsQueue.forEach((cb) => cb(newToken));
            this.requestsQueue = [];

            // 重试当前请求
            if (originalRequest.headers) {
                originalRequest.headers.set(this.config.authHeader!, `Bearer ${newToken}`);
            }
            return this.instance(originalRequest);
          } catch (refreshError) {
            // 刷新失败 (RT 也过期)，强制登出
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
    try {
        const res = await axios.post<ApiResponse<{ token: string }>>(
            this.config.refreshTokenUrl!, 
            {}, 
            { 
                baseURL: this.config.baseURL,
            }
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
      // 避免服务端执行
      window.location.href = this.config.loginUrl!;
    }
  }

  // 公共方法 (泛型增强)

  public async get<T = any, R = T>(url: string, config?: RequestConfig): Promise<R> {
    return this.instance.get(url, config) as Promise<R>;
  }

  public async post<T = any, R = T>(url: string, data?: any, config?: RequestConfig): Promise<R> {
    return this.instance.post(url, data, config) as Promise<R>;
  }

  public async put<T = any, R = T>(url: string, data?: any, config?: RequestConfig): Promise<R> {
    return this.instance.put(url, data, config) as Promise<R>;
  }

  public async delete<T = any, R = T>(url: string, config?: RequestConfig): Promise<R> {
    return this.instance.delete(url, config) as Promise<R>;
  }
}

// 导出单例
export const request = new RequestLayer({
    baseURL: '/api'
});
