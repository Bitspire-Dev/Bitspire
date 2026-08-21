'use client';

import { memo, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'motion/react';
import { tinaField } from 'tinacms/dist/react';
import type { PagePartsFragment } from '@tina/__generated__/types';
import { FadeIn } from '@/components/animations/fade-in';
import { ErrorBoundary } from '@/components/providers/error-boundary';

const PixiScene = dynamic(
  () => import('@/components/animations/atmosphere').then(m => m.PixiScene),
  {
    ssr: false,
  }
);

function HeroBackgroundFallback() {
  return (
    <div
      className="pointer-events-none absolute inset-0 size-full"
      style={{
        background:
          'radial-gradient(circle at 50% 40%, color-mix(in oklab, var(--background) 92%, var(--brand)), var(--background) 72%)',
      }}
      aria-hidden="true"
    />
  );
}

function HeroErrorFallback() {
  return (
    <div
      className="pointer-events-none absolute inset-0 size-full"
      style={{
        background:
          'radial-gradient(circle at 50% 40%, color-mix(in oklab, #04050b 92%, #0037ff), #000000 72%)',
      }}
      aria-hidden="true"
    />
  );
}

interface HeroProps {
  page: PagePartsFragment;
}

function HeroContent({ page }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [sceneError, setSceneError] = useState(false);
  const prefersReducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    setMounted(true);
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
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <HeroBackgroundFallback />
      </div>

      {prefersReducedMotion ? (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <HeroErrorFallback />
        </div>
      ) : mounted ? (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <ErrorBoundary fallback={<HeroErrorFallback />}>
            <Suspense fallback={null}>
              <PixiScene
                data-hero-scene
                onError={() => setSceneError(true)}
                className="pointer-events-none absolute inset-0 size-full"
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      ) : null}

      {sceneError && (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <HeroErrorFallback />
        </div>
      )}

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-10 hidden h-72 w-full dark:block"
        style={{
          background:
            'linear-gradient(to top, var(--background) 0%, color-mix(in oklab, var(--background) 88%, transparent) 20%, color-mix(in oklab, var(--background) 60%, transparent) 42%, color-mix(in oklab, var(--background) 28%, transparent) 66%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 container mx-auto flex max-w-360 flex-col items-center px-6 py-24 text-center"
      >
        <FadeIn>
          <h1
            data-tina-field={tinaField(page, 'title')}
            className="max-w-4xl font-heading text-5xl leading-tight font-semibold tracking-tight text-white md:text-7xl"
          >
            {page.title ?? 'Bitspire'}
          </h1>
        </FadeIn>

        {page.description && (
          <FadeIn delay={0.1}>
            <p
              data-tina-field={tinaField(page, 'description')}
              className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-white/75 md:text-xl"
            >
              {page.description}
            </p>
          </FadeIn>
        )}
      </motion.div>
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

export const Hero = memo(HeroContent);
