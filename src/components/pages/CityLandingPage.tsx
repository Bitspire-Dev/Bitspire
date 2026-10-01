'use client';

import { useTina, tinaField } from 'tinacms/dist/react';
import type { CityQuery } from '@tina/__generated__/types';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/navigation/breadcrumb';
import { MarkdownBody } from '@/components/ui/composites/MarkdownBody';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { CityHero } from '@/components/sections/CityHero';
import { CityServices } from '@/components/sections/CityServices';
import { CityProcess } from '@/components/sections/CityProcess';
import { CityProjects } from '@/components/sections/CityProjects';
import { CityFaq } from '@/components/sections/CityFaq';
import { CityNearby } from '@/components/sections/CityNearby';
import { CityContact } from '@/components/sections/CityContact';
import { getCityUi } from '@/lib/ui';

interface CityLandingPageProps {
  query: string;
  variables: { relativePath: string };
  data: CityQuery;
  locale: string;
  jsonLd?: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
}

export function CityLandingPage({
  query,
  variables,
  data,
  locale,
  jsonLd,
  breadcrumbs,
}: CityLandingPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const city = tinaData?.city ?? data?.city;

  if (!city) {
    return null;
  }

  const ui = getCityUi(locale);

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      {breadcrumbs ? (
        <Breadcrumb
          items={breadcrumbs}
          className="container mx-auto max-w-360 px-4 pt-6 md:px-6 md:pt-8"
        />
      ) : null}

      <CityHero city={city} locale={locale} />
      <CityServices city={city} locale={locale} />
      <CityProcess city={city} locale={locale} />
      <CityProjects city={city} locale={locale} />
      <CityFaq city={city} locale={locale} />

      {city.body ? (
        <section className="relative w-full">
          <div className="container mx-auto max-w-360 px-4 py-12 md:px-6 md:py-16">
            <FadeIn>
              <h2 className="max-w-4xl font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl md:text-4xl">
                {ui.bodyTitle} {city.cityLocative ?? city.cityName}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <MarkdownBody
                content={city.body}
                tinaField={tinaField(city, 'body')}
                className="mt-8 max-w-3xl"
              />
            </FadeIn>
          </div>
        </section>
      ) : null}

      <CityNearby nearbyCities={city.nearbyCities} locale={locale} />
      <CityContact city={city} locale={locale} />
    </>
  );
}
