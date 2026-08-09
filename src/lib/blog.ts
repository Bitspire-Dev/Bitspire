import type { BlogConnectionQuery } from '@tina/__generated__/types';
import type { ContentCardItem } from '@/components/ui/composites/content-card';

export interface BlogArticleMap {
  byCanonical: Record<string, Record<string, string>>;
  bySlug: Record<string, string>;
}

export function getBlogArticleHref(slug: string) {
  return {
    pathname: '/blog/[slug]' as const,
    params: { slug },
  };
}

export function extractBlogSlug(relativePath: string): string {
  return relativePath.split('/').pop()?.replace(/\.md$/, '') ?? '';
}

export function buildBlogArticleMap(data: BlogConnectionQuery): BlogArticleMap {
  const byCanonical: Record<string, Record<string, string>> = {};
  const bySlug: Record<string, string> = {};

  const edges = data?.blogConnection?.edges ?? [];
  for (const edge of edges) {
    if (!edge?.node) continue;
    const node = edge.node;
    const [locale, filename] = node._sys.relativePath.split('/');
    const slug = extractBlogSlug(filename ?? '');
    const canonical = node.canonical?.trim() || slug;

    if (!byCanonical[canonical]) {
      byCanonical[canonical] = {};
    }
    byCanonical[canonical][locale] = slug;
    bySlug[`${locale}|${slug}`] = canonical;
  }

  return { byCanonical, bySlug };
}

export function toRelatedItems(
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
      const slug = extractBlogSlug(node._sys.relativePath);
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
      const slug = extractBlogSlug(node._sys.relativePath);
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
    meta: {
      primaryHref: getBlogArticleHref(slug),
    },
  }));
}
