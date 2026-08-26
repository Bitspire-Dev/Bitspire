'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PixiSceneEngine, type SceneTheme } from './engine';
import { type QualityTier } from './quality';
import { cn } from '@/lib/utils';
import { useDeviceTier } from '@/components/providers/device-capability-provider';

type PixiSceneProps = {
  theme?: SceneTheme;
  onReady?: () => void;
  onError?: () => void;
  /**
   * When true, the WebGL engine is not initialised until the browser reports
   * an idle frame (`requestIdleCallback`). This keeps the heavy PixiJS init +
   * first shader compile off the critical path of the first paint, which
   * matters a lot for LCP on mid-tier devices. On high-tier devices the
   * engine can start immediately.
   */
  deferUntilIdle?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

function getDocumentTheme(): SceneTheme {
  return document.documentElement?.classList.contains('dark') ? 'dark' : 'light';
}

// `requestIdleCallback` is not available on Safari < 17.4; fall back to a
// `setTimeout(0)` which at least yields to the event loop once.
function scheduleIdle(cb: () => void): () => void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const handle = (
      window as Window & {
        requestIdleCallback?: (cb: () => void) => number;
        cancelIdleCallback?: (handle: number) => void;
      }
    ).requestIdleCallback;
    const cancel = (
      window as Window & {
        cancelIdleCallback?: (handle: number) => void;
      }
    ).cancelIdleCallback;
    if (handle && cancel) {
      const id = handle(cb);
      return () => cancel(id);
    }
  }
  const id = setTimeout(cb, 0);
  return () => clearTimeout(id);
}

export function PixiScene({
  theme: themeProp,
  className,
  style,
  onReady,
  onError,
  deferUntilIdle = false,
  ...rest
}: PixiSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<PixiSceneEngine | null>(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const tier = useDeviceTier();
  const tierRef = useRef<QualityTier>(tier);
  tierRef.current = tier;
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const readyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const themePropRef = useRef(themeProp);
  themePropRef.current = themeProp;

  const getTheme = useCallback((): SceneTheme => themePropRef.current ?? getDocumentTheme(), []);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReducedMotion(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Create the WebGL engine once. We do *not* use useTheme() here, so the
  // component never re-renders when the theme changes. Instead we watch the
  // <html> class with a MutationObserver and update the shader uniform
  // directly. This keeps the heavy canvas completely out of React's render
  // loop while still letting the cloud tint snap to the new palette.
  useEffect(() => {
    if (reducedMotion) return;
    if (hasError) return;

    const container = containerRef.current;
    if (!container) return;

    let mounted = true;
    let cancelIdle: (() => void) | null = null;

    const startEngine = () => {
      if (!mounted) return;

      const engine = new PixiSceneEngine(container, getTheme(), tierRef.current);

      engine
        .init()
        .then(() => {
          if (!mounted) {
            engine.destroy();
            return;
          }

          // Wait one extra frame so the first WebGL render has happened before
          // revealing the canvas. This prevents the initial black/empty frame
          // from flashing on screen while the scene is still initialising.
          readyTimer.current = setTimeout(() => {
            if (mounted) {
              setIsReady(true);
              onReadyRef.current?.();
            }
          }, 0);
        })
        .catch(error => {
          console.warn('PixiScene failed to initialise, falling back to static background:', error);
          if (mounted) {
            setHasError(true);
          }
          onErrorRef.current?.();
          engine.destroy();
        });

      engineRef.current = engine;

      const observer = new MutationObserver(() => {
        engineRef.current?.setTheme(getTheme());
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      // Store cleanup on the outer scope so the effect teardown can run it.
      (startEngine as unknown as { _cleanup?: () => void })._cleanup = () => {
        observer.disconnect();
      };
    };

    if (deferUntilIdle) {
      cancelIdle = scheduleIdle(startEngine);
    } else {
      startEngine();
    }

    return () => {
      mounted = false;
      if (cancelIdle) cancelIdle();
      if (readyTimer.current) {
        clearTimeout(readyTimer.current);
      }
      const cleanup = (startEngine as unknown as { _cleanup?: () => void })._cleanup;
      cleanup?.();
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [reducedMotion, hasError, getTheme, deferUntilIdle, tier]);

  // For the (rare) controlled-prop case, push the new theme to the engine
  // directly without recreating it.
  useEffect(() => {
    if (themeProp != null) {
      engineRef.current?.setTheme(themeProp);
    }
  }, [themeProp]);

  if (reducedMotion || hasError) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative size-full transition-opacity duration-700',
        isReady ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={style}
      aria-hidden="true"
      {...rest}
    />
  );
}
