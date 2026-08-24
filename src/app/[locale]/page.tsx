import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { buildMetadata } from '@/lib/metadata';
import { HomePage } from '@/components/pages/HomePage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { data } = await tinaQueryWithRetry(() =>
    client.queries.page({
      relativePath: `${locale}/home.md`,
    })
  );

  const title = data.page?.title ?? (locale === 'pl' ? 'Strona główna' : 'Home');
  const description =
    data.page?.description ??
    (locale === 'pl'
      ? 'Tworzymy nowoczesne strony i oprogramowanie na miarę Twojego biznesu.'
      : 'We build modern websites and tailor-made software for your business.');

  return buildMetadata({
    title,
    description,
    locale,
    pathname: '/',
  });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await tinaQueryWithRetry(() =>
    client.queries.page({
      relativePath: `${locale}/home.md`,
    })
  );

  if (!tina.data.page) {
    notFound();
  }

  return <HomePage query={tina.query} variables={tina.variables} data={tina.data} />;
}
