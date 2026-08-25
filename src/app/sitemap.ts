import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { localePathname, sitemapAlternates } from '@/lib/site';
import { getBlogConnection, getPageConnection, getProjectConnection } from '@/lib/tina';
import { buildBlogArticleMap } from '@/lib/blog';
import { PORTFOLIO_CATEGORIES, getCategoryUrlSlug } from '@/lib/portfolio/categories';
import { extractContentSlug } from '@/lib/string';
import { dottedDateToIso } from '@/lib/date';

const STATIC_PATHS = ['/', '/blog', '/portfolio', '/contact', '/privacy'] as const;

const PATH_TO_PAGE_SLUG: Record<(typeof STATIC_PATHS)[number], string> = {
  '/': 'home',
  '/blog': 'blog',
  '/portfolio': 'portfolio',
  '/contact': 'contact',
  '/privacy': 'privacy',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  const pageLastUpdated = new Map<string, string | null>();
  let pageData: Awaited<ReturnType<typeof getPageConnection>> | undefined;

  try {
    pageData = await getPageConnection();
    for (const edge of pageData.data.pageConnection?.edges ?? []) {
      const node = edge?.node;
      if (!node) continue;
      const [locale, filename] = node._sys.relativePath.split('/');
      if (!locale || !filename) continue;
      const slug = extractContentSlug(filename);
      pageLastUpdated.set(`${locale}:${slug}`, dottedDateToIso(node.lastUpdated));
    }
  } catch {
    // Content backend unavailable -- continue without lastModified for pages.
  }

  for (const path of STATIC_PATHS) {
    const pageSlug = PATH_TO_PAGE_SLUG[path];
    for (const locale of routing.locales) {
      const lastUpdated = pageLastUpdated.get(`${locale}:${pageSlug}`);
      entries.push({
        url: localePathname(locale, path),
        lastModified: lastUpdated ? new Date(lastUpdated) : undefined,
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? 1 : 0.8,
        alternates: sitemapAlternates(() => path),
      });
    }
  }

  for (const category of PORTFOLIO_CATEGORIES) {
    for (const locale of routing.locales) {
      entries.push({
        url: localePathname(locale, `/portfolio/${getCategoryUrlSlug(category.id, locale)}`),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: sitemapAlternates(l => `/portfolio/${getCategoryUrlSlug(category.id, l)}`),
      });
    }
  }

  try {
    const [blogData, projectData] = await Promise.all([
      getBlogConnection(),
      getProjectConnection(),
    ]);

    const blogMap = buildBlogArticleMap(blogData.data);
    const blogEdges = blogData.data.blogConnection?.edges ?? [];

    for (const edge of blogEdges) {
      const node = edge?.node;
      if (!node) continue;
      const [locale, filename] = node._sys.relativePath.split('/');
      if (!locale || !filename) continue;
      const slug = extractContentSlug(filename);
      const canonical = node.canonical?.trim() || slug;
      const byLocale = blogMap.byCanonical[canonical] ?? {};

      entries.push({
        url: localePathname(locale, `/blog/${slug}`),
        lastModified: node.date ? new Date(node.date) : undefined,
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: sitemapAlternates(l => `/blog/${byLocale[l] ?? slug}`),
      });
    }

    const projectEdges = projectData.data.projectConnection?.edges ?? [];
    for (const edge of projectEdges) {
      const node = edge?.node;
      if (!node) continue;
      const [locale, categoryId, filename] = node._sys.relativePath.split('/');
      if (!locale || !categoryId || !filename) continue;
      const slug = extractContentSlug(filename);

      entries.push({
        url: localePathname(
          locale,
          `/portfolio/${getCategoryUrlSlug(categoryId as 'websites' | 'software', locale)}/${slug}`
        ),
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: sitemapAlternates(
          l => `/portfolio/${getCategoryUrlSlug(categoryId as 'websites' | 'software', l)}/${slug}`
        ),
      });
    }
  } catch {
    // Content backend unavailable at build time -- serve the static routes only.
  }

  return entries;
}
