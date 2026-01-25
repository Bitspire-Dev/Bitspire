import { buildAdminLink, type AdminLinkMode } from "@/lib/routing/adminLink";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { SearchBarRouter } from "@/components/ui/composites/SearchBarRouter";
import PageBackground from "@/components/layout/PageBackground";
import BlogHeader from "@/components/sections/blog/BlogHeader";
import BlogGrid from "@/components/sections/blog/BlogGrid";

interface BlogPost {
    _sys: {
        filename: string;
        relativePath: string;
    };
    title: string;
    slug: string;
    description: string;
    excerpt?: string | null;
    date: string;
    author: string;
    category?: string | null;
    tags?: (string | null)[] | null;
    image?: string | null;
    imageAlt?: string | null;
    readTime?: number | null;
}

interface BlogPageData {
    [key: string]: unknown;
    posts?: BlogPost[];
    locale?: string;
    title?: string | null;
    description?: string | null;
    body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
    _body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
}

interface BlogPageWrapperProps {
    data: BlogPageData;
    allTags?: string[];
    searchQuery?: string;
    selectedTags?: string[];
    linkMode?: AdminLinkMode;
}

export default function BlogPageWrapper({
    data,
    allTags,
    searchQuery,
    selectedTags,
    linkMode = "production",
}: BlogPageWrapperProps) {
    const posts = (data?.posts || []) as BlogPost[];
    const locale = data?.locale || "pl";
    const normalizedAllTags = allTags && allTags.length > 0
        ? allTags
        : Array.from(
            posts.reduce((acc, post) => {
                post.tags?.forEach(tag => {
                    if (tag) acc.add(tag);
                });
                return acc;
            }, new Set<string>())
        ).sort();

    const getLink = (href: string) =>
        buildAdminLink(href, {
            locale,
            mode: linkMode,
        });

    return (
        <PageBackground variant="blue">
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-32 pb-16 md:pb-20">
                <BlogHeader
                    title={data?.title || undefined}
                    description={data?.description || undefined}
                    data={data}
                />

                {normalizedAllTags.length > 0 && (
                    <div className="mb-12">
                        <SearchBarRouter
                            allTags={normalizedAllTags}
                            locale={locale}
                            type="blog"
                            initialQuery={searchQuery}
                            initialTags={selectedTags}
                        />
                    </div>
                )}

                <BlogGrid
                    posts={posts}
                    locale={locale}
                    getLink={getLink}
                    isAdmin={linkMode !== "production"}
                />
            </main>
        </PageBackground>
    );
}
