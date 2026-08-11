import * as React from 'react';
import { cn } from '@/lib/ui/classNames';

type CardVariant = 'blue' | 'cyan' | 'slate';
type CardPadding = 'sm' | 'md' | 'lg' | 'none';

type CardProps<T extends React.ElementType> = {
  as?: T;
  variant?: CardVariant;
  interactive?: boolean;
} & React.ComponentPropsWithoutRef<T>;

const baseCardClasses =
  'group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm transition-all duration-300';

const cardVariantClasses: Record<CardVariant, string> = {
  blue: 'hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
  cyan: 'hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
  slate: 'hover:border-slate-500/50 hover:shadow-lg'
};

const cardContentPadding: Record<CardPadding, string> = {
  sm: 'p-5 md:p-6',
  md: 'p-6',
  lg: 'p-8',
  none: 'p-0'
};

export function Card<T extends React.ElementType = 'div'>(
  { as, variant = 'slate', interactive = true, className, ...props }: CardProps<T>
) {
  const Component = as || 'div';

  return (
    <Component
      className={cn(
        baseCardClasses,
        interactive && 'hover:-translate-y-1',
        interactive && cardVariantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding = 'md', ...props }, ref) => (
    <div ref={ref} className={cn(cardContentPadding[padding], className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

export const CardMedia = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative w-full aspect-video overflow-hidden rounded-t-2xl', className)}
      {...props}
    />
  )
);

CardMedia.displayName = 'CardMedia';

export interface CardAccentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const cardAccentVariants: Record<CardVariant, string> = {
  blue: 'from-blue-500 to-cyan-400',
  cyan: 'from-cyan-500 to-blue-400',
  slate: 'from-slate-600 to-slate-400'
};

export const CardAccent = React.forwardRef<HTMLDivElement, CardAccentProps>(
  ({ className, variant = 'slate', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r group-hover:w-full transition-all duration-500',
        cardAccentVariants[variant],
        className
      )}
      {...props}
    />
  )
);

CardAccent.displayName = 'CardAccent';
