import {
  createLegalPageGenerateStaticParams,
  createLegalPageGenerateMetadata,
  createLegalPageComponent,
} from "@/lib/routing/legal-pages/config";

const config = {
  slugMap: { pl: "polityka-cookies" as const, en: "cookies-policy" as const },
  paths: { pl: "/polityka-cookies", en: "/cookies-policy" },
};

export const revalidate = 2592000;
export const generateStaticParams = createLegalPageGenerateStaticParams();
export const generateMetadata = createLegalPageGenerateMetadata(config);
export default createLegalPageComponent(config);
