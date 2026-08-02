'use client';

import { useTina } from 'tinacms/dist/react';
import type { PageQuery } from '@tina/__generated__/types';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';

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
      <Services page={tinaData.page} />
    </>
  );
}
