import { NextIntlClientProvider } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CursorLightProvider } from '@/components/features/Cursor-Light';
import { Background } from '@/components/layout/Background';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://bitspire.pl'),
  title: {
    default: 'Bitspire - Tworzenie stron internetowych | Strony i sklepy online',
    template: '%s | Bitspire',
  },
  description: 'Profesjonalne strony internetowe i sklepy online. Tworzymy nowoczesne, responsywne witryny z Next.js, React i Jamstack. SEO, szybkie ładowanie, indywidualny design.',
  keywords: [
    'tworzenie stron internetowych',
    'strony www',
    'sklepy online',
    'Next.js',
    'React',
    'Jamstack',
    'SEO',
    'responsywne strony',
    'web development',
    'programowanie stron',
  ],
  authors: [{ name: 'Bitspire' }],
  creator: 'Bitspire',
  publisher: 'Bitspire',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    alternateLocale: ['en_US'],
    url: 'https://bitspire.pl',
    siteName: 'Bitspire',
    title: 'Bitspire - Tworzenie stron internetowych',
    description: 'Profesjonalne strony internetowe i sklepy online. Tworzymy nowoczesne, responsywne witryny z Next.js, React i Jamstack.',
    images: [
      {
        url: '/logo/bitspire-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bitspire - Tworzenie stron internetowych',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitspire - Tworzenie stron internetowych',
    description: 'Profesjonalne strony internetowe i sklepy online',
    images: ['/logo/bitspire-og-image.png'],
    creator: '@bitspire',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/logo/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://bitspire.pl',
    languages: {
      'pl': 'https://bitspire.pl',
      'en': 'https://bitspire.pl/en',
    },
  },
  category: 'technology',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  // Pobierz locale z params (będzie ustawione przez middleware)
  const { locale } = await params;
  const currentLocale = locale || 'pl';
  // Messages are stored directly in MDX content; keep provider only for hooks like useLocale
  const messages = {};

  return (
    <html lang={currentLocale} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Podstawowa responsywność */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* PWA - Tryb aplikacji na iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bitspire" />
        
        {/* Kolor motywu dla przeglądarek mobilnych */}
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: light)" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        <NextIntlClientProvider locale={currentLocale} messages={messages}>
          <CursorLightProvider>
            <Background />
            <Header />
            <main className="relative z-10">
              {children}
            </main>
            <Footer />
          </CursorLightProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
