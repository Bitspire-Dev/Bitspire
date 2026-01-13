import Link from 'next/link';
import { tinaField } from 'tinacms/dist/react';
import TagsList from '@/components/ui/TagsList';

interface BlogCardProps {
    title: string;
    slug: string;
    excerpt?: string | null;
    description?: string;
    image?: string | null;
    date: string;
    readTime?: number | null;
    tags?: (string | null)[] | null;
    locale: string;
    translations?: {
        readMore?: string | null;
        readTime?: string | null;
        by?: string | null;
    } | null;
    getLink: (path: string) => string;
    data?: Record<string, unknown>;
}

export default function BlogCard({ 
    title, 
    slug, 
    excerpt, 
    description,
    image, 
    date, 
    readTime, 
    tags,
    locale,
    translations,
    getLink,
    data
}: BlogCardProps) {
    const formattedDate = new Date(date).toLocaleDateString(
        locale === 'pl' ? 'pl-PL' : 'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    );

    return (
        <article
            className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            data-tina-field={data ? tinaField(data) : undefined}
        >
            {/* Image */}
            {image && (
                <Link href={getLink(`/blog/${slug}`)}>
                    <div 
                        className="relative w-full aspect-video overflow-hidden rounded-t-2xl"
                        style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'top center',
                            margin: 0,
                            padding: 0,
                            display: 'block'
                        }}
                    >
                        <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                    </div>
                </Link>
            )}

            {/* Content */}
            <div className="p-6">
                {/* Date and Read Time */}
                <div className="flex items-center gap-3 mb-1 text-xs text-slate-500">
                    <time dateTime={date}>
                        <span data-tina-field={data ? tinaField(data, 'date') : undefined}>{formattedDate}</span>
                    </time>
                    {readTime && translations?.readTime && (
                        <>
                            <span>•</span>
                            <span data-tina-field={data ? tinaField(data, 'readTime') : undefined}>
                                {translations.readTime.replace('{minutes}', readTime.toString())}
                            </span>
                        </>
                    )}
                </div>

                <Link href={getLink(`/blog/${slug}`)}>
                    <h2
                        className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300 mb-4 leading-tight"
                        data-tina-field={data ? tinaField(data, 'title') : undefined}
                    >
                        {title}
                    </h2>
                </Link>

                <p className="text-slate-300 text-base leading-relaxed mb-4" data-tina-field={data ? tinaField(data, excerpt ? 'excerpt' : 'description') : undefined}>
                    {excerpt || description}
                </p>

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="mb-4">
                        <TagsList tags={tags} variant="blue" maxTags={3} />
                    </div>
                )}

                {/* Read More Link */}
                <Link
                    href={getLink(`/blog/${slug}`)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group/link"
                >
                    {translations?.readMore}
                    <span className="group-hover/link:translate-x-1 transition-transform" aria-hidden>→</span>
                </Link>
            </div>

            {/* Accent line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-500" />
        </article>
    );
}
