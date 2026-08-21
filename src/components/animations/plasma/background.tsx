'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import type { Application } from 'pixi.js';
import { cn } from '@/lib/utils';
import type { PlasmaMesh } from './mesh';

interface PlasmaBackgroundProps {
  className?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return [0, 0, 0];

  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ];
}

function getCssColor(name: string, fallback: string): [number, number, number] {
  if (typeof document === 'undefined') return hexToRgb(fallback);
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return hexToRgb(value || fallback);
}

export function PlasmaBackground({ className }: PlasmaBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const meshRef = useRef<PlasmaMesh | null>(null);
  const reducedMotionRef = useRef(false);
  const resumeLoopRef = useRef<(() => void) | null>(null);
  const { resolvedTheme } = useTheme();

  // Sync brand color with the active CSS theme.
  // Use requestAnimationFrame to ensure the DOM has applied the new theme
  // class before we read getComputedStyle, otherwise we get the previous
  // theme's color.
  useEffect(() => {
    if (!meshRef.current) return;

    const updateColors = () => {
      if (!meshRef.current) return;
      const brand = getCssColor('--brand', '#0037ff');
      meshRef.current.brandColor = brand;
    };

    const rafId = requestAnimationFrame(updateColors);
    return () => cancelAnimationFrame(rafId);
  }, [resolvedTheme]);

  // Initialize and run the Pixi application.
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    let rafId = 0;
    let destroyed = false;
    let startTime = 0;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mediaQuery.matches;

    const init = async () => {
      const container = containerRef.current;
      if (!container) return;

      const [{ Application }, { PlasmaMesh }] = await Promise.all([
        import('pixi.js'),
        import('./mesh'),
      ]);

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const { clientWidth, clientHeight } = container;

      const brand = getCssColor('--brand', '#0037ff');

      const newApp = new Application();
      await newApp.init({
        width: clientWidth,
        height: clientHeight,
        resolution: dpr,
        autoDensity: true,
        backgroundAlpha: 0,
        antialias: false,
        autoStart: false,
        preference: 'webgl',
        powerPreference: 'high-performance',
      });

      if (destroyed) {
        newApp.destroy(true);
        return;
      }

      appRef.current = newApp;
      container.appendChild(newApp.canvas);
      newApp.canvas.style.width = '100%';
      newApp.canvas.style.height = '100%';
      newApp.canvas.style.display = 'block';
      newApp.canvas.style.margin = '0';

      // PlasmaMesh uses gl_FragCoord for positioning, so the beam maps
      // directly to canvas pixels — no filter pipeline offset.
      const mesh = new PlasmaMesh({
        brandColor: brand,
        width: clientWidth * dpr,
        height: clientHeight * dpr,
      });
      meshRef.current = mesh;
      newApp.stage.addChild(mesh);

      startTime = performance.now();

      const loop = (now: number) => {
        if (destroyed) return;

        if (reducedMotionRef.current) {
          // Static frame: render once, stop the rAF loop.
          mesh.time = 0;
          newApp.render();
          rafId = 0;
          return;
        }

        mesh.time = (now - startTime) / 1000;
        newApp.render();
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);

      // Resume the loop when reduced-motion is turned off.
      resumeLoopRef.current = () => {
        if (destroyed) return;
        if (rafId === 0) {
          startTime = performance.now();
          rafId = requestAnimationFrame(loop);
        }
      };
    };

    init();

    const handleResize = () => {
      const app = appRef.current;
      const mesh = meshRef.current;
      const container = containerRef.current;
      if (!app || !mesh || !container) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const { clientWidth, clientHeight } = container;

      app.renderer.resize(clientWidth, clientHeight);
      mesh.canvasResolution = [clientWidth * dpr, clientHeight * dpr];
    };

    // Debounce resize: ResizeObserver fires dozens of times during window
    // drag — only resize once the user stops for 100ms.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    const resizeObserver = new ResizeObserver(debouncedResize);
    resizeObserver.observe(containerRef.current);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      if (!event.matches) resumeLoopRef.current?.();
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      mediaQuery.removeEventListener('change', handleMotionChange);

      const app = appRef.current;
      if (app) {
        app.destroy(true, { children: true });
        appRef.current = null;
        meshRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 -z-10 overflow-hidden', className)}
      aria-hidden="true"
    />
  );
}
