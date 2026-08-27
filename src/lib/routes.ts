import { routing } from '@/i18n/routing';

export type PageId = 'home' | 'blog' | 'portfolio' | 'contact' | 'privacy';

export type LocalizedHref =
  | string
  | {
      pathname: string;
      params?: Record<string, string>;
      query?: Record<string, string>;
    };

const PAGE_PATHS: Record<PageId, LocalizedHref> = {
  home: '/',
  blog: '/blog',
  portfolio: '/portfolio',
  contact: '/contact',
  privacy: '/privacy',
};

const pathnames = routing.pathnames as Record<string, string | Record<string, string>> | undefined;

function resolvePathname(locale: string, pathname: string): string {
  const mapping = pathnames?.[pathname];
  if (typeof mapping === 'string') return mapping;
  if (mapping && typeof mapping === 'object') {
    return mapping[locale] ?? mapping[routing.defaultLocale] ?? pathname;
  }
  return pathname;
}

export function getPageHref(page: PageId): LocalizedHref {
  return PAGE_PATHS[page];
}

export function getPathname({
  locale,
  href,
}: {
  locale: string;
  href: LocalizedHref;
}): string {
  let pathname: string;
  const params: Record<string, string> = {};

  if (typeof href === 'string') {
    pathname = href;
  } else {
    pathname = href.pathname;
    if (href.params) Object.assign(params, href.params);
  }

  let resolved = resolvePathname(locale, pathname);
  Object.entries(params).forEach(([key, value]) => {
    resolved = resolved.replace(`[${key}]`, value);
  });

  if (resolved === '/') return `/${locale}`;
  return `/${locale}${resolved}`;
}

export function getLocalizedPath(locale: string, href: LocalizedHref): string {
  return getPathname({ locale, href });
}
