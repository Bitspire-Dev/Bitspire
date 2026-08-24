import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { buildMetadata } from '@/lib/metadata';
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
  const description =
    data.page?.description ??
    (locale === 'pl'
      ? 'Skontaktuj się z Bitspire. Chętnie odpowiemy na Twoje pytania.'
      : 'Get in touch with Bitspire. We will be happy to answer your questions.');

  return buildMetadata({
    title,
    description,
    locale,
    pathname: '/contact',
  });
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
