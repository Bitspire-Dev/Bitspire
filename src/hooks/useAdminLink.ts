"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { buildAdminLink, isAdminPath } from "@/lib/routing/adminLink";

/**
 * Hook to generate correct links that work both in admin and production mode
 * In admin mode: /admin/{locale}/{path}
 * In production: /{locale}/{path} or /{path} (depending on locale)
 */
export function useAdminLink() {
  const pathname = usePathname();
  const locale = useLocale();

  const isAdmin = isAdminPath(pathname);

  /**
   * Convert a regular path to admin-aware path
   * @param href - Regular path like '/portfolio' or '/blog' or '/'
   * @returns Admin-aware path
   */
  const getLink = (href: string): string =>
    buildAdminLink(href, {
      locale,
      pathname,
    });

  return { getLink, isAdmin };
}
