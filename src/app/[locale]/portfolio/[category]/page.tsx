import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getProjectConnection } from '@/lib/tina';
import { PortfolioCategoryPage } from '@/components/pages/PortfolioCategoryPage';
import {
  PORTFOLIO_CATEGORIES,
  getCategoryBySlug,
  getCategoryUrlSlug,
} from '@/lib/portfolio/categories';
import { localeAlternates } from '@/lib/site';

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
  if (!categoryData) return {};

  const title = categoryData.label[locale] ?? categoryData.label.pl;
  const description = categoryData.description[locale] ?? categoryData.description.pl;

  return {
    title,
    description,
    alternates: localeAlternates(
      locale,
      l => `/portfolio/${getCategoryUrlSlug(categoryData.id, l)}`
    ),
    openGraph: { title, description },
  };
}

export default async function PortfolioCategory({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;

  setRequestLocale(locale);

  const tina = await getProjectConnection();

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
