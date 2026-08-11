import { createAdminLegalPageComponent } from "@/lib/routing/legal-pages/config";

export const dynamic = "force-dynamic";

export default createAdminLegalPageComponent({
  slugMap: { pl: "polityka-prywatnosci.mdx", en: "privacy-policy.mdx" },
  redirectPath: "polityka-prywatnosci",
});
