import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getBlogConnection, getPage } from '@/lib/tina';
import { BlogPage } from '@/components/pages/BlogPage';
import { getPageFallbackTitle } from '@/lib/ui';
import { localeAlternates, siteMetadata, getDefaultOgImages, siteUrl } from '@/lib/site';
import { combineJsonLd, webPageJsonLd, breadcrumbListJsonLd } from '@/lib/json-ld';

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
  const defaultImages = getDefaultOgImages(locale);

  return {
    title,
    description,
    alternates: localeAlternates(locale, () => '/blog'),
    openGraph: { ...siteMetadata.openGraph, title, description, images: defaultImages.openGraph },
    twitter: { ...siteMetadata.twitter, title, description, images: defaultImages.twitter },
  };
}

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  const [tina, pageData] = await Promise.all([
    getBlogConnection(),
    getPage(`${locale}/blog.md`).catch(() => ({ data: { page: null } })),
  ]);

  const page = pageData.data.page;
  const pageUrl = `${siteUrl}/${locale}/blog`;
  const homeLabel = locale === 'pl' ? 'Strona główna' : 'Home';
  const blogLabel = page?.title ?? getPageFallbackTitle(locale, 'blog');
  const description = page?.description;
  const jsonLd = combineJsonLd(
    webPageJsonLd({
      name: blogLabel,
      description,
      url: pageUrl,
    }),
    breadcrumbListJsonLd([
      { name: homeLabel, item: `${siteUrl}/${locale}` },
      { name: blogLabel, item: pageUrl },
    ])
  );

  return (
    <BlogPage
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      locale={locale}
      jsonLd={jsonLd}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: blogLabel }]}
    />
  );
}
