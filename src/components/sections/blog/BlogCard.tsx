import Link from 'next/link';
import Image from 'next/image';
import { tinaField } from 'tinacms/dist/react';
import TagsList from '@/components/ui/TagsList';
import CardTitle from '@/components/ui/CardTitle';
import { formatDate, safeLink, toSlug } from '@/lib/ui/helpers';

interface BlogCardProps {
    title: string;
    slug: string;
    excerpt?: string | null;
    description?: string;
    image?: string | null;
    imageAlt?: string | null;
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
    priority?: boolean;
    data?: Record<string, unknown>;
}

export default function BlogCard({ 
    title, 
    slug, 
    excerpt, 
    description,
    image, 
    imageAlt,
    date, 
    readTime, 
    tags,
    locale,
    translations,
    getLink,
    priority = false,
    data
}: BlogCardProps) {
    const blurDataUrl =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjE4IiBmaWxsPSIjMGYxNzJhIi8+PC9zdmc+';
    const resolvedSlug = slug || toSlug(title);
    const postPath = getLink(`/blog/${resolvedSlug}`);
    const postHref = safeLink(postPath) ?? postPath;
    const formattedDate = formatDate(date, locale) ?? date;

    return (
        <article
            className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            data-tina-field={data ? tinaField(data) : undefined}
        >
            {/* Image */}
            {image && (
                <Link href={postHref} prefetch={false}>
                    <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl">
                        <Image
                            src={image}
                            alt={imageAlt || title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            priority={priority}
                            placeholder="blur"
                            blurDataURL={blurDataUrl}
                        />
                        <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                    </div>
                </Link>
            )}

            {/* Content */}
            <div className="p-5 md:p-6">
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

                <Link href={postHref} prefetch={false}>
                    <CardTitle
                        variant="blue"
                        tinaField={data ? tinaField(data, 'title') : undefined}
                    >
                        {title}
                    </CardTitle>
                </Link>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4" data-tina-field={data ? tinaField(data, excerpt ? 'excerpt' : 'description') : undefined}>
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
                    href={postHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group/link"
                    prefetch={false}
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
