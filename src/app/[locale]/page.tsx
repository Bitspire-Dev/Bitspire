import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPage } from '@/lib/tina';
import { HomePage } from '@/components/pages/HomePage';
import { localeAlternates } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await getPage(`${locale}/home.md`);

  const title = data.page?.title;
  const description = data.page?.description ?? undefined;

  return {
    title: title ? { absolute: title } : undefined,
    description,
    alternates: localeAlternates(locale, () => '/'),
    openGraph: { title, description },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await getPage(`${locale}/home.md`);

  if (!tina.data.page) {
    notFound();
  }

  return <HomePage query={tina.query} variables={tina.variables} data={tina.data} />;
}
