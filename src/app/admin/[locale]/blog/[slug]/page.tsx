import { notFound } from "next/navigation";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { getRelatedBlogPosts } from "@/lib/tina/queries";
import { AdminBlogPostPreview } from "@/providers/AdminPreviewRenderer";
import { getTinaClient } from "@/lib/tina/client";
import { AdminMotionFinal } from "@/components/admin/AdminMotionFinal";

export const dynamic = "force-dynamic";

const client = getTinaClient();

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function AdminBlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;

  try {
    const result = await client.queries.blog({ relativePath: `${locale}/${slug}.mdx` });
    const relatedPosts = await getRelatedBlogPosts(locale, result.data.blog);

    return (
      <AdminMotionFinal>
        <AdminPreviewProvider
          query={result.query}
          variables={result.variables}
          data={result.data}
        >
          <AdminBlogPostPreview
            locale={locale}
            slug={slug}
            relatedPosts={relatedPosts as unknown[]}
          />
        </AdminPreviewProvider>
      </AdminMotionFinal>
    );
  } catch (error) {
    console.error("Admin blog post not found", error);
    notFound();
  }
}
