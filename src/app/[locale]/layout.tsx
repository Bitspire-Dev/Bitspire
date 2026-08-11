import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { buildBlogArticleMapFromFs } from '@/lib/blog-fs';
import { inter, nippo, ibmPlexMono } from '@/lib/fonts';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { siteMetadata } from '@/lib/site';
import '@/app/globals.css';

export const metadata: Metadata = {
  ...siteMetadata,
  title: 'Bitspire',
  description: 'Bitspire website',
};

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

  const blogMap = await buildBlogArticleMapFromFs();

  const setInitialTheme = `
    (function() {
      try {
        var theme = localStorage.getItem('bitspire-theme');
        if (theme !== 'light') theme = 'dark';
        document.documentElement.classList.add(theme);
        document.documentElement.style.colorScheme = theme;
      } catch (e) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      }
    })();
  `;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
      </head>
      <body
        className={`${inter.variable} ${nippo.variable} ${ibmPlexMono.variable} flex min-h-screen flex-col bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Header locale={locale} blogMap={blogMap} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
