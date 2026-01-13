import { notFound } from "next/navigation";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { AdminPortfolioItemPreview } from "@/providers/AdminPreviewRenderer";
import client from "@tina/__generated__/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function AdminPortfolioItemPage({ params }: PageProps) {
  const { locale, slug } = await params;

  try {
    const result = await client.queries.portfolio({ relativePath: `${locale}/${slug}.mdx` });

    return (
      <AdminPreviewProvider
        query={result.query}
        variables={result.variables}
        data={result.data}
      >
        <AdminPortfolioItemPreview locale={locale} />
      </AdminPreviewProvider>
    );
  } catch (error) {
    console.error("Admin portfolio item not found", error);
    notFound();
  }
}
