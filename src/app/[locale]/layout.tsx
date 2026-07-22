import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import client from '@tina/__generated__/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { inter, nippo, ibmPlexMono } from '@/lib/fonts';
import '../globals.css';

export const metadata: Metadata = {
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

  const { data: headerData } = await client.queries.header({
    relativePath: `${locale}.md`,
  });

  const links = (headerData.header?.navLinks ?? []) as { label: string; href: string }[];

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${nippo.variable} ${ibmPlexMono.variable} dark flex min-h-screen flex-col bg-background text-foreground antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header locale={locale} links={links} />
          <main className="flex-1">{children}</main>
        </NextIntlClientProvider>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
