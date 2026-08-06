import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  pathnames: {
    '/': '/',
    '/blog': '/blog',
    '/portfolio': '/portfolio',
    '/portfolio/websites': {
      pl: '/portfolio/strony-internetowe',
      en: '/portfolio/websites',
    },
    '/portfolio/software': {
      pl: '/portfolio/oprogramowanie',
      en: '/portfolio/software',
    },
  },
});
