import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/portfolio': '/portfolio',
    '/portfolio/[category]': '/portfolio/[category]',
    '/portfolio/[category]/[slug]': '/portfolio/[category]/[slug]',
    '/contact': '/contact',
    '/privacy': '/privacy',
  },
});
