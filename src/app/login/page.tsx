'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input } from '@/components/Primitives';
import { Coffee, AlertCircle, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('chen@university.edu'); 
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email);
      router.push('/dashboard');
    } catch (e) {
      // 错误已由 Context 捕获并显示
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 bg-brand-cream relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100 relative z-10">
        <div className="text-center mb-8">
          <div className="bg-brand-green w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-green/20">
            <Coffee className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark tracking-tight">欢迎回来</h2>
          <p className="text-gray-500 mt-2 text-sm">登录以管理您的专属学习空间</p>
        </div>

        {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg flex items-start text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="邮箱地址" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@university.edu"
            className="bg-gray-50 focus:bg-white"
            required
          />
          <div className="relative">
             <Input 
                label="密码" 
                type="password" 
                value="password"
                disabled
                placeholder="••••••••"
                className="bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <Lock className="absolute right-3 top-[34px] w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
             <span>演示账号：无需密码</span>
             <span className="text-brand-green hover:underline cursor-pointer">忘记密码?</span>
          </div>

          <Button type="submit" className="w-full py-3 text-lg group" isLoading={isLoading}>
            登录
            {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
           <p className="text-sm text-gray-600">
             还没有账号？ 
             <Link href="/register" className="text-brand-green font-bold ml-1 hover:text-brand-dark transition-colors">
               免费注册
             </Link>
           </p>
        </div>
      </div>
    </div>
  );
}
