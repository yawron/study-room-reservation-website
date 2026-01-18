'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Coffee, Menu as MenuIcon, X, LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './UI';
import { Drawer } from './Drawer'; 
import { Menu } from './Menu'; 

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  const isActiveLink = (path: string) => pathname === path;
  const getLinkClass = (path: string) => `text-sm font-semibold tracking-wide hover:text-brand-green transition-colors ${isActiveLink(path) ? 'text-brand-green' : 'text-gray-600'}`;
  const getMobileLinkClass = (path: string) => `block px-4 py-3 text-base font-medium rounded-xl transition-colors ${isActiveLink(path) ? 'bg-brand-green/10 text-brand-green' : 'text-gray-700 hover:bg-gray-50'}`;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer active:scale-95 transition-transform" onClick={() => router.push('/')}>
              <div className="bg-brand-green p-1.5 md:p-2 rounded-full mr-2">
                <Coffee className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <span className="font-bold text-lg md:text-xl tracking-tight text-brand-dark">STARSTUDY</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/" className={getLinkClass('/')}>首页</Link>
              <Link href="/rooms" className={getLinkClass('/rooms')}>所有房型</Link>
              {isAuthenticated && (
                 <Link href="/dashboard" className={getLinkClass('/dashboard')}>我的预订</Link>
              )}
            </div>

            {/* User Auth (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Menu.Root>
                  <Menu.Trigger>
                    <div className="flex items-center space-x-2 text-sm font-medium text-brand-dark hover:bg-gray-100 px-3 py-2 rounded-full transition-colors select-none">
                       {user?.avatar ? (
                         <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-gray-200" />
                       ) : (
                         <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center">
                           <User className="w-4 h-4 text-brand-green" />
                         </div>
                       )}
                       <span>{user?.name}</span>
                       <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </Menu.Trigger>

                  <Menu.List>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Menu.Item icon={<LayoutDashboard className="w-4 h-4"/>} onClick={() => router.push('/dashboard')}>
                       我的仪表盘
                    </Menu.Item>
                    <Menu.Item icon={<User className="w-4 h-4"/>} onClick={() => console.log('Profile')}>
                       个人资料
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item variant="danger" icon={<LogOut className="w-4 h-4"/>} onClick={handleLogout}>
                       退出登录
                    </Menu.Item>
                  </Menu.List>
                </Menu.Root>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => router.push('/login')}>登录</Button>
                  <Button size="sm" onClick={() => router.push('/login')}>注册</Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-brand-dark p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Drawer.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Drawer.Overlay />
        <Drawer.Content side="top" className="mt-[64px] border-t border-gray-100">
             <div className="px-4 py-4 space-y-1">
                 <Link href="/" onClick={() => setIsOpen(false)} className={getMobileLinkClass('/')}>首页</Link>
                 <Link href="/rooms" onClick={() => setIsOpen(false)} className={getMobileLinkClass('/rooms')}>所有房型</Link>
                 {isAuthenticated && (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className={getMobileLinkClass('/dashboard')}>我的预订</Link>
                 )}
                 
                 <div className="pt-4 mt-2 border-t border-gray-100">
                   {isAuthenticated ? (
                     <div className="px-2 space-y-3">
                        <div className="flex items-center px-2 py-2 text-brand-dark font-medium">
                           {user?.avatar ? (
                             <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-gray-200 mr-3" />
                           ) : (
                             <div className="bg-brand-green/10 p-1.5 rounded-full mr-3">
                                <User className="w-5 h-5 text-brand-green" />
                             </div>
                           )}
                           {user?.name}
                        </div>
                        <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>退出登录</Button>
                     </div>
                   ) : (
                     <div className="grid grid-cols-2 gap-3 px-2">
                      <Button variant="outline" className="justify-center" onClick={() => { router.push('/login'); setIsOpen(false); }}>登录</Button>
                      <Button className="justify-center" onClick={() => { router.push('/login'); setIsOpen(false); }}>注册</Button>
                     </div>
                   )}
                 </div>
              </div>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-brand-dark text-white py-8 md:pt-10 md:pb-12">
    <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 text-left">
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-lg font-bold mb-2 md:mb-4 flex items-center">
             <Coffee className="w-5 h-5 mr-2 text-brand-green" />
             StarStudy
          </h3>
          <p className="hidden md:block text-gray-300 text-sm leading-relaxed max-w-sm">致力于为学生和专业人士提供最佳的学习环境。灵感源自咖啡文化。</p>
          <p className="md:hidden text-gray-400 text-xs">专注为您打造的沉浸式学习空间。</p>
        </div>
        
        <div className="col-span-1">
          <h3 className="text-sm md:text-lg font-bold mb-2 md:mb-4 text-brand-accent">快速链接</h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer transition-colors">寻找空间</li>
            <li className="hover:text-white cursor-pointer transition-colors">会员服务</li>
            <li className="hover:text-white cursor-pointer transition-colors">企业合作</li>
          </ul>
        </div>

         <div className="col-span-1">
          <h3 className="text-sm md:text-lg font-bold mb-2 md:mb-4 text-brand-accent">客户支持</h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer transition-colors">联系我们</li>
            <li className="hover:text-white cursor-pointer transition-colors">常见问题</li>
            <li className="hover:text-white cursor-pointer transition-colors">隐私政策</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-gray-400 gap-2">
        <p>&copy; 2024 StarStudy Inc.</p>
        <div className="flex space-x-4">
          <span className="cursor-pointer hover:text-white">使用条款</span>
          <span className="cursor-pointer hover:text-white">隐私政策</span>
        </div>
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-brand-cream font-sans antialiased">
    <Navbar />
    <main className="flex-grow w-full">{children}</main>
    <Footer />
  </div>
);