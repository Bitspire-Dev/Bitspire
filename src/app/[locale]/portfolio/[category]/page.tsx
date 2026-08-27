import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getProjectConnection } from '@/lib/tina';
import { PortfolioCategoryPage } from '@/components/pages/PortfolioCategoryPage';
import {
  PORTFOLIO_CATEGORIES,
  getCategoryBySlug,
  getCategoryUrlSlug,
} from '@/lib/portfolio/categories';
import { localeAlternates, localePathname, siteMetadata, getDefaultOgImages, siteUrl } from '@/lib/site';
import { getPageHref } from '@/lib/routes';
import { combineJsonLd, webPageJsonLd, breadcrumbListJsonLd } from '@/lib/json-ld';

export const dynamicParams = false;

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
  const defaultImages = getDefaultOgImages(locale);

  return {
    title,
    description,
    alternates: localeAlternates(locale, l => ({
      pathname: '/portfolio/[category]',
      params: { category: getCategoryUrlSlug(categoryData.id, l) },
    })),
    openGraph: { ...siteMetadata.openGraph, title, description, images: defaultImages.openGraph },
    twitter: { ...siteMetadata.twitter, title, description, images: defaultImages.twitter },
  };
}

export default async function PortfolioCategory({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;

  setRequestLocale(locale);

  const categoryData = getCategoryBySlug(category, locale);
  if (!categoryData) {
    notFound();
  }

  const tina = await getProjectConnection();
  const categoryLabel = categoryData.label[locale] ?? categoryData.label.pl;
  const categoryDescription = categoryData.description[locale] ?? categoryData.description.pl;
  const categoryUrlSlug = getCategoryUrlSlug(categoryData.id, locale);
  const pageUrl = localePathname(locale, {
    pathname: '/portfolio/[category]',
    params: { category: categoryUrlSlug },
  });
  const homeLabel = locale === 'pl' ? 'Strona główna' : 'Home';
  const portfolioLabel = 'Portfolio';
  const jsonLd = combineJsonLd(
    webPageJsonLd({
      name: categoryLabel,
      description: categoryDescription,
      url: pageUrl,
    }),
    breadcrumbListJsonLd([
      { name: homeLabel, item: localePathname(locale, getPageHref('home')) },
      { name: portfolioLabel, item: localePathname(locale, getPageHref('portfolio')) },
      { name: categoryLabel, item: pageUrl },
    ])
  );

  return (
    <PortfolioCategoryPage
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      category={category}
      locale={locale}
      jsonLd={jsonLd}
      breadcrumbs={[
        { label: homeLabel, href: getPageHref('home') },
        { label: portfolioLabel, href: getPageHref('portfolio') },
        { label: categoryLabel },
      ]}
    />
  );
}
