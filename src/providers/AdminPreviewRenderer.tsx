"use client";

import HomePageWrapper from "@/components/pages/HomePageWrapper";
import LegalPage from "@/components/sections/LegalPage";
import BlogPageWrapper from "@/components/pages/BlogPageWrapper";
import BlogPostWrapper from "@/components/pages/BlogPostWrapper";
import PortfolioPageWrapper from "@/components/pages/PortfolioPageWrapper";
import PortfolioItemWrapper from "@/components/pages/PortfolioItemWrapper";
import {
  mapBlogIndexData,
  mapBlogPostData,
  mapHomePageData,
  mapLegalPageData,
  mapPortfolioIndexData,
  mapPortfolioItemData,
} from "@/lib/tina/adapters";
import { useAdminPreviewData } from "./AdminPreviewProvider";
import type { ComponentProps } from "react";

type JsonRecord = Record<string, unknown>;
type HomeData = ComponentProps<typeof HomePageWrapper>["data"];
type LegalData = ComponentProps<typeof LegalPage>["data"];
type BlogPageData = ComponentProps<typeof BlogPageWrapper>["data"];
type BlogPostData = ComponentProps<typeof BlogPostWrapper>["data"];
type PortfolioIndexData = ComponentProps<typeof PortfolioPageWrapper>["data"];
type PortfolioItemData = ComponentProps<typeof PortfolioItemWrapper>["data"];

export function AdminHomePreview({ locale }: { locale: string }) {
  const data = useAdminPreviewData<{ pages: JsonRecord }>();
  const pages = mapHomePageData(data.pages as Record<string, unknown>, locale) as HomeData;
  return <HomePageWrapper data={pages} />;
}

export function AdminLegalPagePreview({ locale }: { locale: string }) {
  const data = useAdminPreviewData<{ pages: JsonRecord }>();
  const pages = mapLegalPageData(data.pages as Record<string, unknown>, locale) as LegalData;
  return <LegalPage data={pages} hideToc />;
}

export function AdminBlogIndexPreview({ locale, posts }: { locale: string; posts: unknown[] }) {
  const data = useAdminPreviewData<{ pages: JsonRecord }>();
  const pages = data.pages as Record<string, unknown>;
  const mapped = mapBlogIndexData(pages, posts as Record<string, unknown>[], locale) as BlogPageData;
  return <BlogPageWrapper data={mapped} linkMode="admin" />;
}

export function AdminBlogPostPreview({
  locale,
  slug,
  relatedPosts,
}: {
  locale: string;
  slug: string;
  relatedPosts: unknown[];
}) {
  const data = useAdminPreviewData<{ blog: unknown }>();
  const mapped = mapBlogPostData(data.blog as Record<string, unknown>, {
    locale,
    slug,
    relatedPosts: relatedPosts as Record<string, unknown>[],
  });

  return <BlogPostWrapper data={mapped as BlogPostData} linkMode="admin" />;
}

export function AdminPortfolioIndexPreview({ locale, projects }: { locale: string; projects: unknown[] }) {
  const data = useAdminPreviewData<{ pages: JsonRecord }>();
  const pages = data.pages as Record<string, unknown>;
  const mapped = mapPortfolioIndexData(pages, projects as Record<string, unknown>[], locale) as PortfolioIndexData;
  return <PortfolioPageWrapper data={mapped} />;
}

export function AdminPortfolioItemPreview({ locale }: { locale: string }) {
  const data = useAdminPreviewData<{ portfolio: unknown }>();
  const mapped = mapPortfolioItemData(data.portfolio as Record<string, unknown>, locale) as PortfolioItemData;
  return <PortfolioItemWrapper data={mapped} />;
}