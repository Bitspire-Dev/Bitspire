import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bitspire.pl';
const DEFAULT_LOCALE = 'pl' as const;
const LOCALES = ['pl', 'en'] as const;

type Locale = (typeof LOCALES)[number];
type OgType = 'website' | 'article';

export interface BuildMetadataOptions {
  title: string;
  description: string;
  locale: string;
  pathname: string;
  image?: string;
  type?: OgType;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

function buildUrl(locale: string, pathname: string): string {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (locale === DEFAULT_LOCALE) {
    return `${SITE_URL}${cleanPath}`;
  }
  return `${SITE_URL}/${locale}${cleanPath}`;
}

function toOpenGraphLocale(locale: string): string {
  return locale === 'pl' ? 'pl_PL' : 'en_US';
}

export function buildMetadata({
  title,
  description,
  locale,
  pathname,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: BuildMetadataOptions): Metadata {
  const validLocale = LOCALES.includes(locale as Locale) ? (locale as Locale) : DEFAULT_LOCALE;
  const canonical = buildUrl(validLocale, pathname);

  const alternates: Metadata['alternates'] = {
    canonical,
    languages: {
      'x-default': buildUrl(DEFAULT_LOCALE, pathname),
    },
  };

  for (const loc of LOCALES) {
    alternates.languages![loc] = buildUrl(loc, pathname);
  }

  const openGraph: Metadata['openGraph'] = {
    title,
    description,
    url: canonical,
    siteName: 'Bitspire',
    locale: toOpenGraphLocale(validLocale),
    type,
    ...(image
      ? {
          images: [
            {
              url: image.startsWith('http') ? image : `${SITE_URL}${image}`,
              alt: title,
            },
          ],
        }
      : {}),
    ...(type === 'article'
      ? {
          publishedTime,
          modifiedTime,
          authors,
        }
      : {}),
  };

  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title,
    description,
  };

  if (image) {
    twitter.images = [image.startsWith('http') ? image : `${SITE_URL}${image}`];
  }

  return {
    title,
    description,
    alternates,
    openGraph,
    twitter,
  };
}
