"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { tinaField } from 'tinacms/dist/react';
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { RichTextLite } from '@tina/richTextPresets';
import { safeImageSrc } from '@/lib/ui/helpers';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';

type TechnologyItem = Record<string, unknown> & {
    name?: string | null;
    icon?: string | null;
};

interface TechnologyData {
    title?: TinaMarkdownContent | TinaMarkdownContent[] | null;
    description?: TinaMarkdownContent | TinaMarkdownContent[] | null;
    items?: TechnologyItem[] | null;
    [key: string]: unknown;
}

const LOGO_WIDTH = 140; // 80px image + 60px gap
const SPEED = 0.8;

const Technology: React.FC<{ data?: TechnologyData }> = ({ data }) => {
    const items = data?.items || [];
    const containerRef = useRef<HTMLDivElement>(null);
    const [logoCount, setLogoCount] = useState(items.length > 0 ? items.length * 8 : 0);
    
    // animation state stored in refs
    const positionsRef = useRef<number[]>([]);
    const rafRef = useRef<number | null>(null);
    const itemsRef = useRef<Array<HTMLSpanElement | null>>([]);
    const lastWidthRef = useRef<number>(0);
    const resizeTimeoutRef = useRef<number | null>(null);
  
    // Use scroll animation hook for fade-in effect
    const { ref: sectionRef, visible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

    useEffect(() => {
        if (items.length === 0) return;

        // Calculate how many logos are needed to fill the container + buffer
        const computeCount = () => {
            const vw = window.visualViewport?.width || window.innerWidth || 2200;
            // ignore tiny changes that occur when mobile address bar hides/shows
            if (Math.abs(vw - lastWidthRef.current) < 10 && positionsRef.current.length) return;
            lastWidthRef.current = vw;

            // Ensure we have enough copies to cover screen width + buffer
            const minCount = Math.ceil(vw / LOGO_WIDTH) + items.length * 5;
            setLogoCount((prev) => (prev === minCount ? prev : minCount));
            
            // initialize or preserve a smooth offset
            if (!positionsRef.current.length) {
                positionsRef.current = Array.from({ length: minCount }, (_, i) => i * LOGO_WIDTH);
            } else {
                const base = positionsRef.current[0] || 0;
                // Rebuild positions array based on new count, continuing from current offset
                positionsRef.current = Array.from({ length: minCount }, (_, i) => base + i * LOGO_WIDTH);
            }
        };

        const onResize = () => {
            if (resizeTimeoutRef.current) window.clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = window.setTimeout(() => computeCount(), 120) as unknown as number;
        };

        computeCount();
        window.visualViewport?.addEventListener("resize", onResize);
        window.addEventListener("resize", onResize);
        return () => {
            window.visualViewport?.removeEventListener("resize", onResize);
            window.removeEventListener("resize", onResize);
            if (resizeTimeoutRef.current) window.clearTimeout(resizeTimeoutRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [items.length]);

    useEffect(() => {
        if (items.length === 0) return;
        
        const vw = window.visualViewport?.width || window.innerWidth || 2200;
        const isMobile = vw < 768;
        const currentSpeed = isMobile ? 1.0 : SPEED;

        const step = () => {
            const arr = positionsRef.current;
            if (!arr.length) {
                rafRef.current = requestAnimationFrame(step);
                return;
            }
            
            // Find current max pos to move items wrapped around to the end
            let maxPos = -Infinity;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] > maxPos) maxPos = arr[i];
            }

            for (let i = 0; i < arr.length; i++) {
                let p = arr[i] - currentSpeed;
                // If item moved completely off-screen to left, move it to the right end
                if (p < -LOGO_WIDTH) p = maxPos + LOGO_WIDTH; 
                arr[i] = p;
                
                const el = itemsRef.current[i];
                if (el) el.style.transform = `translate3d(${p}px, -50%, 0)`;
            }
            rafRef.current = requestAnimationFrame(step);
        };
        
        rafRef.current = requestAnimationFrame(step);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [items.length]);

    if (!data || items.length === 0) return null;

    return (
        <section 
            ref={sectionRef}
            className={`py-section mt-2.5 relative bg-brand-bg text-brand-fg overflow-hidden transition-all duration-1000 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
             data-tina-field={tinaField(data)}
        >
             {/* Background glow similar to Features */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-250 h-75 bg-brand-accent-2/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 mb-6 lg:mb-8">
                 <div className="text-center max-w-3xl mx-auto">
                    {data.title && (
                        <div 
                            className="prose prose-invert max-w-none [&>h1]:text-3xl [&>h1]:md:text-4xl [&>h1]:font-bold mb-4"
                            data-tina-field={tinaField(data, 'title')}
                        >
                            <RichTextLite content={data.title} />
                        </div>
                    )}
                    {data.description && (
                        <div 
                            className="prose prose-invert max-w-none text-brand-text-muted text-lg"
                            data-tina-field={tinaField(data, 'description')}
                        >
                            <RichTextLite content={data.description} />
                        </div>
                    )}
                 </div>
            </div>

            <div 
                className="relative w-full h-32 overflow-hidden items-center flex"
                ref={containerRef}
            >
                {/* Fade masks for edges */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-linear-to-r from-brand-bg to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-linear-to-l from-brand-bg to-transparent z-20 pointer-events-none" />

                {/* Render enough copies to fill buffer */}
                {Array.from({ length: logoCount }).map((_, i) => {
                    const item = items[i % items.length];
                    const iconSrc = safeImageSrc(item?.icon || undefined);
                    return (
                        <span
                            key={i}
                            ref={(el) => { itemsRef.current[i] = el; }}
                            className="absolute top-1/2 left-0 w-35 flex justify-center items-center px-4 will-change-transform"
                            style={{
                                transform: 'translate3d(2000px, -50%, 0)', // initial offscreen
                            }}
                             data-tina-field={tinaField(item)}
                        >
                            {/* Icon Container */}
                                                        <div className="relative w-full h-15 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                                {iconSrc ? (
                                    <Image
                                        src={iconSrc}
                                        alt={item.name || "Technology Logo"}
                                        fill
                                                                                className={`object-contain opacity-90 ${
                                                                                    item.name === 'Vite'
                                                                                        ? 'filter-[brightness(1.75)]'
                                                                                        : 'filter-[brightness(0)_invert(1)_brightness(1.75)]'
                                                                                }`}
                                    />
                                ) : (
                                    <span className="text-brand-text-muted text-sm font-bold">{item.name}</span>
                                )}
                            </div>
                        </span>
                    );
                })}
            </div>
        </section>
    );
};

export default Technology;
