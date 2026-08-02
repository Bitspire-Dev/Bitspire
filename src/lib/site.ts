import type { Metadata } from 'next';

export const siteMetadata: Metadata = {
  applicationName: 'Bitspire',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      {
        url: '/favicon-light-mode.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-dark-mode.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/favicon-32x32.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16',
      },
    ],
    shortcut: {
      url: '/favicon.ico',
      type: 'image/x-icon',
      sizes: 'any',
    },
    apple: [
      {
        url: '/apple-touch-icon-light-mode.png',
        sizes: '180x180',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/apple-touch-icon-dark-mode.png',
        sizes: '180x180',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
};
