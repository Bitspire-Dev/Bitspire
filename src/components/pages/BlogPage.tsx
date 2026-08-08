'use client';

import { useMemo, useState } from 'react';
import { useTina, tinaField } from 'tinacms/dist/react';
import type { BlogConnectionQuery } from '@tina/__generated__/types';
import { Separator } from '@/components/ui/primitives/separator';
import { ContentSearch } from '@/components/ui/composites/content-search';
import { CardGrid } from '@/components/ui/composites/card-grid';
import type { ContentCardItem } from '@/components/ui/composites/content-card';

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
    const edges = tinaData?.blogConnection?.edges ?? [];
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
        const slug = post._sys.basename.replace(/\.md$/, '');
        return {
          id: post.id,
          title: post.title,
          description: post.description,
          image: post.cover,
          imageAlt: post.title,
          tags: post.tags,
          meta: {
            primaryHref: `/blog/${slug}`,
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
    <section className="container mx-auto max-w-360 px-4 py-16 md:px-6 md:py-24">
      <h1 className="font-heading text-3xl font-bold text-foreground md:text-5xl">{ui.title}</h1>
      <p className="mt-4 max-w-2xl font-sans text-base text-muted-foreground">{ui.description}</p>

      <ContentSearch value={search} onChange={setSearch} placeholder={ui.searchPlaceholder} />

      <Separator className="my-12" />

      <CardGrid items={posts} emptyMessage={ui.empty} imageRatio={16 / 9} />
    </section>
  );
}
