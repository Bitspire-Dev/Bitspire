import PortfolioPageWrapper from "@/components/pages/PortfolioPageWrapper";
import { buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
import { getPortfolioIndex, getPage } from "@/lib/tina/queries";

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

function extractTags(projects: Array<{ tags?: (string | null)[] | null }>) {
  const tagsSet = new Set<string>();
  projects.forEach((project) => {
    project.tags?.forEach((tag) => {
      if (tag) tagsSet.add(tag);
    });
  });
  return Array.from(tagsSet).sort();
}

function filterProjects<T extends { title?: string | null; description?: string | null; tags?: (string | null)[] | null }>(
  projects: T[],
  query: string,
  tags: string[]
): T[] {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedTags = tags.map((tag) => tag.toLowerCase());

  return projects.filter((project) => {
    const matchesSearch =
      !normalizedQuery ||
      (project.title?.toLowerCase() || "").includes(normalizedQuery) ||
      (project.description?.toLowerCase() || "").includes(normalizedQuery);

    const matchesTags =
      normalizedTags.length === 0 ||
      normalizedTags.some((tag) =>
        project.tags?.some((projectTag) => projectTag?.toLowerCase() === tag)
      );

    return matchesSearch && matchesTags;
  });
}

export default async function PortfolioIndexPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q = "", tags = "" } = (await searchParams) ?? {};
  const page = await getPage(locale, "portfolio");
  const allProjects = await getPortfolioIndex(locale);
  const selectedTags = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  const filteredProjects = filterProjects(allProjects, q, selectedTags);
  const allTags = extractTags(allProjects);

  return (
    <PortfolioPageWrapper
      data={{
        ...page,
        projects: filteredProjects,
        locale,
      }}
      allTags={allTags}
      searchQuery={q}
      selectedTags={selectedTags}
    />
  );
}
