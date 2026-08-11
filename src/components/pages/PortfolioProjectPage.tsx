'use client';

import { useTina, tinaField } from 'tinacms/dist/react';
import type { ProjectQuery } from '@tina/__generated__/types';
import { PortfolioProjectHeader } from '@/components/sections/PortfolioProjectHeader';
import { PortfolioProjectBody } from '@/components/sections/PortfolioProjectBody';
import { ContactCta } from '@/components/ui/composites/ContactCta';
import { getCategoryHref, isPortfolioCategoryId } from '@/lib/portfolio/categories';

const UI: Record<string, Record<string, string>> = {
  pl: {
    back: 'Wróć do realizacji',
    visit: 'Odwiedź stronę',
  },
  en: {
    back: 'Back to projects',
    visit: 'Visit website',
  },
};

interface PortfolioProjectPageProps {
  query: string;
  variables: Record<string, unknown>;
  data: ProjectQuery;
  locale: string;
  category: string;
}

export function PortfolioProjectPage({
  query,
  variables,
  data,
  locale,
  category,
}: PortfolioProjectPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const project = tinaData?.project ?? data?.project;
  const ui = UI[locale] ?? UI.pl;

  if (!project) {
    return null;
  }

  const backHref = isPortfolioCategoryId(category)
    ? getCategoryHref(locale, category)
    : '/portfolio';

  return (
    <article className="container mx-auto max-w-360 px-4 pb-24 md:px-6 lg:pb-12">
      <PortfolioProjectHeader
        project={project}
        backLabel={ui.back}
        backHref={backHref}
        visitLabel={ui.visit}
        locale={locale}
      />
      <PortfolioProjectBody body={project.body} tinaFieldBody={tinaField(project, 'body')} />
      <ContactCta locale={locale} />
    </article>
  );
}
