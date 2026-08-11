import * as React from 'react';
import { cn } from '@/lib/ui/classNames';

type BadgeVariant = 'blue' | 'cyan' | 'slate' | 'neutral';
type BadgeSize = 'sm' | 'md';
type BadgeShape = 'pill' | 'md';

type BadgeProps<T extends React.ElementType> = {
  as?: T;
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
} & React.ComponentPropsWithoutRef<T>;

const badgeVariants: Record<BadgeVariant, string> = {
  blue: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  cyan: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
  slate: 'text-slate-400 bg-slate-800 border-slate-700',
  neutral: 'text-slate-300 bg-slate-800/50 border-slate-700/50'
};

const badgeSizes: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5'
};

const badgeShapes: Record<BadgeShape, string> = {
  pill: 'rounded-full',
  md: 'rounded-md'
};

export function Badge<T extends React.ElementType = 'span'>(
  { as, variant = 'neutral', size = 'sm', shape = 'pill', className, ...props }: BadgeProps<T>
) {
  const Component = as || 'span';

  return (
    <Component
      className={cn('inline-flex items-center gap-1 border font-semibold', badgeVariants[variant], badgeSizes[size], badgeShapes[shape], className)}
      {...props}
    />
  );
}
