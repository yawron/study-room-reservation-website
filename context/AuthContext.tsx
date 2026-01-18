'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';
import { api } from '../services/apiService';

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

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('starstudy_user');
        const token = localStorage.getItem('starstudy_token');
        if (storedUser && token) {
          setState({
            user: JSON.parse(storedUser),
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
         setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    checkSession();
  }, []);

  const handleAuthSuccess = (user: User, token: string) => {
    localStorage.setItem('starstudy_user', JSON.stringify(user));
    localStorage.setItem('starstudy_token', token);
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

  const logout = () => {
    localStorage.removeItem('starstudy_user');
    localStorage.removeItem('starstudy_token');
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