import { SearchBarRouter } from "@/components/ui/composites/SearchBarRouter";
import PageBackground from "@/components/layout/PageBackground";
import PortfolioHeader from "@/components/sections/portfolio/PortfolioHeader";
import PortfolioGrid from "@/components/sections/portfolio/PortfolioGrid";
import { extractTags } from "@/lib/ui/helpers";

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
    projects?: PortfolioProject[];
    locale?: string;
}

interface PortfolioPageWrapperProps {
    data: PortfolioPageData;
    allTags?: string[];
    searchQuery?: string;
    selectedTags?: string[];
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

export default function PortfolioPageWrapper({
    data,
    allTags,
    searchQuery,
    selectedTags,
}: PortfolioPageWrapperProps) {
    const projects = data?.projects || [];
    const locale = (data?.locale as string) || 'pl';
    const t = translations[locale as keyof typeof translations] || translations.en;
    const safeTitle = typeof data?.title === 'string' ? data.title : undefined;
    const safeDescription = typeof data?.description === 'string' ? data.description : undefined;
    const normalizedAllTags = allTags && allTags.length > 0
        ? allTags
        : extractTags(projects);

    return (
        <PageBackground variant="blue">
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-32 pb-16 md:pb-20">
                <PortfolioHeader 
                    title={safeTitle}
                    description={safeDescription}
                    locale={locale}
                    data={data}
                />

                {normalizedAllTags.length > 0 && (
                    <div className="mb-12">
                        <SearchBarRouter
                            allTags={normalizedAllTags}
                            locale={locale}
                            type="portfolio"
                            initialQuery={searchQuery}
                            initialTags={selectedTags}
                        />
                    </div>
                )}

                <PortfolioGrid 
                    projects={projects}
                    data={data}
                    translations={t}
                />
            </main>
        </PageBackground>
    );
}
