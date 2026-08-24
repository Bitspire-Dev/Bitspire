'use client';

import { useTina, tinaField } from 'tinacms/dist/react';
import type { PageQuery } from '@tina/__generated__/types';
import { ContactHero } from '@/components/sections/ContactHero';
import { MarkdownBody } from '@/components/ui/composites/MarkdownBody';
import { Separator } from '@/components/ui/primitives/separator';
import { FadeIn } from '@/components/animations/primitives/fade-in';

interface PrivacyPageProps {
  query: string;
  variables: { relativePath: string };
  data: PageQuery;
  locale: string;
}

export function PrivacyPage({ query, variables, data, locale }: PrivacyPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const page = tinaData?.page ?? data?.page;

  if (!page) {
    return null;
  }

  const lastUpdated = (page as { lastUpdated?: string | null }).lastUpdated;
  const displayDate = lastUpdated ?? '24.08.2026';
  const isoDate = lastUpdated ? lastUpdated.split('.').reverse().join('-') : '2026-08-24';
  const updatedLabel = locale === 'pl' ? 'Ostatnia aktualizacja:' : 'Last updated:';

  return (
    <section className="container mx-auto max-w-360 px-4 py-16 md:px-6 md:py-24">
      <ContactHero page={page} />

      <FadeIn delay={0.15}>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{updatedLabel}</span>
          <time dateTime={isoDate}>{displayDate}</time>
        </div>
      </FadeIn>

      <Separator className="my-12" />

      <FadeIn delay={0.2}>
        <MarkdownBody
          content={page.body}
          tinaField={tinaField(page, 'body')}
          className="max-w-3xl"
        />
      </FadeIn>
    </section>
  );
}
