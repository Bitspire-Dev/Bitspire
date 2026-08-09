'use client';

import type { Components, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { cn } from '@/lib/utils';

interface MarkdownBodyProps {
  content: unknown;
  tinaField: string;
  components?: Record<string, unknown>;
  className?: string;
}

export function MarkdownBody({ content, tinaField, components, className }: MarkdownBodyProps) {
  if (!content) {
    return null;
  }

  return (
    <section className={cn('w-full', className)}>
      <div data-tina-field={tinaField} className="prose max-w-none font-sans prose-invert">
        <TinaMarkdown
          content={content as TinaMarkdownContent | TinaMarkdownContent[]}
          components={components as Components<Record<string, object>>}
        />
      </div>
    </section>
  );
}
