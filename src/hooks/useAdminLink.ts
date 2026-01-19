'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

/**
 * Hook to generate correct links that work both in admin and production mode
 * In admin mode: /admin/{locale}/{path}
 * In production: /{locale}/{path} or /{path} (depending on locale)
 */
export function useAdminLink() {
  const pathname = usePathname();
  const locale = useLocale();
  
  const isAdmin = pathname.startsWith('/admin/');
  const isPreview = pathname.startsWith('/admin/preview');
  
  /**
   * Convert a regular path to admin-aware path
   * @param href - Regular path like '/portfolio' or '/blog' or '/'
   * @returns Admin-aware path
   */
  const getLink = (href: string): string => {
    if (href.startsWith('http')) {
      return href;
    }

    if (isPreview) {
      const localeMatch = pathname?.match(/\/admin\/preview\/([^\/]+)/);
      const previewLocale = localeMatch?.[1] || locale;

      const cleanHref = href.replace(/^\/(pl|en)/, '').replace(/\/$/, '');

      let newPath = 'home';
      if (href === '/' || href === `/${previewLocale}` || href === `/${previewLocale}/`) {
        newPath = 'home';
      } else if (cleanHref === '/portfolio') {
        newPath = 'portfolio';
      } else if (cleanHref.startsWith('/portfolio/')) {
        newPath = cleanHref.substring(1);
      } else if (cleanHref === '/blog') {
        newPath = 'blog';
      } else if (cleanHref.startsWith('/blog/')) {
        newPath = cleanHref.substring(1);
      } else if (cleanHref) {
        newPath = cleanHref.substring(1) || 'home';
      }

      return `/admin/preview/${previewLocale}/${newPath}`;
    }

    if (isAdmin) {
      // Remove leading slash from href
      const cleanHref = href.startsWith('/') ? href.slice(1) : href;

      // Special case: root path "/" should go to /admin/{locale}
      if (cleanHref === '' || cleanHref === '/') {
        return `/admin/${locale}`;
      }

      return `/admin/${locale}/${cleanHref}`;
    }

    // In production, always prefix locale (localePrefix is always)
    const withSlash = href.startsWith('/') ? href : `/${href}`;
    const normalized = withSlash.replace(/\/$/, '') || '/';

    if (normalized === '/') return `/${locale}`;
    if (normalized === '/pl' || normalized === '/en' || normalized.startsWith('/pl/') || normalized.startsWith('/en/')) {
      return normalized;
    }

    return `/${locale}${normalized}`;
  };
  
  return { getLink, isAdmin };
}
