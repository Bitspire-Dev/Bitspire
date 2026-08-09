'use client';

import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { cn } from '@/lib/utils';

interface PortfolioProjectBodyProps {
  body: any;
  tinaFieldBody: string;
  className?: string;
}

export function PortfolioProjectBody({ body, tinaFieldBody, className }: PortfolioProjectBodyProps) {
  if (!body) {
    return null;
  }

  return (
    <section className={cn('w-full', className)}>
      <div
        data-tina-field={tinaFieldBody}
        className="prose max-w-none font-sans prose-invert"
      >
        <TinaMarkdown content={body} />
      </div>
    </section>
  );
}
