"use client";

import { useMemo, useState } from "react";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import { SearchBar, type SearchTranslations } from "@/components/ui/SearchBar";
import PageBackground from "@/components/layout/PageBackground";
import PortfolioHeader from "@/components/sections/portfolio/PortfolioHeader";
import PortfolioGrid from "@/components/sections/portfolio/PortfolioGrid";

interface PortfolioProject {
    title?: string | null;
    description?: string | null;
    tags?: (string | null)[] | null;
    year?: string | null;
    image?: string | null;
    imageAlt?: string | null;
    link?: string | null;
}

interface PortfolioPageData {
    [key: string]: unknown;
    title?: string | null;
    description?: string | null;
    sectionLabel?: string | null;
    projects?: PortfolioProject[];
    locale?: string;
    body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
    _body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
    searchBar?: {
        portfolio?: SearchTranslations;
    } | null;
}

interface PortfolioPageWrapperProps {
    data: PortfolioPageData;
}

const translations = {
    pl: {
        noProjects: 'Brak projektów.',
        viewProject: 'Zobacz projekt',
        year: 'Rok',
    },
    en: {
        noProjects: 'No projects found.',
        viewProject: 'View project',
        year: 'Year',
    },
};

export default function PortfolioPageWrapper({ data }: PortfolioPageWrapperProps) {
    const projects = data?.projects || [];
    const locale = (data?.locale as string) || 'pl';
    const t = translations[locale as keyof typeof translations] || translations.en;
    const searchTranslations = data?.searchBar?.portfolio as SearchTranslations | undefined;
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Extract all unique tags
    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        projects.forEach(project => {
            project.tags?.forEach(tag => {
                if (tag) tagsSet.add(tag);
            });
        });
        return Array.from(tagsSet).sort();
    }, [projects]);

    // Filter projects based on search and tags
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            // Search filter
            const matchesSearch = !searchQuery || 
                project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchQuery.toLowerCase());

            // Tags filter
            const matchesTags = selectedTags.length === 0 ||
                selectedTags.some(tag => project.tags?.some(projectTag => projectTag === tag));

            return matchesSearch && matchesTags;
        });
    }, [projects, searchQuery, selectedTags]);

    return (
        <PageBackground variant="cyan">
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
                <PortfolioHeader 
                    title={data?.title}
                    description={data?.description}
                    sectionLabel={data?.sectionLabel}
                    data={data}
                />

                {allTags.length > 0 && (
                    <div className="mb-12">
                        <SearchBar
                            allTags={allTags}
                            onSearchChange={setSearchQuery}
                            onTagsChange={setSelectedTags}
                            locale={locale}
                            type="portfolio"
                            translations={searchTranslations}
                            tinaFields={data ? {
                                searchPlaceholder: tinaField(data, 'searchBar.portfolio.searchPlaceholder'),
                                clearSearch: tinaField(data, 'searchBar.portfolio.clearSearch'),
                                filterByTech: tinaField(data, 'searchBar.portfolio.filterByTech'),
                                clearFilters: tinaField(data, 'searchBar.portfolio.clearFilters'),
                                showLess: tinaField(data, 'searchBar.portfolio.showLess'),
                                showMore: tinaField(data, 'searchBar.portfolio.showMore'),
                                activeFilters: tinaField(data, 'searchBar.portfolio.activeFilters'),
                                removeFilter: tinaField(data, 'searchBar.portfolio.removeFilter'),
                            } : undefined}
                        />
                    </div>
                )}

                <PortfolioGrid 
                    projects={filteredProjects}
                    data={data}
                    translations={t}
                />
            </main>
        </PageBackground>
    );
}
