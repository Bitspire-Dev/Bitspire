'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { useTina, tinaField } from 'tinacms/dist/react';
import type { ProjectConnectionQuery } from '@tina/__generated__/types';
import { Link } from '@/i18n/navigation';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/primitives/button';
import { ContentListView } from '@/components/sections/ContentListView';
import type { ContentCardItem } from '@/components/ui/composites/content-card';
import {
  getCategoryBySlug,
  getProjectHref,
  isPortfolioCategoryId,
  type PortfolioCategoryId,
} from '@/lib/portfolio/categories';
import { extractContentSlug } from '@/lib/string';
import { useContentList } from '@/lib/content-list';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/navigation/breadcrumb';

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

type ProjectNode = NonNullable<
  NonNullable<
    NonNullable<NonNullable<ProjectConnectionQuery['projectConnection']>['edges']>[number]
  >['node']
>;

interface PortfolioCategoryPageProps {
  query: string;
  variables: Record<string, unknown>;
  data: ProjectConnectionQuery;
  category: string;
  locale: string;
  jsonLd?: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
}

function matchesProject(project: ProjectNode, term: string): boolean {
  const title = (project.title ?? '').toLowerCase();
  const description = (project.description ?? '').toLowerCase();
  const technologies = (project.technologies ?? []).join(' ').toLowerCase();
  return title.includes(term) || description.includes(term) || technologies.includes(term);
}

export function PortfolioCategoryPage({
  query,
  variables,
  data,
  category,
  locale,
  jsonLd,
  breadcrumbs,
}: PortfolioCategoryPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const [search, setSearch] = useState('');
  const categoryData = getCategoryBySlug(category, locale);
  const canonicalCategory = categoryData?.id ?? category;
  const isKnownCategory = isPortfolioCategoryId(canonicalCategory);
  const ui = UI[locale] ?? UI.pl;

  const map = useCallback(
    (project: ProjectNode): ContentCardItem => {
      const slug = extractContentSlug(project._sys.basename);
      const primaryHref = isKnownCategory
        ? getProjectHref(locale, canonicalCategory as PortfolioCategoryId, slug)
        : undefined;
      return {
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.screenshot,
        imageAlt: project.title,
        tags: project.technologies,
        meta: {
          primaryHref,
          websiteUrl: project.websiteUrl,
          tinaField_title: tinaField(project, 'title'),
          tinaField_description: tinaField(project, 'description'),
          tinaField_image: tinaField(project, 'screenshot'),
          tinaField_tags: tinaField(project, 'technologies'),
          tinaField_websiteUrl: tinaField(project, 'websiteUrl'),
        },
      };
    },
    [locale, canonicalCategory, isKnownCategory]
  );

  const projects = useContentList(
    tinaData?.projectConnection,
    locale,
    search,
    isKnownCategory ? `${canonicalCategory}/` : `${category}/`,
    matchesProject,
    map
  );

  const renderFooter = useCallback(
    (item: ContentCardItem): ReactNode => {
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
    },
    [locale, ui]
  );

  const title = categoryData?.label[locale] ?? category;

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
      <ContentListView
        title={title}
        description={ui.description}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={ui.searchPlaceholder}
        emptyMessage={ui.empty}
        items={projects}
        imageRatio={16 / 9}
        renderFooter={renderFooter}
      />
    </>
  );
}
