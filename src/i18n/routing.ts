import type { Locale } from './locales';
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

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

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localePrefix: 'as-needed',
  pathnames,
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

export function normalizePathname(pathname: string): string {
  if (!pathname) return '/';
  const withSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (withSlash === '/') return '/';
  return withSlash.replace(/\/$/, '');
}

export function resolveLocalizedPathname(pathname: string, locale: Locale): string {
  const normalized = normalizePathname(pathname);

  for (const [key, value] of Object.entries(pathnames)) {
    const normalizedKey = normalizePathname(key);
    if (typeof value === 'string') {
      const normalizedValue = normalizePathname(value);
      if (normalized === normalizedKey || normalized === normalizedValue) {
        return normalizedValue;
      }
      continue;
    }

    const localizedValue = value[locale];
    const normalizedLocalized = normalizePathname(localizedValue);
    if (normalized === normalizedKey) {
      return normalizedLocalized;
    }

    const matchesAnyLocale = Object.values(value).some((candidate) =>
      normalizePathname(candidate) === normalized
    );
    if (matchesAnyLocale) {
      return normalizedLocalized;
    }
  }

  return normalized;
}

export function resolvePathnameKey(
  pathname: string,
  locale: Locale
): keyof typeof pathnames | null {
  const normalized = normalizePathname(pathname);

  for (const [key, value] of Object.entries(pathnames)) {
    const normalizedKey = normalizePathname(key);
    if (normalized === normalizedKey) {
      return key as keyof typeof pathnames;
    }

    if (typeof value === 'string') {
      if (normalized === normalizePathname(value)) {
        return key as keyof typeof pathnames;
      }
      continue;
    }

    const localizedValue = value[locale];
    if (localizedValue && normalized === normalizePathname(localizedValue)) {
      return key as keyof typeof pathnames;
    }

    const matchesAnyLocale = Object.values(value).some(
      (candidate) => normalizePathname(candidate) === normalized
    );
    if (matchesAnyLocale) {
      return key as keyof typeof pathnames;
    }
  }

  return null;
}

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
