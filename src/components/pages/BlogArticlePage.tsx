'use client';

import { useTina, tinaField } from 'tinacms/dist/react';
import type { BlogQuery } from '@tina/__generated__/types';
import { BlogArticleHeader } from '@/components/sections/BlogArticleHeader';
import { BlogArticleBody } from '@/components/sections/BlogArticleBody';
import { BlogArticleRelated } from '@/components/sections/BlogArticleRelated';
import { AuthorCard } from '@/components/ui/content/AuthorCard';
import { ShareCard } from '@/components/ui/content/ShareCard';
import { TableOfContents, MobileTocBar } from '@/components/ui/content/table-of-contents';
import type { ContentCardItem } from '@/components/ui/content/content-card';
import type { TocItem } from '@/lib/toc';

const UI: Record<string, Record<string, string>> = {
  pl: {
    back: 'Wróć do bloga',
    related: 'Polecane artykuły',
    noRelated: 'Brak powiązanych artykułów.',
    toc: 'Spis treści',
  },
  en: {
    back: 'Back to blog',
    related: 'Recommended articles',
    noRelated: 'No related articles.',
    toc: 'Table of contents',
  },
};

interface BlogArticleProps {
  query: string;
  variables: Record<string, unknown>;
  data: BlogQuery;
  related: ContentCardItem[];
  locale: string;
  toc: TocItem[];
}

export function BlogArticle({ query, variables, data, related, locale, toc }: BlogArticleProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const blog = tinaData?.blog ?? data?.blog;
  const ui = UI[locale] ?? UI.pl;

  if (!blog) {
    return null;
  }

  const author = blog.author;

  return (
    <article className="container mx-auto max-w-360 px-4 pb-24 md:px-6 lg:pb-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <main className="min-w-0">
          <BlogArticleHeader blog={blog} locale={locale} backLabel={ui.back} />
          <BlogArticleBody
            body={blog.body}
            tinaFieldBody={tinaField(blog, 'body')}
            toc={toc}
            className={related.length === 0 ? 'pb-8 md:pb-12' : undefined}
          />
          <div className="flex flex-col gap-6 py-8 lg:hidden">
            <AuthorCard author={author} tinaField={tinaField(blog, 'author')} />
            <ShareCard title={blog.title} locale={locale} />
          </div>
          {related.length > 0 ? (
            <BlogArticleRelated items={related} title={ui.related} emptyMessage={ui.noRelated} />
          ) : null}
        </main>
        <aside className="hidden flex-col gap-6 lg:flex">
          <AuthorCard author={author} tinaField={tinaField(blog, 'author')} />
          <ShareCard title={blog.title} locale={locale} />
          <TableOfContents toc={toc} title={ui.toc} />
        </aside>
      </div>
      <MobileTocBar toc={toc} title={ui.toc} />
    </article>
  );
}
