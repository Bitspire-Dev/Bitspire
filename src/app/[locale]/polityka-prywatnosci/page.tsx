import { notFound } from "next/navigation";
import LegalPageWrapper from "@/components/pages/LegalPageWrapper";
import { buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
import { getLegalPage } from "@/lib/tina/queries";

export const revalidate = 2592000;

const supportedLocales = ["pl", "en"] as const;
const slugMap: Record<(typeof supportedLocales)[number], string> = {
  pl: "polityka-prywatnosci",
  en: "privacy-policy",
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = normalizeLocale(locale);
  const slug = slugMap[currentLocale];
  const data = await getLegalPage(currentLocale, slug);

  const paths = {
    pl: buildLocalePath("pl", "/polityka-prywatnosci"),
    en: buildLocalePath("en", "/privacy-policy"),
  };

  return buildMetadata({
    title: data?.title,
    description: data?.description,
    locale: currentLocale,
    paths,
  });
}

export default async function PolitykaPrywatnosciPage({ params }: PageProps) {
  const { locale } = await params;
  try {
    const currentLocale = normalizeLocale(locale);
    const slug = slugMap[currentLocale];
    const data = await getLegalPage(currentLocale, slug);
    return <LegalPageWrapper data={{ ...data, locale: currentLocale }} />;
  } catch (error) {
    console.error("Polityka prywatnosci not found", error);
    notFound();
  }
}
