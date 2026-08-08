'use client';

import { tinaField } from 'tinacms/dist/react';
import Image from 'next/image';
import type { BlogQuery } from '@tina/__generated__/types';
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';
import { Separator } from '@/components/ui/primitives/separator';
import { BackLink } from '@/components/ui/composites/back-link';
import { ArticleMeta } from '@/components/ui/composites/article-meta';

interface BlogArticleHeaderProps {
  blog: NonNullable<BlogQuery['blog']>;
  locale: string;
  backLabel: string;
}

export function BlogArticleHeader({ blog, locale, backLabel }: BlogArticleHeaderProps) {
  const cover = blog.cover ?? null;

  return (
    <div className="mt-4">
      {cover ? (
        <AspectRatio
          data-tina-field={tinaField(blog, 'cover')}
          ratio={16 / 9}
          className="w-full bg-muted"
        >
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

      <div className="w-full pt-8 md:pt-12">
        <BackLink href="/blog" label={backLabel} locale={locale} className="mb-6" />

        <header>
          <h1
            data-tina-field={tinaField(blog, 'title')}
            className="font-heading text-3xl font-bold text-foreground md:text-5xl"
          >
            {blog.title}
          </h1>
          {blog.description ? (
            <p
              data-tina-field={tinaField(blog, 'description')}
              className="mt-4 max-w-2xl font-sans text-lg text-muted-foreground"
            >
              {blog.description}
            </p>
          ) : null}

          <div className="mt-4">
            <ArticleMeta
              date={blog.date}
              tags={blog.tags}
              locale={locale}
              tinaFieldDate={tinaField(blog, 'date')}
              tinaFieldTags={tinaField(blog, 'tags')}
            />
          </div>
        </header>

        <Separator className="my-12" />
      </div>
    </div>
  );
}
