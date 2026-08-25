'use client';

import * as React from 'react';
import Image from 'next/image';
import type { Components, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { cn } from '@/lib/utils';
import { isUnoptimizedImage } from '@/lib/image';

interface MarkdownBodyProps {
  content: unknown;
  tinaField: string;
  components?: Record<string, unknown>;
  className?: string;
  shiftHeadings?: number;
}

type HeadingComponent = (props: { children: React.JSX.Element }) => React.JSX.Element;

function makeHeading(level: number, shift = 0): HeadingComponent {
  const shifted = Math.min(level + shift, 6);
  const Tag = `h${shifted}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return function Heading({ children }) {
    return <Tag>{children}</Tag>;
  };
}

export function MarkdownBody({
  content,
  tinaField,
  components,
  className,
  shiftHeadings = 0,
}: MarkdownBodyProps) {
  if (!content) {
    return null;
  }

  const richTextComponents = {
    h1: makeHeading(1, shiftHeadings),
    h2: makeHeading(2, shiftHeadings),
    h3: makeHeading(3, shiftHeadings),
    h4: makeHeading(4, shiftHeadings),
    h5: makeHeading(5, shiftHeadings),
    h6: makeHeading(6, shiftHeadings),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    img: ({ url, alt, caption }: any) => (
      <span className="block">
        <Image
          src={url}
          alt={alt ?? caption ?? ''}
          width={1200}
          height={675}
          sizes="(max-width: 768px) 100vw, 768px"
          unoptimized={isUnoptimizedImage(url)}
        />
        {caption ? (
          <span className="mx-auto mt-3 block max-w-3xl text-center text-sm text-muted-foreground">
            {caption}
          </span>
        ) : null}
      </span>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    a: ({ url, title, children }: any) => {
      const isExternal =
        typeof url === 'string' &&
        (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'));
      return (
        <a
          href={url}
          title={title}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },
  };

  const merged = {
    ...richTextComponents,
    ...(components as Components<Record<string, object>>),
  } as Components<Record<string, object>>;

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
