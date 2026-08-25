import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPage } from '@/lib/tina';
import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { getPageFallbackTitle } from '@/lib/ui';
import { localeAlternates, siteMetadata, getDefaultOgImages, siteUrl } from '@/lib/site';
import { combineJsonLd, webPageJsonLd, breadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await getPage(`${locale}/privacy.md`);

  const title = data.page?.title ?? getPageFallbackTitle(locale, 'privacy');
  const description = data.page?.description ?? undefined;
  const defaultImages = getDefaultOgImages(locale);

  return {
    title,
    description,
    alternates: localeAlternates(locale, () => '/privacy'),
    openGraph: { ...siteMetadata.openGraph, title, description, images: defaultImages.openGraph },
    twitter: { ...siteMetadata.twitter, title, description, images: defaultImages.twitter },
  };
}

export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await getPage(`${locale}/privacy.md`);

  if (!tina.data.page) {
    notFound();
  }

  const page = tina.data.page;
  const pageUrl = `${siteUrl}/${locale}/privacy`;
  const homeLabel = locale === 'pl' ? 'Strona główna' : 'Home';
  const privacyLabel = page.title ?? getPageFallbackTitle(locale, 'privacy');
  const description = page.description;
  const jsonLd = combineJsonLd(
    webPageJsonLd({
      name: privacyLabel,
      description,
      url: pageUrl,
    }),
    breadcrumbListJsonLd([
      { name: homeLabel, item: `${siteUrl}/${locale}` },
      { name: privacyLabel, item: pageUrl },
    ])
  );

  return (
    <PrivacyPage
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      locale={locale}
      jsonLd={jsonLd}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: privacyLabel }]}
    />
  );
}
