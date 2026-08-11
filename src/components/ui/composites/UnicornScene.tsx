'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import OfficialUnicornScene from 'unicornstudio-react';
import { cn } from '@/lib/utils';

type ValidFPS = 15 | 24 | 30 | 60 | 120;

interface UnicornSceneProps {
  projectId: string;
  className?: string;
  style?: CSSProperties;
  onReady?: () => void;
  scale?: number;
  dpi?: number;
  fps?: ValidFPS;
  lazyLoad?: boolean;
  production?: boolean;
}

export function UnicornScene({
  projectId,
  className,
  style,
  onReady,
  scale = 1,
  dpi = 1,
  fps = 60,
  lazyLoad = true,
  production = true,
}: UnicornSceneProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReducedMotion(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (reducedMotion) return null;

  return (
    <div className={cn('relative size-full', className)} style={style} aria-hidden="true">
      <OfficialUnicornScene
        projectId={projectId}
        width="100%"
        height="100%"
        scale={scale}
        dpi={dpi}
        fps={fps}
        lazyLoad={lazyLoad}
        production={production}
        onLoad={onReady}
      />
    </div>
  );
}
