import { notFound, redirect } from "next/navigation";
import LegalPageWrapper from "@/components/pages/LegalPageWrapper";
import { getLegalPage } from "@/lib/tina/queries";

const supportedLocales = ["pl", "en"] as const;
const slugMap: Record<(typeof supportedLocales)[number], string> = {
  pl: "polityka-cookies",
  en: "cookies-policy",
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function PolitykaCookiesPage({ params }: PageProps) {
  const { locale } = await params;
  if (!supportedLocales.includes(locale as (typeof supportedLocales)[number])) {
    redirect(`/pl/${locale}`);
  }
  try {
    const slug = slugMap[locale as (typeof supportedLocales)[number]];
    const data = await getLegalPage(locale, slug);
    return <LegalPageWrapper data={{ ...data, locale }} />;
  } catch (error) {
    console.error("Polityka cookies not found", error);
    notFound();
  }
}
