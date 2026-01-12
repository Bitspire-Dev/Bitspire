import { notFound } from "next/navigation";
import LegalPageWrapper from "@/components/pages/LegalPageWrapper";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import client from "@tina/__generated__/client";

interface PageProps {
  params: { locale: string };
}

export async function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function AdminPrivacyPolicyPage({ params }: PageProps) {
  const { locale } = params;

  try {
    const result = await client.queries.pages({ relativePath: `${locale}/privacy-policy.mdx` });

    return (
      <AdminPreviewProvider
        query={result.query}
        variables={result.variables}
        data={result.data}
        render={data => <LegalPageWrapper data={{ ...data.pages, locale }} />}
      />
    );
  } catch (error) {
    console.error("Admin privacy policy not found", error);
    notFound();
  }
}
