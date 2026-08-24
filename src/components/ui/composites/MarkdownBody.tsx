'use client';

import Image from 'next/image';
import type { Components, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { cn } from '@/lib/utils';

const richTextComponents: Components<Record<string, object>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  img: ({ url, alt, caption }: any) => (
    <span className="block">
      <Image
        src={url}
        alt={alt ?? caption ?? ''}
        width={1200}
        height={675}
        sizes="(max-width: 768px) 100vw, 768px"
        style={{
          width: 'auto',
          height: 'auto',
          display: 'block',
          borderRadius: '0.75rem',
          margin: '0 auto',
        }}
        className="max-w-3xl"
        unoptimized={url?.endsWith('.gif') || url?.endsWith('.svg')}
      />
      {caption ? (
        <span className="mx-auto mt-3 block max-w-3xl text-center text-sm text-muted-foreground">
          {caption}
        </span>
      ) : null}
    </span>
  ),
};

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

  const merged = { ...richTextComponents, ...(components as Components<Record<string, object>>) };

  return (
    <section className={cn('w-full', className)}>
      <div data-tina-field={tinaField} className="prose max-w-none font-sans dark:prose-invert">
        <TinaMarkdown
          content={content as TinaMarkdownContent | TinaMarkdownContent[]}
          components={merged}
        />
      </div>
    </section>
  );
}
