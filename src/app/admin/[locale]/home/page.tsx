import { notFound } from "next/navigation";
import HomePageWrapper from "@/components/pages/HomePageWrapper";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import client from "@tina/__generated__/client";

interface PageProps {
  params: { locale: string };
}

export async function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
}

export default async function AdminHomePage({ params }: PageProps) {
  const { locale } = params;

  try {
    const result = await client.queries.pages({ relativePath: `${locale}/home.mdx` });

    return (
      <AdminPreviewProvider
        query={result.query}
        variables={result.variables}
        data={result.data}
        render={data => <HomePageWrapper data={{ ...data.pages, locale }} />}
      />
    );
  } catch (error) {
    console.error("Admin home page not found", error);
    notFound();
  }
}
