import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getBlogConnection, getPage } from '@/lib/tina';
import { BlogPage } from '@/components/pages/BlogPage';
import { getPageFallbackTitle } from '@/lib/ui';
import { localeAlternates } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  let title = getPageFallbackTitle(locale, 'blog');
  let description: string | undefined;
  try {
    const { data } = await getPage(`${locale}/blog.md`);
    title = data.page?.title ?? title;
    description = data.page?.description ?? undefined;
  } catch {
    // Content unavailable — fall back to the defaults above.
  }

  return {
    title,
    description,
    alternates: localeAlternates(locale, () => '/blog'),
    openGraph: { title, description },
  };
}

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tina = await getBlogConnection();

  return (
    <BlogPage query={tina.query} variables={tina.variables} data={tina.data} locale={locale} />
  );
}
