import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

const Input = forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'input-field',
          error && 'input-error',
          className
        )}
        {...props}
      />
      {error && <p className="error-text">{error.message}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
