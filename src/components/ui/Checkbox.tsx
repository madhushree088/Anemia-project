import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className={clsx(
                'w-5 h-5 border-2 rounded cursor-pointer transition-colors appearance-none',
                props.checked 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'border-gray-300 hover:border-gray-400',
                error && 'border-red-300',
                className
              )}
              {...props}
            />
            {props.checked && (
              <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 pointer-events-none" />
            )}
          </div>
          {label && (
            <span className="ml-3 text-sm text-gray-700">
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';