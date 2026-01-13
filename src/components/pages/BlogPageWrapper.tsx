"use client";

import { useMemo, useState, type ReactNode } from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import { SearchBar, type SearchTranslations } from "@/components/ui/SearchBar";
import { useAdminLink } from "@/hooks/useAdminLink";
import PageBackground from "@/components/layout/PageBackground";
import BlogHeader from "@/components/sections/blog/BlogHeader";
import BlogGrid from "@/components/sections/blog/BlogGrid";
import { extractBody, hasBodyContent } from "@/lib/tina/body";

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
    blog?: {
        noArticles?: string | null;
        readMore?: string | null;
        readTime?: string | null;
        by?: string | null;
        backToBlog?: string | null;
        publishedOn?: string | null;
        shareTitle?: string | null;
        shareButtons?: {
            twitter?: string | null;
            linkedin?: string | null;
            facebook?: string | null;
            copyLink?: string | null;
        } | null;
        tableOfContentsTitle?: string | null;
        authorBox?: {
            title?: string | null;
            bio?: string | null;
            contact?: string | null;
        } | null;
        relatedArticlesTitle?: string | null;
        otherProjectsTitle?: string | null;
    } | null;
    searchBar?: {
        blog?: SearchTranslations;
    } | null;
}

interface BlogPageWrapperProps {
    data: BlogPageData;
}

const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";

const textFromChildren = (children: ReactNode): string => {
    if (typeof children === "string" || typeof children === "number") return String(children);
    if (Array.isArray(children)) return children.map(textFromChildren).join("");
    if (children && typeof children === "object" && "props" in children) {
        return textFromChildren((children as { props?: { children?: ReactNode } }).props?.children ?? null);
    }
    return "";
};

const mdxComponents = {
    h2: ({ children }: { children: ReactNode }) => {
        const id = slugify(textFromChildren(children));
        return (
            <h2 id={id} className="group text-2xl md:text-3xl font-semibold mt-6 mb-4 text-white flex items-center gap-2">
                <span>{children}</span>
                <a
                    href={`#${id}`}
                    aria-label={`Bezpośredni link: ${textFromChildren(children)}`}
                    className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 transition text-sm"
                >
                    #
                </a>
            </h2>
        );
    },
    h3: ({ children }: { children: ReactNode }) => {
        const id = slugify(textFromChildren(children));
        return <h3 id={id} className="text-xl md:text-2xl font-semibold mt-5 mb-3 text-white">{children}</h3>;
    },
    p: ({ children }: { children: ReactNode }) => (
        <p className="mb-4 text-slate-300 text-base md:text-lg leading-relaxed">{children}</p>
    ),
    ul: ({ children }: { children: ReactNode }) => (
        <ul className="list-disc list-inside space-y-2 mb-4 text-slate-300 text-base md:text-lg">{children}</ul>
    ),
    ol: ({ children }: { children: ReactNode }) => (
        <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-300 text-base md:text-lg">{children}</ol>
    ),
    li: ({ children }: { children: ReactNode }) => (
        <li className="leading-relaxed">{children}</li>
    ),
    strong: ({ children }: { children: ReactNode }) => (
        <strong className="font-semibold text-white">{children}</strong>
    ),
    a: ({ children, href }: { children: ReactNode; href?: string }) => (
        <a href={href} className="text-blue-400 hover:text-blue-300 underline">
            {children}
        </a>
    ),
};

export default function BlogPageWrapper({ data }: BlogPageWrapperProps) {
    const { getLink } = useAdminLink();
    const posts = (data?.posts || []) as BlogPost[];
    const locale = data?.locale || "pl";
    const searchTranslations = data?.searchBar?.blog as SearchTranslations | undefined;
    const body = extractBody(data);
    const hasBody = hasBodyContent(body);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        posts.forEach(post => {
            post.tags?.forEach(tag => {
                if (tag) tagsSet.add(tag);
            });
        });
        return Array.from(tagsSet).sort();
    }, [posts]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = !searchQuery ||
                (post.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (post.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (post.excerpt?.toLowerCase() || "").includes(searchQuery.toLowerCase());

            const matchesTags = selectedTags.length === 0 ||
                selectedTags.some(tag => post.tags?.some(postTag => postTag === tag));

            return matchesSearch && matchesTags;
        });
    }, [posts, searchQuery, selectedTags]);

    return (
        <PageBackground variant="blue">
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
                <BlogHeader
                    title={data?.title || undefined}
                    description={data?.description || undefined}
                    data={data}
                />

                {hasBody && (
                    <article
                        className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-md leading-relaxed text-slate-200 mb-12"
                        data-tina-field={tinaField(data, "body")}
                    >
                        <TinaMarkdown content={body as TinaMarkdownContent} components={mdxComponents} />
                    </article>
                )}

                {allTags.length > 0 && (
                    <div className="mb-12">
                        <SearchBar
                            allTags={allTags}
                            onSearchChange={setSearchQuery}
                            onTagsChange={setSelectedTags}
                            locale={locale}
                            type="blog"
                            translations={searchTranslations}
                        />
                    </div>
                )}

                <BlogGrid
                    posts={filteredPosts}
                    locale={locale}
                    translations={data?.blog}
                    getLink={getLink}
                />
            </main>
        </PageBackground>
    );
}
