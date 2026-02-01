import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-lg border-2 border-black focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:shadow-none active:translate-x-[2px] active:translate-y-[2px]";

  const variants = {
    primary: "bg-primary text-white shadow-neo hover:bg-primary/90",
    outline: "bg-white text-black shadow-neo hover:bg-accent",
    ghost: "bg-transparent border-transparent text-black hover:bg-accent hover:border-black",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'neutral' | 'danger'; className?: string }> = ({
  children,
  variant = 'neutral',
  className = ''
}) => {
  const styles = {
    success: "bg-brand-green text-black",
    warning: "bg-accent text-black",
    neutral: "bg-muted text-black",
    danger: "bg-[#FF4444] text-white",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border-2 border-black shadow-neo-sm ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-bold text-black mb-1">{label}</label>}
    <input
      className={`w-full px-4 py-2 bg-white border-2 border-black rounded-lg shadow-neo focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all placeholder:text-gray-500 ${error ? 'bg-secondary/20' : ''} ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs font-bold text-destructive">{error}</p>}
  </div>
);
