import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { PrivacyPage } from '@/components/pages/PrivacyPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await tinaQueryWithRetry(() =>
    client.queries.page({
      relativePath: `${locale}/privacy.md`,
    })
  );

  const title = data.page?.title ?? (locale === 'pl' ? 'Polityka prywatności' : 'Privacy Policy');
  const description = data.page?.description ?? '';

  return {
    title: `${title} | Bitspire`,
    description,
  };
}

export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await tinaQueryWithRetry(() =>
    client.queries.page({
      relativePath: `${locale}/privacy.md`,
    })
  );

  if (!tina.data.page) {
    notFound();
  }

  return (
    <PrivacyPage query={tina.query} variables={tina.variables} data={tina.data} locale={locale} />
  );
}
