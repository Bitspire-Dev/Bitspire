import { createAdminLegalPageComponent } from "@/lib/routing/legal-pages/config";

export const dynamic = "force-dynamic";

export default createAdminLegalPageComponent({
  slugMap: { pl: "regulamin.mdx", en: "terms.mdx" },
  redirectPath: "regulamin",
});
