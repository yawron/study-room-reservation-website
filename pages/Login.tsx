import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/UI';
import { Coffee } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('chen@university.edu'); // Pre-fill for demo
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-t-4 border-brand-green">
        <div className="text-center mb-8">
          <div className="bg-brand-green w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark">登录 StarStudy</h2>
          <p className="text-gray-500 mt-2">管理您的预订和行程</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="邮箱地址" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@university.edu"
            required
          />
          <Input 
            label="密码" 
            type="password" 
            value="password"
            disabled
            placeholder="••••••••"
          />
          <div className="text-xs text-gray-400 text-center">
             (演示模式：直接点击登录即可)
          </div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            登录
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
           还没有账号？ <span className="text-brand-green font-semibold cursor-pointer">立即注册</span>
        </div>
      </div>
    </div>
  );
};