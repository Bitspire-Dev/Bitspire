import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import client from '@tina/__generated__/client';
import type { BlogConnectionQuery } from '@tina/__generated__/types';
import { BlogArticle } from '@/components/pages/BlogArticlePage';
import type { ContentCardItem } from '@/components/ui/composites/content-card';

interface BlogPageParams {
  locale: string;
  slug: string;
}

export async function generateStaticParams() {
  const tina = await client.queries.blogConnection();
  const locales = ['pl', 'en'];
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
  const tina = await client.queries.blog({
    relativePath: `${locale}/${slug}.md`,
  });

  return {
    title: tina.data.blog?.title,
    description: tina.data.blog?.description,
  };
}

function toRelatedItems(
  currentSlug: string,
  locale: string,
  data: BlogConnectionQuery
): ContentCardItem[] {
  const currentTags = new Set<string>();
  const edges = data?.blogConnection?.edges ?? [];
  const current = edges
    .filter((edge): edge is NonNullable<typeof edge> => !!edge && !!edge.node)
    .find(edge => {
      const node = edge.node!;
      const slug = node._sys.basename.replace(/\.md$/, '');
      return node._sys.relativePath.startsWith(`${locale}/`) && slug === currentSlug;
    });

  if (current?.node?.tags) {
    current.node.tags.filter((tag): tag is string => !!tag).forEach(tag => currentTags.add(tag));
  }

  const scored = edges
    .filter((edge): edge is NonNullable<typeof edge> => !!edge && !!edge.node)
    .filter(edge => edge.node!._sys.relativePath.startsWith(`${locale}/`))
    .map(edge => {
      const node = edge.node!;
      const slug = node._sys.basename.replace(/\.md$/, '');
      const tags = (node.tags ?? []).filter((tag): tag is string => !!tag);
      const shared = tags.filter(tag => currentTags.has(tag)).length;
      return { node, slug, shared };
    })
    .filter(item => item.slug !== currentSlug)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3);

  return scored.map(({ node, slug }) => ({
    id: node.id,
    title: node.title,
    description: node.description,
    image: node.cover,
    imageAlt: node.title,
    tags: node.tags,
    meta: { primaryHref: `/blog/${slug}` },
  }));
}

export default async function BlogArticlePage({ params }: { params: Promise<BlogPageParams> }) {
  const { locale, slug } = await params;

  setRequestLocale(locale);

  const [tina, all] = await Promise.all([
    client.queries.blog({ relativePath: `${locale}/${slug}.md` }),
    client.queries.blogConnection(),
  ]);

  if (!tina.data.blog) {
    notFound();
  }

  const related = toRelatedItems(slug, locale, all.data);

  return (
    <BlogArticle
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      related={related}
      locale={locale}
    />
  );
}
