import type { Metadata } from "next";
import { resolveLocalizedPathname } from "@/i18n/routing";

export const BASE_URL = "https://bitspire.pl";
export const SUPPORTED_LOCALES = ["pl", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function normalizeLocale(locale: string | undefined): SupportedLocale {
  return locale === "en" ? "en" : "pl";
}

export function localePrefix(locale: SupportedLocale): string {
  return locale === "en" ? "/en" : "/pl";
}

export function buildLocalePath(locale: SupportedLocale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const localized = resolveLocalizedPathname(clean, locale);
  const prefix = localePrefix(locale);
  if (!prefix) return localized === "/" ? "/" : localized;
  return localized === "/" ? prefix : `${prefix}${localized}`;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildAlternates(locale: SupportedLocale, paths: { pl: string; en: string }) {
  return {
    canonical: absoluteUrl(paths[locale]),
    languages: {
      pl: absoluteUrl(paths.pl),
      en: absoluteUrl(paths.en),
    },
  };
}

export function buildMetadata({
  title,
  description,
  locale,
  paths,
  image,
  ogType = "website",
}: {
  title?: string | null;
  description?: string | null;
  locale: SupportedLocale;
  paths: { pl: string; en: string };
  image?: string | null;
  ogType?: "website" | "article";
}): Metadata {
  const safeTitle = title ?? "Bitspire";
  const safeDescription = description ?? "";
  const imageUrl = image ? absoluteUrl(image) : undefined;
  const otherLocale = locale === "pl" ? "en" : "pl";
  const openGraphImages = imageUrl
    ? [{ url: imageUrl, width: 1200, height: 630, alt: safeTitle }]
    : undefined;

  return {
    title: safeTitle,
    description: safeDescription,
    alternates: buildAlternates(locale, paths),
    openGraph: {
      type: ogType,
      title: safeTitle,
      description: safeDescription,
      url: absoluteUrl(paths[locale]),
      locale: locale === "pl" ? "pl_PL" : "en_US",
      alternateLocale: [otherLocale === "pl" ? "pl_PL" : "en_US"],
      images: openGraphImages,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: safeTitle,
      description: safeDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}