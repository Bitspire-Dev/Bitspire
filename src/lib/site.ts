import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { COMPANY } from '@/lib/company';

export const siteName = COMPANY.name;

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const siteUrl = rawSiteUrl
  .replace(/^https?:\/\/www\./, match => match.replace('www.', ''))
  .replace(/\/$/, '');

export const localePathname = (locale: string, path: string) => {
  const normalizedPath = path.replace(/\/$/, '');
  return `${siteUrl}/${locale}${normalizedPath === '/' ? '' : normalizedPath}`;
};

export function getDefaultOgImages(locale: string) {
  return {
    openGraph: [{ url: `/${locale}/opengraph-image`, alt: siteName }],
    twitter: [{ url: `/${locale}/twitter-image`, alt: siteName }],
  };
}

export function sitemapAlternates(pathForLocale: (locale: string) => string) {
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
  pathForLocale: (locale: string) => string
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
