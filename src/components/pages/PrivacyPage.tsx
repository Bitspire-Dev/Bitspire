'use client';

import { useTina, tinaField } from 'tinacms/dist/react';
import type { PageQuery } from '@tina/__generated__/types';
import { ContactHero } from '@/components/sections/ContactHero';
import { MarkdownBody } from '@/components/ui/composites/MarkdownBody';
import { Separator } from '@/components/ui/primitives/separator';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { getPrivacyUi } from '@/lib/ui';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/navigation/breadcrumb';

interface PrivacyPageProps {
  query: string;
  variables: { relativePath: string };
  data: PageQuery;
  locale: string;
  jsonLd?: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
}

export function PrivacyPage({
  query,
  variables,
  data,
  locale,
  jsonLd,
  breadcrumbs,
}: PrivacyPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const page = tinaData?.page ?? data?.page;

  if (!page) {
    return null;
  }

  const lastUpdated = page.lastUpdated;
  const displayDate = lastUpdated ?? '';
  const isoDate = lastUpdated ? lastUpdated.split('.').reverse().join('-') : undefined;
  const ui = getPrivacyUi(locale);

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      {breadcrumbs ? (
        <Breadcrumb
          items={breadcrumbs}
          className="container mx-auto max-w-360 px-4 pt-6 md:px-6 md:pt-8"
        />
      ) : null}
      <section className="container mx-auto max-w-360 px-4 py-16 md:px-6 md:py-24">
        <ContactHero page={page} />

        {displayDate ? (
          <FadeIn delay={0.15}>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{ui.lastUpdated}</span>
              <time dateTime={isoDate}>{displayDate}</time>
            </div>
          </FadeIn>
        ) : null}

        <Separator className="my-12" />

        <FadeIn delay={0.2}>
          <MarkdownBody
            content={page.body}
            tinaField={tinaField(page, 'body')}
            className="max-w-3xl"
          />
        </FadeIn>
      </section>
    </>
  );
}
