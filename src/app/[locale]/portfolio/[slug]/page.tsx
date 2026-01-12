import { notFound } from "next/navigation";
import PortfolioItemWrapper from "@/components/pages/PortfolioItemWrapper";
import { getAllPortfolioSlugs } from "@/lib/tina/params";
import { getPortfolioItem } from "@/lib/tina/queries";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales = ["pl", "en"];
  const all = await Promise.all(locales.map(l => getAllPortfolioSlugs(l)));
  return all.flat().map(({ locale, slug }) => ({ locale, slug }));
}

export default async function PortfolioItemPage({ params }: PageProps) {
  const { locale, slug } = await params;
  try {
    const project = await getPortfolioItem(locale, slug);
    return <PortfolioItemWrapper data={{ ...project, locale }} />;
  } catch (error) {
    console.error("Portfolio item not found", error);
    notFound();
  }
}
