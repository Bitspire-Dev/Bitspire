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
