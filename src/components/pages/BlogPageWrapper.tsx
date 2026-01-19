"use client";

import { useMemo, useState } from "react";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import { SearchBar, type SearchTranslations } from "@/components/ui/SearchBar";
import { useAdminLink } from "@/hooks/useAdminLink";
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

export default function BlogPageWrapper({ data }: BlogPageWrapperProps) {
    const { getLink } = useAdminLink();
    const posts = (data?.posts || []) as BlogPost[];
    const locale = data?.locale || "pl";
    const searchTranslations = data?.searchBar?.blog as SearchTranslations | undefined;
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
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-32 pb-16 md:pb-20">
                <BlogHeader
                    title={data?.title || undefined}
                    description={data?.description || undefined}
                    data={data}
                />

                {allTags.length > 0 && (
                    <div className="mb-12">
                        <SearchBar
                            allTags={allTags}
                            onSearchChange={setSearchQuery}
                            onTagsChange={setSelectedTags}
                            locale={locale}
                            type="blog"
                            translations={searchTranslations}
                            tinaFields={data ? {
                                searchPlaceholder: tinaField(data, 'searchBar.blog.searchPlaceholder'),
                                clearSearch: tinaField(data, 'searchBar.blog.clearSearch'),
                                filterByTech: tinaField(data, 'searchBar.blog.filterByTech'),
                                clearFilters: tinaField(data, 'searchBar.blog.clearFilters'),
                                showLess: tinaField(data, 'searchBar.blog.showLess'),
                                showMore: tinaField(data, 'searchBar.blog.showMore'),
                                activeFilters: tinaField(data, 'searchBar.blog.activeFilters'),
                                removeFilter: tinaField(data, 'searchBar.blog.removeFilter'),
                            } : undefined}
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
