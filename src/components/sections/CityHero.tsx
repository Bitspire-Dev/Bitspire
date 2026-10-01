'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { tinaField } from 'tinacms/dist/react';
import type { CityQuery } from '@tina/__generated__/types';
import { Badge } from '@/components/ui/primitives/badge';
import { Button } from '@/components/ui/primitives/button';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { ErrorBoundary } from '@/components/providers/error-boundary';
import { COMPANY } from '@/lib/company';
import { getCityUi } from '@/lib/ui';
import { useMounted } from '@/lib/use-mounted';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Calendar, Phone } from 'lucide-react';

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

type City = NonNullable<CityQuery['city']>;

interface CityHeroProps {
  city: City;
  locale: string;
}

export function CityHero({ city, locale }: CityHeroProps) {
  const ui = getCityUi(locale);
  const stats = (city.trustStats ?? []).filter((s): s is string => Boolean(s));

  const mounted = useMounted();
  const [sceneError, setSceneError] = useState(false);
  const [canUseWebgl, setCanUseWebgl] = useState(false);
  const isReducedMotion = useReducedMotion();

  // Same capability check as the homepage hero: WebGL available, no
  // save-data, no reduced-motion. Falls back to the static gradient.
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
    <section className="relative w-full overflow-hidden bg-background">
      <div className="absolute inset-0" aria-hidden="true">
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
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-48 w-full"
        style={{
          background:
            'linear-gradient(to top, var(--background) 0%, color-mix(in oklab, var(--background) 60%, transparent) 45%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-20 container mx-auto max-w-360 px-4 py-16 md:px-6 md:pt-24 md:pb-20">
        <FadeIn>
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium"
          >
            <span className="relative size-2 rounded-full bg-primary">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/60 opacity-75" />
            </span>
            {city.cityName} {ui.heroBadgeSuffix}
          </Badge>
        </FadeIn>

        <FadeIn delay={0.05}>
          <h1
            data-tina-field={tinaField(city, 'title')}
            className="mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight text-balance text-foreground md:text-6xl"
          >
            {city.title}
          </h1>
        </FadeIn>

        {city.heroSubtitle ? (
          <FadeIn delay={0.1}>
            <p
              data-tina-field={tinaField(city, 'heroSubtitle')}
              className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {city.heroSubtitle}
            </p>
          </FadeIn>
        ) : null}

        <FadeIn delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href="#kontakt">{ui.quoteCta}</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${COMPANY.phoneRaw}`}>
                <Phone className="mr-1 size-4" />
                {COMPANY.phone}
              </a>
            </Button>
            <a
              href="https://cal.com/bitspire"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Calendar className="size-4" />
              {ui.meetingCta}
            </a>
          </div>
        </FadeIn>

        {stats.length > 0 ? (
          <FadeIn delay={0.2}>
            <ul
              data-tina-field={tinaField(city, 'trustStats')}
              className="mt-8 flex flex-wrap gap-2"
            >
              {stats.map(stat => (
                <li
                  key={stat}
                  className="rounded-md border border-border/60 bg-card/60 px-3 py-1.5 font-sans text-xs text-muted-foreground"
                >
                  {stat}
                </li>
              ))}
            </ul>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
