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
  
  /**
   * Convert a regular path to admin-aware path
   * @param href - Regular path like '/portfolio' or '/blog' or '/'
   * @returns Admin-aware path
   */
  const getLink = (href: string): string => {
    if (isAdmin) {
      // Remove leading slash from href
      const cleanHref = href.startsWith('/') ? href.slice(1) : href;

      // Special case: root path "/" should go to /admin/{locale}
      if (cleanHref === '' || cleanHref === '/') {
        return `/admin/${locale}`;
      }

      return `/admin/${locale}/${cleanHref}`;
    }
    
    // In production mode, return as-is (Next.js middleware will handle locale)
    return href;
  };
  
  return { getLink, isAdmin };
}
