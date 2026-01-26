import type { TinaMarkdownContent } from "tinacms/dist/rich-text";

export interface BlogPostData {
  title: string;
  description: string;
  date: string;
  author: string;
  category?: string | null;
  tags?: (string | null)[] | null;
  image?: string | null;
  imageAlt?: string | null;
  readTime?: number | null;
  body: TinaMarkdownContent | TinaMarkdownContent[];
  locale?: string;
  slug?: string;
  relatedPosts?: Array<{
    title: string;
    slug: string;
    excerpt?: string;
    image?: string;
    date?: string;
    readTime?: number | null;
  }>;
  [key: string]: unknown;
}

export interface BlogListItem {
  _sys: {
    filename: string;
    relativePath: string;
  };
  title: string;
  slug: string;
  description: string;
  excerpt?: string;
  date: string;
  author: string;
  category?: string | null;
  tags?: (string | null)[] | null;
  image?: string | null;
  imageAlt?: string | null;
  readTime?: number | null;
  [key: string]: unknown;
}

export interface PortfolioListItem {
  _sys?: {
    filename?: string;
    relativePath?: string;
  };
  title?: string;
  description?: string | null;
  tags?: (string | null)[] | null;
  year?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  link?: string | null;
  locale?: string;
  [key: string]: unknown;
}

export interface PortfolioItemData {
  title?: string;
  description?: string | null;
  year?: string | null;
  category?: string | null;
  tags?: (string | null)[] | null;
  image?: string | null;
  imageAlt?: string | null;
  link?: string | null;
  body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  locale?: string;
  [key: string]: unknown;
}
