import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { buildMetadata } from '@/lib/metadata';
import { PortfolioCategoryPage } from '@/components/pages/PortfolioCategoryPage';
import { PORTFOLIO_CATEGORIES, getCategoryBySlug } from '@/lib/portfolio/categories';

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return PORTFOLIO_CATEGORIES.map(category => ({
    category: category.slug[locale] ?? category.slug.pl,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const categoryData = getCategoryBySlug(category, locale);

  const title = categoryData?.label[locale] ?? categoryData?.label.pl ?? category;
  const description =
    categoryData?.description[locale] ??
    categoryData?.description.pl ??
    (locale === 'pl'
      ? 'Przeglądaj nasze realizacje.'
      : 'Browse our work.');

  return buildMetadata({
    title,
    description,
    locale,
    pathname: `/portfolio/${category}`,
  });
}

export default async function PortfolioCategory({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;

  setRequestLocale(locale);

  const tina = await tinaQueryWithRetry(() => client.queries.projectConnection());

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
