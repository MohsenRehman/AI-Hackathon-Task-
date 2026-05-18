import React from 'react';
import { cn } from '../../utils/cn.js';

const Button = ({ children, className, variant = 'primary', isLoading, ...props }) => {
  const baseStyle = 'inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-white text-slate-700 border border-surface-border hover:bg-slate-50 active:bg-slate-100',
    danger: 'bg-medical-red text-white hover:bg-red-700 active:bg-red-800',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };

  return (
    <button
      className={cn(baseStyle, variants[variant], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
      )}
      {children}
    </button>
  );
};

export default Button;
