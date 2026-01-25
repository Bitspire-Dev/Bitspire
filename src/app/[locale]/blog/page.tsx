import BlogPageWrapper from "@/components/pages/BlogPageWrapper";
import { buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
import { getBlogIndex, getPage } from "@/lib/tina/queries";

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
  const page = await getPage(currentLocale, "blog");

  const paths = {
    pl: buildLocalePath("pl", "/blog"),
    en: buildLocalePath("en", "/blog"),
  };

  return buildMetadata({
    title: page?.title,
    description: page?.description,
    locale: currentLocale,
    paths,
  });
}

function extractTags(posts: Array<{ tags?: (string | null)[] | null }>) {
  const tagsSet = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      if (tag) tagsSet.add(tag);
    });
  });
  return Array.from(tagsSet).sort();
}

function filterPosts<T extends { title?: string; description?: string; excerpt?: string | null; tags?: (string | null)[] | null }>(
  posts: T[],
  query: string,
  tags: string[]
): T[] {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedTags = tags.map((tag) => tag.toLowerCase());

  return posts.filter((post) => {
    const matchesSearch =
      !normalizedQuery ||
      (post.title?.toLowerCase() || "").includes(normalizedQuery) ||
      (post.description?.toLowerCase() || "").includes(normalizedQuery) ||
      (post.excerpt?.toLowerCase() || "").includes(normalizedQuery);

    const matchesTags =
      normalizedTags.length === 0 ||
      normalizedTags.some((tag) =>
        post.tags?.some((postTag) => postTag?.toLowerCase() === tag)
      );

    return matchesSearch && matchesTags;
  });
}

export default async function BlogIndexPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q = "", tags = "" } = (await searchParams) ?? {};
  const currentLocale = normalizeLocale(locale);
  const page = await getPage(currentLocale, "blog");
  const allPosts = await getBlogIndex(currentLocale);
  const selectedTags = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  const filteredPosts = filterPosts(allPosts, q, selectedTags);
  const allTags = extractTags(allPosts);

  return (
    <BlogPageWrapper
      data={{
        ...page,
        posts: filteredPosts,
        locale: currentLocale,
      }}
      allTags={allTags}
      searchQuery={q}
      selectedTags={selectedTags}
    />
  );
}
