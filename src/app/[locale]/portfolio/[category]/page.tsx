import { setRequestLocale } from 'next-intl/server';
import client from '@tina/__generated__/client';
import { PortfolioCategoryPage } from '@/components/pages/PortfolioCategoryPage';
import { PORTFOLIO_CATEGORIES } from '@/lib/portfolio/categories';

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return PORTFOLIO_CATEGORIES.map(category => ({
    category: category.slug[locale] ?? category.slug.pl,
  }));
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
