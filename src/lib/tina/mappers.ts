// Normalization and helpers for Tina data.

import { formatDate } from "@/lib/ui/helpers";
import { DEFAULT_LOCALE } from "@/i18n/locales";

export function normalizePost<T extends { _sys?: { filename?: string }; date?: string | null; title?: string; excerpt?: string | null; description?: string | null; readTime?: number | null; image?: string | null; imageAlt?: string | null; category?: string | null; tags?: (string | null)[] | null; author?: string | null; body?: unknown; }>(raw: T, options?: { locale?: string; relatedPosts?: unknown[] }) {
  const { locale = DEFAULT_LOCALE, relatedPosts = [] } = options || {};
  return {
    ...raw,
    slug: raw._sys?.filename?.replace(/\.mdx$/, ""),
    dateFormatted: formatDate(raw.date, locale),
    relatedPosts,
  };
}

export function normalizeProject<T extends { _sys?: { filename?: string }; title?: string; description?: string; tags?: (string | null)[] | null; year?: string | null; image?: string | null; imageAlt?: string | null; body?: unknown; }>(raw: T, options?: { locale?: string }) {
  const { locale = DEFAULT_LOCALE } = options || {};
  return {
    ...raw,
    slug: raw._sys?.filename?.replace(/\.mdx$/, ""),
    year: raw.year,
    locale,
  };
}

export function getRelatedPosts(current: { category?: string | null; _sys?: { filename?: string } }, allPosts: Array<{ category?: string | null; _sys?: { filename?: string } }>, limit = 3) {
  const currentSlug = current._sys?.filename;
  const sameCategory = current.category
    ? allPosts.filter(p => p._sys?.filename !== currentSlug && p.category === current.category)
    : [];
  const remaining = allPosts.filter(p => p._sys?.filename !== currentSlug && !sameCategory.includes(p));
  return [...sameCategory, ...remaining].slice(0, limit);
}
