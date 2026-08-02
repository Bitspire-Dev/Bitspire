import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import client from '@tina/__generated__/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { inter, nippo, ibmPlexMono } from '@/lib/fonts';
import { ThemeProvider } from '@/components/providers/theme-provider';
import '../../globals.css';

export const metadata: Metadata = {
  title: 'Bitspire Preview',
  robots: {
    index: false,
    follow: false,
  },
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function PreviewLayout({
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

  const { data: headerData } = await client.queries.header({
    relativePath: `${locale}.md`,
  });

  const links =
    headerData.header?.navLinks?.flatMap(link =>
      link ? [{ label: link.label, href: link.href }] : []
    ) ?? [];

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${nippo.variable} ${ibmPlexMono.variable} flex min-h-screen flex-col bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Header locale={locale} links={links} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
