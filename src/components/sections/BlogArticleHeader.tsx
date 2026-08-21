'use client';

import { tinaField } from 'tinacms/dist/react';
import type { BlogQuery } from '@tina/__generated__/types';
import { ArticleHeader } from '@/components/ui/composites/ArticleHeader';
import { ArticleMeta } from '@/components/ui/composites/article-meta';
import { FadeIn } from '@/components/animations/primitives/fade-in';

interface BlogArticleHeaderProps {
  blog: NonNullable<BlogQuery['blog']>;
  locale: string;
  backLabel: string;
}

export function BlogArticleHeader({ blog, locale, backLabel }: BlogArticleHeaderProps) {
  return (
    <ArticleHeader
      cover={blog.cover}
      coverAlt={blog.title}
      tinaFieldCover={tinaField(blog, 'cover')}
      backHref="/blog"
      backLabel={backLabel}
      locale={locale}
      title={blog.title}
      tinaFieldTitle={tinaField(blog, 'title')}
      description={blog.description}
      tinaFieldDescription={tinaField(blog, 'description')}
    >
      <div className="mt-4">
        <FadeIn delay={0.3}>
          <ArticleMeta
            date={blog.date}
            tags={blog.tags}
            locale={locale}
            tinaFieldDate={tinaField(blog, 'date')}
            tinaFieldTags={tinaField(blog, 'tags')}
          />
        </FadeIn>
      </div>
    </ArticleHeader>
  );
}
