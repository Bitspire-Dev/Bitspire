import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import type { BlogListItem, BlogPostData, PortfolioItemData, PortfolioListItem } from "@/lib/tina/types";
import { extractBody } from "./body";
import { getRelatedPosts, normalizePost, normalizeProject } from "./mappers";
import { cmsPageSchema, cmsBlogPostSchema, cmsPortfolioSchema, validateCmsData } from "./schemas";

type UnknownRecord = Record<string, unknown>;

type WithContentSource = {
  _content_source?: unknown;
};

function ensureContentSource<T extends UnknownRecord>(raw: UnknownRecord | null | undefined, mapped: T): T & WithContentSource {
  if (raw && "_content_source" in raw && (mapped as UnknownRecord)._content_source === undefined) {
    (mapped as UnknownRecord)._content_source = (raw as UnknownRecord)._content_source;
  }
  return mapped as T & WithContentSource;
}

export function normalizeBody(value?: { body?: unknown; _body?: unknown } | null): {
  body?: TinaMarkdownContent | TinaMarkdownContent[];
  _body?: TinaMarkdownContent | TinaMarkdownContent[];
} {
  const body = extractBody(value ?? null);
  return {
    body: body ?? undefined,
    _body: body ?? undefined,
  };
}

export function mapPageWithBody<T extends UnknownRecord>(raw: T, extra?: UnknownRecord): T & WithContentSource {
  validateCmsData(cmsPageSchema, raw, "page");
  const { body, _body } = normalizeBody(raw as { body?: unknown; _body?: unknown });
  const mapped = {
    ...raw,
    ...extra,
    body,
    _body,
  } as T & WithContentSource;

  return ensureContentSource(raw, mapped);
}

export function mapHomePageData<T extends UnknownRecord>(raw: T, locale: string) {
  return mapPageWithBody(raw, { locale });
}

export function mapLegalPageData<T extends UnknownRecord>(raw: T, locale: string) {
  return mapPageWithBody(raw, { locale });
}

type RawPost = {
  _sys?: { filename?: string; relativePath?: string };
  title?: string;
  description?: string | null;
  excerpt?: string | null;
  date?: string | null;
  author?: string | null;
  category?: string | null;
  tags?: (string | null)[] | null;
  image?: string | null;
  imageAlt?: string | null;
  readTime?: number | null;
};

function normalizeBlogImage(image?: string | null): string | undefined {
  if (!image) return undefined;
  const trimmed = image.trim();
  if (!trimmed) return undefined;

  const tinaMatch = trimmed.match(/^https?:\/\/assets\.tina\.io\/[^/]+(\/.*)$/i);
  if (tinaMatch) {
    const path = tinaMatch[1] || "";
    if (path.startsWith("/blog/")) return path;
  }

  return trimmed;
}

export function mapBlogListItem(raw: RawPost, locale: string): BlogListItem {
  validateCmsData(cmsBlogPostSchema, raw, "blogListItem");
  const normalized = normalizePost(raw, { locale });
  const fallbackSlug = normalized._sys?.filename ?? "";

  const mapped = {
    _sys: {
      filename: normalized._sys?.filename ?? fallbackSlug,
      relativePath: raw._sys?.relativePath ?? "",
    },
    title: (normalized as { title?: string }).title ?? "",
    slug: normalized.slug ?? fallbackSlug,
    description: (normalized as { description?: string | null }).description ?? "",
    excerpt: (normalized as { excerpt?: string | null }).excerpt ?? undefined,
    date: normalized.date ?? "",
    author: (normalized as { author?: string }).author ?? "",
    category: normalized.category ?? null,
    tags: normalized.tags ?? [],
    image: normalizeBlogImage((normalized as { image?: string | null }).image),
    imageAlt: (normalized as { imageAlt?: string | null }).imageAlt ?? undefined,
    readTime: (normalized as { readTime?: number | null }).readTime ?? null,
  };

  return ensureContentSource(raw as UnknownRecord, mapped as UnknownRecord) as BlogListItem;
}

export function mapBlogList(items: RawPost[], locale: string): BlogListItem[] {
  return items.map(item => mapBlogListItem(item, locale));
}

export function mapBlogIndexData<T extends UnknownRecord>(rawPage: T, posts: RawPost[], locale: string) {
  const mappedPosts = mapBlogList(posts, locale);
  return mapPageWithBody(rawPage, {
    posts: mappedPosts,
    locale,
  });
}

type RawBlogPost = RawPost & {
  body?: unknown;
  _body?: unknown;
};

export function mapBlogPostData(
  raw: RawBlogPost,
  options: {
    locale: string;
    allPosts?: Array<Record<string, unknown>>;
    relatedPosts?: RawPost[];
    slug?: string;
  }
): BlogPostData {
  validateCmsData(cmsBlogPostSchema, raw, "blogPost");
  const { locale, allPosts, relatedPosts: providedRelated, slug } = options;
  const relatedPosts = providedRelated
    ? providedRelated
    : getRelatedPosts(raw, (allPosts ?? []) as RawPost[]) as RawPost[];
  const normalized = normalizePost(raw, { locale, relatedPosts });
  const { body, _body } = normalizeBody(raw);

  const related = relatedPosts.map((post) => {
    const normalizedPost = normalizePost(post as RawPost, { locale }) as RawPost & {
      slug?: string;
      dateFormatted?: string;
    };
    const fallbackSlug = normalizedPost._sys?.filename ?? "";
    const mapped = {
      title: (normalizedPost as { title?: string }).title ?? "",
      slug: normalizedPost.slug ?? fallbackSlug,
      excerpt: (normalizedPost as { excerpt?: string | null }).excerpt ?? undefined,
      image: normalizeBlogImage((normalizedPost as { image?: string | null }).image),
      date: normalizedPost.dateFormatted ?? normalizedPost.date ?? undefined,
      readTime: normalizedPost.readTime ?? null,
    };
    return ensureContentSource(post as UnknownRecord, mapped as UnknownRecord);
  });

  const mapped = {
    ...(raw as UnknownRecord),
    ...(normalized as UnknownRecord),
    title: (normalized as { title?: string }).title ?? "",
    description: (normalized as { description?: string }).description ?? "",
    date: normalized.date ?? "",
    author: (normalized as { author?: string }).author ?? "",
    category: normalized.category ?? null,
    tags: normalized.tags ?? [],
    image: normalizeBlogImage((normalized as { image?: string | null }).image),
    imageAlt: (normalized as { imageAlt?: string | null }).imageAlt ?? undefined,
    readTime: normalized.readTime ?? null,
    locale,
    slug: slug ?? normalized.slug,
    body,
    _body,
    relatedPosts: related,
  };

  return ensureContentSource(raw as UnknownRecord, mapped as UnknownRecord) as BlogPostData;
}

type RawProject = {
  _sys?: { filename?: string; relativePath?: string };
  title?: string;
  description?: string | null;
  tags?: (string | null)[] | null;
  year?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  link?: string | null;
  body?: unknown;
  _body?: unknown;
};

export function mapPortfolioProject(raw: RawProject, locale: string): PortfolioListItem {
  validateCmsData(cmsPortfolioSchema, raw, "portfolioProject");
  const normalized = normalizeProject(raw as Parameters<typeof normalizeProject>[0], { locale });
  return ensureContentSource(raw as UnknownRecord, normalized as UnknownRecord) as PortfolioListItem;
}

export function mapPortfolioProjects(projects: RawProject[], locale: string): PortfolioListItem[] {
  return projects.map(project => mapPortfolioProject(project, locale));
}

export function mapPortfolioIndexData<T extends UnknownRecord>(rawPage: T, projects: RawProject[], locale: string) {
  return mapPageWithBody(rawPage, {
    projects: mapPortfolioProjects(projects, locale),
    locale,
  });
}

export function mapPortfolioItemData(raw: RawProject, locale: string): PortfolioItemData {
  validateCmsData(cmsPortfolioSchema, raw, "portfolioItem");
  const normalized = normalizeProject(raw as Parameters<typeof normalizeProject>[0], { locale });
  const { body, _body } = normalizeBody(raw);
  const mapped = {
    ...(normalized as UnknownRecord),
    body,
    _body,
    locale,
  };
  return ensureContentSource(raw as UnknownRecord, mapped as UnknownRecord) as PortfolioItemData;
}
