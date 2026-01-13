import { notFound } from "next/navigation";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { AdminPortfolioIndexPreview } from "@/providers/AdminPreviewRenderer";
import { getPortfolioIndex } from "@/lib/tina/queries";
import client from "@tina/__generated__/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPortfolioIndexPage({ params }: PageProps) {
  const { locale } = await params;

  try {
    const [pageResult, projects] = await Promise.all([
      client.queries.pages({ relativePath: `${locale}/portfolio.mdx` }),
      getPortfolioIndex(locale),
    ]);

    return (
      <AdminPreviewProvider
        query={pageResult.query}
        variables={pageResult.variables}
        data={pageResult.data}
      >
        <AdminPortfolioIndexPreview locale={locale} projects={projects as unknown[]} />
      </AdminPreviewProvider>
    );
  } catch (error) {
    console.error("Admin portfolio page not found", error);
    notFound();
  }
}
