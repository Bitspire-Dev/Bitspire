import { MetadataRoute } from 'next';
import client from '@tina/__generated__/client';
import { LEGAL_PAGES_EN, LEGAL_PAGES_PL } from '@/lib/routing/legal-pages/config';

const BASE_URL = 'https://bitspire.pl';
const LOCALES = ['pl', 'en'] as const;

const prefixFor = (locale: string) => (locale === 'pl' ? '/pl' : '/en');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Portfolio entries
  let portfolioPosts: MetadataRoute.Sitemap = [];
  try {
    const portfolioConnection = await client.queries.portfolioConnection();

    portfolioPosts = (portfolioConnection.data.portfolioConnection.edges || [])
      .map(edge => edge?.node)
      .filter((node): node is NonNullable<typeof node> => Boolean(node))
      .map(node => {
        const slug = node._sys.filename;
        const locale = node._sys.relativePath.split('/')[0];
        const date = node.date ? new Date(node.date) : now;
        const prefix = prefixFor(locale);

        return {
          url: `${BASE_URL}${prefix}/portfolio/${slug}`,
          lastModified: date,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      });
  } catch (error) {
    console.error('Error fetching portfolio posts for sitemap:', error);
  }

  // Blog entries
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const blogConnection = await client.queries.blogConnection();

    blogPosts = (blogConnection.data.blogConnection.edges || [])
      .map(edge => edge?.node)
      .filter((node): node is NonNullable<typeof node> => Boolean(node))
      .map(node => {
        const slug = node._sys.filename;
        const locale = node._sys.relativePath.split('/')[0];
        const date = node.date ? new Date(node.date) : now;
        const prefix = prefixFor(locale);

        return {
          url: `${BASE_URL}${prefix}/blog/${slug}`,
          lastModified: date,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      });
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Static pages per locale
  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap(locale => {
    const prefix = prefixFor(locale);
    return [
      {
        url: `${BASE_URL}${prefix}`,
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
      url: `${BASE_URL}/pl/${slug}`,
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
