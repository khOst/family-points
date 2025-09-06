import React from 'react';
import { cn } from '../../utils/cn';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  const variants = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    danger: 'bg-error-500 text-white rounded-2xl shadow-apple hover:bg-error-600 hover:shadow-apple-lg focus:ring-error-500',
    ghost: 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-2xl focus:ring-gray-500',
    outline: 'bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-2xl shadow-apple focus:ring-primary-500'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[2.25rem]',
    md: 'px-6 py-3 text-sm min-h-[2.75rem]',
    lg: 'px-8 py-4 text-base min-h-[3.25rem]'
  };
  
  const spinnerSize = size === 'sm' ? 'sm' : 'sm';
  
  return (
    <button
      className={cn(
        baseClasses, 
        variants[variant], 
        sizes[size], 
        loading && 'cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size={spinnerSize} className="mr-2" />}
      {children}
    </button>
  );
}