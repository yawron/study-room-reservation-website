'use client';

import React, { createContext, useContext, useState, useRef, ReactNode, useLayoutEffect, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useClickOutside } from '../hooks/useClickOutside';

// 1. Context
interface MenuContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// 2. Root Component
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

  return (
    <MenuContext.Provider value={{ isOpen, toggle, close, triggerRef }}>
      <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
        {children}
      </div>
    </MenuContext.Provider>
  );
};

// 3. Trigger Component
const Trigger: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('Menu.Trigger must be used within Menu.Root');

  return (
    <div ref={context.triggerRef} onClick={context.toggle} className={`cursor-pointer ${className}`}>
      {children}
    </div>
  );
};

// 4. List (Dropdown) Component
const List: React.FC<{ children: ReactNode; className?: string; align?: 'left' | 'right' }> = ({
  children,
  className = '',
  align = 'right',
}) => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('Menu.List must be used within Menu.Root');

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const computePos = useCallback(() => {
    const triggerEl = context.triggerRef.current;
    const dd = dropdownRef.current;
    if (!triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const width = dd?.offsetWidth ?? 224;
    const top = rect.bottom + 8;
    const left = align === 'right' ? rect.right - width : rect.left;
    setPos({ top, left });
  }, [align, context.triggerRef]);

  useLayoutEffect(() => {
    if (!context.isOpen) return;
    computePos();
  }, [context.isOpen, computePos]);

  useEffect(() => {
    if (!context.isOpen) return;
    const onScroll = () => computePos();
    const onResize = () => computePos();
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    const onDocDown = (e: MouseEvent) => {
      const dd = dropdownRef.current;
      const triggerEl = context.triggerRef.current;
      const target = e.target as Node;
      if (dd && dd.contains(target)) return;
      if (triggerEl && triggerEl.contains(target)) return;
      context.close();
    };
    document.addEventListener('mousedown', onDocDown);
    return () => {
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', onDocDown);
    };
  }, [context.isOpen, computePos, context.triggerRef, context]);

  if (!context.isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      style={{ position: 'fixed', top: pos?.top ?? 0, left: pos?.left ?? 0, zIndex: 50 }}
      className={`w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      <div className="py-1" role="none">
        {children}
      </div>
    </div>,
    document.body
  );
};

// 5. Item Component
interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  variant?: 'default' | 'danger';
}

const Item: React.FC<MenuItemProps> = ({ 
  children, 
  onClick, 
  className = '', 
  icon,
  variant = 'default'
}) => {
  const context = useContext(MenuContext);
  
  const handleClick = () => {
    if (onClick) onClick();
    context?.close();
  };

  const variantStyles = variant === 'danger' 
    ? 'text-red-600 hover:bg-red-50' 
    : 'text-gray-700 hover:bg-gray-50 hover:text-brand-green';

  return (
    <div
      onClick={handleClick}
      className={`group flex items-center px-4 py-3 text-sm cursor-pointer transition-colors ${variantStyles} ${className}`}
      role="menuitem"
    >
      {icon && <span className="mr-3 opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>}
      {children}
    </div>
  );
};

const Divider: React.FC = () => <div className="h-px bg-gray-100 my-1" />;

export const Menu = {
  Root,
  Trigger,
  List,
  Item,
  Divider
};
