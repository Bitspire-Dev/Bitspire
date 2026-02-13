import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";
import { buildLocalePath, buildMetadata, normalizeLocale, type SupportedLocale } from "@/lib/seo/metadata";
import { getLegalPage } from "@/lib/tina/queries";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { AdminLegalPagePreview } from "@/providers/AdminPreviewRenderer";
import { getTinaClient } from "@/lib/tina/client";
import { AdminMotionFinal } from "@/components/admin/AdminMotionFinal";

export const LEGAL_PAGES_PL = [
  "polityka-prywatnosci",
  "polityka-cookies",
  "regulamin",
];

export const LEGAL_PAGES_EN = [
  "privacy-policy",
  "cookies-policy",
  "terms",
];

const supportedLocales: SupportedLocale[] = ["pl", "en"];

interface LegalPageConfig {
  slugMap: Record<SupportedLocale, string>;
  paths: { pl: string; en: string };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function createLegalPageGenerateStaticParams() {
  return () => supportedLocales.map((locale) => ({ locale }));
}

export function createLegalPageGenerateMetadata(config: LegalPageConfig) {
  return async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const currentLocale = normalizeLocale(locale);
    const slug = config.slugMap[currentLocale];
    const data = await getLegalPage(currentLocale, slug);

    const paths = {
      pl: buildLocalePath("pl", config.paths.pl),
      en: buildLocalePath("en", config.paths.en),
    };

    return buildMetadata({
      title: data?.title,
      description: data?.description,
      locale: currentLocale,
      paths,
    });
  };
}

export function createLegalPageComponent(config: LegalPageConfig) {
  return async function LegalPageRoute({ params }: PageProps) {
    const { locale } = await params;
    try {
      const currentLocale = normalizeLocale(locale);
      const slug = config.slugMap[currentLocale];
      const data = await getLegalPage(currentLocale, slug);
      return <LegalPage data={{ ...data, locale: currentLocale }} />;
    } catch (error) {
      console.error(`Legal page not found (${config.slugMap.pl}):`, error);
      notFound();
    }
  };
}

interface AdminLegalPageConfig {
  slugMap: Record<SupportedLocale, string>;
  redirectPath: string;
}

export function createAdminLegalPageComponent(config: AdminLegalPageConfig) {
  const client = getTinaClient();

  return async function AdminLegalPageRoute({ params }: PageProps) {
    const { locale } = await params;

    if (!supportedLocales.includes(locale as SupportedLocale)) {
      redirect(`/admin/pl/${config.redirectPath}`);
    }

    try {
      const slug = config.slugMap[locale as SupportedLocale];
      const result = await client.queries.pages({ relativePath: `${locale}/${slug}` });

      return (
        <AdminMotionFinal>
          <AdminPreviewProvider
            query={result.query}
            variables={result.variables}
            data={result.data}
          >
            <AdminLegalPagePreview locale={locale} />
          </AdminPreviewProvider>
        </AdminMotionFinal>
      );
    } catch (error) {
      console.error(`Admin legal page not found (${config.redirectPath}):`, error);
      notFound();
    }
  };
}
