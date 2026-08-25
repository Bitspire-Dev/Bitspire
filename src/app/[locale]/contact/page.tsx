import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPage } from '@/lib/tina';
import { ContactPage } from '@/components/pages/ContactPage';
import { getPageFallbackTitle } from '@/lib/ui';
import { localeAlternates } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await getPage(`${locale}/contact.md`);

  const title = data.page?.title ?? getPageFallbackTitle(locale, 'contact');
  const description = data.page?.description ?? undefined;

  return {
    title,
    description,
    alternates: localeAlternates(locale, () => '/contact'),
    openGraph: { title, description },
  };
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await getPage(`${locale}/contact.md`);

  if (!tina.data.page) {
    notFound();
  }

  return (
    <ContactPage query={tina.query} variables={tina.variables} data={tina.data} locale={locale} />
  );
}
