import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  pathnames: {
    '/': '/',
    '/blog': { pl: '/blog', en: '/blog' },
    '/blog/[slug]': { pl: '/blog/[slug]', en: '/blog/[slug]' },
    '/portfolio': { pl: '/portfolio', en: '/portfolio' },
    '/portfolio/[category]': { pl: '/portfolio/[category]', en: '/portfolio/[category]' },
    '/portfolio/[category]/[slug]': {
      pl: '/portfolio/[category]/[slug]',
      en: '/portfolio/[category]/[slug]',
    },
    '/contact': { pl: '/kontakt', en: '/contact' },
    '/privacy': { pl: '/polityka-prywatnosci', en: '/privacy' },
  },
});
