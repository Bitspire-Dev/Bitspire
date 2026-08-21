import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { PortfolioPage } from '@/components/pages/PortfolioPage';

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
