import HomePageWrapper from "@/components/pages/HomePageWrapper";
import { getHomePage, getPortfolioIndex } from "@/lib/tina/queries";
import { buildLocalePath, buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export async function generateMetadata() {
  const data = await getHomePage("pl");
  const paths = {
    pl: buildLocalePath("pl", "/"),
    en: buildLocalePath("en", "/"),
  };

  return buildMetadata({
    title: data?.title,
    description: data?.description,
    locale: "pl",
    paths,
  });
}

export default async function RootPage() {
  const [data, portfolioHighlightsProjects] = await Promise.all([
    getHomePage("pl"),
    getPortfolioIndex("pl"),
  ]);

  return (
    <HomePageWrapper
      data={{ ...data, locale: "pl" }}
      portfolioHighlightsProjects={portfolioHighlightsProjects}
    />
  );
}
