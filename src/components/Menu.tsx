'use client';

import React, { useState, useRef, ReactNode, useLayoutEffect, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useClickOutside } from '../hooks/useClickOutside';

// Root 组件
interface MenuRootProps {
  children: ReactNode;
  className?: string;
}

const Root: React.FC<MenuRootProps> = ({ children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useClickOutside(() => setIsOpen(false));
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  // 通过 cloneElement 传递状态给子组件
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        isOpen,
        toggle,
        close,
        triggerRef
      });
    }
    return child;
  });

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {childrenWithProps}
    </div>
  );
};

// Trigger 组件
interface MenuTriggerProps {
  children: ReactNode;
  className?: string;
  toggle?: () => void;
  triggerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

const Trigger: React.FC<MenuTriggerProps> = ({ children, className = '', toggle, triggerRef }) => (
  <div ref={triggerRef} onClick={toggle} className={`cursor-pointer ${className}`}>
    {children}
  </div>
);

// List (下拉) 组件
interface MenuListProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'right';
  isOpen?: boolean;
  close?: () => void;
  triggerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

const List: React.FC<MenuListProps> = ({
  children,
  className = '',
  align = 'right',
  isOpen = false,
  close,
  triggerRef
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const computePos = useCallback(() => {
    const triggerEl = triggerRef?.current;
    const dd = dropdownRef.current;
    if (!triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const width = dd?.offsetWidth ?? 224;
    const top = rect.bottom + 8;
    const left = align === 'right' ? rect.right - width : rect.left;
    setPos({ top, left });
  }, [align, triggerRef]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    computePos();
  }, [isOpen, computePos]);

  useEffect(() => {
    if (!isOpen) return;
    const onScroll = () => computePos();
    const onResize = () => computePos();
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    const onDocDown = (e: MouseEvent) => {
      const dd = dropdownRef.current;
      const triggerEl = triggerRef?.current;
      const target = e.target as Node;
      if (dd && dd.contains(target)) return;
      if (triggerEl && triggerEl.contains(target)) return;
      close?.();
    };
    document.addEventListener('mousedown', onDocDown);
    return () => {
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', onDocDown);
    };
  }, [isOpen, computePos, triggerRef, close]);

  if (!isOpen || !mounted) return null;

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      style={{ position: 'fixed', top: pos?.top ?? 0, left: pos?.left ?? 0, zIndex: 50 }}
      className={`w-56 rounded-lg shadow-neo bg-white border-2 border-black focus:outline-none animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      <div className="py-1" role="none">
        {children}
      </div>
    </div>,
    document.body
  );
};

// Item 组件
interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  variant?: 'default' | 'danger';
  close?: () => void;
}

const Item: React.FC<MenuItemProps> = ({
  children,
  onClick,
  className = '',
  icon,
  variant = 'default',
  close
}) => {
  const handleClick = () => {
    if (onClick) onClick();
    close?.();
  };

  const variantStyles = variant === 'danger'
    ? 'text-destructive hover:bg-destructive/10 font-bold'
    : 'text-black hover:bg-accent font-bold';

  return (
    <div
      onClick={handleClick}
      className={`group flex items-center px-4 py-3 text-sm cursor-pointer transition-colors ${variantStyles} ${className}`}
      role="menuitem"
    >
      {icon && <span className="mr-3 opacity-100 group-hover:scale-110 transition-transform">{icon}</span>}
      {children}
    </div>
  );
};

const Divider: React.FC = () => <div className="h-[2px] bg-black my-1" />;

export const Menu = {
  Root,
  Trigger,
  List,
  Item,
  Divider
};
