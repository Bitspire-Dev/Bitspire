import { notFound, redirect } from "next/navigation";
import LegalPageWrapper from "@/components/pages/LegalPageWrapper";
import { buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
import { getLegalPage } from "@/lib/tina/queries";

export const revalidate = 2592000;

const supportedLocales = ["pl", "en"] as const;
const slugMap: Record<(typeof supportedLocales)[number], string> = {
  pl: "regulamin",
  en: "terms",
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
    pl: buildLocalePath("pl", "/regulamin"),
    en: buildLocalePath("en", "/terms"),
  };

  return buildMetadata({
    title: data?.title,
    description: data?.description,
    locale: currentLocale,
    paths,
  });
}

export default async function RegulaminPage({ params }: PageProps) {
  const { locale } = await params;
  if (!supportedLocales.includes(locale as (typeof supportedLocales)[number])) {
    redirect(`/pl/${locale}`);
  }
  try {
    const slug = slugMap[locale as (typeof supportedLocales)[number]];
    const data = await getLegalPage(locale, slug);
    return <LegalPageWrapper data={{ ...data, locale }} />;
  } catch (error) {
    console.error("Regulamin not found", error);
    notFound();
  }
}
