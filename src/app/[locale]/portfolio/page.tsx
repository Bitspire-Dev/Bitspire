import PortfolioPageWrapper from "@/components/pages/PortfolioPageWrapper";
import { buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
import { getPortfolioIndex, getPage } from "@/lib/tina/queries";
import { extractTags, filterByQueryAndTags } from "@/lib/ui/helpers";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string; tags?: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = normalizeLocale(locale);
  const page = await getPage(currentLocale, "portfolio");

  const paths = {
    pl: buildLocalePath("pl", "/portfolio"),
    en: buildLocalePath("en", "/portfolio"),
  };

  return buildMetadata({
    title: page?.title,
    description: page?.description,
    locale: currentLocale,
    paths,
  });
}

export default async function PortfolioIndexPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q = "", tags = "" } = (await searchParams) ?? {};
  const currentLocale = normalizeLocale(locale);
  const page = await getPage(currentLocale, "portfolio");
  const allProjects = await getPortfolioIndex(currentLocale);
  const selectedTags = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  const filteredProjects = filterByQueryAndTags(allProjects, q, selectedTags);
  const allTags = extractTags(allProjects);

  return (
    <PortfolioPageWrapper
      data={{
        ...page,
        projects: filteredProjects,
        locale: currentLocale,
      }}
      allTags={allTags}
      searchQuery={q}
      selectedTags={selectedTags}
    />
  );
}
