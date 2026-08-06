'use client';

import { useMemo, useState } from 'react';
import { useTina } from 'tinacms/dist/react';
import type { ProjectConnectionQuery } from '@tina/__generated__/types';
import { Separator } from '@/components/ui/primitives/separator';
import { PortfolioSearch } from '@/components/ui/composites/portfolio-search';
import { PortfolioList } from '@/components/ui/composites/portfolio-list';
import type { PortfolioProject } from '@/components/ui/composites/portfolio-card';

type ProjectNode = NonNullable<PortfolioProject>;

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  'strony-internetowe': { pl: 'Strony internetowe', en: 'Websites' },
  oprogramowanie: { pl: 'Oprogramowanie', en: 'Software' },
  websites: { pl: 'Strony internetowe', en: 'Websites' },
  software: { pl: 'Oprogramowanie', en: 'Software' },
};

const CATEGORY_TO_CANONICAL: Record<string, string> = {
  'strony-internetowe': 'websites',
  oprogramowanie: 'software',
  websites: 'websites',
  software: 'software',
};

const UI: Record<string, Record<string, string>> = {
  pl: {
    title: 'Zobacz nasze realizacje',
    description: 'Przeglądaj nasze realizacje i znajdź coś dla siebie.',
    searchPlaceholder: 'Szukaj po tytule, opisie lub technologii...',
    empty: 'Brak realizacji.',
    readMore: 'Czytaj więcej',
    visit: 'Odwiedź',
  },
  en: {
    title: 'See our work',
    description: 'Browse our work and find something for you.',
    searchPlaceholder: 'Search by title, description or technology...',
    empty: 'No projects found.',
    readMore: 'Read more',
    visit: 'Visit',
  },
};

interface PortfolioCategoryPageProps {
  query: string;
  variables: Record<string, unknown>;
  data: ProjectConnectionQuery;
  category: string;
  locale: string;
}

export function PortfolioCategoryPage({
  query,
  variables,
  data,
  category,
  locale,
}: PortfolioCategoryPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const [search, setSearch] = useState('');
  const canonicalCategory = CATEGORY_TO_CANONICAL[category] ?? category;
  const ui = UI[locale] ?? UI.pl;

  const projects = useMemo(() => {
    const edges = tinaData?.projectConnection?.edges ?? [];
    return edges
      .filter((edge): edge is NonNullable<typeof edge> => !!edge && !!edge.node)
      .filter(edge => edge.node?._sys?.relativePath?.startsWith(`${locale}/${canonicalCategory}/`))
      .filter(edge => {
        const project = edge.node!;
        const term = search.toLowerCase();
        const title = (project.title ?? '').toLowerCase();
        const description = (project.description ?? '').toLowerCase();
        const technologies = (project.technologies ?? []).join(' ').toLowerCase();
        return (
          !term || title.includes(term) || description.includes(term) || technologies.includes(term)
        );
      })
      .map(edge => edge.node!)
      .filter((p): p is ProjectNode => !!p);
  }, [tinaData, locale, canonicalCategory, search]);

  return (
    <section className="container mx-auto max-w-360 px-4 py-16 md:px-6 md:py-24">
      <h1 className="font-heading text-3xl font-bold text-foreground md:text-5xl">
        {CATEGORY_LABELS[category]?.[locale] ?? category}
      </h1>
      <p className="mt-4 max-w-2xl font-sans text-base text-muted-foreground">{ui.description}</p>

      <PortfolioSearch value={search} onChange={setSearch} placeholder={ui.searchPlaceholder} />

      <Separator className="my-12" />

      <PortfolioList
        projects={projects}
        locale={locale}
        emptyMessage={ui.empty}
        readMoreLabel={ui.readMore}
        visitLabel={ui.visit}
      />
    </section>
  );
}
