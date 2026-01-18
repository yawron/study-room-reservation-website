import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';

// 1. Context
interface MenuContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
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

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <MenuContext.Provider value={{ isOpen, toggle, close }}>
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
    <div onClick={context.toggle} className={`cursor-pointer ${className}`}>
      {children}
    </div>
  );
};

// 4. List (Dropdown) Component
const List: React.FC<{ children: ReactNode; className?: string; align?: 'left' | 'right' }> = ({ 
  children, 
  className = '',
  align = 'right'
}) => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('Menu.List must be used within Menu.Root');

  if (!context.isOpen) return null;

  const alignmentStyles = align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left';

  return (
    <div 
      className={`absolute z-50 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 ${alignmentStyles} ${className}`}
    >
      <div className="py-1" role="none">
        {children}
      </div>
    </div>
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