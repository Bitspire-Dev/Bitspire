export function formatDate(date: string | null | undefined, locale?: string): string | undefined {
  if (!date) return undefined;
  const normalizedLocale = locale === "pl" ? "pl-PL" : locale === "en" ? "en-US" : locale || "pl-PL";

  try {
    return new Date(date).toLocaleDateString(normalizedLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

export function toSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function safeLink(href?: string | null): string | undefined {
  if (!href) return undefined;
  const trimmed = href.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w.-]+\.[a-z]{2,}.*$/i.test(trimmed)) return `https://${trimmed}`;

  return undefined;
}

export function safeImageSrc(src?: string | null): string | undefined {
  if (!src) return undefined;
  const trimmed = src.trim();
  if (!trimmed) return undefined;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return trimmed;
  if (trimmed.startsWith('data:')) return trimmed;

  return `/${trimmed}`;
}

/**
 * Extract unique, sorted tags from a list of items that have a `tags` property.
 */
export function extractTags(items: Array<{ tags?: (string | null)[] | null }>): string[] {
  const tagsSet = new Set<string>();
  items.forEach((item) => {
    item.tags?.forEach((tag) => {
      if (tag) tagsSet.add(tag);
    });
  });
  return Array.from(tagsSet).sort();
}

/**
 * Filter items by search query and selected tags.
 * Searches across title, description, and (optionally) excerpt fields.
 */
export function filterByQueryAndTags<
  T extends { title?: string | null; description?: string | null; excerpt?: string | null; tags?: (string | null)[] | null }
>(
  items: T[],
  query: string,
  tags: string[]
): T[] {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedTags = tags.map((tag) => tag.toLowerCase());

  return items.filter((item) => {
    const matchesSearch =
      !normalizedQuery ||
      (item.title?.toLowerCase() || "").includes(normalizedQuery) ||
      (item.description?.toLowerCase() || "").includes(normalizedQuery) ||
      (item.excerpt?.toLowerCase() || "").includes(normalizedQuery);

    const matchesTags =
      normalizedTags.length === 0 ||
      normalizedTags.some((tag) =>
        item.tags?.some((itemTag) => itemTag?.toLowerCase() === tag)
      );

    return matchesSearch && matchesTags;
  });
}
