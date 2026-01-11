import Link from 'next/link';
import { tinaField } from 'tinacms/dist/react';
import TagsList from '@/components/ui/TagsList';

interface PortfolioCardProps {
    title: string;
    description?: string | null;
    year?: string | null;
    image?: string | null;
    link?: string | null;
    tags?: (string | null)[] | null;
    index: number;
    data?: Record<string, unknown>;
    translations: {
        viewProject: string;
    };
}

export default function PortfolioCard({ 
    title, 
    description, 
    year, 
    image, 
    link, 
    tags,
    index,
    data,
    translations: t
}: PortfolioCardProps) {
    return (
        <article className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            {/* Image */}
            {image && (
                <div 
                    className="relative w-full aspect-video overflow-hidden rounded-t-2xl"
                    data-tina-field={data ? tinaField(data, `projects.${index}.image`) : undefined}
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top center',
                        margin: 0,
                        padding: 0,
                        display: 'block'
                    }}
                >
                    <div className="absolute inset-0 bg-linear-to-br from-cyan-600/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                </div>
            )}

            {/* Content */}
            <div className="p-6">
                {/* Year Badge */}
                {year && (
                    <div className="flex items-center gap-2 mb-1">
                        <span 
                            className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700"
                            data-tina-field={data ? tinaField(data, `projects.${index}.year`) : undefined}
                        >
                            {year}
                        </span>
                    </div>
                )}

                <h2 
                    className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300 mb-4 leading-tight" 
                    data-tina-field={data ? tinaField(data, `projects.${index}.title`) : undefined}
                >
                    {title}
                </h2>

                <p 
                    className="text-slate-300 text-base leading-relaxed mb-4" 
                    data-tina-field={data ? tinaField(data, `projects.${index}.description`) : undefined}
                >
                    {description}
                </p>

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="mb-4">
                        <TagsList tags={tags} variant="cyan" maxTags={3} />
                    </div>
                )}

                {/* View Project Link */}
                {link && (
                    <Link
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                        data-tina-field={data ? tinaField(data, `projects.${index}.link`) : undefined}
                    >
                        {t.viewProject}
                        <span className="group-hover/link:translate-x-1 transition-transform" aria-hidden>→</span>
                    </Link>
                )}
            </div>

            {/* Accent line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-cyan-500 to-blue-400 group-hover:w-full transition-all duration-500" />
        </article>
    );
}
