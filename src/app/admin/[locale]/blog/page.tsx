import { notFound } from "next/navigation";
import BlogPageWrapper from "@/components/pages/BlogPageWrapper";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { getBlogIndex } from "@/lib/tina/queries";
import client from "@tina/__generated__/client";

interface PageProps {
  params: { locale: string };
}

export async function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
}

export default async function AdminBlogIndexPage({ params }: PageProps) {
  const { locale } = params;

  try {
    const [pageResult, posts] = await Promise.all([
      client.queries.pages({ relativePath: `${locale}/blog.mdx` }),
      getBlogIndex(locale),
    ]);

    return (
      <AdminPreviewProvider
        query={pageResult.query}
        variables={pageResult.variables}
        data={pageResult.data}
        render={data => (
          <BlogPageWrapper
            data={{
              ...data.pages,
              posts,
              locale,
              blog: null,
            }}
          />
        )}
      />
    );
  } catch (error) {
    console.error("Admin blog page not found", error);
    notFound();
  }
}
