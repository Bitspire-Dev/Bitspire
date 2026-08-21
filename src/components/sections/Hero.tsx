'use client';

import { tinaField } from 'tinacms/dist/react';
import type { PagePartsFragment } from '@tina/__generated__/types';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { FadeIn } from '@/components/ui/composites/fade-in';

interface HeroProps {
  page: PagePartsFragment;
}

export function Hero({ page }: HeroProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden bg-background">
      <div className="relative z-10 container mx-auto flex max-w-360 flex-col items-center px-6 py-24 text-center">
        <FadeIn>
          <h1
            data-tina-field={tinaField(page, 'title')}
            className="max-w-4xl font-heading text-5xl leading-tight font-semibold tracking-tight text-foreground md:text-7xl"
          >
            {page.title ?? 'Bitspire'}
          </h1>
        </FadeIn>

        {page.description && (
          <FadeIn delay={0.1}>
            <p
              data-tina-field={tinaField(page, 'description')}
              className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              {page.description}
            </p>
          </FadeIn>
        )}

        {page.body && (
          <FadeIn delay={0.2}>
            <div
              data-tina-field={tinaField(page, 'body')}
              className="prose mt-8 max-w-2xl font-sans text-muted-foreground dark:prose-invert"
            >
              <TinaMarkdown content={page.body} />
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
