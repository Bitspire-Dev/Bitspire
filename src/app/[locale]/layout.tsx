import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { buildBlogArticleMap, type BlogArticleMap } from '@/lib/blog';
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

  let blogMap: BlogArticleMap = { byCanonical: {}, bySlug: {} };
  try {
    const { data: blogData } = await tinaQueryWithRetry(() => client.queries.blogConnection());
    blogMap = buildBlogArticleMap(blogData);
  } catch {
    // If the Tina dev server is not quite ready yet, still render the shell.
    // Blog-specific locale switching will fall back to the current slug.
  }

  return (
    <html lang={locale} suppressHydrationWarning>
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
