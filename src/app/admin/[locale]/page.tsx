import { notFound } from "next/navigation";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { AdminHomePreview } from "@/providers/AdminPreviewRenderer";
import client from "@tina/__generated__/client";
import { redirect } from "next/navigation";

const supportedLocales = ["pl", "en"] as const;

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminHomePage({ params }: PageProps) {
  const { locale } = await params;

  if (!supportedLocales.includes(locale as (typeof supportedLocales)[number])) {
    redirect(`/admin/pl`);
  }

  try {
    const result = await client.queries.pages({ relativePath: `${locale}/home.mdx` });

    return (
      <AdminPreviewProvider
        query={result.query}
        variables={result.variables}
        data={result.data}
      >
        <AdminHomePreview locale={locale} />
      </AdminPreviewProvider>
    );
  } catch (error) {
    console.error("Admin home page not found", error);
    notFound();
  }
}
