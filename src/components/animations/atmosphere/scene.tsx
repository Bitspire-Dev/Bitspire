'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PixiSceneEngine, type SceneTheme } from './engine';
import { cn } from '@/lib/utils';

type PixiSceneProps = {
  theme?: SceneTheme;
  onReady?: () => void;
  onError?: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

function getDocumentTheme(): SceneTheme {
  return document.documentElement?.classList.contains('dark') ? 'dark' : 'light';
}

export function PixiScene({
  theme: themeProp,
  className,
  style,
  onReady,
  onError,
  ...rest
}: PixiSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<PixiSceneEngine | null>(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
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
    const engine = new PixiSceneEngine(container, getTheme());

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
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      mounted = false;
      if (readyTimer.current) {
        clearTimeout(readyTimer.current);
      }
      observer.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [reducedMotion, hasError, getTheme]);

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
