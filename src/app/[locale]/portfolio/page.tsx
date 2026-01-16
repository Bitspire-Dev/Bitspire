import PortfolioPageWrapper from "@/components/pages/PortfolioPageWrapper";
import { buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
import { getPortfolioIndex, getPage } from "@/lib/tina/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = normalizeLocale(locale);
  const page = await getPage(currentLocale, "portfolio");

  const paths = {
    pl: buildLocalePath("pl", "/portfolio"),
    en: buildLocalePath("en", "/portfolio"),
  };

  return buildMetadata({
    title: page?.title,
    description: page?.description,
    locale: currentLocale,
    paths,
  });
}

export default async function PortfolioIndexPage({ params }: PageProps) {
  const { locale } = await params;
  const page = await getPage(locale, "portfolio");
  const projects = await getPortfolioIndex(locale);

  return (
    <PortfolioPageWrapper
      data={{
        ...page,
        projects,
        locale,
      }}
    />
  );
}
