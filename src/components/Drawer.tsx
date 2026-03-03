'use client';
import React, { useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { useClickOutside } from '../hooks/useClickOutside';

interface DrawerRootProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

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

  if (!isOpen || !mounted) return null;

  // 通过 cloneElement 传递 onClose 给子组件
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { onClose });
    }
    return child;
  });

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {childrenWithProps}
    </div>,
    document.body
  );
};

// 复合组件: Overlay
interface DrawerOverlayProps {
  onClose?: () => void;
}

const Overlay: React.FC<DrawerOverlayProps> = ({ onClose }) => (
  <div
    className="absolute inset-0 bg-black/40 animate-in fade-in duration-300"
    onClick={onClose}
  />
);

// 复合组件: Content
interface DrawerContentProps {
  children: ReactNode;
  className?: string;
  side?: 'left' | 'right' | 'top';
  onClose?: () => void;
}

const Content: React.FC<DrawerContentProps> = ({ children, className = '', side = 'top', onClose }) => {
  // 复用 ClickOutside Hook
  const ref = useClickOutside(onClose || (() => {}));

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
