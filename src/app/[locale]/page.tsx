import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPage } from '@/lib/tina';
import { HomePage } from '@/components/pages/HomePage';
import { localeAlternates, localePathname, siteMetadata, getDefaultOgImages } from '@/lib/site';
import { getPageHref } from '@/lib/routes';
import { combineJsonLd, webPageJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await getPage(`${locale}/home.md`);

  const title = data.page?.title;
  const description = data.page?.description ?? undefined;
  const defaultImages = getDefaultOgImages(locale);

  return {
    title: title ? { absolute: title } : undefined,
    description,
    alternates: localeAlternates(locale, () => getPageHref('home')),
    openGraph: { ...siteMetadata.openGraph, title, description, images: defaultImages.openGraph },
    twitter: { ...siteMetadata.twitter, title, description, images: defaultImages.twitter },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await getPage(`${locale}/home.md`);

  if (!tina.data.page) {
    notFound();
  }

  const page = tina.data.page;
  const pageUrl = localePathname(locale, getPageHref('home'));
  const jsonLd = combineJsonLd(
    webPageJsonLd({
      name: page.title ?? 'Bitspire',
      description: page.description,
      url: pageUrl,
    })
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage query={tina.query} variables={tina.variables} data={tina.data} />
    </>
  );
}
