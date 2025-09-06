import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 tracking-tight">
          {label}
        </label>
      )}
      <input
        className={cn(
          'input-field',
          error && 'border-error-300 focus:border-error-500 focus:ring-error-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-600 font-medium">{error}</p>
      )}
    </div>
  );
}