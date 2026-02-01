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
       {/* Decorative shapes */}
       <div className="absolute top-20 right-20 w-24 h-24 bg-brand-gold border-2 border-black rounded-none shadow-neo hidden md:block rotate-45"></div>
       <div className="absolute bottom-20 left-20 w-32 h-32 bg-brand-green border-2 border-black rounded-full shadow-neo hidden md:block"></div>

      <div className="max-w-md w-full bg-white rounded-lg border-2 border-black shadow-neo-lg p-8 md:p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="bg-black w-16 h-16 rounded-lg border-2 border-black flex items-center justify-center mx-auto mb-5 shadow-neo">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-black tracking-tight uppercase">加入 StarStudy</h2>
          <p className="text-gray-600 mt-2 text-base font-bold">开启您的高效学习之旅</p>
        </div>

        {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-500 text-red-600 px-4 py-3 rounded-lg flex items-start text-sm font-bold shadow-neo-sm">
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
            className="bg-white"
            required
          />
          <Input 
            label="学校/工作邮箱" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="bg-white"
            required
          />
          <div>
            <Input 
                label="设置密码" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位字符"
                className="bg-white"
                required
            />
            <p className="text-xs font-bold text-gray-500 mt-1 ml-1">密码长度需大于6位</p>
          </div>
          
          <Button type="submit" className="w-full py-3 text-lg group bg-black hover:bg-gray-800 text-white border-2 border-black shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]" isLoading={isLoading}>
            立即注册
            {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t-2 border-black text-center">
           <p className="text-sm font-bold text-gray-600">
             已有账号？ 
             <Link href="/login" className="text-brand-green ml-1 hover:text-black hover:underline transition-colors">
               直接登录
             </Link>
           </p>
        </div>
      </div>
    </div>
  );
}
