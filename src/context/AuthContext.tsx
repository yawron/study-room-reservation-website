'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';
import { api } from '../services/apiService';
import { setAccessToken, clearAccessToken } from '../lib/token';


interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null, 
    isAuthenticated: false,
    isLoading: true,
  });
  const [error, setError] = useState<string | null>(null);

  // 检查现有会话
  useEffect(() => {
    const checkSession = async () => {
      // 尝试从 API 获取用户信息 (自动触发 Token 刷新)
      try {
        const user = await api.getProfile();
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        // 验证失败，清除所有状态
        clearAccessToken(); // 确保内存也清理
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };
    checkSession();
  }, []);

  const handleAuthSuccess = (user: User, token: string) => {
    // Token 存入内存
    setAccessToken(token);
    
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    setError(null);
  };

  const login = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await api.login(email);
      handleAuthSuccess(response.user, response.token);
    } catch (err: any) {
      setError(err.message || '登录失败');
      setState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const register = async (name: string, email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await api.register(name, email);
      handleAuthSuccess(response.user, response.token);
    } catch (err: any) {
      setError(err.message || '注册失败');
      setState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error('Logout failed', e);
    }
    clearAccessToken();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
