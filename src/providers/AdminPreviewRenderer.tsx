"use client";

import HomePageWrapper from "@/components/pages/HomePageWrapper";
import LegalPageWrapper from "@/components/pages/LegalPageWrapper";
import BlogPageWrapper from "@/components/pages/BlogPageWrapper";
import BlogPostWrapper from "@/components/pages/BlogPostWrapper";
import PortfolioPageWrapper from "@/components/pages/PortfolioPageWrapper";
import PortfolioItemWrapper from "@/components/pages/PortfolioItemWrapper";
import { getRelatedPosts, normalizePost, normalizeProject } from "@/lib/tina/mappers";
import { useAdminPreviewData } from "./AdminPreviewProvider";
import type { ComponentProps } from "react";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";

type JsonRecord = Record<string, unknown>;
type HomeData = ComponentProps<typeof HomePageWrapper>["data"];
type LegalData = ComponentProps<typeof LegalPageWrapper>["data"];
type BlogPageData = ComponentProps<typeof BlogPageWrapper>["data"];
type PortfolioIndexData = ComponentProps<typeof PortfolioPageWrapper>["data"];
type PortfolioItemData = ComponentProps<typeof PortfolioItemWrapper>["data"];
type BlogListItem = NonNullable<BlogPageData["posts"]>[number];

const toTinaMarkdown = (value: unknown): TinaMarkdownContent | TinaMarkdownContent[] => {
  if (Array.isArray(value)) return value as TinaMarkdownContent[];
  if (value && typeof value === "object") return value as TinaMarkdownContent;
  return [];
};

export function AdminHomePreview({ locale }: { locale: string }) {
  const data = useAdminPreviewData<{ pages: JsonRecord }>();
  const pages = data.pages as HomeData & { _body?: unknown };
  const rawBody = (pages as { body?: unknown }).body ?? (pages as { _body?: unknown })._body;
  const body = rawBody ? toTinaMarkdown(rawBody) : null;

  return <HomePageWrapper data={{ ...pages, body: body ?? undefined, _body: body ?? undefined, locale }} />;
}

export function AdminLegalPagePreview({ locale }: { locale: string }) {
  const data = useAdminPreviewData<{ pages: JsonRecord }>();
  const pages = data.pages as LegalData & { _body?: unknown };
  const rawBody = (pages as { body?: unknown }).body ?? (pages as { _body?: unknown })._body;
  const normalizedBody = rawBody ? toTinaMarkdown(rawBody) : null;
  return <LegalPageWrapper data={{ ...pages, body: normalizedBody as LegalData["body"], _body: normalizedBody, locale }} hideToc />;
}

export function AdminBlogIndexPreview({ locale, posts }: { locale: string; posts: unknown[] }) {
  const data = useAdminPreviewData<{ pages: JsonRecord }>();
  const pages = data.pages as BlogPageData & { _body?: unknown };
  const rawBody = (pages as { body?: unknown }).body ?? (pages as { _body?: unknown })._body;
  const body = rawBody ? toTinaMarkdown(rawBody) : null;
  const typedPosts = posts as Parameters<typeof normalizePost>[0][];
  const normalizedPosts: BlogListItem[] = typedPosts.map((post) => {
    const normalized = normalizePost(post, { locale });
    const fallbackSlug = normalized._sys?.filename ?? "";

    return {
      _sys: {
        filename: normalized._sys?.filename ?? fallbackSlug,
        relativePath: (post as { _sys?: { relativePath?: string } })._sys?.relativePath ?? "",
      },
      title: (normalized as { title?: string }).title ?? "",
      slug: normalized.slug ?? fallbackSlug,
      description: (normalized as { description?: string | null }).description ?? "",
      excerpt: (normalized as { excerpt?: string | null }).excerpt ?? undefined,
      date: normalized.date ?? "",
      author: (normalized as { author?: string }).author ?? "",
      category: normalized.category ?? null,
      tags: normalized.tags ?? [],
      image: (normalized as { image?: string | null }).image ?? undefined,
      imageAlt: (normalized as { imageAlt?: string | null }).imageAlt ?? undefined,
      readTime: (normalized as { readTime?: number | null }).readTime ?? null,
    } satisfies BlogListItem;
  });

  return (
    <BlogPageWrapper
      data={{ ...(pages as BlogPageData), posts: normalizedPosts, locale, blog: null, body: body ?? undefined, _body: body ?? undefined }}
    />
  );
}

export function AdminBlogPostPreview({
  locale,
  slug,
  allPosts,
}: {
  locale: string;
  slug: string;
  allPosts: unknown[];
}) {
  const data = useAdminPreviewData<{ blog: unknown }>();
  const blog = data.blog as Parameters<typeof normalizePost>[0];
  const typedAllPosts = allPosts as Parameters<typeof normalizePost>[0][];
  const relatedPosts = getRelatedPosts(blog, typedAllPosts as Parameters<typeof getRelatedPosts>[1]);
  const normalized = normalizePost(blog, { locale, relatedPosts });
  const related = relatedPosts.map((post) => {
    const normalizedPost = normalizePost(post as Parameters<typeof normalizePost>[0], { locale });
    const fallbackSlug = normalizedPost._sys?.filename ?? "";

    return {
      title: (normalizedPost as { title?: string }).title ?? "",
      slug: normalizedPost.slug ?? fallbackSlug,
      excerpt: (normalizedPost as { excerpt?: string | null }).excerpt ?? undefined,
      image: (normalizedPost as { image?: string | null }).image ?? undefined,
      date: normalizedPost.dateFormatted ?? normalizedPost.date ?? undefined,
      readTime: normalizedPost.readTime ? String(normalizedPost.readTime) : undefined,
    };
  });
  const body = (blog as { body?: unknown }).body ?? {};

  return (
    <BlogPostWrapper
      data={{
        title: (normalized as { title?: string }).title ?? "",
        description: (normalized as { description?: string }).description ?? "",
        date: normalized.date ?? "",
        author: (normalized as { author?: string }).author ?? "",
        category: normalized.category ?? null,
        tags: normalized.tags ?? [],
        image: (normalized as { image?: string | null }).image ?? undefined,
        imageAlt: (normalized as { imageAlt?: string | null }).imageAlt ?? undefined,
        readTime: (normalized as { readTime?: number | null }).readTime ?? null,
        locale,
        slug,
        body: toTinaMarkdown(body),
        relatedPosts: related,
        blog: null,
      }}
    />
  );
}

export function AdminPortfolioIndexPreview({ locale, projects }: { locale: string; projects: unknown[] }) {
  const data = useAdminPreviewData<{ pages: JsonRecord }>();
  const pages = data.pages as PortfolioIndexData & { _body?: unknown };
  const rawBody = (pages as { body?: unknown }).body ?? (pages as { _body?: unknown })._body;
  const body = rawBody ? toTinaMarkdown(rawBody) : null;

  return <PortfolioPageWrapper data={{ ...(pages as PortfolioIndexData), projects: projects as PortfolioIndexData["projects"], locale, body: body ?? undefined, _body: body ?? undefined }} />;
}

export function AdminPortfolioItemPreview({ locale }: { locale: string }) {
  const data = useAdminPreviewData<{ portfolio: unknown }>();
  const portfolio = data.portfolio as Parameters<typeof normalizeProject>[0];
  const normalized = normalizeProject(portfolio, { locale });
  const body = (portfolio as { body?: unknown }).body ?? null;

  return (
    <PortfolioItemWrapper
      data={{
        ...(normalized as PortfolioItemData),
        title: (normalized as { title?: string }).title,
        description: (normalized as { description?: string | null }).description,
        locale,
        body: body as PortfolioItemData["body"],
      }}
    />
  );
}