import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { readFile } from 'fs/promises';
import path from 'path';
import client from '@tina/__generated__/client';
import { routing } from '@/i18n/routing';
import { BlogArticle } from '@/components/pages/BlogArticlePage';
import { toRelatedItemsFromFs, getBlogSlugsForLocale } from '@/lib/blog-fs';
import { extractTocFromMarkdown } from '@/lib/toc';

interface BlogPageParams {
  locale: string;
  slug: string;
}

export async function generateStaticParams() {
  const locales = routing.locales;
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = await getBlogSlugsForLocale(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BlogPageParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tina = await client.queries.blog({
    relativePath: `${locale}/${slug}.md`,
  });

  return {
    title: tina.data.blog?.title,
    description: tina.data.blog?.description,
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<BlogPageParams> }) {
  const { locale, slug } = await params;

  setRequestLocale(locale);

  const [tina, rawMarkdown, related] = await Promise.all([
    client.queries.blog({ relativePath: `${locale}/${slug}.md` }),
    readFile(path.join(process.cwd(), 'content', 'blog', locale, `${slug}.md`), 'utf-8').catch(
      () => ''
    ),
    toRelatedItemsFromFs(slug, locale),
  ]);

  if (!tina.data.blog) {
    notFound();
  }
  const toc = extractTocFromMarkdown(rawMarkdown);

  return (
    <BlogArticle
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      related={related}
      locale={locale}
      toc={toc}
    />
  );
}
