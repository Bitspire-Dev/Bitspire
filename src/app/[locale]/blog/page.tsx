import { setRequestLocale } from 'next-intl/server';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { BlogPage } from '@/components/pages/BlogPage';

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await tinaQueryWithRetry(() => client.queries.blogConnection());

  return (
    <BlogPage query={tina.query} variables={tina.variables} data={tina.data} locale={locale} />
  );
}
