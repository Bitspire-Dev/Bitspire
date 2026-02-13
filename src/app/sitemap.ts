import { MetadataRoute } from 'next';
import { fetchAllBlogNodes, fetchAllPortfolioNodes } from '@/lib/tina/queries';
import { LEGAL_PAGES_EN, LEGAL_PAGES_PL } from '@/lib/routing/legal-pages/config';

import { locales, DEFAULT_LOCALE, type Locale } from '@/i18n/locales';

const BASE_URL = 'https://bitspire.pl';
const LOCALES = locales;

export const revalidate = 3600;

const prefixFor = (locale: string) => (locale === DEFAULT_LOCALE ? '' : `/${locale}`);

function mapNodesToSitemapEntries(
  nodes: Array<{ _sys: { filename: string; relativePath: string }; date?: string | null }>,
  section: string,
  now: Date,
): MetadataRoute.Sitemap {
  return nodes
    .filter((node): node is NonNullable<typeof node> => Boolean(node))
    .map((node) => {
      const slug = node._sys.filename;
      const locale = node._sys.relativePath.split('/')[0];
      const date = node.date ? new Date(node.date) : now;
      const prefix = prefixFor(locale);

      return {
        url: `${BASE_URL}${prefix}/${section}/${slug}`,
        lastModified: date,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Portfolio entries
  let portfolioPosts: MetadataRoute.Sitemap = [];
  try {
    const portfolioNodes = await fetchAllPortfolioNodes();
    portfolioPosts = mapNodesToSitemapEntries(
      portfolioNodes.filter((n): n is NonNullable<typeof n> => Boolean(n)),
      'portfolio',
      now,
    );
  } catch (error) {
    console.error('Error fetching portfolio posts for sitemap:', error);
  }

  // Blog entries
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const blogNodes = await fetchAllBlogNodes();
    blogPosts = mapNodesToSitemapEntries(
      blogNodes.filter((n): n is NonNullable<typeof n> => Boolean(n)),
      'blog',
      now,
    );
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Static pages per locale
  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap(locale => {
    const prefix = prefixFor(locale);
    return [
      {
        url: `${BASE_URL}${prefix || '/'}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 1,
      },
      {
        url: `${BASE_URL}${prefix}/portfolio`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}${prefix}/blog`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ];
  });

  // Legal pages
  const legalPages: MetadataRoute.Sitemap = [
    ...LEGAL_PAGES_PL.map(slug => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
    ...LEGAL_PAGES_EN.map(slug => ({
      url: `${BASE_URL}/en/${slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ];

  return [...staticPages, ...portfolioPosts, ...blogPosts, ...legalPages];
}
