'use client';

import { useTina, tinaField } from 'tinacms/dist/react';
import type { BlogQuery } from '@tina/__generated__/types';
import { BlogArticleHeader } from '@/components/sections/BlogArticleHeader';
import { BlogArticleBody } from '@/components/sections/BlogArticleBody';
import { BlogArticleRelated } from '@/components/sections/BlogArticleRelated';
import type { ContentCardItem } from '@/components/ui/composites/content-card';

const UI: Record<string, Record<string, string>> = {
  pl: {
    back: 'Wróć do bloga',
    related: 'Polecane artykuły',
    noRelated: 'Brak powiązanych artykułów.',
  },
  en: {
    back: 'Back to blog',
    related: 'Recommended articles',
    noRelated: 'No related articles.',
  },
};

interface BlogArticleProps {
  query: string;
  variables: Record<string, unknown>;
  data: BlogQuery;
  related: ContentCardItem[];
  locale: string;
}

export function BlogArticle({ query, variables, data, related, locale }: BlogArticleProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const blog = tinaData?.blog;
  const ui = UI[locale] ?? UI.pl;

  if (!blog) {
    return null;
  }

  return (
    <article>
      <BlogArticleHeader blog={blog} locale={locale} backLabel={ui.back} />
      <BlogArticleBody
        body={blog.body}
        tinaFieldBody={tinaField(blog, 'body')}
        className={related.length === 0 ? 'pb-8 md:pb-12' : undefined}
      />
      {related.length > 0 ? (
        <BlogArticleRelated items={related} title={ui.related} emptyMessage={ui.noRelated} />
      ) : null}
    </article>
  );
}
