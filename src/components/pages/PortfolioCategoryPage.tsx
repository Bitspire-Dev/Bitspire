'use client';

import { useMemo, useState } from 'react';
import { useTina, tinaField } from 'tinacms/dist/react';
import type { ProjectConnectionQuery } from '@tina/__generated__/types';
import { Link } from '@/i18n/navigation';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/primitives/button';
import { ContentListView } from '@/components/sections/ContentListView';
import type { ContentCardItem } from '@/components/ui/composites/content-card';
import { getCategoryBySlug, getProjectHref } from '@/lib/portfolio/categories';
import type { ReactNode } from 'react';

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
  const categoryData = getCategoryBySlug(category, locale);
  const canonicalCategory = categoryData?.id ?? category;
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
            primaryHref: getProjectHref(locale, canonicalCategory as 'websites' | 'software', slug),
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
            <Link href={primaryHref} locale={locale}>
              {ui.readMore}
            </Link>
          </Button>
        ) : null}
        {websiteUrl ? (
          <Button
            asChild
            variant="outline"
            data-tina-field={item.meta?.tinaField_websiteUrl as string | undefined}
          >
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1 size-3" />
              {ui.visit}
            </a>
          </Button>
        ) : null}
      </>
    );
  };

  return (
    <ContentListView
      title={categoryData?.label[locale] ?? category}
      description={ui.description}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder={ui.searchPlaceholder}
      emptyMessage={ui.empty}
      items={projects}
      imageRatio={16 / 9}
      renderFooter={renderFooter}
    />
  );
}
