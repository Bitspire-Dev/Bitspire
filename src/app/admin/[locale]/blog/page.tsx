import { notFound } from "next/navigation";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { AdminBlogIndexPreview } from "@/providers/AdminPreviewRenderer";
import { getBlogIndex } from "@/lib/tina/queries";
import client from "@tina/__generated__/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminBlogIndexPage({ params }: PageProps) {
  const { locale } = await params;

  try {
    const [pageResult, posts] = await Promise.all([
      client.queries.pages({ relativePath: `${locale}/blog.mdx` }),
      getBlogIndex(locale),
    ]);

    return (
      <AdminPreviewProvider
        query={pageResult.query}
        variables={pageResult.variables}
        data={pageResult.data}
      >
        <AdminBlogIndexPreview locale={locale} posts={posts as unknown[]} />
      </AdminPreviewProvider>
    );
  } catch (error) {
    console.error("Admin blog page not found", error);
    notFound();
  }
}
