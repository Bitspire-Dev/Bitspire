import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCity, getCityConnection } from '@/lib/tina';
import { CityLandingPage } from '@/components/pages/CityLandingPage';
import { localeAlternates, localePathname, getDefaultOgImages, socialMetadata } from '@/lib/site';
import { getPageHref } from '@/lib/routes';
import { getCityHref } from '@/lib/cities';
import {
  combineJsonLd,
  webPageJsonLd,
  breadcrumbListJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
} from '@/lib/json-ld';
import { extractContentSlug } from '@/lib/string';

interface CityPageParams {
  locale: string;
  city: string;
}

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const tina = await getCityConnection();
  const edges = tina.data.cityConnection?.edges ?? [];
  const routeParams: { city: string }[] = [];

  for (const edge of edges) {
    const node = edge?.node;
    if (!node) continue;
    const relativePath = node._sys.relativePath;
    if (!relativePath.endsWith('.md')) continue;
    const [contentLocale, filename] = relativePath.split('/');
    if (contentLocale !== locale || !filename) continue;
    routeParams.push({ city: extractContentSlug(filename) });
  }

  return routeParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CityPageParams>;
}): Promise<Metadata> {
  const { locale, city } = await params;
  const tina = await getCity(`${locale}/${city}.md`);
  const doc = tina.data.city;
  if (!doc) return {};

  const defaultImages = getDefaultOgImages(locale);

  return {
    title: doc.title,
    description: doc.description,
    alternates: localeAlternates(locale, () => getCityHref(city)),
    ...socialMetadata(locale, {
      title: doc.title,
      description: doc.description,
      url: localePathname(locale, getCityHref(city)),
      images: defaultImages.openGraph,
    }),
  };
}

export default async function CityPage({ params }: { params: Promise<CityPageParams> }) {
  const { locale, city } = await params;

  setRequestLocale(locale);

  const tina = await getCity(`${locale}/${city}.md`);

  if (!tina.data.city) {
    notFound();
  }

  const doc = tina.data.city;
  const pageUrl = localePathname(locale, getCityHref(city));
  const homeLabel = locale === 'pl' ? 'Strona główna' : 'Home';
  const cityLabel = doc.cityName ?? city;

  const jsonLd = combineJsonLd(
    webPageJsonLd({
      name: doc.title,
      description: doc.description,
      url: pageUrl,
    }),
    breadcrumbListJsonLd([
      { name: homeLabel, item: localePathname(locale, getPageHref('home')) },
      { name: cityLabel, item: pageUrl },
    ]),
    serviceJsonLd({
      name: doc.title,
      description: doc.description,
      url: pageUrl,
      areaServed: doc.cityName,
    }),
    ...(doc.faq?.length ? [faqPageJsonLd(doc.faq)] : [])
  );

  return (
    <CityLandingPage
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      locale={locale}
      jsonLd={jsonLd}
      breadcrumbs={[{ label: homeLabel, href: getPageHref('home') }, { label: cityLabel }]}
    />
  );
}
