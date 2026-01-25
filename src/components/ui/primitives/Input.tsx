import * as React from 'react';
import { cn } from '@/lib/ui/classNames';

type InputVariant = 'default' | 'search';
type InputSize = 'md' | 'lg';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
}

const inputVariants: Record<InputVariant, string> = {
  default: 'bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder-slate-400 focus:ring-blue-500/50 focus:border-blue-500/50',
  search: 'bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-400 focus:ring-blue-500/50 focus:border-blue-500/50'
};

const inputSizes: Record<InputSize, string> = {
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-4 py-4 text-base rounded-xl'
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', inputSize = 'md', ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full focus:outline-none focus:ring-2 transition-all',
        inputVariants[variant],
        inputSizes[inputSize],
        className
      )}
      {...props}
    />
  )
);

Input.displayName = 'Input';
