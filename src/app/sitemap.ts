import type { MetadataRoute } from 'next';
import client from '@tina/__generated__/client';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';
import { buildBlogArticleMap, extractBlogSlug } from '@/lib/blog';
import { PORTFOLIO_CATEGORIES, getCategoryUrlSlug } from '@/lib/portfolio/categories';

const STATIC_PATHS = ['/', '/blog', '/portfolio', '/contact'] as const;

function localizedUrl(locale: string, path: string) {
  return `${siteUrl}/${locale}${path === '/' ? '' : path}`;
}

function languageAlternates(pathForLocale: (locale: string) => string) {
  return {
    languages: {
      ...Object.fromEntries(
        routing.locales.map(locale => [locale, localizedUrl(locale, pathForLocale(locale))])
      ),
      'x-default': localizedUrl(routing.defaultLocale, pathForLocale(routing.defaultLocale)),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    for (const locale of routing.locales) {
      entries.push({
        url: localizedUrl(locale, path),
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? 1 : 0.8,
        alternates: languageAlternates(() => path),
      });
    }
  }

  for (const category of PORTFOLIO_CATEGORIES) {
    for (const locale of routing.locales) {
      entries.push({
        url: localizedUrl(locale, `/portfolio/${getCategoryUrlSlug(category.id, locale)}`),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: languageAlternates(l => `/portfolio/${getCategoryUrlSlug(category.id, l)}`),
      });
    }
  }

  try {
    const [blogData, projectData] = await Promise.all([
      client.queries.blogConnection(),
      client.queries.projectConnection(),
    ]);

    const blogMap = buildBlogArticleMap(blogData.data);
    const blogEdges = blogData.data.blogConnection?.edges ?? [];

    for (const edge of blogEdges) {
      const node = edge?.node;
      if (!node) continue;
      const [locale, filename] = node._sys.relativePath.split('/');
      if (!locale || !filename) continue;
      const slug = extractBlogSlug(filename);
      const canonical = node.canonical?.trim() || slug;
      const byLocale = blogMap.byCanonical[canonical] ?? {};

      entries.push({
        url: localizedUrl(locale, `/blog/${slug}`),
        lastModified: node.date ? new Date(node.date) : undefined,
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: languageAlternates(l => `/blog/${byLocale[l] ?? slug}`),
      });
    }

    const projectEdges = projectData.data.projectConnection?.edges ?? [];
    for (const edge of projectEdges) {
      const node = edge?.node;
      if (!node) continue;
      const [locale, categoryId, filename] = node._sys.relativePath.split('/');
      if (!locale || !categoryId || !filename) continue;
      const slug = filename.replace(/\.md$/, '');

      entries.push({
        url: localizedUrl(
          locale,
          `/portfolio/${getCategoryUrlSlug(categoryId as 'websites' | 'software', locale)}/${slug}`
        ),
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: languageAlternates(
          l => `/portfolio/${getCategoryUrlSlug(categoryId as 'websites' | 'software', l)}/${slug}`
        ),
      });
    }
  } catch {
    // Content backend unavailable at build time — serve the static routes only.
  }

  return entries;
}
