'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function ReadingProgressBar() {
    const [enabled, setEnabled] = useState(true);
    const articleRef = useRef<HTMLElement | null>(null);
    const barRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const metricsRef = useRef({ start: 0, range: 1 });
    const lastProgressRef = useRef<number>(-1);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const updateEnabled = () => setEnabled(!mediaQuery.matches);
        updateEnabled();
        mediaQuery.addEventListener('change', updateEnabled);
        return () => mediaQuery.removeEventListener('change', updateEnabled);
    }, []);

    useEffect(() => {
        if (!enabled) return;

        articleRef.current = document.querySelector('article');
        const article = articleRef.current;
        if (!article) return;

        const updateProgress = () => {
            rafRef.current = null;
            const scrollTop = window.scrollY;
            const { start, range } = metricsRef.current;
            const currentProgress = (scrollTop - start) / range;
            const clampedProgress = Math.min(Math.max(currentProgress, 0), 1);

            if (Math.abs(clampedProgress - lastProgressRef.current) >= 0.005) {
                lastProgressRef.current = clampedProgress;
                if (barRef.current) {
                    barRef.current.style.transform = `scaleX(${clampedProgress})`;
                }
            }
        };

        const measureArticle = () => {
            const currentArticle = articleRef.current;
            if (!currentArticle) return;

            const rect = currentArticle.getBoundingClientRect();
            const articleTop = rect.top + window.scrollY;
            const articleHeight = rect.height;
            const windowHeight = window.innerHeight;
            const articleStart = articleTop - windowHeight / 2;
            const articleEnd = articleTop + articleHeight - windowHeight / 2;

            metricsRef.current = {
                start: articleStart,
                range: Math.max(articleEnd - articleStart, 1),
            };

            updateProgress();
        };

        const onScroll = () => {
            if (rafRef.current != null) return;
            rafRef.current = window.requestAnimationFrame(updateProgress);
        };

        const resizeObserver = typeof ResizeObserver === 'undefined'
            ? null
            : new ResizeObserver(() => {
                measureArticle();
            });

        resizeObserver?.observe(article);

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', measureArticle, { passive: true });
        measureArticle();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', measureArticle);
            resizeObserver?.disconnect();
            if (rafRef.current != null) {
                window.cancelAnimationFrame(rafRef.current);
            }
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-800/50">
            <div
                ref={barRef}
                className="h-full bg-linear-to-r from-blue-500 to-cyan-500 origin-left will-change-transform transition-transform duration-150 ease-out"
                style={{ transform: 'scaleX(0)' }}
            />
        </div>
    );
}
