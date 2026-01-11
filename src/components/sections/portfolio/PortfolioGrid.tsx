import PortfolioCard from './PortfolioCard';

interface PortfolioProject {
    title?: string | null;
    description?: string | null;
    tags?: (string | null)[] | null;
    year?: string | null;
    image?: string | null;
    imageAlt?: string | null;
    link?: string | null;
}

interface PortfolioGridProps {
    projects: PortfolioProject[];
    data?: Record<string, unknown>;
    translations: {
        noProjects: string;
        viewProject: string;
    };
}

export default function PortfolioGrid({ projects, data, translations: t }: PortfolioGridProps) {
    if (projects.length === 0) {
        return (
            <section aria-label="Portfolio projects" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                <div className="col-span-full text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
                        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-slate-400 text-lg">{t.noProjects}</p>
                </div>
            </section>
        );
    }

    return (
        <section aria-label="Portfolio projects" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {projects.map((project, idx) => {
                if (!project?.title) return null;

                return (
                    <PortfolioCard
                        key={idx}
                        title={project.title}
                        description={project.description}
                        year={project.year}
                        image={project.image}
                        link={project.link}
                        tags={project.tags}
                        index={idx}
                        data={data}
                        translations={t}
                    />
                );
            })}
        </section>
    );
}
