import { headers } from "next/headers";
import { redirect } from "next/navigation";
import HomePageWrapper from "@/components/pages/HomePageWrapper";
import { getHomePage, getPortfolioIndex } from "@/lib/tina/queries";
import { buildLocalePath, buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

async function getCountry(): Promise<string | undefined> {
  const h = await headers();
  return (
    h.get("x-vercel-ip-country") ??
    h.get("x-geo-country") ??
    h.get("x-country") ??
    h.get("cf-ipcountry") ??
    undefined
  );
}

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
  const country = await getCountry();
  if (country?.toUpperCase() !== "PL") {
    redirect("/en");
  }

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
