import { LEGAL_PAGES_EN, LEGAL_PAGES_PL } from "@/lib/routing/legal-pages/config";
import { fetchAllBlogNodes, fetchAllPortfolioNodes, cmsPathPrefix } from "@/lib/tina/queries";

export async function getAllBlogSlugs(locale: string) {
  const nodes = await fetchAllBlogNodes();
  const pfx = cmsPathPrefix(locale);
  return nodes
    .filter((node): node is NonNullable<typeof node> & { _sys: { filename: string; relativePath: string } } =>
      Boolean(node?._sys?.relativePath?.startsWith(pfx)))
    .map((node) => ({
      locale,
      slug: node._sys.filename,
    }));
}

export async function getAllPortfolioSlugs(locale: string) {
  const nodes = await fetchAllPortfolioNodes();
  const pfx = cmsPathPrefix(locale);
  return nodes
    .filter((node): node is NonNullable<typeof node> & { _sys: { filename: string; relativePath: string } } =>
      Boolean(node?._sys?.relativePath?.startsWith(pfx)))
    .map((node) => ({
      locale,
      slug: node._sys.filename,
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
  return `${cmsPathPrefix(locale)}${slug}.mdx`;
}
