import { notFound } from "next/navigation";
import PortfolioItemWrapper from "@/components/pages/PortfolioItemWrapper";
import { absoluteUrl, buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
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

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const currentLocale = normalizeLocale(locale);
  const project = await getPortfolioItem(currentLocale, slug);

  const paths = {
    pl: buildLocalePath("pl", `/portfolio/${slug}`),
    en: buildLocalePath("en", `/portfolio/${slug}`),
  };

  return buildMetadata({
    title: project?.title ?? undefined,
    description: project?.description ?? undefined,
    locale: currentLocale,
    paths,
    image: project?.image ?? undefined,
  });
}

export default async function PortfolioItemPage({ params }: PageProps) {
  const { locale, slug } = await params;
  try {
    const currentLocale = normalizeLocale(locale);
    const project = await getPortfolioItem(currentLocale, slug);
    const pagePath = buildLocalePath(currentLocale, `/portfolio/${slug}`);
    const imageUrl = project?.image ? absoluteUrl(project.image) : undefined;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project?.title ?? "",
      description: project?.description ?? "",
      image: imageUrl ? [imageUrl] : undefined,
      url: absoluteUrl(pagePath),
      inLanguage: currentLocale,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PortfolioItemWrapper data={{ ...project, locale: currentLocale }} />
      </>
    );
  } catch (error) {
    console.error("Portfolio item not found", error);
    notFound();
  }
}
