import { notFound } from "next/navigation";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { AdminPortfolioItemPreview } from "@/providers/AdminPreviewRenderer";
import { getTinaClient } from "@/lib/tina/client";
import { AdminMotionFinal } from "@/components/admin/AdminMotionFinal";

export const dynamic = "force-dynamic";

const client = getTinaClient();

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function AdminPortfolioItemPage({ params }: PageProps) {
  const { locale, slug } = await params;

  try {
    const result = await client.queries.portfolio({ relativePath: `${locale}/${slug}.mdx` });

    return (
      <AdminMotionFinal>
        <AdminPreviewProvider
          query={result.query}
          variables={result.variables}
          data={result.data}
        >
          <AdminPortfolioItemPreview locale={locale} />
        </AdminPreviewProvider>
      </AdminMotionFinal>
    );
  } catch (error) {
    console.error("Admin portfolio item not found", error);
    notFound();
  }
}
