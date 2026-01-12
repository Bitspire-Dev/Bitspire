import { notFound } from "next/navigation";
import LegalPageWrapper from "@/components/pages/LegalPageWrapper";
import { getLegalPage } from "@/lib/tina/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "pl" }];
}

export default async function PolitykaPrywatnosciPage({ params }: PageProps) {
  const { locale } = await params;
  try {
    const data = await getLegalPage(locale, "polityka-prywatnosci");
    return <LegalPageWrapper data={{ ...data, locale }} />;
  } catch (error) {
    console.error("Polityka prywatnosci not found", error);
    notFound();
  }
}
