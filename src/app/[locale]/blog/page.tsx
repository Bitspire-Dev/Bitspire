import BlogPageWrapper from "@/components/pages/BlogPageWrapper";
import { buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
import { getBlogIndex, getPage } from "@/lib/tina/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
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

export default async function BlogIndexPage({ params }: PageProps) {
  const { locale } = await params;
  const page = await getPage(locale, "blog");
  const posts = await getBlogIndex(locale);

  return (
    <BlogPageWrapper
      data={{
        ...page,
        posts,
        locale,
        blog: page?.blog,
      }}
    />
  );
}
