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
  const safeTitle = typeof project?.title === "string" ? project.title : undefined;
  const safeDescription = typeof project?.description === "string" ? project.description : undefined;
  const safeImage = typeof project?.image === "string" ? project.image : undefined;

  const paths = {
    pl: buildLocalePath("pl", `/portfolio/${slug}`),
    en: buildLocalePath("en", `/portfolio/${slug}`),
  };

  return buildMetadata({
    title: safeTitle,
    description: safeDescription,
    locale: currentLocale,
    paths,
    image: safeImage,
  });
}

export default async function PortfolioItemPage({ params }: PageProps) {
  const { locale, slug } = await params;
  try {
    const currentLocale = normalizeLocale(locale);
    const project = await getPortfolioItem(currentLocale, slug);
    if (!project) {
      notFound();
    }
    const pagePath = buildLocalePath(currentLocale, `/portfolio/${slug}`);
    const safeImage = typeof project?.image === "string" ? project.image : undefined;
    const imageUrl = safeImage ? absoluteUrl(safeImage) : undefined;
    const authorName = (project as { client?: string; author?: string | null })?.author
      ?? (project as { client?: string; author?: string | null })?.client;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Project",
      name: project?.title ?? "",
      description: project?.description ?? "",
      image: imageUrl ? [imageUrl] : undefined,
      datePublished: (project as { date?: string | null })?.date ?? undefined,
      author: authorName ? { "@type": "Organization", name: authorName } : undefined,
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
