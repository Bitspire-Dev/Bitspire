'use client';

import { memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { useTina } from 'tinacms/dist/react';
import type { PageQuery } from '@tina/__generated__/types';
import { Hero } from '@/components/sections/Hero';

// Below-the-fold sections are loaded dynamically so their JS (and the JS of
// their dependencies — Pixi, motion, lucide, etc.) is split into separate
// chunks that the browser only fetches when the section is about to enter
// the viewport. This keeps the initial JS payload small, which directly
// improves FCP/LCP/TBT on weak devices.
//
// `ssr: false` would defer *all* work to the client, but most of these
// sections are server-renderable (they don't depend on window). We keep SSR
// enabled and only split the JS bundle — Next.js will still stream the HTML
// for them, but the client-side JS arrives later.
const TechnologyCarousel = dynamic(
  () => import('@/components/sections/TechnologyCarousel').then(m => m.TechnologyCarousel),
  { loading: () => <section className="h-24" aria-hidden="true" /> }
);
const Services = dynamic(() => import('@/components/sections/Services').then(m => m.Services), {
  loading: () => <section className="h-96" aria-hidden="true" />,
});
const WhyBitspire = dynamic(
  () => import('@/components/sections/WhyBitspire').then(m => m.WhyBitspire),
  { loading: () => <section className="h-96" aria-hidden="true" /> }
);
const PortfolioHighlights = dynamic(
  () => import('@/components/sections/PortfolioHighlights').then(m => m.PortfolioHighlights),
  { loading: () => <section className="h-96" aria-hidden="true" /> }
);
const CallToAction = dynamic(
  () => import('@/components/sections/CallToAction').then(m => m.CallToAction),
  { loading: () => <section className="h-64" aria-hidden="true" /> }
);

interface HomePageProps {
  query: string;
  variables: { relativePath: string };
  data: PageQuery;
}

function HomePageContent({ query, variables, data }: HomePageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const page = useMemo(() => tinaData?.page ?? data?.page ?? null, [tinaData, data]);
  const locale = useLocale();

  if (!page) {
    return null;
  }

  return (
    <>
      <Hero page={page} />
      <TechnologyCarousel locale={locale} />
      <Services page={page} />
      <WhyBitspire page={page} />
      <PortfolioHighlights page={page} />
      <CallToAction page={page} />
    </>
  );
}

export const HomePage = memo(HomePageContent);
