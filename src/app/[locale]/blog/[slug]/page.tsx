import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { readFile } from 'fs/promises';
import path from 'path';
import { getBlogConnection, getBlogPost } from '@/lib/tina';
import { routing } from '@/i18n/routing';
import { BlogArticle } from '@/components/pages/BlogArticlePage';
import { buildBlogArticleMap, toRelatedItems } from '@/lib/blog';
import { extractTocFromMarkdown } from '@/lib/toc';
import { localeAlternates } from '@/lib/site';

interface BlogPageParams {
  locale: string;
  slug: string;
}

export async function generateStaticParams() {
  const tina = await getBlogConnection();
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
  const [tina, all] = await Promise.all([getBlogPost(`${locale}/${slug}.md`), getBlogConnection()]);

  const post = tina.data.blog;
  if (!post) return {};

  const canonical = post.canonical?.trim() || slug;
  const byLocale = buildBlogArticleMap(all.data).byCanonical[canonical] ?? {};
  const cover = post.cover ?? undefined;

  return {
    title: post.title,
    description: post.description,
    alternates: localeAlternates(locale, l => `/blog/${byLocale[l] ?? slug}`),
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description ?? undefined,
      publishedTime: post.date ?? undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: cover ? [{ url: cover, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description ?? undefined,
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<BlogPageParams> }) {
  const { locale, slug } = await params;

  setRequestLocale(locale);

  const [tina, all, rawMarkdown] = await Promise.all([
    getBlogPost(`${locale}/${slug}.md`),
    getBlogConnection(),
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
