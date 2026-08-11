import {
  createLegalPageGenerateStaticParams,
  createLegalPageGenerateMetadata,
  createLegalPageComponent,
} from "@/lib/routing/legal-pages/config";

const config = {
  slugMap: { pl: "regulamin" as const, en: "terms" as const },
  paths: { pl: "/regulamin", en: "/terms" },
};

export const revalidate = 2592000;
export const generateStaticParams = createLegalPageGenerateStaticParams();
export const generateMetadata = createLegalPageGenerateMetadata(config);
export default createLegalPageComponent(config);
