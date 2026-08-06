import { setRequestLocale } from 'next-intl/server';
import client from '@tina/__generated__/client';
import { PortfolioPage } from '@/components/pages/PortfolioPage';

export default async function Portfolio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await client.queries.page({
    relativePath: `${locale}/portfolio.md`,
  });

  return (
    <PortfolioPage query={tina.query} variables={tina.variables} data={tina.data} locale={locale} />
  );
}
