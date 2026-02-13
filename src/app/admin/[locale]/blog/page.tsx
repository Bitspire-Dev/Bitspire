import { AdminBlogIndexPreview } from "@/providers/AdminPreviewRenderer";
import { getBlogIndex } from "@/lib/tina/queries";
import { createAdminPage } from "@/lib/routing/admin-pages/createAdminPage";

export const dynamic = 'force-dynamic';

export default createAdminPage<unknown[]>({
  fetchData: async ({ client, locale }) => {
    const [pageResult, posts] = await Promise.all([
      client.queries.pages({ relativePath: `${locale}/blog.mdx` }),
      getBlogIndex(locale),
    ]);
    return { result: pageResult, extra: posts as unknown[] };
  },
  renderPreview: ({ locale, extra: posts }) => (
    <AdminBlogIndexPreview locale={locale} posts={posts ?? []} />
  ),
});
