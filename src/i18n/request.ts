import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Supported locales (kept sync with middleware)
export const locales = ['pl', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request (set by middleware)
  let locale = await requestLocale;
  
  // Fallback to default if not found
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'pl';
  }

  return {
    locale,
    messages: {},
  };
});
