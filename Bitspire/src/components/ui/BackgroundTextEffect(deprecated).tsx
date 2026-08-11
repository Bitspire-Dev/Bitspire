import React from 'react';
import { cn } from '@/lib/ui/classNames';

interface Props {
  className?: string; // Positioning
}

export const BackgroundTextEffect = ({ className }: Props) => {
    return (
        <div 
          className={cn(
            "absolute pointer-events-none select-none flex items-center justify-center z-0 scale-75 md:scale-100",
            className
          )} 
          aria-hidden="true"
        >
             {/* Container defining the size of the "Spot" */}
            <div className="relative w-[180px] h-[180px] md:w-[260px] md:h-[260px] flex items-center justify-center">
                
                {/* 1. The Light - Radial smooth gradient, no hard edges */}
                 <div 
                    className="absolute inset-0 opacity-60"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.8) 35%, transparent 55%)'
                    }}
                 />

                {/* 2. Crayon Texture Overlay - Masked to fade with the light */}
                <div className="absolute inset-0 mix-blend-overlay opacity-60"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        maskImage: 'radial-gradient(circle, black 35%, transparent 55%)',
                        WebkitMaskImage: 'radial-gradient(circle, black 35%, transparent 55%)',
                    }}
                />
                
                {/* 3. Text - Upright, blue, sharp */}
                <div className="relative z-10 flex flex-col items-center justify-center leading-[0.85]">
                    <span className="text-[1.8rem] md:text-[2.6rem] font-black text-[#3b82f6] tracking-tighter drop-shadow-sm">
                      bitspire
                    </span>
                    <span className="text-[1.8rem] md:text-[2.6rem] font-black text-[#3b82f6] tracking-tighter drop-shadow-sm">
                       web dev.
                    </span>
                </div>
            </div>
        </div>
    );
};






