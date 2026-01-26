import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/ui/classNames';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20',
  secondary: 'bg-brand-surface-2/60 text-brand-fg border border-brand-border/60 hover:border-blue-500/50 hover:bg-brand-border/60',
  outline: 'border border-brand-border/60 text-brand-fg hover:border-blue-500/50 hover:bg-blue-500/10',
  ghost: 'bg-transparent text-brand-fg hover:bg-brand-surface-2/60',
  link: 'text-blue-400 hover:text-blue-300 p-0 h-auto'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
  icon: 'p-2',
  link: 'text-sm'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, type, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';
    const resolvedType = Component === 'button' ? (type ?? 'button') : undefined;

    return (
      <Component
        ref={ref}
        type={resolvedType}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
