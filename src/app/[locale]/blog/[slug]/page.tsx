import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { readFile } from 'fs/promises';
import path from 'path';
import { getBlogConnection, getBlogPost } from '@/lib/cms/client';
import { routing } from '@/i18n/routing';
import { BlogArticle } from '@/components/pages/BlogArticlePage';
import { buildBlogArticleMap, toRelatedItems, getBlogArticleHref } from '@/lib/cms/blog';
import { extractTocFromMarkdown } from '@/lib/cms/toc';
import { localePathname, getDefaultOgImages, socialMetadata } from '@/lib/seo/metadata';
import { getPageHref } from '@/lib/config/routes';
import {
  combineJsonLd,
  webPageJsonLd,
  blogPostingJsonLd,
  breadcrumbListJsonLd,
} from '@/lib/seo/json-ld';
import { extractContentSlug } from '@/lib/cms/slug';

interface BlogPageParams {
  locale: string;
  slug: string;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const tina = await getBlogConnection();
  const locales = routing.locales;
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs =
      tina.data.blogConnection?.edges
        ?.filter(edge => edge?.node?._sys.relativePath.startsWith(`${locale}/`))
        .map(edge => extractContentSlug(edge?.node?._sys.basename ?? '')) ?? [];
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
  if (!post) notFound();

  const canonical = post.canonical?.trim() || slug;
  const byLocale = buildBlogArticleMap(all.data).byCanonical[canonical] ?? {};
  const cover = post.cover ?? undefined;
  const defaultImages = getDefaultOgImages(locale);
  const selfUrl = localePathname(locale, getBlogArticleHref(slug));

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: selfUrl,
      languages: {
        ...Object.fromEntries(
          routing.locales
            .filter(l => byLocale[l])
            .map(l => [l, localePathname(l, getBlogArticleHref(byLocale[l]))])
        ),
        'x-default': byLocale[routing.defaultLocale]
          ? localePathname(
              routing.defaultLocale,
              getBlogArticleHref(byLocale[routing.defaultLocale])
            )
          : selfUrl,
      },
    },
    ...socialMetadata(locale, {
      title: post.title,
      description: post.description,
      url: selfUrl,
      type: 'article',
      publishedTime: post.date ?? undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: cover ? [{ url: cover, alt: post.title }] : defaultImages.openGraph,
    }),
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

  const post = tina.data.blog;
  const related = toRelatedItems(slug, locale, all.data);
  const toc = extractTocFromMarkdown(rawMarkdown);

  const postUrl = localePathname(locale, getBlogArticleHref(slug));
  const homeLabel = locale === 'pl' ? 'Strona główna' : 'Home';
  const blogLabel = 'Blog';
  const jsonLd = combineJsonLd(
    webPageJsonLd({
      name: post.title,
      description: post.description,
      url: postUrl,
      image: post.cover,
    }),
    blogPostingJsonLd({
      title: post.title,
      description: post.description,
      url: postUrl,
      image: post.cover,
      datePublished: post.date,
      author: post.author,
    }),
    breadcrumbListJsonLd([
      { name: homeLabel, item: localePathname(locale, getPageHref('home')) },
      { name: blogLabel, item: localePathname(locale, getPageHref('blog')) },
      { name: post.title, item: postUrl },
    ])
  );

  return (
    <BlogArticle
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      related={related}
      locale={locale}
      toc={toc}
      jsonLd={jsonLd}
      breadcrumbs={[
        { label: homeLabel, href: getPageHref('home') },
        { label: blogLabel, href: getPageHref('blog') },
        { label: post.title },
      ]}
    />
  );
}
