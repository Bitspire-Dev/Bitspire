'use client';

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { useAdminLink } from "@/hooks/useAdminLink";
import PageBackground from "@/components/layout/PageBackground";
import BlogHeader from "@/components/sections/blog/BlogHeader";
import BlogGrid from "@/components/sections/blog/BlogGrid";

interface BlogPost {
    _sys?: {
        filename?: string;
        relativePath?: string;
    };
    title?: string;
    slug?: string;
    description?: string | null;
    excerpt?: string | null;
    date?: string;
    author?: string;
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
    blog?: {
        noArticles?: string | null;
        readMore?: string | null;
        readTime?: string | null;
        by?: string | null;
    } | null;
}

interface BlogPageWrapperProps {
    data: BlogPageData;
}

export default function BlogPageWrapper({ data }: BlogPageWrapperProps) {
    const { getLink } = useAdminLink();
    const posts = (data?.posts || []) as BlogPost[];
    const locale = data?.locale || 'pl';

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Extract all unique tags
    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        posts.forEach(post => {
            post.tags?.forEach(tag => {
                if (tag) tagsSet.add(tag);
            });
        });
        return Array.from(tagsSet).sort();
    }, [posts]);

    // Filter posts based on search and tags
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            // Search filter
            const matchesSearch = !searchQuery || 
                (post.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (post.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (post.excerpt?.toLowerCase() || '').includes(searchQuery.toLowerCase());

            // Tags filter
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

                {allTags.length > 0 && (
                    <div className="mb-12">
                        <SearchBar
                            allTags={allTags}
                            onSearchChange={setSearchQuery}
                            onTagsChange={setSelectedTags}
                            locale={locale}
                            type="blog"
                        />
                    </div>
                )}

                <BlogGrid 
                    posts={filteredPosts as any}
                    locale={locale}
                    translations={data?.blog}
                    getLink={getLink}
                />
            </main>
        </PageBackground>
    );
}
