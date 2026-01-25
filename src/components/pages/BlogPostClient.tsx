'use client';

import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { tinaField } from 'tinacms/dist/react';
import ReadingProgressBar from '@/components/sections/blog/ReadingProgressBar';
import TableOfContents from '@/components/sections/blog/TableOfContents';
import AuthorBox from '@/components/sections/blog/AuthorBox';
import ShareButtons from '@/components/sections/blog/ShareButtons';
import { RelatedArticles } from '@/components/sections/blog/RelatedArticles';
import type { BlogUiCopy } from '@/lib/ui/blogCopy';

interface BlogPostData {
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

interface BlogPostClientProps {
  data: BlogPostData;
  copy: BlogUiCopy;
}

export function BlogPostProgress() {
  return <ReadingProgressBar />;
}

export function BlogPostMobileSidebar({ data, copy }: BlogPostClientProps) {
  const locale = data?.locale || 'pl';

  return (
    <div className="mt-10 space-y-6 lg:hidden">
      <AuthorBox
        author={data.author}
        authorBox={copy.authorBox}
        tinaFields={data ? { author: tinaField(data, 'author') } : undefined}
      />
      <ShareButtons
        title={copy.shareTitle}
        buttons={copy.shareButtons}
      />
      <TableOfContents
        title={copy.tableOfContentsTitle}
        locale={locale}
      />
    </div>
  );
}

export function BlogPostDesktopSidebar({ data, copy }: BlogPostClientProps) {
  const locale = data?.locale || 'pl';

  return (
    <aside className="hidden lg:block space-y-6">
      <AuthorBox
        author={data.author}
        authorBox={copy.authorBox}
        tinaFields={data ? { author: tinaField(data, 'author') } : undefined}
      />
      <ShareButtons
        title={copy.shareTitle}
        buttons={copy.shareButtons}
      />
      <div className="sticky top-28 pr-1">
        <TableOfContents
          title={copy.tableOfContentsTitle}
          locale={locale}
        />
      </div>
    </aside>
  );
}

export function BlogPostRelated({ data, copy }: BlogPostClientProps) {
  const locale = data?.locale || 'pl';

  if (!data.relatedPosts || data.relatedPosts.length === 0) {
    return null;
  }

  return (
    <RelatedArticles
      articles={data.relatedPosts}
      currentSlug={data.slug || ''}
      locale={locale}
      type="blog"
      sectionTitle={copy.relatedArticlesTitle}
      readMoreLabel={copy.readMore}
      readTimeLabel={copy.readTime}
    />
  );
}
