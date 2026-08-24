import localFont from 'next/font/local';

export const inter = localFont({
  src: '../../public/fonts/Inter/InterVariable.woff2',
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
});

export const nippo = localFont({
  src: '../../public/fonts/Nippo/Nippo-Variable.woff2',
  variable: '--font-heading',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
});

export const ibmPlexMono = localFont({
  src: [
    {
      path: '../../public/fonts/IBM_Plex_Mono/IBMPlexMono-Regular-SlashedZero.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBM_Plex_Mono/IBMPlexMono-Italic-SlashedZero.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/IBM_Plex_Mono/IBMPlexMono-Bold-SlashedZero.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBM_Plex_Mono/IBMPlexMono-BoldItalic-SlashedZero.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
});
