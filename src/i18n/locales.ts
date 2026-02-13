export const locales = ['pl', 'en'] as const;
export type Locale = (typeof locales)[number];

/** The default / fallback locale used across the app. */
export const DEFAULT_LOCALE: Locale = 'pl';

/** Check whether a string is a supported locale. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Normalize an unknown string to a supported Locale (falls back to DEFAULT_LOCALE). */
export function normalizeLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Locale → OpenGraph-style locale string. */
export const OG_LOCALES: Record<Locale, string> = {
  pl: 'pl_PL',
  en: 'en_US',
};

/** Locale → label for UI. */
export const LOCALE_LABELS: Record<Locale, string> = {
  pl: 'Polski',
  en: 'English',
};

/** Locale → date-fns / Intl locale tag used for date formatting. */
export const DATE_LOCALES: Record<Locale, string> = {
  pl: 'pl-PL',
  en: 'en-US',
};
