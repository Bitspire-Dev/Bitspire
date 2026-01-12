import { notFound } from "next/navigation";
import ContactPageWrapper from "@/components/pages/ContactPageWrapper";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import client from "@tina/__generated__/client";

interface PageProps {
  params: { locale: string };
}

export async function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
}

export default async function AdminBriefPage({ params }: PageProps) {
  const { locale } = params;

  try {
    const result = await client.queries.pages({ relativePath: `${locale}/brief.mdx` });

    return (
      <AdminPreviewProvider
        query={result.query}
        variables={result.variables}
        data={result.data}
        render={data => <ContactPageWrapper data={{ ...data.pages, locale }} />}
      />
    );
  } catch (error) {
    console.error("Admin brief page not found", error);
    notFound();
  }
}
