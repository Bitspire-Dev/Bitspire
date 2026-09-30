import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { COMPANY } from '@/lib/company';
import { getLocalizedPath, type LocalizedHref } from '@/lib/routes';

export const siteName = COMPANY.name;

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const siteUrl = rawSiteUrl
  .replace(/^https?:\/\/www\./, match => match.replace('www.', ''))
  .replace(/\/$/, '');

export const localePathname = (locale: string, href: LocalizedHref) => {
  return `${siteUrl}${getLocalizedPath(locale, href)}`;
};

export function getDefaultOgImages(locale: string) {
  return {
    openGraph: [{ url: `/${locale}/opengraph-image`, alt: siteName }],
    twitter: [{ url: `/${locale}/twitter-image`, alt: siteName }],
  };
}

const LOCALE_TO_OG: Record<string, string> = { pl: 'pl_PL', en: 'en_US' };

export interface SocialMetadataOptions {
  title?: string | null;
  description?: string | null;
  url: string;
  type?: 'website' | 'article';
  images?: { url: string; alt: string }[];
  publishedTime?: string;
  authors?: string[];
}

export function socialMetadata(
  locale: string,
  options: SocialMetadataOptions
): Pick<Metadata, 'openGraph' | 'twitter'> {
  const ogLocale = LOCALE_TO_OG[locale] ?? LOCALE_TO_OG[routing.defaultLocale];
  const { title, description, url, type = 'website', images, publishedTime, authors } = options;

  const openGraph: NonNullable<Metadata['openGraph']> = {
    type,
    siteName,
    title: title ?? undefined,
    description: description ?? undefined,
    locale: ogLocale,
    alternateLocale: routing.locales.map(l => LOCALE_TO_OG[l] ?? l).filter(l => l !== ogLocale),
    url,
    images,
  };

  if (type === 'article') {
    Object.assign(openGraph, { publishedTime, authors });
  }

  return {
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: title ?? undefined,
      description: description ?? undefined,
      images: images?.map(image => image.url),
    },
  };
}

export function sitemapAlternates(pathForLocale: (locale: string) => LocalizedHref) {
  return {
    languages: {
      ...Object.fromEntries(
        routing.locales.map(locale => [locale, localePathname(locale, pathForLocale(locale))])
      ),
      'x-default': localePathname(routing.defaultLocale, pathForLocale(routing.defaultLocale)),
    },
  };
}

export function localeAlternates(
  locale: string,
  pathForLocale: (locale: string) => LocalizedHref
): Metadata['alternates'] {
  return {
    canonical: localePathname(locale, pathForLocale(locale)),
    languages: {
      ...Object.fromEntries(routing.locales.map(l => [l, localePathname(l, pathForLocale(l))])),
      'x-default': localePathname(routing.defaultLocale, pathForLocale(routing.defaultLocale)),
    },
  };
}

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  manifest: '/site.webmanifest',
  creator: siteName,
  publisher: siteName,
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description:
      'Bitspire — nowoczesne strony i aplikacje webowe. Projektujemy i budujemy szybkie, dopracowane produkty cyfrowe.',
    locale: 'pl_PL',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description:
      'Bitspire — nowoczesne strony i aplikacje webowe. Projektujemy i budujemy szybkie, dopracowane produkty cyfrowe.',
  },
  icons: {
    icon: [
      {
        url: '/favicon-light-mode.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-dark-mode.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/favicon-32x32.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16',
      },
    ],
    shortcut: {
      url: '/favicon.ico',
      type: 'image/x-icon',
      sizes: 'any',
    },
    apple: [
      {
        url: '/apple-touch-icon-light-mode.png',
        sizes: '180x180',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/apple-touch-icon-dark-mode.png',
        sizes: '180x180',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
};
