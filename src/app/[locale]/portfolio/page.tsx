import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPage } from '@/lib/tina';
import { PortfolioPage } from '@/components/pages/PortfolioPage';
import { localeAlternates } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await getPage(`${locale}/portfolio.md`);

  const title = data.page?.title ?? 'Portfolio';
  const description = data.page?.description ?? undefined;

  return {
    title,
    description,
    alternates: localeAlternates(locale, () => '/portfolio'),
    openGraph: { title, description },
  };
}

export default async function Portfolio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await getPage(`${locale}/portfolio.md`);

  if (!tina.data.page) {
    notFound();
  }

  return (
    <PortfolioPage query={tina.query} variables={tina.variables} data={tina.data} locale={locale} />
  );
}
