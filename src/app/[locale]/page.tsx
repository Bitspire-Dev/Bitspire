import HomePageWrapper from "@/components/pages/HomePageWrapper";
import { buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
import { getHomePage, getPortfolioIndex } from "@/lib/tina/queries";

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
  const currentLocale = normalizeLocale(locale);
  const [data, portfolioHighlightsProjects] = await Promise.all([
    getHomePage(currentLocale),
    getPortfolioIndex(currentLocale),
  ]);
  return (
    <HomePageWrapper
      data={{ ...data, locale: currentLocale }}
      portfolioHighlightsProjects={portfolioHighlightsProjects}
    />
  );
}
