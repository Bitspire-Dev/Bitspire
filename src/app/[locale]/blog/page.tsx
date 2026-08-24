import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { buildMetadata } from '@/lib/metadata';
import { BlogPage } from '@/components/pages/BlogPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: locale === 'pl' ? 'Blog' : 'Blog',
    description:
      locale === 'pl'
        ? 'Artykuły o tworzeniu stron, aplikacji i nowoczesnym oprogramowaniu.'
        : 'Articles about building websites, applications and modern software.',
    locale,
    pathname: '/blog',
  });
}

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await tinaQueryWithRetry(() => client.queries.blogConnection());

  return (
    <BlogPage query={tina.query} variables={tina.variables} data={tina.data} locale={locale} />
  );
}
