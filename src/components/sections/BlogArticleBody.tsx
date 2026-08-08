'use client';

import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { cn } from '@/lib/utils';
import type { BlogQuery } from '@tina/__generated__/types';

interface BlogArticleBodyProps {
  body: NonNullable<BlogQuery['blog']>['body'];
  tinaFieldBody: string;
  className?: string;
}

export function BlogArticleBody({ body, tinaFieldBody, className }: BlogArticleBodyProps) {
  if (!body) {
    return null;
  }

  return (
    <section
      className={cn('container mx-auto max-w-360 px-4 pt-0 md:px-6', className)}
    >
      <div
        data-tina-field={tinaFieldBody}
        className="prose max-w-none font-sans prose-invert"
      >
        <TinaMarkdown content={body} />
      </div>
    </section>
  );
}
