import { AdminPortfolioIndexPreview } from "@/providers/AdminPreviewRenderer";
import { getPortfolioIndex } from "@/lib/tina/queries";
import { createAdminPage } from "@/lib/routing/admin-pages/createAdminPage";

export const dynamic = 'force-dynamic';

export default createAdminPage<unknown[]>({
  fetchData: async ({ client, locale }) => {
    const [pageResult, projects] = await Promise.all([
      client.queries.pages({ relativePath: `${locale}/portfolio.mdx` }),
      getPortfolioIndex(locale),
    ]);
    return { result: pageResult, extra: projects as unknown[] };
  },
  renderPreview: ({ locale, extra: projects }) => (
    <AdminPortfolioIndexPreview locale={locale} projects={projects ?? []} />
  ),
});
