"use client";

import { useMemo, useState, type ReactNode } from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import { SearchBar, type SearchTranslations } from "@/components/ui/SearchBar";
import PageBackground from "@/components/layout/PageBackground";
import PortfolioHeader from "@/components/sections/portfolio/PortfolioHeader";
import PortfolioGrid from "@/components/sections/portfolio/PortfolioGrid";
import { extractBody, hasBodyContent } from "@/lib/tina/body";

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
                    className="opacity-0 group-hover:opacity-100 text-cyan-400 hover:text-cyan-300 transition text-sm"
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
        <a href={href} className="text-cyan-400 hover:text-cyan-300 underline">
            {children}
        </a>
    ),
};

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
    const body = extractBody(data);
    const hasBody = hasBodyContent(body);

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

                {hasBody && (
                    <article
                        className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-md leading-relaxed text-slate-200 mb-12"
                        data-tina-field={tinaField(data, 'body')}
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
                            type="portfolio"
                            translations={searchTranslations}
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
