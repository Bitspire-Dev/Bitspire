import { notFound } from "next/navigation";
import LegalPageWrapper from "@/components/pages/LegalPageWrapper";
import { getLegalPage } from "@/lib/tina/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "pl" }];
}

export default async function PolitykaCookiesPage({ params }: PageProps) {
  const { locale } = await params;
  try {
    const data = await getLegalPage(locale, "polityka-cookies");
    return <LegalPageWrapper data={{ ...data, locale }} />;
  } catch (error) {
    console.error("Polityka cookies not found", error);
    notFound();
  }
}
