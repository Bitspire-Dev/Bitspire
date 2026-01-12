import BlogPageWrapper from "@/components/pages/BlogPageWrapper";
import { getBlogIndex, getPage } from "@/lib/tina/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
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
