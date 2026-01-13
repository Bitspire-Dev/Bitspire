import { notFound, redirect } from "next/navigation";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { AdminLegalPagePreview } from "@/providers/AdminPreviewRenderer";
import client from "@tina/__generated__/client";

const supportedLocales = ["pl", "en"] as const;
const slugMap: Record<(typeof supportedLocales)[number], string> = {
  pl: "polityka-cookies.mdx",
  en: "cookies-policy.mdx",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPolitykaCookiesPage({ params }: PageProps) {
  const { locale } = await params;

  if (!supportedLocales.includes(locale as (typeof supportedLocales)[number])) {
    redirect(`/admin/pl/polityka-cookies`);
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
    console.error("Admin polityka cookies not found", error);
    notFound();
  }
}
