import * as React from 'react';
import { cn } from '@/lib/ui/classNames';

export type TileVariant = 
  | 'solid-light' 
  | 'solid-dark' 
  | 'glass' 
  | 'glass-light' 
  | 'outline' 
  | 'gradient-dark';

export type TileSize = 'sm' | 'md' | 'lg' | 'xl';

export interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TileVariant;
  size?: TileSize;
  withNoise?: boolean;
}

const variants: Record<TileVariant, string> = {
  // Pure white card, dark text. Good for high contrast.
  'solid-light': 'bg-white text-brand-bg border border-white/20 shadow-lg',
  
  // Standard brand surface card.
  'solid-dark': 'bg-brand-surface text-brand-fg border border-white/5 shadow-xl',
  
  // The "Bitspire" gradient glass (Pink -> Purple).
  'glass': 'bg-gradient-to-br from-brand-accent/90 to-brand-accent-2/90 text-white backdrop-blur-xl border border-white/20 shadow-2xl shadow-brand-accent/20',
  
  // Subtle frosted glass, good for overlays.
  'glass-light': 'bg-white/5 backdrop-blur-md text-brand-fg border border-white/10 hover:bg-white/10 shadow-lg',
  
  // Simple outline.
  'outline': 'bg-transparent border-2 border-brand-border text-brand-fg hover:border-brand-text-muted',
  
  // Dark gradient for richness.
  'gradient-dark': 'bg-gradient-to-br from-brand-surface to-brand-bg text-brand-fg border border-white/10 shadow-xl'
};

const sizes: Record<TileSize, string> = {
  'sm': 'p-5 rounded-2xl',
  'md': 'p-6 rounded-3xl',
  'lg': 'p-8 rounded-[2rem]',
  'xl': 'p-10 rounded-[2.5rem]',
};

export function Tile({ 
  variant = 'solid-dark', 
  size = 'md', 
  withNoise = false, 
  className, 
  children, 
  ...props 
}: TileProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-300 group',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
        {withNoise && (
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-noise z-0"></div>
        )}
        <div className="relative z-10 h-full w-full flex flex-col">
            {children}
        </div>
    </div>
  );
}

// Sub-components for semantic structure
export function TileNumber({ children, className }: React.ComponentProps<'div'>) {
    return <div className={cn("text-3xl md:text-5xl font-bold tracking-tighter mb-4 opacity-90", className)}>{children}</div>
}

export function TileTitle({ children, className }: React.ComponentProps<'h3'>) {
    return <h3 className={cn("text-xl md:text-2xl font-bold leading-tight mb-3", className)}>{children}</h3>
}

export function TileDescription({ children, className }: React.ComponentProps<'p'>) {
    return <p className={cn("text-sm md:text-base opacity-80 leading-relaxed", className)}>{children}</p>
}

// A flexible content area that expands
export function TileContent({ children, className }: React.ComponentProps<'div'>) {
    return <div className={cn("flex-1", className)}>{children}</div>
}

export function TileFooter({ children, className }: React.ComponentProps<'div'>) {
    return <div className={cn("mt-auto pt-6 flex items-center justify-between", className)}>{children}</div>
}
