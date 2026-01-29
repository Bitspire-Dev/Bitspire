"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { tinaField } from 'tinacms/dist/react';
import { RichText } from '@tina/richTextPresets';
import { safeImageSrc } from '@/lib/ui/helpers';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { motion } from 'framer-motion';
import { useLocale } from "next-intl";

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
    const logoCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
    const locale = useLocale();
    
    // animation state stored in refs
    const positionsRef = useRef<number[]>([]);
    const rafRef = useRef<number | null>(null);
    const itemsRef = useRef<Array<HTMLSpanElement | null>>([]);
    const lastWidthRef = useRef<number>(0);
    const resizeTimeoutRef = useRef<number | null>(null);
  
    const itemIconSrcs = useMemo(
        () => items.map((item) => safeImageSrc(item?.icon || undefined)),
        [items]
    );
    const uniqueLogoSrcs = useMemo(
        () => Array.from(new Set(itemIconSrcs.filter(Boolean) as string[])),
        [itemIconSrcs]
    );

    useEffect(() => {
        if (!uniqueLogoSrcs.length || typeof window === "undefined") return;

        uniqueLogoSrcs.forEach((src) => {
            if (!logoCacheRef.current.has(src)) {
                const img = new window.Image();
                img.src = src;
                img.decoding = "async";
                img.loading = "lazy";
                logoCacheRef.current.set(src, img);
            }
        });
    }, [uniqueLogoSrcs]);

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
        <motion.section 
            key={`technology-${locale}`}
            className="py-section mt-2.5 relative bg-brand-bg text-brand-fg overflow-visible"
            data-tina-field={tinaField(data)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
                            <RichText content={data.title} />
                        </div>
                    )}
                    {data.description && (
                        <div 
                            className="prose prose-invert max-w-none text-brand-text-muted text-lg"
                            data-tina-field={tinaField(data, 'description')}
                        >
                            <RichText content={data.description} />
                        </div>
                    )}
                 </div>
            </div>

            <div 
                className="relative w-full h-32 overflow-hidden items-center flex"
                ref={containerRef}
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                    maskImage:
                        "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                }}
            >

                {/* Render enough copies to fill buffer */}
                {Array.from({ length: logoCount }).map((_, i) => {
                    const item = items[i % items.length];
                    const iconSrc = itemIconSrcs[i % itemIconSrcs.length];
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
                                        sizes="140px"
                                        loading="lazy"
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
        </motion.section>
    );
};

export default Technology;
