import { notFound, redirect } from "next/navigation";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { AdminLegalPagePreview } from "@/providers/AdminPreviewRenderer";
import { getTinaClient } from "@/lib/tina/client";

const supportedLocales = ["pl", "en"] as const;
const slugMap: Record<(typeof supportedLocales)[number], string> = {
  pl: "polityka-prywatnosci.mdx",
  en: "privacy-policy.mdx",
};

export const dynamic = "force-dynamic";

const client = getTinaClient();

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPolitykaPrywatnosciPage({ params }: PageProps) {
  const { locale } = await params;

  if (!supportedLocales.includes(locale as (typeof supportedLocales)[number])) {
    redirect(`/admin/pl/polityka-prywatnosci`);
  }

  try {
    const slug = slugMap[locale as (typeof supportedLocales)[number]];
    const result = await client.queries.pages({ relativePath: `${locale}/${slug}` });

    return (
      <AdminPreviewProvider
        query={result.query}
        variables={result.variables}
        data={result.data}
      >
        <AdminLegalPagePreview locale={locale} />
      </AdminPreviewProvider>
    );
  } catch (error) {
    console.error("Admin polityka prywatnosci not found", error);
    notFound();
  }
}
