import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { ContactPage } from '@/components/pages/ContactPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await tinaQueryWithRetry(() =>
    client.queries.page({
      relativePath: `${locale}/contact.md`,
    })
  );

  const title = data.page?.title ?? (locale === 'pl' ? 'Kontakt' : 'Contact');
  const description = data.page?.description ?? '';

  return {
    title: `${title} | Bitspire`,
    description,
  };
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await tinaQueryWithRetry(() =>
    client.queries.page({
      relativePath: `${locale}/contact.md`,
    })
  );

  if (!tina.data.page) {
    notFound();
  }

  return (
    <ContactPage query={tina.query} variables={tina.variables} data={tina.data} locale={locale} />
  );
}
