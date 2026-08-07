'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import type { BlogQuery } from '@tina/__generated__/types';
import { Badge } from '@/components/ui/primitives/badge';
import { Button } from '@/components/ui/primitives/button';
import { Separator } from '@/components/ui/primitives/separator';
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';
import { CardGrid } from '@/components/ui/composites/card-grid';
import { Link } from '@/i18n/navigation';
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
  const params = useParams();
  const currentLocale = typeof params?.locale === 'string' ? params.locale : locale;
  const ui = UI[locale] ?? UI.pl;

  const blog = tinaData?.blog;

  const formattedDate = (() => {
    if (!blog?.date) return null;
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(blog.date));
    } catch {
      return blog.date;
    }
  })();

  if (!blog) {
    return null;
  }

  const cover = blog.cover ?? null;

  return (
    <article>
      {cover ? (
        <AspectRatio ratio={16 / 9} className="w-full bg-muted">
          <Image
            src={cover}
            alt={blog.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </AspectRatio>
      ) : null}

      <section className="container mx-auto max-w-360 px-4 py-8 md:px-6 md:py-12">
        <Button asChild variant="ghost" className="mb-6 h-auto p-0 font-sans">
          <Link href="/blog" locale={currentLocale}>
            <ArrowLeft className="mr-2 size-4" />
            {ui.back}
          </Link>
        </Button>

        <header>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-5xl">
            {blog.title}
          </h1>
          {blog.description ? (
            <p className="mt-4 max-w-2xl font-sans text-lg text-muted-foreground">
              {blog.description}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {formattedDate ? (
              <time
                className="font-sans text-sm text-muted-foreground"
                dateTime={blog.date ?? undefined}
              >
                {formattedDate}
              </time>
            ) : null}
            {blog.tags
              ?.filter((tag): tag is string => !!tag)
              .map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
          </div>
        </header>

        <Separator className="my-12" />

        {blog.body ? (
          <div className="prose max-w-none font-sans prose-invert">
            <TinaMarkdown content={blog.body} />
          </div>
        ) : null}

        {related.length > 0 ? (
          <>
            <Separator className="my-12" />
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              {ui.related}
            </h2>
            <div className="mt-8">
              <CardGrid items={related} emptyMessage={ui.noRelated} imageRatio={16 / 9} />
            </div>
          </>
        ) : null}
      </section>
    </article>
  );
}
