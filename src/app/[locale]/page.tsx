import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPage } from '@/lib/cms/client';
import { HomePage } from '@/components/pages/HomePage';
import {
  localeAlternates,
  localePathname,
  getDefaultOgImages,
  socialMetadata,
} from '@/lib/seo/metadata';
import { getPageHref } from '@/lib/config/routes';
import { combineJsonLd, webPageJsonLd } from '@/lib/seo/json-ld';

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
    ...socialMetadata(locale, {
      title,
      description,
      url: localePathname(locale, getPageHref('home')),
      images: defaultImages.openGraph,
    }),
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
