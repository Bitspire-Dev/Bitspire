'use client';

import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { cn } from '@/lib/utils';
import { TocProvider, Heading2, Heading3, Heading } from '@/lib/toc';
import type { TocItem } from '@/lib/toc';

interface BlogArticleBodyProps {
  body: any;
  tinaFieldBody: string;
  toc: TocItem[];
  className?: string;
}

export function BlogArticleBody({ body, tinaFieldBody, toc, className }: BlogArticleBodyProps) {
  if (!body) {
    return null;
  }

  return (
    <section
      className={cn('w-full px-0 pt-0', className)}
    >
      <TocProvider toc={toc}>
        <div
          data-tina-field={tinaFieldBody}
          className="prose max-w-none font-sans prose-invert"
        >
          <TinaMarkdown
            content={body}
            components={{
              h2: Heading2 as any,
              h3: Heading3 as any,
              heading: Heading as any,
            }}
          />
        </div>
      </TocProvider>
    </section>
  );
}
