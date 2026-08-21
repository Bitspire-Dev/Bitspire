import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { HomePage } from '@/components/pages/HomePage';

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
