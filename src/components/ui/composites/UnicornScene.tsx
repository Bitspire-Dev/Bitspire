'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface UnicornSceneProps {
  projectId: string;
  className?: string;
  style?: CSSProperties;
  onReady?: () => void;
  scale?: number;
  dpi?: number;
  fps?: number;
  lazyLoad?: boolean;
  production?: boolean;
  disableMobile?: boolean;
}

const SDK_VERSION = '2.2.8';
const SDK_URL = `https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v${SDK_VERSION}/dist/unicornStudio.umd.js`;

let sdkPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return;

    const w = window as Window & { UnicornStudio?: unknown };
    if (w.UnicornStudio) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js"]`
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('UnicornStudio SDK load failed')));
      return;
    }

    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('UnicornStudio SDK load failed'));
    document.body.appendChild(script);
  });

  return sdkPromise;
}

interface UnicornSceneHandle {
  destroy: () => void;
}

interface UnicornStudioSDK {
  addScene: (config: Record<string, unknown>) => Promise<UnicornSceneHandle>;
}

export function UnicornScene({
  projectId,
  className,
  style,
  onReady,
  scale = 1,
  dpi = 1,
  fps = 60,
  lazyLoad = false,
  production = true,
  disableMobile = true,
}: UnicornSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<UnicornSceneHandle | null>(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;

    loadSdk()
      .then(async () => {
        if (cancelled || !containerRef.current) return;

        const w = window as Window & { UnicornStudio?: UnicornStudioSDK };
        const UnicornStudio = w.UnicornStudio;
        if (!UnicornStudio?.addScene) return;

        const scene = await UnicornStudio.addScene({
          element: containerRef.current,
          projectId,
          scale,
          dpi,
          fps,
          lazyLoad,
          production,
          interactivity: {
            mouse: {
              disableMobile,
              disabled: false,
            },
          },
        });

        if (cancelled) {
          scene?.destroy?.();
          return;
        }

        sceneRef.current = scene;
        onReadyRef.current?.();
      })
      .catch(err => {
        if (!cancelled) console.error('UnicornScene error:', err);
      });

    return () => {
      cancelled = true;
      sceneRef.current?.destroy?.();
      sceneRef.current = null;
    };
  }, [projectId, scale, dpi, fps, lazyLoad, production, disableMobile]);

  return (
    <div
      ref={containerRef}
      className={cn('relative size-full', className)}
      style={style}
      aria-hidden="true"
    />
  );
}
