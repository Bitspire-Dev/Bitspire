'use client';

import { memo, Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useLocale } from 'next-intl';
import { tinaField } from 'tinacms/dist/react';
import type { PagePartsFragment } from '@tina/__generated__/types';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { ErrorBoundary } from '@/components/providers/error-boundary';
import { Button } from '@/components/ui/primitives/button';
import { Link } from '@/i18n/navigation';

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

interface HeroProps {
  page: PagePartsFragment;
}

function HeroContent({ page }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [sceneError, setSceneError] = useState(false);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const locale = useLocale();

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
      className="relative z-0 flex min-h-dvh w-full items-center justify-center overflow-hidden bg-background"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <HeroBackgroundFallback />
      </div>

      {mounted && !prefersReducedMotion && !sceneError ? (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <ErrorBoundary fallback={null}>
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

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-72 w-full"
        style={{
          background:
            'linear-gradient(to top, var(--background) 0%, color-mix(in oklab, var(--background) 88%, transparent) 20%, color-mix(in oklab, var(--background) 60%, transparent) 42%, color-mix(in oklab, var(--background) 28%, transparent) 66%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <m.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 container mx-auto flex max-w-360 flex-col items-center px-6 py-24 text-center"
      >
        <FadeIn>
          <h1
            data-tina-field={tinaField(page, 'title')}
            className="max-w-4xl text-balance font-heading text-5xl leading-tight font-semibold tracking-tight text-foreground md:text-7xl"
          >
            {page.title ?? 'Bitspire'}
          </h1>
        </FadeIn>

        {page.description && (
          <FadeIn delay={0.1}>
            <p
              data-tina-field={tinaField(page, 'description')}
              className="mt-6 max-w-2xl text-pretty font-sans text-lg leading-relaxed text-foreground/70 md:text-xl"
            >
              {page.description}
            </p>
          </FadeIn>
        )}

        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base md:h-13 md:px-10 md:text-lg"
            >
              <Link href="/contact" locale={locale}>
                {locale === 'pl' ? 'Rozpocznij projekt' : 'Start a project'}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base md:h-13 md:px-10 md:text-lg"
            >
              <Link href="/portfolio" locale={locale}>
                {locale === 'pl' ? 'Zobacz wybrane case studies' : 'See selected case studies'}
              </Link>
            </Button>
          </div>
        </FadeIn>
      </m.div>
      <m.div
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-xs tracking-widest text-muted-foreground/70 uppercase">
            Scroll
          </span>
          <div className="flex h-10 w-6 justify-center rounded-full border border-muted-foreground/30 p-1">
            <m.div
              className="h-2 w-1 rounded-full bg-muted-foreground/50"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </m.div>
    </section>
  );
}

export const Hero = memo(HeroContent);
