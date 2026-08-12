'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PixiSceneEngine, type SceneTheme } from './pixi/scene';
import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

interface PixiSceneProps {
  theme?: SceneTheme;
  className?: string;
  style?: CSSProperties;
  onReady?: () => void;
}

export function PixiScene({ theme: themeProp, className, style, onReady }: PixiSceneProps) {
  const { theme: contextTheme } = useTheme();
  const theme: SceneTheme = themeProp ?? contextTheme;
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<PixiSceneEngine | null>(null);
  const onReadyRef = useRef(onReady);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Keep latest onReady without re-creating the engine
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReducedMotion(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    let mounted = true;
    const engine = new PixiSceneEngine(container, theme);

    engine.init().then(() => {
      if (!mounted) {
        engine.destroy();
        return;
      }
      onReadyRef.current?.();
    });

    engineRef.current = engine;

    return () => {
      mounted = false;
      engine.destroy();
      engineRef.current = null;
    };
    // Intentionally NOT dep on `theme` — the engine stays alive across theme
    // switches and only the cloud tint cross-fades (see setTheme below).
    // Recreating the WebGL scene on every theme change caused a visible flash.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Theme changes only nudge the cloud colour target — the scene keeps running,
  // so the transition is a smooth cross-fade with no re-init flash.
  useEffect(() => {
    engineRef.current?.setTheme(theme);
  }, [theme]);

  if (reducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className={cn('relative size-full', className)}
      style={style}
      aria-hidden="true"
    />
  );
}
