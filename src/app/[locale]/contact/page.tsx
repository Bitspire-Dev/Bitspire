import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPage } from '@/lib/tina';
import { ContactPage } from '@/components/pages/ContactPage';
import { getPageFallbackTitle } from '@/lib/ui';
import { localeAlternates, localePathname, siteMetadata, getDefaultOgImages, siteUrl } from '@/lib/site';
import { getPageHref } from '@/lib/routes';
import { combineJsonLd, webPageJsonLd, breadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await getPage(`${locale}/contact.md`);

  const title = data.page?.title ?? getPageFallbackTitle(locale, 'contact');
  const description = data.page?.description ?? undefined;
  const defaultImages = getDefaultOgImages(locale);

  return {
    title,
    description,
    alternates: localeAlternates(locale, () => getPageHref('contact')),
    openGraph: { ...siteMetadata.openGraph, title, description, images: defaultImages.openGraph },
    twitter: { ...siteMetadata.twitter, title, description, images: defaultImages.twitter },
  };
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await getPage(`${locale}/contact.md`);

  if (!tina.data.page) {
    notFound();
  }

  const page = tina.data.page;
  const pageUrl = localePathname(locale, getPageHref('contact'));
  const homeLabel = locale === 'pl' ? 'Strona główna' : 'Home';
  const contactLabel = page.title ?? getPageFallbackTitle(locale, 'contact');
  const description = page.description;
  const jsonLd = combineJsonLd(
    webPageJsonLd({
      name: contactLabel,
      description,
      url: pageUrl,
    }),
    breadcrumbListJsonLd([
      { name: homeLabel, item: localePathname(locale, getPageHref('home')) },
      { name: contactLabel, item: pageUrl },
    ])
  );

  return (
    <ContactPage
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      locale={locale}
      jsonLd={jsonLd}
      breadcrumbs={[{ label: homeLabel, href: getPageHref('home') }, { label: contactLabel }]}
    />
  );
}
