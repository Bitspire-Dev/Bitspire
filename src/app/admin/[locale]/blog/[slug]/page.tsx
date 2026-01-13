import { notFound } from "next/navigation";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { getBlogIndex } from "@/lib/tina/queries";
import { AdminBlogPostPreview } from "@/providers/AdminPreviewRenderer";
import client from "@tina/__generated__/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function AdminBlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;

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
      >
        <AdminBlogPostPreview locale={locale} slug={slug} allPosts={allPosts as unknown[]} />
      </AdminPreviewProvider>
    );
  } catch (error) {
    console.error("Admin blog post not found", error);
    notFound();
  }
}
