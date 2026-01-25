import { LEGAL_PAGES_EN, LEGAL_PAGES_PL } from "@/lib/routing/legal-pages/config";
import { getTinaClient } from "@/lib/tina/client";

function prefix(locale: string): string {
  return `${locale}/`;
}

const client = getTinaClient();

async function fetchAllBlogRelativePaths() {
  const paths: string[] = [];
  let after: string | undefined = undefined;

  do {
    const response = await client.queries.blogConnection({ first: 50, after });
    const connection = response.data.blogConnection;
    const edges = connection.edges || [];
    edges.forEach((edge) => {
      const relativePath = edge?.node?._sys?.relativePath;
      if (relativePath) paths.push(relativePath);
    });
    after = connection.pageInfo?.hasNextPage ? connection.pageInfo.endCursor : undefined;
  } while (after);

  return paths;
}

async function fetchAllPortfolioRelativePaths() {
  const paths: string[] = [];
  let after: string | undefined = undefined;

  do {
    const response = await client.queries.portfolioConnection({ first: 50, after });
    const connection = response.data.portfolioConnection;
    const edges = connection.edges || [];
    edges.forEach((edge) => {
      const relativePath = edge?.node?._sys?.relativePath;
      if (relativePath) paths.push(relativePath);
    });
    after = connection.pageInfo?.hasNextPage ? connection.pageInfo.endCursor : undefined;
  } while (after);

  return paths;
}

export async function getAllBlogSlugs(locale: string) {
  const relativePaths = await fetchAllBlogRelativePaths();
  return relativePaths
    .filter((relativePath) => relativePath.startsWith(prefix(locale)))
    .map((relativePath) => ({
      locale,
      slug: relativePath.replace(prefix(locale), "").replace(/\.mdx$/, ""),
    }));
}

export async function getAllPortfolioSlugs(locale: string) {
  const relativePaths = await fetchAllPortfolioRelativePaths();
  return relativePaths
    .filter((relativePath) => relativePath.startsWith(prefix(locale)))
    .map((relativePath) => ({
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
