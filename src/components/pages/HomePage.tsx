'use client';

import { memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { useTina } from 'tinacms/dist/react';
import type { PageQuery } from '@tina/__generated__/types';

import { Hero } from '@/components/sections/Hero';

// Below-the-fold sections are code-split: their HTML still prerenders on
// the server (SEO/content intact), but their JS — including the motion
// animations they use — loads in separate chunks and hydrates lazily.
// This keeps animation setup off the critical path that blocks the LCP
// heading.
const TechnologyCarousel = dynamic(() =>
  import('@/components/sections/TechnologyCarousel').then(m => m.TechnologyCarousel)
);
const Services = dynamic(() => import('@/components/sections/Services').then(m => m.Services));
const WhyBitspire = dynamic(() =>
  import('@/components/sections/WhyBitspire').then(m => m.WhyBitspire)
);
const PortfolioHighlights = dynamic(() =>
  import('@/components/sections/PortfolioHighlights').then(m => m.PortfolioHighlights)
);
const CallToAction = dynamic(() =>
  import('@/components/sections/CallToAction').then(m => m.CallToAction)
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
