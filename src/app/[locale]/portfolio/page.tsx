import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { buildMetadata } from '@/lib/metadata';
import { PortfolioPage } from '@/components/pages/PortfolioPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await tinaQueryWithRetry(() =>
    client.queries.page({
      relativePath: `${locale}/portfolio.md`,
    })
  );

  const title = data.page?.title ?? (locale === 'pl' ? 'Portfolio' : 'Portfolio');
  const description =
    data.page?.description ??
    (locale === 'pl'
      ? 'Przeglądaj nasze realizacje: strony internetowe, aplikacje i oprogramowanie.'
      : 'Browse our work: websites, applications and custom software.');

  return buildMetadata({
    title,
    description,
    locale,
    pathname: '/portfolio',
  });
}

export default async function Portfolio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await tinaQueryWithRetry(() =>
    client.queries.page({
      relativePath: `${locale}/portfolio.md`,
    })
  );

  if (!tina.data.page) {
    notFound();
  }

  return (
    <PortfolioPage query={tina.query} variables={tina.variables} data={tina.data} locale={locale} />
  );
}
