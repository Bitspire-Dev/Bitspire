'use client';

import { memo, Suspense, useEffect, useRef, useState, type ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { tinaField } from 'tinacms/dist/react';
import type { PagePartsFragment } from '@tina/__generated__/types';
import { ErrorBoundary } from '@/components/providers/error-boundary';
import { Button } from '@/components/ui/primitives/button';
import { Link } from '@/i18n/navigation';
import { getPageHref } from '@/lib/config/routes';
import { useMounted } from '@/hooks/use-mounted';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type Href = ComponentProps<typeof Link>['href'];

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

interface HeroCTAProps {
  locale: string;
}

const HeroCTA = memo(function HeroCTA({ locale }: HeroCTAProps) {
  return (
    <div
      className="hero-fade-in" // eslint-disable-line tailwindcss/no-custom-classname
      style={{ animationDelay: '0.2s' }}
    >
      <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          asChild
          size="lg"
          className="h-12 w-full px-8 text-base sm:w-auto md:h-13 md:px-10 md:text-lg"
        >
          <Link href={getPageHref('contact') as Href} locale={locale}>
            {locale === 'pl' ? 'Rozpocznij projekt' : 'Start a project'}
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 w-full px-8 text-base sm:w-auto md:h-13 md:px-10 md:text-lg"
        >
          <Link href={getPageHref('portfolio') as Href} locale={locale}>
            {locale === 'pl' ? 'Zobacz wybrane case studies' : 'See selected case studies'}
          </Link>
        </Button>
      </div>
    </div>
  );
});

interface HeroProps {
  page: PagePartsFragment;
}

function HeroContent({ page }: HeroProps) {
  const mounted = useMounted();
  const [sceneError, setSceneError] = useState(false);
  const [canUseWebgl, setCanUseWebgl] = useState(false);
  const isReducedMotion = useReducedMotion();
  const locale = useLocale();

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Scroll-linked parallax + fade for the hero content. A passive listener +
  // rAF replaces motion's useScroll so the LCP element isn't gated behind
  // the animation library hydrating — it paints on the very first frame.
  useEffect(() => {
    if (isReducedMotion) return;
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      content.style.transform = `translateY(${progress * -80}px)`;
      content.style.opacity = `${1 - Math.min(progress / 0.6, 1)}`;
      if (indicatorRef.current) {
        indicatorRef.current.style.opacity = `${1 - Math.min(progress / 0.15, 1)}`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isReducedMotion]);

  // Simple, local, one-time capability check. We enable the WebGL hero
  // background on any device that supports WebGL, isn't requesting reduced
  // motion, and isn't in save-data mode. Mobile devices get a lower-quality
  // config (see quality.ts) so the scene stays performant on phones.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isReducedMotion) return;

    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ??
      false;
    const hasWebgl = !!document.createElement('canvas').getContext('webgl');

    setCanUseWebgl(!saveData && hasWebgl);
  }, [isReducedMotion]);

  const shouldRenderPixi = mounted && !sceneError && canUseWebgl;

  return (
    <section
      ref={sectionRef}
      className="relative z-0 flex min-h-dvh w-full items-center justify-center overflow-hidden bg-background"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <HeroBackgroundFallback />
      </div>

      {shouldRenderPixi ? (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <PixiScene
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

      <div
        ref={contentRef}
        className="relative z-20 container mx-auto flex max-w-360 flex-col items-center px-4 py-16 text-center will-change-transform md:px-6 md:py-24"
      >
        <div
          className="hero-fade-in" // eslint-disable-line tailwindcss/no-custom-classname
        >
          <h1
            data-tina-field={tinaField(page, 'title')}
            className="max-w-4xl font-heading text-4xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-5xl md:text-7xl"
          >
            {page.title ?? 'Bitspire'}
          </h1>
        </div>

        {page.description && (
          <div
            className="hero-fade-in" // eslint-disable-line tailwindcss/no-custom-classname
            style={{ animationDelay: '0.1s' }}
          >
            <p
              data-tina-field={tinaField(page, 'description')}
              className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-pretty text-foreground/70 sm:text-lg md:text-xl"
            >
              {page.description}
            </p>
          </div>
        )}

        <HeroCTA locale={locale} />
      </div>
      <div
        ref={indicatorRef}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-xs tracking-widest text-muted-foreground/70 uppercase">
            Scroll
          </span>
          <div className="flex h-10 w-6 justify-center rounded-full border border-muted-foreground/30 p-1">
            <div
              className="scroll-hint h-2 w-1 rounded-full bg-muted-foreground/50" // eslint-disable-line tailwindcss/no-custom-classname
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export const Hero = memo(HeroContent);
