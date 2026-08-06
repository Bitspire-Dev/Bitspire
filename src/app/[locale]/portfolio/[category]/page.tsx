import { setRequestLocale } from 'next-intl/server';
import client from '@tina/__generated__/client';
import { PortfolioCategoryPage } from '@/components/pages/PortfolioCategoryPage';

const CATEGORIES_BY_LOCALE: Record<string, string[]> = {
  pl: ['strony-internetowe', 'oprogramowanie'],
  en: ['websites', 'software'],
};

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const categories = CATEGORIES_BY_LOCALE[params.locale] ?? CATEGORIES_BY_LOCALE.pl;
  return categories.map(category => ({ category }));
}

export default async function PortfolioCategory({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;

  setRequestLocale(locale);

  const tina = await client.queries.projectConnection();

  return (
    <PortfolioCategoryPage
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      category={category}
      locale={locale}
    />
  );
}
