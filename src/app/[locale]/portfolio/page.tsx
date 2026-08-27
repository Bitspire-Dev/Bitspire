import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPage } from '@/lib/tina';
import { PortfolioPage } from '@/components/pages/PortfolioPage';
import { getPageFallbackTitle } from '@/lib/ui';
import { localeAlternates, localePathname, siteMetadata, getDefaultOgImages } from '@/lib/site';
import { getPageHref } from '@/lib/routes';
import { combineJsonLd, webPageJsonLd, breadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await getPage(`${locale}/portfolio.md`);

  const title = data.page?.title ?? getPageFallbackTitle(locale, 'portfolio');
  const description = data.page?.description ?? undefined;
  const defaultImages = getDefaultOgImages(locale);

  return {
    title,
    description,
    alternates: localeAlternates(locale, () => getPageHref('portfolio')),
    openGraph: { ...siteMetadata.openGraph, title, description, images: defaultImages.openGraph },
    twitter: { ...siteMetadata.twitter, title, description, images: defaultImages.twitter },
  };
}

export default async function Portfolio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await getPage(`${locale}/portfolio.md`);

  if (!tina.data.page) {
    notFound();
  }

  const page = tina.data.page;
  const pageUrl = localePathname(locale, getPageHref('portfolio'));
  const homeLabel = locale === 'pl' ? 'Strona główna' : 'Home';
  const portfolioLabel = page.title ?? getPageFallbackTitle(locale, 'portfolio');
  const description = page.description;
  const jsonLd = combineJsonLd(
    webPageJsonLd({
      name: portfolioLabel,
      description,
      url: pageUrl,
    }),
    breadcrumbListJsonLd([
      { name: homeLabel, item: localePathname(locale, getPageHref('home')) },
      { name: portfolioLabel, item: pageUrl },
    ])
  );

  return (
    <PortfolioPage
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      locale={locale}
      jsonLd={jsonLd}
      breadcrumbs={[{ label: homeLabel, href: getPageHref('home') }, { label: portfolioLabel }]}
    />
  );
}
