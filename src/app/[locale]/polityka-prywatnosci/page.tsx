import {
  createLegalPageGenerateStaticParams,
  createLegalPageGenerateMetadata,
  createLegalPageComponent,
} from "@/lib/routing/legal-pages/config";

const config = {
  slugMap: { pl: "polityka-prywatnosci" as const, en: "privacy-policy" as const },
  paths: { pl: "/polityka-prywatnosci", en: "/privacy-policy" },
};

export const revalidate = 2592000;
export const generateStaticParams = createLegalPageGenerateStaticParams();
export const generateMetadata = createLegalPageGenerateMetadata(config);
export default createLegalPageComponent(config);
