import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'pl',
  
  // Always show locale in pathname for proper language switching
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames, exclude static files, API routes, and admin
  // Admin has its own routing and TinaCMS interface
  matcher: [
    '/((?!api|_next|_vercel|admin|favicon.ico|.*\\.[^/]+$).*)',
  ]
};
