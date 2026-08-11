import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, isLocale } from './locales';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request (set by middleware)
  let locale = await requestLocale;
  
  // Fallback to default if not found
  if (!locale || !isLocale(locale)) {
    locale = DEFAULT_LOCALE;
  }

  return {
    locale,
    messages: {},
  };
});
