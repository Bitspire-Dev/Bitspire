import { notFound } from "next/navigation";
import BlogPostWrapper from "@/components/pages/BlogPostWrapper";
import { getBlogPost } from "@/lib/tina/queries";
import { getAllBlogSlugs } from "@/lib/tina/params";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales = ["pl", "en"];
  const all = await Promise.all(locales.map(l => getAllBlogSlugs(l)));
  return all.flat().map(({ locale, slug }) => ({ locale, slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  try {
    const post = await getBlogPost(locale, slug);
    return <BlogPostWrapper data={{ ...post, locale, slug }} />;
  } catch (error) {
    console.error("Blog post not found", error);
    notFound();
  }
}
