import { notFound } from "next/navigation";
import LegalPageWrapper from "@/components/pages/LegalPageWrapper";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import client from "@tina/__generated__/client";

interface PageProps {
  params: { locale: string };
}

export async function generateStaticParams() {
  return [{ locale: "pl" }];
}

export default async function AdminPolitykaPrywatnosciPage({ params }: PageProps) {
  const { locale } = params;

  try {
    const result = await client.queries.pages({ relativePath: `${locale}/polityka-prywatnosci.mdx` });

    return (
      <AdminPreviewProvider
        query={result.query}
        variables={result.variables}
        data={result.data}
        render={data => <LegalPageWrapper data={{ ...data.pages, locale }} />}
      />
    );
  } catch (error) {
    console.error("Admin polityka prywatnosci not found", error);
    notFound();
  }
}
