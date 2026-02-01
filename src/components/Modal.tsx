 'use client';
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

// Context API: 解决跨层级状态传递问题
interface ModalContextType {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalRootProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

// React Portal: 规避父容器布局限制
const Root: React.FC<ModalRootProps> = ({ isOpen, onClose, children, className = '' }) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 复用 useClickOutside Hook
  const contentRef = useClickOutside(onClose);

  // 锁定背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return ReactDOM.createPortal(
    <ModalContext.Provider value={{ onClose }}>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
        <div 
          ref={contentRef} 
          className={`bg-white rounded-lg border-2 border-black shadow-neo w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${className || 'max-w-lg'}`}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body
  );
};

// 复合组件模式
interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
  showClose?: boolean;
}

const Header: React.FC<ModalHeaderProps> = ({ children, className = '', showClose = true }) => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal.Header must be used within Modal.Root');
  
  return (
    <div className={`px-6 py-4 border-b-2 border-black flex justify-between items-center bg-primary ${className}`}>
      <h2 className="text-lg font-black text-white">{children}</h2>
      {showClose && (
        <button 
          onClick={context.onClose} 
          className="text-white hover:text-black hover:bg-white transition-all border-2 border-transparent hover:border-black hover:shadow-neo-sm rounded-lg p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

const Body: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 overflow-y-auto flex-1 ${className}`}>
    {children}
  </div>
);

const Footer: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-background border-t-2 border-black flex items-center justify-end space-x-3 ${className}`}>
    {children}
  </div>
);

// 导出复合组件
export const Modal = {
  Root,
  Header,
  Body,
  Footer
};
