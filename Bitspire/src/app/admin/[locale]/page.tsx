import { AdminHomePreview } from "@/providers/AdminPreviewRenderer";
import { createAdminPage } from "@/lib/routing/admin-pages/createAdminPage";

export const dynamic = 'force-dynamic';

export default createAdminPage({
  validateLocale: true,
  fetchData: async ({ client, locale }) => {
    const result = await client.queries.pages({ relativePath: `${locale}/home.mdx` });
    return { result };
  },
  renderPreview: ({ locale }) => <AdminHomePreview locale={locale} />,
});
