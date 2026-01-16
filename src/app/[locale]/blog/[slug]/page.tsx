import { notFound } from "next/navigation";
import BlogPostWrapper from "@/components/pages/BlogPostWrapper";
import { absoluteUrl, buildLocalePath, buildMetadata, normalizeLocale } from "@/lib/seo/metadata";
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

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const currentLocale = normalizeLocale(locale);
  const post = await getBlogPost(currentLocale, slug);

  const paths = {
    pl: buildLocalePath("pl", `/blog/${slug}`),
    en: buildLocalePath("en", `/blog/${slug}`),
  };

  const base = buildMetadata({
    title: post?.title ?? undefined,
    description: post?.description ?? undefined,
    locale: currentLocale,
    paths,
    image: post?.image ?? undefined,
    ogType: "article",
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post?.date ?? undefined,
      authors: post?.author ? [post.author] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  try {
    const currentLocale = normalizeLocale(locale);
    const post = await getBlogPost(currentLocale, slug);
    const pagePath = buildLocalePath(currentLocale, `/blog/${slug}`);
    const imageUrl = post?.image ? absoluteUrl(post.image) : undefined;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post?.title ?? "",
      description: post?.description ?? "",
      image: imageUrl ? [imageUrl] : undefined,
      datePublished: post?.date ?? undefined,
      dateModified: post?.date ?? undefined,
      author: post?.author ? { "@type": "Person", name: post.author } : undefined,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": absoluteUrl(pagePath),
      },
      inLanguage: currentLocale,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BlogPostWrapper data={{ ...post, locale: currentLocale, slug }} />
      </>
    );
  } catch (error) {
    console.error("Blog post not found", error);
    notFound();
  }
}
