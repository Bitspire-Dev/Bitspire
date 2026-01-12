import { notFound } from "next/navigation";
import BlogPostWrapper from "@/components/pages/BlogPostWrapper";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { getBlogIndex } from "@/lib/tina/queries";
import { getRelatedPosts, normalizePost } from "@/lib/tina/mappers";
import { getAllBlogSlugs } from "@/lib/tina/params";
import client from "@tina/__generated__/client";

interface PageProps {
  params: { locale: string; slug: string };
}

export async function generateStaticParams() {
  const locales = ["pl", "en"];
  const all = await Promise.all(locales.map(locale => getAllBlogSlugs(locale)));
  return all.flat().map(({ locale, slug }) => ({ locale, slug }));
}

export default async function AdminBlogPostPage({ params }: PageProps) {
  const { locale, slug } = params;

  try {
    const [result, allPosts] = await Promise.all([
      client.queries.blog({ relativePath: `${locale}/${slug}.mdx` }),
      getBlogIndex(locale),
    ]);

    return (
      <AdminPreviewProvider
        query={result.query}
        variables={result.variables}
        data={result.data}
        render={data => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const relatedPosts = getRelatedPosts(data.blog, allPosts) as any[];
          const normalized = normalizePost(data.blog, { locale, relatedPosts });
          return <BlogPostWrapper data={{ ...normalized, locale, slug, body: data.blog.body ?? {}, relatedPosts }} />;
        }}
      />
    );
  } catch (error) {
    console.error("Admin blog post not found", error);
    notFound();
  }
}
