import { getPathname } from '@/i18n/navigation';

export type PageId = 'home' | 'blog' | 'portfolio' | 'contact' | 'privacy';

export type LocalizedHref =
  | string
  | {
      pathname: string;
      params?: Record<string, string>;
      query?: Record<string, string>;
    };

const PAGE_PATHS: Record<PageId, LocalizedHref> = {
  home: '/',
  blog: '/blog',
  portfolio: '/portfolio',
  contact: '/contact',
  privacy: '/privacy',
};

export function getPageHref(page: PageId): LocalizedHref {
  return PAGE_PATHS[page];
}

export function getBlogIndexHref(): LocalizedHref {
  return getPageHref('blog');
}

export function getBlogArticleHref(slug: string): LocalizedHref {
  return { pathname: '/blog/[slug]', params: { slug } };
}

export function getPortfolioHref(): LocalizedHref {
  return getPageHref('portfolio');
}

export function getLocalizedPath(locale: string, href: LocalizedHref): string {
  return getPathname({ locale, href: href as never });
}
