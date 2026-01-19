'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);
    const [enabled, setEnabled] = useState(true);
    const articleRef = useRef<HTMLElement | null>(null);
    const rafRef = useRef<number | null>(null);
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

        const calculateProgress = () => {
            rafRef.current = null;
            const article = articleRef.current;
            if (!article) return;

            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.scrollY;

            const articleStart = articleTop - windowHeight / 2;
            const articleEnd = articleTop + articleHeight - windowHeight / 2;
            const scrollRange = articleEnd - articleStart || 1;

            const currentProgress = ((scrollTop - articleStart) / scrollRange) * 100;
            const clampedProgress = Math.min(Math.max(currentProgress, 0), 100);

            if (Math.abs(clampedProgress - lastProgressRef.current) >= 0.5) {
                lastProgressRef.current = clampedProgress;
                setProgress(clampedProgress);
            }
        };

        const onScroll = () => {
            if (rafRef.current != null) return;
            rafRef.current = window.requestAnimationFrame(calculateProgress);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (rafRef.current != null) {
                window.cancelAnimationFrame(rafRef.current);
            }
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-800/50">
            <div
                className="h-full bg-linear-to-r from-blue-500 to-cyan-500 transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
