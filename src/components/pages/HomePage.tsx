'use client';

import { useTina } from 'tinacms/dist/react';
import type { PageQuery } from '@tina/__generated__/types';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { TechnologyCarousel } from '@/components/sections/TechnologyCarousel';

interface HomePageProps {
  query: string;
  variables: { relativePath: string };
  data: PageQuery;
}

export function HomePage({ query, variables, data }: HomePageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const page = tinaData?.page ?? data?.page;

  if (!page) {
    return null;
  }

  return (
    <>
      <Hero page={page} />
      <TechnologyCarousel />
      <Services page={page} />
    </>
  );
}
