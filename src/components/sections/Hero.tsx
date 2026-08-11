'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { tinaField } from 'tinacms/dist/react';
import type { PagePartsFragment } from '@tina/__generated__/types';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { FadeIn } from '@/components/ui/composites/fade-in';
import { UnicornScene } from '@/components/ui/composites/UnicornScene';
import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

interface HeroProps {
  page: PagePartsFragment;
}

const DARK_PROJECT_ID = 'h1BqwqCs5IMUMFF6knG3';
const LIGHT_PROJECT_ID = 'akxkqMoymrONQdz6EGnI';

const FADE_MS = 700;

type SceneTheme = 'dark' | 'light';

const PROJECT_IDS: Record<SceneTheme, string> = {
  dark: DARK_PROJECT_ID,
  light: LIGHT_PROJECT_ID,
};

export function Hero({ page }: HeroProps) {
  const { theme } = useTheme();

  // Single-active-scene pattern: only one scene runs at rest. On theme
  // change, the new scene mounts (hidden), waits for ready, cross-fades,
  // then the old scene is destroyed — so two canvases overlap only briefly.
  const [mounted, setMounted] = useState(false);
  const [activeScene, setActiveScene] = useState<SceneTheme>(theme === 'light' ? 'light' : 'dark');
  const [pendingScene, setPendingScene] = useState<SceneTheme | null>(null);
  const [pendingReady, setPendingReady] = useState(false);
  const [fading, setFading] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const next: SceneTheme = theme === 'light' ? 'light' : 'dark';
    if (next === activeScene || pendingScene) return;

    setPendingScene(next);
    setPendingReady(false);
  }, [theme, activeScene, pendingScene]);

  const handlePendingReady = useCallback(() => {
    setPendingReady(true);
    setFading(true);

    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setActiveScene(pendingScene!);
      setPendingScene(null);
      setPendingReady(false);
      setFading(false);
      fadeTimer.current = null;
    }, FADE_MS);
  }, [pendingScene]);

  useEffect(() => {
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, []);

  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative z-0 flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-background"
    >
      <div className="absolute inset-0 z-0 bg-background" aria-hidden="true">
        {mounted && (
          <>
            {/* Active scene — always running */}
            <UnicornScene
              projectId={PROJECT_IDS[activeScene]}
              className={cn(
                'absolute inset-0 size-full pointer-events-none transition-opacity ease-out hero-scene',
                fading ? 'opacity-0' : 'opacity-100'
              )}
              style={{ transitionDuration: `${FADE_MS}ms` }}
            />
            {/* Pending scene — mounts only during theme switch, destroyed after fade */}
            {pendingScene && (
              <UnicornScene
                projectId={PROJECT_IDS[pendingScene]}
                onReady={handlePendingReady}
                className={cn(
                  'absolute inset-0 size-full pointer-events-none transition-opacity ease-out hero-scene',
                  pendingReady ? 'opacity-100' : 'opacity-0'
                )}
                style={{ transitionDuration: `${FADE_MS}ms` }}
              />
            )}
          </>
        )}
      </div>

      {/* Gradient fade for smooth transition to next section.
          Taller + multi-stop so the blend into the page background reads as
          a natural fade instead of a hard band (especially in light mode). */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-64 w-full bg-gradient-to-t from-background via-background/75 to-transparent"
        aria-hidden="true"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 container mx-auto flex max-w-360 flex-col items-center px-6 py-24 text-center"
      >
        <FadeIn>
          <h1
            data-tina-field={tinaField(page, 'title')}
            className="max-w-4xl font-heading text-5xl leading-tight font-semibold tracking-tight text-foreground md:text-7xl"
          >
            {page.title ?? 'Bitspire'}
          </h1>
        </FadeIn>

        {page.description && (
          <FadeIn delay={0.1}>
            <p
              data-tina-field={tinaField(page, 'description')}
              className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              {page.description}
            </p>
          </FadeIn>
        )}

        {page.body && (
          <FadeIn delay={0.2}>
            <div
              data-tina-field={tinaField(page, 'body')}
              className="prose mt-8 max-w-2xl font-sans text-muted-foreground prose-invert"
            >
              <TinaMarkdown content={page.body} />
            </div>
          </FadeIn>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-xs tracking-widest text-muted-foreground/60 uppercase">
            Scroll
          </span>
          <div className="flex h-10 w-6 justify-center rounded-full border border-muted-foreground/30 p-1">
            <motion.div
              className="h-2 w-1 rounded-full bg-muted-foreground/50"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
