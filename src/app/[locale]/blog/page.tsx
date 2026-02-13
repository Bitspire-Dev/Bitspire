import BlogPageWrapper from "@/components/pages/BlogPageWrapper";
import { buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
import { getBlogIndex, getPage } from "@/lib/tina/queries";
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

export default async function BlogIndexPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q = "", tags = "" } = (await searchParams) ?? {};
  const currentLocale = normalizeLocale(locale);
  const page = await getPage(currentLocale, "blog");
  const allPosts = await getBlogIndex(currentLocale);
  const selectedTags = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  const filteredPosts = filterByQueryAndTags(allPosts, q, selectedTags);
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
