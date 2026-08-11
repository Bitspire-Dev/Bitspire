'use client';

import { useMemo, useState } from 'react';
import { useTina, tinaField } from 'tinacms/dist/react';
import type { BlogConnectionQuery } from '@tina/__generated__/types';
import { ContentListView } from '@/components/sections/ContentListView';
import type { ContentCardItem } from '@/components/ui/composites/content-card';
import { getBlogArticleHref, extractBlogSlug } from '@/lib/blog';

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

interface BlogPageProps {
  query: string;
  variables: Record<string, unknown>;
  data: BlogConnectionQuery;
  locale: string;
}

export function BlogPage({ query, variables, data, locale }: BlogPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const [search, setSearch] = useState('');
  const ui = UI[locale] ?? UI.pl;

  const posts = useMemo<ContentCardItem[]>(() => {
    const edges = tinaData?.blogConnection?.edges ?? data?.blogConnection?.edges ?? [];
    return edges
      .filter((edge): edge is NonNullable<typeof edge> => !!edge && !!edge.node)
      .filter(edge => edge.node?._sys?.relativePath?.startsWith(`${locale}/`))
      .filter(edge => {
        const post = edge.node!;
        const term = search.toLowerCase();
        const title = (post.title ?? '').toLowerCase();
        const description = (post.description ?? '').toLowerCase();
        const tags = (post.tags ?? []).join(' ').toLowerCase();
        return !term || title.includes(term) || description.includes(term) || tags.includes(term);
      })
      .map(edge => {
        const post = edge.node!;
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
      });
  }, [tinaData, locale, search, ui]);

  return (
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
  );
}
