import type { Locale } from './locales';
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

// Path mappings for different locales
export const pathnames = {
  '/': '/',
  '/portfolio': '/portfolio',
  '/polityka-prywatnosci': {
    pl: '/polityka-prywatnosci',
    en: '/privacy-policy',
  },
  '/polityka-cookies': {
    pl: '/polityka-cookies',
    en: '/cookies-policy',
  },
  '/regulamin': {
    pl: '/regulamin',
    en: '/terms',
  },
} as const;

// File name mappings for MDX files
export const mdxFileNames: Record<string, Record<Locale, string>> = {
  'privacy': {
    pl: 'polityka-prywatnosci.mdx',
    en: 'privacy-policy.mdx',
  },
  'cookies': {
    pl: 'polityka-cookies.mdx',
    en: 'cookies-policy.mdx',
  },
  'terms': {
    pl: 'regulamin.mdx',
    en: 'terms.mdx',
  },
  'portfolio': {
    pl: 'portfolio.mdx',
    en: 'portfolio.mdx',
  },
};

// Get the correct MDX file name based on locale
export function getMdxFileName(pageType: keyof typeof mdxFileNames, locale: Locale): string {
  return mdxFileNames[pageType][locale];
}
