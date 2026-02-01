 'use client';
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { useClickOutside } from '../hooks/useClickOutside';

// Context API: 状态管理
interface DrawerContextType {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

interface DrawerRootProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

// React Portal: 渲染到 body 节点
const Root: React.FC<DrawerRootProps> = ({ isOpen, onClose, children }) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 锁定背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // 为了动画效果，我们需要始终渲染 Portal，但通过 CSS 控制显隐
  // 或者简单的条件渲染（这里使用条件渲染配合 CSS 动画类）
  if (!isOpen || !mounted) return null;

  return ReactDOM.createPortal(
    <DrawerContext.Provider value={{ isOpen, onClose }}>
      <div className="fixed inset-0 z-[100] flex justify-end">
        {children}
      </div>
    </DrawerContext.Provider>,
    document.body
  );
};

// 复合组件: Overlay
const Overlay: React.FC = () => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('Drawer.Overlay must be used within Drawer.Root');

  return (
    <div 
      className="absolute inset-0 bg-black/40 animate-in fade-in duration-300"
      onClick={context.onClose}
    />
  );
};

// 复合组件: Content
interface DrawerContentProps {
  children: ReactNode;
  className?: string;
  side?: 'left' | 'right' | 'top'; // 支持不同方向
}

const Content: React.FC<DrawerContentProps> = ({ children, className = '', side = 'top' }) => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('Drawer.Content must be used within Drawer.Root');
  
  // 复用 ClickOutside Hook
  const ref = useClickOutside(context.onClose);

  // 根据方向定义动画和定位
  const sideStyles = {
    top: 'top-0 left-0 right-0 border-b-2 border-black rounded-b-lg shadow-neo animate-in slide-in-from-top duration-300',
    left: 'top-0 bottom-0 left-0 h-full border-r-2 border-black shadow-neo animate-in slide-in-from-left duration-300',
    right: 'top-0 bottom-0 right-0 h-full border-l-2 border-black shadow-neo-lg animate-in slide-in-from-right duration-300',
  };

  return (
    <div 
      ref={ref}
      className={`relative bg-background overflow-y-auto ${sideStyles[side]} ${className}`}
      style={{ maxHeight: side === 'top' ? '80vh' : '100vh' }}
    >
      {children}
    </div>
  );
};

export const Drawer = {
  Root,
  Overlay,
  Content,
};
