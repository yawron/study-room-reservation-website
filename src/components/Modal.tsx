 'use client';
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

// 1. Context API: 解决跨层级状态传递问题 (Context API to solve cross-level state passing)
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

// 2. React Portal: 规避父容器布局限制 (React Portal to avoid parent layout constraints)
const Root: React.FC<ModalRootProps> = ({ isOpen, onClose, children, className = '' }) => {
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

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalContext.Provider value={{ onClose }}>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          ref={contentRef} 
          className={`bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${className || 'max-w-lg'}`}
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

// 3. 复合组件模式 (Compound Component Pattern)
interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
  showClose?: boolean;
}

const Header: React.FC<ModalHeaderProps> = ({ children, className = '', showClose = true }) => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal.Header must be used within Modal.Root');
  
  return (
    <div className={`px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-brand-green ${className}`}>
      <h2 className="text-lg font-bold text-white">{children}</h2>
      {showClose && (
        <button 
          onClick={context.onClose} 
          className="text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-1"
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
  <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-3 ${className}`}>
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
