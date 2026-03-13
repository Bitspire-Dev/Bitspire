import { cache } from "react";
import { getTinaClient } from "@/lib/tina/client";
import {
  mapBlogList,
  mapBlogPostData,
  mapHomePageData,
  mapLegalPageData,
  mapPageWithBody,
  mapPortfolioItemData,
  mapPortfolioProjects,
} from "./adapters";
import type { BlogListItem, BlogPostData, PortfolioItemData, PortfolioListItem } from "@/lib/tina/types";

// Minimal data access layer for Tina collections.

const client = getTinaClient();

export function cmsPathPrefix(locale: string): string {
  return `${locale}/`;
}

export const fetchAllBlogNodes = cache(async (sort?: string) => {
  const nodes: Array<NonNullable<NonNullable<Awaited<ReturnType<typeof client.queries.blogConnection>>['data']['blogConnection']['edges']>[number]>['node']> = [];
  let after: string | undefined = undefined;

  do {
    const response = await client.queries.blogConnection({
      first: 50,
      after,
      sort,
      filter: {
        slug: { startsWith: "" },
        author: { startsWith: "" },
      },
    });

    const connection = response.data.blogConnection;
    const edges = connection.edges || [];
    edges.forEach((edge) => {
      if (edge?.node) nodes.push(edge.node);
    });

    after = connection.pageInfo?.hasNextPage ? connection.pageInfo.endCursor : undefined;
  } while (after);

  return nodes;
});

export const fetchAllPortfolioNodes = cache(async (sort?: string) => {
  const nodes: Array<NonNullable<NonNullable<Awaited<ReturnType<typeof client.queries.portfolioConnection>>['data']['portfolioConnection']['edges']>[number]>['node']> = [];
  let after: string | undefined = undefined;

  do {
    const response = await client.queries.portfolioConnection({
      first: 50,
      after,
      sort,
    });

    const connection = response.data.portfolioConnection;
    const edges = connection.edges || [];
    edges.forEach((edge) => {
      if (edge?.node) nodes.push(edge.node);
    });

    after = connection.pageInfo?.hasNextPage ? connection.pageInfo.endCursor : undefined;
  } while (after);

  return nodes;
});

export const getHomePage = cache(async (locale: string) => {
  const relativePath = `${cmsPathPrefix(locale)}home.mdx`;
  const result = await client.queries.pages({ relativePath });
  const page = result.data.pages;
  return page ? mapHomePageData(page, locale) : page;
});

export const getPage = cache(async (locale: string, slug: string) => {
  const relativePath = `${cmsPathPrefix(locale)}${slug}.mdx`;
  const result = await client.queries.pages({ relativePath });
  const page = result.data.pages;
  return page ? mapPageWithBody(page, { locale }) : page;
});

export const getLegalPage = cache(async (locale: string, slug: string) => {
  const relativePath = `${cmsPathPrefix(locale)}${slug}.mdx`;
  const result = await client.queries.pages({ relativePath });
  const page = result.data.pages;
  return page ? mapLegalPageData(page, locale) : page;
});

export const getBlogPost = cache(async (locale: string, slug: string): Promise<BlogPostData | null> => {
  const relativePath = `${cmsPathPrefix(locale)}${slug}.mdx`;
  const result = await client.queries.blog({ relativePath });
  const blog = result.data.blog;
  if (!blog) return null;
  const relatedPosts = await getRelatedBlogPosts(locale, blog);
  return mapBlogPostData(blog, {
    locale,
    slug,
    relatedPosts,
  });
});

type BlogNode = {
  _sys?: { filename?: string; relativePath?: string };
  slug?: string | null;
  category?: string | null;
};

function getLocaleFromPath(path?: string) {
  return path?.split("/")[0] ?? "";
}

function getNodeSlug(node: BlogNode) {
  return node.slug ?? node._sys?.filename?.replace(/\.mdx$/, "") ?? "";
}

function collectBlogNodes(
  nodes: Array<BlogNode | null | undefined>,
  locale: string,
  currentSlug: string,
  seen: Set<string>,
  output: BlogNode[]
) {
  nodes.forEach((node) => {
    if (!node) return;
    const nodeLocale = getLocaleFromPath(node._sys?.relativePath);
    if (nodeLocale !== locale) return;
    const slug = getNodeSlug(node);
    if (!slug || slug === currentSlug || seen.has(slug)) return;
    seen.add(slug);
    output.push(node);
  });
}

export async function getRelatedBlogPosts(locale: string, current: BlogNode | null | undefined) {
  if (!current) {
    return [];
  }

  const currentSlug = getNodeSlug(current);
  const seen = new Set<string>();
  const related: BlogNode[] = [];

  try {
    const recentConnection = await client.queries.blogConnection({
      first: 24,
      sort: "date_desc",
      filter: {
        slug: { startsWith: "" },
        author: { startsWith: "" },
      },
    });

    const recentNodes = (recentConnection.data.blogConnection.edges || [])
      .map((edge) => edge?.node);

    if (current.category) {
      const sameCategory = recentNodes.filter((node) => node?.category === current.category);
      collectBlogNodes(sameCategory, locale, currentSlug, seen, related);
    }

    if (related.length < 3) {
      collectBlogNodes(recentNodes, locale, currentSlug, seen, related);
    }
  } catch (error) {
    console.error("Failed to load related blog posts:", error);
  }

  return related.slice(0, 3);
}

export const getBlogIndex = cache(async (locale: string): Promise<BlogListItem[]> => {
  try {
    const nodes = await fetchAllBlogNodes("date_desc");
    const posts = nodes
      .filter((node): node is NonNullable<typeof node> => Boolean(node?._sys?.relativePath?.startsWith(cmsPathPrefix(locale))));
    return mapBlogList(posts, locale);
  } catch (error) {
    console.error("Failed to load blog index:", error);
    return [];
  }
});

export const getPortfolioItem = cache(async (locale: string, slug: string): Promise<PortfolioItemData | null> => {
  const relativePath = `${cmsPathPrefix(locale)}${slug}.mdx`;
  const result = await client.queries.portfolio({ relativePath });
  const portfolio = result.data.portfolio;
  if (!portfolio) return null;
  return mapPortfolioItemData(portfolio, locale);
});

export const getPortfolioIndex = cache(async (locale: string): Promise<PortfolioListItem[]> => {
  const nodes = await fetchAllPortfolioNodes();
  const projects = nodes
    .filter((node): node is NonNullable<typeof node> => Boolean(node?._sys?.relativePath?.startsWith(cmsPathPrefix(locale))));
  return mapPortfolioProjects(projects, locale);
});
