import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/ui/classNames';

export type TileVariant = 
  | 'solid-white' 
  | 'transparent' 
  | 'solid-black'
  | 'texture';

export type TileSize = '2x2' | '4x2';

export interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TileVariant;
  gridSize?: TileSize | null;
  withNoise?: boolean;
}

// Variant classes define background, border, shadow, AND text colors.
// Updated to use BLUE themes as requested.
const variants: Record<TileVariant, string> = {
  // Pure white card, BLACK text.
  'solid-white': 'bg-white text-black border border-black/5 shadow-lg hover:shadow-xl',
  
  // Transparent (formerly solid-dark)
  'transparent': 'bg-brand-surface text-brand-fg border border-white/14 shadow-xl hover:border-blue-300/35',

  // Full black tile (requested)
  'solid-black': 'bg-black text-white border border-black/80 shadow-xl hover:border-black',
  
  // Texture (image-based, no border)
  'texture': 'text-white shadow-2xl shadow-blue-500/20',
};

const gridSizes: Record<TileSize, string> = {
  '2x2': 'col-span-2 row-span-2',
  '4x2': 'col-span-4 row-span-2'
}

export function Tile({ 
  variant = 'transparent',
  gridSize = '2x2', 
  withNoise = false, 
  className, 
  children, 
  ...props 
}: TileProps) {
  // Fallback to 2x2 if gridSize is missing or invalid
  const sizeClass = gridSizes[gridSize as TileSize] || gridSizes['2x2'];

  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-300 group rounded-4xl p-5 sm:p-6 md:p-8',
        variants[variant],
        sizeClass,
        className
      )}
      {...props}
    >
        {variant === 'texture' && (
          <Image
            src="/textures/tekstura-kafelka.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-center z-0"
            priority={false}
          />
        )}
        {withNoise && (
          <div className="absolute inset-0 opacity-[0.018] pointer-events-none mix-blend-soft-light bg-noise z-0"></div>
        )}
        
           {/* Decorative gloss/reflection for texture */}
           {variant === 'texture' && (
             <>
                {/* top edge specular */}
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent opacity-80 pointer-events-none" />

                {/* glossy vertical sheen */}
                <div className="absolute inset-0 bg-linear-to-b from-white/30 via-white/10 to-transparent opacity-70 pointer-events-none" />

                {/* soft glow blob (upper-left) */}
                <div className="absolute -inset-24 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.55),transparent_62%)] opacity-70 pointer-events-none" />

                {/* color bloom (bottom-right) */}
                <div className="absolute -inset-24 bg-[radial-gradient(circle_at_85%_88%,rgba(56,189,248,0.35),transparent_65%)] opacity-70 pointer-events-none" />

                {/* subtle vignette for depth */}
                <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/10 to-black/25 opacity-70 pointer-events-none" />
             </>
        )}

        <div className="relative z-10 h-full w-full flex flex-col justify-between">
            {children}
        </div>
    </div>
  );
}

// Sub-components
export function TileNumber({ children, className }: React.ComponentProps<'div'>) {
    return <div className={cn("text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-2 sm:mb-4 opacity-90", className)}>{children}</div>
}

export function TileTitle({ children, className }: React.ComponentProps<'h3'>) {
    return <h3 className={cn("text-lg sm:text-xl md:text-2xl font-bold leading-tight mb-1 sm:mb-2 tracking-tight", className)}>{children}</h3>
}

export function TileDescription({ children, className }: React.ComponentProps<'p'>) {
    return <p className={cn("text-sm sm:text-base opacity-80 leading-relaxed max-w-prose", className)}>{children}</p>
}

export function TileContent({ children, className }: React.ComponentProps<'div'>) {
    return <div className={cn("mt-auto", className)}>{children}</div>
}

export function TileHeader({ children, className }: React.ComponentProps<'div'>) {
    return <div className={cn("mb-2 sm:mb-4 md:mb-6", className)}>{children}</div>
}

export function TileFooter({ children, className }: React.ComponentProps<'div'>) {
    return <div className={cn("mt-auto pt-4 md:pt-6 flex items-center justify-between", className)}>{children}</div>
}
