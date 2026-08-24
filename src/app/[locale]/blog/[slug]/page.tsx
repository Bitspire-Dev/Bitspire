import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { readFile } from 'fs/promises';
import path from 'path';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { buildMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';
import { BlogArticle } from '@/components/pages/BlogArticlePage';
import { toRelatedItems } from '@/lib/blog';
import { extractTocFromMarkdown } from '@/lib/toc';

interface BlogPageParams {
  locale: string;
  slug: string;
}

export async function generateStaticParams() {
  const tina = await tinaQueryWithRetry(() => client.queries.blogConnection());
  const locales = routing.locales;
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs =
      tina.data.blogConnection?.edges
        ?.filter(edge => edge?.node?._sys.relativePath.startsWith(`${locale}/`))
        .map(edge => edge?.node?._sys.basename.replace(/\.md$/, '')) ?? [];
    for (const slug of slugs) {
      if (slug) params.push({ locale, slug });
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
  const tina = await tinaQueryWithRetry(() =>
    client.queries.blog({
      relativePath: `${locale}/${slug}.md`,
    })
  );

  const blog = tina.data.blog;
  if (!blog) {
    return {};
  }

  const authorName = typeof blog.author === 'object' && blog.author ? blog.author.name : undefined;

  return buildMetadata({
    title: blog.title ?? slug,
    description: blog.description ?? '',
    locale,
    pathname: `/blog/${slug}`,
    image: blog.cover ?? undefined,
    type: 'article',
    publishedTime: blog.date ?? undefined,
    authors: authorName ? [authorName] : undefined,
  });
}

export default async function BlogArticlePage({ params }: { params: Promise<BlogPageParams> }) {
  const { locale, slug } = await params;

  setRequestLocale(locale);

  const [tina, all, rawMarkdown] = await Promise.all([
    tinaQueryWithRetry(() => client.queries.blog({ relativePath: `${locale}/${slug}.md` })),
    tinaQueryWithRetry(() => client.queries.blogConnection()),
    readFile(path.join(process.cwd(), 'content', 'blog', locale, `${slug}.md`), 'utf-8').catch(
      () => ''
    ),
  ]);

  if (!tina.data.blog) {
    notFound();
  }

  const related = toRelatedItems(slug, locale, all.data);
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
