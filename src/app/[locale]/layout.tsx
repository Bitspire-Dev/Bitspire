import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getBlogConnection } from '@/lib/tina';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { buildBlogArticleMap, type BlogArticleMap } from '@/lib/blog';
import { inter, nippo, ibmPlexMono } from '@/lib/fonts';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { MotionProvider } from '@/components/providers/motion-provider';
import { siteMetadata, siteName, siteUrl, localePathname, localeAlternates } from '@/lib/site';
import '@/app/globals.css';

const LOCALE_TO_OG: Record<string, string> = { pl: 'pl_PL', en: 'en_US' };

const DESCRIPTIONS: Record<string, string> = {
  pl: 'Bitspire — nowoczesne strony i aplikacje webowe. Projektujemy i budujemy szybkie, dopracowane produkty cyfrowe.',
  en: 'Bitspire — modern websites and web applications. We design and build fast, polished digital products.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c0b' },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    ...siteMetadata,
    title: {
      default: `${siteName} — ${locale === 'pl' ? 'Nowoczesne rozwiązania webowe' : 'Modern web solutions'}`,
      template: `%s | ${siteName}`,
    },
    description: DESCRIPTIONS[locale] ?? DESCRIPTIONS.pl,
    alternates: localeAlternates(locale, () => '/'),
    openGraph: {
      ...siteMetadata.openGraph,
      locale: LOCALE_TO_OG[locale] ?? 'pl_PL',
      alternateLocale: routing.locales
        .map(l => LOCALE_TO_OG[l] ?? l)
        .filter(l => l !== LOCALE_TO_OG[locale]),
      url: localePathname(locale, '/'),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  let blogMap: BlogArticleMap = { byCanonical: {}, bySlug: {} };
  try {
    const { data: blogData } = await getBlogConnection();
    blogMap = buildBlogArticleMap(blogData);
  } catch {
    // If the Tina dev server is not quite ready yet, still render the shell.
    // Blog-specific locale switching will fall back to the current slug.
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/favicon-light-mode.svg`,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: routing.locales,
      },
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${nippo.variable} ${ibmPlexMono.variable} flex min-h-screen flex-col bg-background text-foreground antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <MotionProvider>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <Header locale={locale} blogMap={blogMap} />
              <main className="flex-1">{children}</main>
              <Footer locale={locale} />
            </NextIntlClientProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
