'use client';

import dynamic from 'next/dynamic';
import { useTina } from 'tinacms/dist/react';
import type { PageQuery } from '@tina/__generated__/types';
import { ContactHero } from '@/components/sections/ContactHero';
import { ContactDetails } from '@/components/sections/ContactDetails';
import { ContactForm } from '@/components/sections/ContactForm';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/navigation/breadcrumb';

const PlasmaBackground = dynamic(
  () => import('@/components/animations/plasma').then(mod => mod.PlasmaBackground),
  { ssr: false }
);

interface ContactPageProps {
  query: string;
  variables: { relativePath: string };
  data: PageQuery;
  locale: string;
  jsonLd?: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
}

export function ContactPage({
  query,
  variables,
  data,
  locale,
  jsonLd,
  breadcrumbs,
}: ContactPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const page = tinaData?.page ?? data?.page;

  if (!page) {
    return null;
  }

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
      <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden">
        <PlasmaBackground />
        <div className="relative z-10 container mx-auto max-w-360 px-4 py-16 md:px-6 md:py-24">
          <ContactHero page={page} />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <ContactDetails contact={page.contact} locale={locale} />
            <ContactForm contact={page.contact} locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
