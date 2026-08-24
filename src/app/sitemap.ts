import type { MetadataRoute } from 'next';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { PORTFOLIO_CATEGORIES, getCategoryUrlSlug } from '@/lib/portfolio/categories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bitspire.pl';
const DEFAULT_LOCALE = 'pl' as const;
const LOCALES = ['pl', 'en'] as const;

const STATIC_PATHS = ['', 'contact', 'portfolio', 'blog', 'privacy'] as const;

async function getFileMtime(filePath: string): Promise<Date | undefined> {
  try {
    const stats = await stat(filePath);
    return stats.mtime;
  } catch {
    return undefined;
  }
}

function buildUrl(locale: string, segments: string[]): string {
  const encodedPath = segments.map(s => encodeURIComponent(s)).join('/');
  const localePrefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  if (!encodedPath) {
    return `${SITE_URL}${localePrefix}`;
  }
  return `${SITE_URL}${localePrefix}/${encodedPath}`;
}

async function getPortfolioEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const category of PORTFOLIO_CATEGORIES) {
      const categorySlug = getCategoryUrlSlug(category.id, locale);
      const categoryDir = path.join(
        process.cwd(),
        'content',
        'portfolio',
        locale,
        category.id
      );

      try {
        const files = await readdir(categoryDir);
        for (const file of files) {
          if (!file.endsWith('.md')) continue;

          const slug = file.replace(/\.md$/, '');
          const filePath = path.join(categoryDir, file);
          const lastModified = await getFileMtime(filePath);

          entries.push({
            url: buildUrl(locale, ['portfolio', categorySlug, slug]),
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      } catch {
        // Directory may not exist for a given locale/category.
      }
    }
  }

  return entries;
}

async function getBlogEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    const blogDir = path.join(process.cwd(), 'content', 'blog', locale);

    try {
      const files = await readdir(blogDir);
      for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const slug = file.replace(/\.md$/, '');
        const filePath = path.join(blogDir, file);
        const lastModified = await getFileMtime(filePath);

        entries.push({
          url: buildUrl(locale, ['blog', slug]),
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    } catch {
      // Directory may not exist for a given locale.
    }
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const pagePath of STATIC_PATHS) {
      const segments = pagePath ? [pagePath] : [];
      const url = buildUrl(locale, segments);
      const isHome = pagePath === '';

      staticEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: isHome ? 'weekly' : 'monthly',
        priority: isHome ? 1.0 : 0.8,
      });
    }
  }

  const categoryEntries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const category of PORTFOLIO_CATEGORIES) {
      const categorySlug = getCategoryUrlSlug(category.id, locale);

      categoryEntries.push({
        url: buildUrl(locale, ['portfolio', categorySlug]),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  const [portfolioEntries, blogEntries] = await Promise.all([
    getPortfolioEntries(),
    getBlogEntries(),
  ]);

  return [...staticEntries, ...categoryEntries, ...portfolioEntries, ...blogEntries];
}
