import { getRelatedBlogPosts } from "@/lib/tina/queries";
import { AdminBlogPostPreview } from "@/providers/AdminPreviewRenderer";
import { createAdminPage } from "@/lib/routing/admin-pages/createAdminPage";

export const dynamic = 'force-dynamic';

export default createAdminPage<unknown[]>({
  fetchData: async ({ client, locale, slug }) => {
    const result = await client.queries.blog({ relativePath: `${locale}/${slug}.mdx` });
    const relatedPosts = await getRelatedBlogPosts(locale, result.data.blog);
    return { result, extra: relatedPosts as unknown[] };
  },
  renderPreview: ({ locale, slug, extra: relatedPosts }) => (
    <AdminBlogPostPreview
      locale={locale}
      slug={slug!}
      relatedPosts={relatedPosts ?? []}
    />
  ),
});
