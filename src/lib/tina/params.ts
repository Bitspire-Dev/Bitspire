import { LEGAL_PAGES_EN, LEGAL_PAGES_PL } from "@/lib/routing/legal-pages/config";
import client from "@tina/__generated__/client";

function prefix(locale: string): string {
  return `${locale}/`;
}

export async function getAllBlogSlugs(locale: string) {
  const connection = await client.queries.blogConnection();
  const edges = connection.data.blogConnection.edges || [];
  return edges
    .map(edge => edge?.node?._sys?.relativePath)
    .filter((relativePath): relativePath is string => Boolean(relativePath))
    .filter(relativePath => relativePath.startsWith(prefix(locale)))
    .map(relativePath => ({
      locale,
      slug: relativePath.replace(prefix(locale), "").replace(/\.mdx$/, ""),
    }));
}

export async function getAllPortfolioSlugs(locale: string) {
  const connection = await client.queries.portfolioConnection();
  const edges = connection.data.portfolioConnection.edges || [];
  return edges
    .map(edge => edge?.node?._sys?.relativePath)
    .filter((relativePath): relativePath is string => Boolean(relativePath))
    .filter(relativePath => relativePath.startsWith(prefix(locale)))
    .map(relativePath => ({
      locale,
      slug: relativePath.replace(prefix(locale), "").replace(/\.mdx$/, ""),
    }));
}

export function getLegalSlugs(locale: string) {
  if (locale === "pl") return LEGAL_PAGES_PL.map(slug => ({ locale, slug }));
  return LEGAL_PAGES_EN.map(slug => ({ locale, slug }));
}

export function getHomeParam(locale: string) {
  return { locale };
}

export function mapPathForPagesCollection(locale: string, slug: string) {
  return `${prefix(locale)}${slug}.mdx`;
}
