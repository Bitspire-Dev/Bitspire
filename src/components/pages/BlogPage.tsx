'use client';

import { useCallback, useState } from 'react';
import { useTina, tinaField } from 'tinacms/dist/react';
import type { BlogConnectionQuery } from '@tina/__generated__/types';
import { ContentListView } from '@/components/sections/ContentListView';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/navigation/breadcrumb';
import type { ContentCardItem } from '@/components/ui/composites/content-card';
import { getBlogArticleHref, extractBlogSlug } from '@/lib/blog';
import { useContentList } from '@/lib/content-list';

const UI: Record<string, Record<string, string>> = {
  pl: {
    title: 'Blog',
    description: 'Przeglądaj nasze artykuły i znajdź coś dla siebie.',
    searchPlaceholder: 'Szukaj po tytule, opisie lub tagu...',
    empty: 'Brak artykułów.',
    readMore: 'Czytaj więcej',
  },
  en: {
    title: 'Blog',
    description: 'Browse our articles and find something for you.',
    searchPlaceholder: 'Search by title, description or tag...',
    empty: 'No articles found.',
    readMore: 'Read more',
  },
};

type BlogNode = NonNullable<
  NonNullable<
    NonNullable<NonNullable<BlogConnectionQuery['blogConnection']>['edges']>[number]
  >['node']
>;

interface BlogPageProps {
  query: string;
  variables: Record<string, unknown>;
  data: BlogConnectionQuery;
  locale: string;
  jsonLd?: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
}

function matches(post: BlogNode, term: string): boolean {
  const title = (post.title ?? '').toLowerCase();
  const description = (post.description ?? '').toLowerCase();
  const tags = (post.tags ?? []).join(' ').toLowerCase();
  return title.includes(term) || description.includes(term) || tags.includes(term);
}

export function BlogPage({ query, variables, data, locale, jsonLd, breadcrumbs }: BlogPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const [search, setSearch] = useState('');
  const ui = UI[locale] ?? UI.pl;

  const map = useCallback(
    (post: BlogNode): ContentCardItem => {
      const slug = extractBlogSlug(post._sys.relativePath);
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        image: post.cover,
        imageAlt: post.title,
        tags: post.tags,
        meta: {
          primaryHref: getBlogArticleHref(slug),
          ctaLabel: ui.readMore,
          tinaField_title: tinaField(post, 'title'),
          tinaField_description: tinaField(post, 'description'),
          tinaField_image: tinaField(post, 'cover'),
          tinaField_tags: tinaField(post, 'tags'),
        },
      };
    },
    [ui]
  );

  const posts = useContentList(tinaData?.blogConnection, locale, search, '', matches, map);

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
        title={ui.title}
        description={ui.description}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={ui.searchPlaceholder}
        emptyMessage={ui.empty}
        items={posts}
        imageRatio={16 / 9}
      />
    </>
  );
}
