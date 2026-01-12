import { notFound } from "next/navigation";
import LegalPageWrapper from "@/components/pages/LegalPageWrapper";
import { getLegalPage } from "@/lib/tina/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "pl" }];
}

export default async function RegulaminPage({ params }: PageProps) {
  const { locale } = await params;
  try {
    const data = await getLegalPage(locale, "regulamin");
    return <LegalPageWrapper data={{ ...data, locale }} />;
  } catch (error) {
    console.error("Regulamin not found", error);
    notFound();
  }
}
