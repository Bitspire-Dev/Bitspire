import client from "@tina/__generated__/client";
import { getRelatedPosts, normalizePost, normalizeProject } from "./mappers";

// Minimal data access layer for Tina collections.

function prefix(locale: string): string {
  return `${locale}/`;
}

export async function getHomePage(locale: string) {
  const relativePath = `${prefix(locale)}home.mdx`;
  const result = await client.queries.pages({ relativePath });
  return result.data.pages;
}

export async function getBriefPage(locale: string) {
  const relativePath = `${prefix(locale)}brief.mdx`;
  const result = await client.queries.pages({ relativePath });
  return result.data.pages;
}

export async function getPage(locale: string, slug: string) {
  const relativePath = `${prefix(locale)}${slug}.mdx`;
  const result = await client.queries.pages({ relativePath });
  return result.data.pages;
}

export async function getLegalPage(locale: string, slug: string) {
  const relativePath = `${prefix(locale)}${slug}.mdx`;
  const result = await client.queries.pages({ relativePath });
  return result.data.pages;
}

export async function getBlogPost(locale: string, slug: string) {
  const relativePath = `${prefix(locale)}${slug}.mdx`;
  const result = await client.queries.blog({ relativePath });
  const allPosts = await getBlogIndex(locale);
  const relatedPosts = getRelatedPosts(result.data.blog, allPosts);
  return normalizePost(result.data.blog, { locale, relatedPosts });
}

export async function getBlogIndex(locale: string) {
  const connection = await client.queries.blogConnection();
  const edges = connection.data.blogConnection.edges || [];
  return edges
    .map(edge => edge?.node)
    .filter((node): node is NonNullable<typeof node> => Boolean(node?._sys?.relativePath?.startsWith(prefix(locale))))
    .map(node => normalizePost(node, { locale }))
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
}

export async function getPortfolioItem(locale: string, slug: string) {
  const relativePath = `${prefix(locale)}${slug}.mdx`;
  const result = await client.queries.portfolio({ relativePath });
  return normalizeProject(result.data.portfolio, { locale });
}

export async function getPortfolioIndex(locale: string) {
  const connection = await client.queries.portfolioConnection();
  const edges = connection.data.portfolioConnection.edges || [];
  return edges
    .map(edge => edge?.node)
    .filter((node): node is NonNullable<typeof node> => Boolean(node?._sys?.relativePath?.startsWith(prefix(locale))))
    .map(node => normalizeProject(node, { locale }));
}
