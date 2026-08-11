import { AdminPortfolioItemPreview } from "@/providers/AdminPreviewRenderer";
import { createAdminPage } from "@/lib/routing/admin-pages/createAdminPage";

export const dynamic = 'force-dynamic';

export default createAdminPage({
  fetchData: async ({ client, locale, slug }) => {
    const result = await client.queries.portfolio({ relativePath: `${locale}/${slug}.mdx` });
    return { result };
  },
  renderPreview: ({ locale }) => <AdminPortfolioItemPreview locale={locale} />,
});
