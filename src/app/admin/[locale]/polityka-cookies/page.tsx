import { createAdminLegalPageComponent } from "@/lib/routing/legal-pages/config";

export const dynamic = "force-dynamic";

export default createAdminLegalPageComponent({
  slugMap: { pl: "polityka-cookies.mdx", en: "cookies-policy.mdx" },
  redirectPath: "polityka-cookies",
});
