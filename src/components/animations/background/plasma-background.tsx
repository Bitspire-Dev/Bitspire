'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import type { Application, Sprite } from 'pixi.js';
import { cn } from '@/lib/utils';
import type { PlasmaFilter } from './plasma-filter';

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
  const filterRef = useRef<PlasmaFilter | null>(null);
  const reducedMotionRef = useRef(false);
  const { resolvedTheme } = useTheme();

  // Sync brand/background colors with the active CSS theme.
  useEffect(() => {
    if (!filterRef.current) return;

    const brand = getCssColor('--brand', '#0037ff');
    const background = getCssColor('--background', '#ffffff');

    filterRef.current.brandColor = brand;
    filterRef.current.backgroundColor = background;
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

      const [{ Application, Sprite, Texture }, { PlasmaFilter }] = await Promise.all([
        import('pixi.js'),
        import('./plasma-filter'),
      ]);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = container;

      const brand = getCssColor('--brand', '#0037ff');
      const background = getCssColor('--background', '#ffffff');

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

      const filter = new PlasmaFilter({
        brandColor: brand,
        backgroundColor: background,
      });
      filter.canvasResolution = [clientWidth * dpr, clientHeight * dpr];
      filterRef.current = filter;

      const sprite = new Sprite({
        texture: Texture.WHITE,
        width: clientWidth,
        height: clientHeight,
      });
      sprite.filters = [filter];
      newApp.stage.addChild(sprite);

      startTime = performance.now();

      const loop = (now: number) => {
        if (destroyed) return;

        if (!reducedMotionRef.current) {
          filter.time = (now - startTime) / 1000;
        } else {
          filter.time = 0;
        }

        newApp.render();
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
    };

    init();

    const handleResize = () => {
      const app = appRef.current;
      const filter = filterRef.current;
      const container = containerRef.current;
      if (!app || !filter || !container) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = container;

      app.renderer.resize(clientWidth, clientHeight);
      filter.canvasResolution = [clientWidth * dpr, clientHeight * dpr];

      const sprite = app.stage.children[0] as Sprite;
      if (sprite) {
        sprite.width = clientWidth;
        sprite.height = clientHeight;
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      mediaQuery.removeEventListener('change', handleMotionChange);

      const app = appRef.current;
      if (app) {
        app.destroy(true, { children: true });
        appRef.current = null;
        filterRef.current = null;
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
