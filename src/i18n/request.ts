import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './locales';

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
