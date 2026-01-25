import * as React from 'react';
import { cn } from '@/lib/ui/classNames';

type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type HeadingProps<T extends React.ElementType> = {
  as?: T;
  size?: HeadingSize;
} & React.ComponentPropsWithoutRef<T>;

const headingSizes: Record<HeadingSize, string> = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
  '2xl': 'text-4xl'
};

export function Heading<T extends React.ElementType = 'h2'>(
  { as, size = 'lg', className, ...props }: HeadingProps<T>
) {
  const Component = as || 'h2';

  return (
    <Component className={cn('font-bold text-white', headingSizes[size], className)} {...props} />
  );
}
