import { notFound } from "next/navigation";
import PortfolioPageWrapper from "@/components/pages/PortfolioPageWrapper";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { getPortfolioIndex } from "@/lib/tina/queries";
import client from "@tina/__generated__/client";

interface PageProps {
  params: { locale: string };
}

export async function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
}

export default async function AdminPortfolioIndexPage({ params }: PageProps) {
  const { locale } = params;

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
        render={data => (
          <PortfolioPageWrapper
            data={{
              ...data.pages,
              projects,
              locale,
            }}
          />
        )}
      />
    );
  } catch (error) {
    console.error("Admin portfolio page not found", error);
    notFound();
  }
}
