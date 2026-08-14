'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PixiSceneEngine, type SceneTheme } from './pixi/scene';
import { cn } from '@/lib/utils';

type PixiSceneProps = {
  theme?: SceneTheme;
  onReady?: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

function getDocumentTheme(): SceneTheme {
  return document.documentElement?.classList.contains('dark') ? 'dark' : 'light';
}

export function PixiScene({
  theme: themeProp,
  className,
  style,
  onReady,
  ...rest
}: PixiSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<PixiSceneEngine | null>(null);
  const onReadyRef = useRef(onReady);
  const [reducedMotion, setReducedMotion] = useState(false);
  const themePropRef = useRef(themeProp);
  themePropRef.current = themeProp;

  const getTheme = useCallback((): SceneTheme => themePropRef.current ?? getDocumentTheme(), []);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

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

    const container = containerRef.current;
    if (!container) return;

    let mounted = true;
    const engine = new PixiSceneEngine(container, getTheme());

    engine.init().then(() => {
      if (!mounted) {
        engine.destroy();
        return;
      }
      onReadyRef.current?.();
    });

    engineRef.current = engine;

    const observer = new MutationObserver(() => {
      engineRef.current?.setTheme(getTheme());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      mounted = false;
      observer.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [reducedMotion, getTheme]);

  // For the (rare) controlled-prop case, push the new theme to the engine
  // directly without recreating it.
  useEffect(() => {
    if (themeProp != null) {
      engineRef.current?.setTheme(themeProp);
    }
  }, [themeProp]);

  if (reducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className={cn('relative size-full', className)}
      style={style}
      aria-hidden="true"
      {...rest}
    />
  );
}
