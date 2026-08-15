'use client';

import { useTina } from 'tinacms/dist/react';
import type { PageQuery } from '@tina/__generated__/types';
import { Hero } from '@/components/sections/Hero';
import { CallToAction } from '@/components/sections/CallToAction';
import { PortfolioHighlights } from '@/components/sections/PortfolioHighlights';
import { Services } from '@/components/sections/Services';
import { WhyBitspire } from '@/components/sections/WhyBitspire';
import { TechnologyCarousel } from '@/components/sections/TechnologyCarousel';

interface HomePageProps {
  query: string;
  variables: { relativePath: string };
  data: PageQuery;
}

export function HomePage({ query, variables, data }: HomePageProps) {
  const { data: tinaData } = useTina({ query, variables, data });

  if (!tinaData?.page) {
    return null;
  }

  return (
    <>
      <Hero page={tinaData.page} />
      <TechnologyCarousel />
      <Services page={tinaData.page} />
      <WhyBitspire page={tinaData.page} />
      <PortfolioHighlights page={tinaData.page} />
      <CallToAction page={tinaData.page} />
    </>
  );
}
