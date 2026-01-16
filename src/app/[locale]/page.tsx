import HomePageWrapper from "@/components/pages/HomePageWrapper";
import { buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
import { getHomePage } from "@/lib/tina/queries";
import { redirect } from "next/navigation";

const supportedLocales = ["pl", "en"] as const;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = normalizeLocale(locale);
  const data = await getHomePage(currentLocale);

  const paths = {
    pl: buildLocalePath("pl", "/"),
    en: buildLocalePath("en", "/"),
  };

  return buildMetadata({
    title: data?.title,
    description: data?.description,
    locale: currentLocale,
    paths,
  });
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  if (!supportedLocales.includes(locale as (typeof supportedLocales)[number])) {
    // If a non-locale slug hits the locale segment (e.g. /regulamin),
    // send it to default locale with the same path to reach the correct route.
    redirect(`/pl/${locale}`);
  }
  const data = await getHomePage(locale);
  return <HomePageWrapper data={{ ...data, locale }} />;
}
