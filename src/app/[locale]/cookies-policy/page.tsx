import { notFound } from "next/navigation";
import LegalPageWrapper from "@/components/pages/LegalPageWrapper";
import { getLegalPage } from "@/lib/tina/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function CookiesPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  try {
    const data = await getLegalPage(locale, "cookies-policy");
    return <LegalPageWrapper data={{ ...data, locale }} />;
  } catch (error) {
    console.error("Cookies policy not found", error);
    notFound();
  }
}
