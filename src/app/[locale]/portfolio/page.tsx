import PortfolioPageWrapper from "@/components/pages/PortfolioPageWrapper";
import { getPortfolioIndex, getPage } from "@/lib/tina/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
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
