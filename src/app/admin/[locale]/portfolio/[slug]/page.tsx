import { notFound } from "next/navigation";
import PortfolioItemWrapper from "@/components/pages/PortfolioItemWrapper";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { normalizeProject } from "@/lib/tina/mappers";
import { getAllPortfolioSlugs } from "@/lib/tina/params";
import client from "@tina/__generated__/client";

interface PageProps {
  params: { locale: string; slug: string };
}

export async function generateStaticParams() {
  const locales = ["pl", "en"];
  const all = await Promise.all(locales.map(locale => getAllPortfolioSlugs(locale)));
  return all.flat().map(({ locale, slug }) => ({ locale, slug }));
}

export default async function AdminPortfolioItemPage({ params }: PageProps) {
  const { locale, slug } = params;

  try {
    const result = await client.queries.portfolio({ relativePath: `${locale}/${slug}.mdx` });

    return (
      <AdminPreviewProvider
        query={result.query}
        variables={result.variables}
        data={result.data}
        render={data => {
          const normalized = normalizeProject(data.portfolio, { locale });
          return <PortfolioItemWrapper data={{ ...normalized, locale }} />;
        }}
      />
    );
  } catch (error) {
    console.error("Admin portfolio item not found", error);
    notFound();
  }
}
