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
import { DeviceCapabilityProvider } from '@/components/providers/device-capability-provider';
import { siteMetadata, siteName, localePathname, localeAlternates } from '@/lib/site';
import { combineJsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/json-ld';
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

  const title = `${siteName} — ${locale === 'pl' ? 'Nowoczesne rozwiązania webowe' : 'Modern web solutions'}`;
  const description = DESCRIPTIONS[locale] ?? DESCRIPTIONS.pl;

  return {
    ...siteMetadata,
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    alternates: localeAlternates(locale, () => '/'),
    openGraph: {
      ...siteMetadata.openGraph,
      title,
      description,
      locale: LOCALE_TO_OG[locale] ?? 'pl_PL',
      alternateLocale: routing.locales
        .map(l => LOCALE_TO_OG[l] ?? l)
        .filter(l => l !== LOCALE_TO_OG[locale]),
      url: localePathname(locale, '/'),
    },
    twitter: {
      ...siteMetadata.twitter,
      title,
      description,
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

  const messages = await getMessages();

  let blogMap: BlogArticleMap = { byCanonical: {}, bySlug: {} };
  try {
    const { data: blogData } = await getBlogConnection();
    blogMap = buildBlogArticleMap(blogData);
  } catch {
    // If the Tina dev server is not quite ready yet, still render the shell.
    // Blog-specific locale switching will fall back to the current slug.
  }

  const jsonLd = combineJsonLd(organizationJsonLd(), websiteJsonLd());

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${nippo.variable} ${ibmPlexMono.variable} flex min-h-dvh flex-col bg-background text-foreground antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <MotionProvider>
            <DeviceCapabilityProvider>
              <NextIntlClientProvider messages={messages} locale={locale}>
                <Header locale={locale} blogMap={blogMap} />
                <main className="flex-1">{children}</main>
                <Footer locale={locale} />
              </NextIntlClientProvider>
            </DeviceCapabilityProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
