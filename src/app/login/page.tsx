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
      {/* Decorative shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-brand-green border-2 border-black rounded-full shadow-neo opacity-20 hidden md:block"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-accent border-2 border-black rounded-none rotate-12 shadow-neo opacity-20 hidden md:block"></div>

      <div className="max-w-md w-full bg-white rounded-lg border-2 border-black shadow-neo-lg p-8 md:p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="bg-brand-green w-16 h-16 rounded-lg border-2 border-black flex items-center justify-center mx-auto mb-5 shadow-neo">
            <Coffee className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-3xl font-black text-black tracking-tight uppercase">欢迎回来</h2>
          <p className="text-gray-600 mt-2 text-base font-bold">登录以管理您的专属学习空间</p>
        </div>

        {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-500 text-red-600 px-4 py-3 rounded-lg flex items-start text-sm font-bold shadow-neo-sm">
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
            className="bg-white"
            required
          />
          <div className="relative">
             <Input 
                label="密码" 
                type="password" 
                value="password"
                disabled
                placeholder="••••••••"
                className="bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <Lock className="absolute right-3 top-[34px] w-4 h-4 text-gray-500" />
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-gray-500">
             <span>演示账号：无需密码</span>
             <span className="text-brand-green hover:underline cursor-pointer hover:text-black transition-colors">忘记密码?</span>
          </div>

          <Button type="submit" className="w-full py-3 text-lg group" isLoading={isLoading}>
            登录
            {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t-2 border-black text-center">
           <p className="text-sm font-bold text-gray-600">
             还没有账号？ 
             <Link href="/register" className="text-brand-green ml-1 hover:text-black hover:underline transition-colors">
               免费注册
             </Link>
           </p>
        </div>
      </div>
    </div>
  );
}
