import React from 'react';
import { cn } from '../../utils/cn.js';

const Badge = ({ children, variant = 'info', className }) => {
  const baseStyle = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider';

  const variants = {
    info: 'bg-primary-50 text-primary-700 border border-primary-100',
    success: 'bg-medical-green-light text-medical-green border border-emerald-100',
    danger: 'bg-medical-red-light text-medical-red border border-red-100',
    warning: 'bg-medical-amber-light text-medical-amber border border-amber-100',
  };

  return (
    <span className={cn(baseStyle, variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
