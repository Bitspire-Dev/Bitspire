import * as React from 'react';
import { cn } from '@/lib/ui/classNames';

type TextVariant = 'body' | 'muted' | 'subtle';
type TextSize = 'sm' | 'md' | 'lg';

type TextProps<T extends React.ElementType> = {
  as?: T;
  variant?: TextVariant;
  size?: TextSize;
} & React.ComponentPropsWithoutRef<T>;

const textVariants: Record<TextVariant, string> = {
  body: 'text-slate-300',
  muted: 'text-slate-400',
  subtle: 'text-slate-500'
};

const textSizes: Record<TextSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
};

export function Text<T extends React.ElementType = 'p'>(
  { as, variant = 'body', size = 'md', className, ...props }: TextProps<T>
) {
  const Component = as || 'p';

  return (
    <Component className={cn(textVariants[variant], textSizes[size], className)} {...props} />
  );
}
