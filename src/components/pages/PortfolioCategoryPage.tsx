'use client';

import { useMemo, useState } from 'react';
import { useTina, tinaField } from 'tinacms/dist/react';
import type { ProjectConnectionQuery } from '@tina/__generated__/types';
import { Link } from '@/i18n/navigation';
import { ExternalLinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/primitives/button';
import { Separator } from '@/components/ui/primitives/separator';
import { ContentSearch } from '@/components/ui/composites/content-search';
import { CardGrid } from '@/components/ui/composites/card-grid';
import type { ContentCardItem } from '@/components/ui/composites/content-card';
import type { ReactNode } from 'react';

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
    description: 'Przeglądaj nasze realizacje i znajdź coś dla siebie.',
    searchPlaceholder: 'Szukaj po tytule, opisie lub technologii...',
    empty: 'Brak realizacji.',
    readMore: 'Czytaj więcej',
    visit: 'Odwiedź',
  },
  en: {
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

  const projects = useMemo<ContentCardItem[]>(() => {
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
      .map(edge => {
        const project = edge.node!;
        const slug = project._sys.basename.replace(/\.md$/, '');
        return {
          id: project.id,
          title: project.title,
          description: project.description,
          image: project.screenshot,
          imageAlt: project.title,
          tags: project.technologies,
          meta: {
            primaryHref: `/portfolio/${canonicalCategory}/${slug}`,
            websiteUrl: project.websiteUrl,
            tinaField_title: tinaField(project, 'title'),
            tinaField_description: tinaField(project, 'description'),
            tinaField_image: tinaField(project, 'screenshot'),
            tinaField_tags: tinaField(project, 'technologies'),
            tinaField_websiteUrl: tinaField(project, 'websiteUrl'),
          },
        };
      });
  }, [tinaData, locale, canonicalCategory, search]);

  const renderFooter = (item: ContentCardItem): ReactNode => {
    const primaryHref = item.meta?.primaryHref;
    const websiteUrl = item.meta?.websiteUrl;
    return (
      <>
        {primaryHref ? (
          <Button asChild variant="default">
            <Link
              href={primaryHref as '/portfolio/websites' | '/portfolio/software'}
              locale={locale}
            >
              {ui.readMore}
            </Link>
          </Button>
        ) : null}
        {websiteUrl ? (
          <Button
            asChild
            variant="outline"
            data-tina-field={item.meta?.tinaField_websiteUrl ?? undefined}
          >
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="mr-1 size-3" />
              {ui.visit}
            </a>
          </Button>
        ) : null}
      </>
    );
  };

  return (
    <section className="container mx-auto max-w-360 px-4 py-16 md:px-6 md:py-24">
      <h1 className="font-heading text-3xl font-bold text-foreground md:text-5xl">
        {CATEGORY_LABELS[category]?.[locale] ?? category}
      </h1>
      <p className="mt-4 max-w-2xl font-sans text-base text-muted-foreground">{ui.description}</p>

      <ContentSearch value={search} onChange={setSearch} placeholder={ui.searchPlaceholder} />

      <Separator className="my-12" />

      <CardGrid items={projects} emptyMessage={ui.empty} renderFooter={renderFooter} />
    </section>
  );
}
