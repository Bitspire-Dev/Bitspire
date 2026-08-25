'use client';

import { useTina, tinaField } from 'tinacms/dist/react';
import type { BlogQuery } from '@tina/__generated__/types';
import { BlogArticleHeader } from '@/components/sections/BlogArticleHeader';
import { BlogArticleBody } from '@/components/sections/BlogArticleBody';
import { BlogArticleRelated } from '@/components/sections/BlogArticleRelated';
import { AuthorCard } from '@/components/ui/composites/AuthorCard';
import { ShareCard } from '@/components/ui/composites/ShareCard';
import { TableOfContents, MobileTocBar } from '@/components/ui/composites/table-of-contents';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/navigation/breadcrumb';
import type { ContentCardItem } from '@/components/ui/composites/content-card';
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
  jsonLd?: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
}

export function BlogArticle({
  query,
  variables,
  data,
  related,
  locale,
  toc,
  jsonLd,
  breadcrumbs,
}: BlogArticleProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const blog = tinaData?.blog ?? data?.blog;
  const ui = UI[locale] ?? UI.pl;

  if (!blog) {
    return null;
  }

  const author = blog.author;

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
              <AuthorCard author={author} tinaField={tinaField(blog, 'author')} locale={locale} />
              <ShareCard title={blog.title} locale={locale} />
            </div>
            {related.length > 0 ? (
              <BlogArticleRelated items={related} title={ui.related} emptyMessage={ui.noRelated} />
            ) : null}
          </main>
          <aside className="hidden flex-col gap-6 lg:flex">
            <AuthorCard author={author} tinaField={tinaField(blog, 'author')} locale={locale} />
            <ShareCard title={blog.title} locale={locale} />
            <TableOfContents toc={toc} title={ui.toc} />
          </aside>
        </div>
        <MobileTocBar toc={toc} title={ui.toc} />
      </article>
    </>
  );
}
