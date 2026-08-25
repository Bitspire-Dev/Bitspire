import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPage } from '@/lib/tina';
import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { getPageFallbackTitle } from '@/lib/ui';
import { localeAlternates } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await getPage(`${locale}/privacy.md`);

  const title = data.page?.title ?? getPageFallbackTitle(locale, 'privacy');
  const description = data.page?.description ?? undefined;

  return {
    title,
    description,
    alternates: localeAlternates(locale, () => '/privacy'),
    openGraph: { title, description },
  };
}

export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await getPage(`${locale}/privacy.md`);

  if (!tina.data.page) {
    notFound();
  }

  return (
    <PrivacyPage query={tina.query} variables={tina.variables} data={tina.data} locale={locale} />
  );
}
