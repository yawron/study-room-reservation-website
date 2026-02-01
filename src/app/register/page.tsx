'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input } from '@/components/Primitives';
import { AlertCircle, ArrowRight, User as UserIcon } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        return;
    }
    try {
      await register(name, email);
      router.push('/dashboard');
    } catch (e) {
      // Error handled by context state
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 bg-brand-cream relative overflow-hidden">
       <div className="absolute top-10 right-10 w-40 h-40 bg-brand-green/5 rounded-full blur-3xl"></div>
       <div className="absolute bottom-10 left-10 w-60 h-60 bg-brand-gold/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100 relative z-10">
        <div className="text-center mb-8">
          <div className="bg-brand-dark w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
            <UserIcon className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark tracking-tight">加入 StarStudy</h2>
          <p className="text-gray-500 mt-2 text-sm">开启您的高效学习之旅</p>
        </div>

        {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg flex items-start text-sm animate-in fade-in">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="如何称呼您" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：Alex"
            className="bg-gray-50 focus:bg-white"
            required
          />
          <Input 
            label="学校/工作邮箱" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="bg-gray-50 focus:bg-white"
            required
          />
          <div>
            <Input 
                label="设置密码" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位字符"
                className="bg-gray-50 focus:bg-white"
                required
            />
            <p className="text-xs text-gray-400 mt-1 ml-1">密码长度需大于6位</p>
          </div>
          
          <Button type="submit" className="w-full py-3 text-lg group bg-brand-dark hover:bg-black" isLoading={isLoading}>
            立即注册
            {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
           <p className="text-sm text-gray-600">
             已有账号？ 
             <Link href="/login" className="text-brand-green font-bold ml-1 hover:text-brand-dark transition-colors">
               直接登录
             </Link>
           </p>
        </div>
      </div>
    </div>
  );
}
