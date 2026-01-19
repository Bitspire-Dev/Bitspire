import { tinaField } from 'tinacms/dist/react';
import MetaBadge from '@/components/ui/MetaBadge';
import { formatDate } from '@/lib/ui/helpers';

interface BlogPostHeaderProps {
    title: string;
    description: string;
    category?: string | null;
    readTime?: number | null;
    author: string;
    date: string;
    locale: string;
    data?: Record<string, unknown>;
    translations?: {
        by?: string;
        readTime?: string;
        publishedOn?: string;
    } | null;
    translationsTinaFields?: {
        by?: string;
        readTime?: string;
        publishedOn?: string;
    };
    authorTinaField?: string;
}

export default function BlogPostHeader({ 
    title, 
    description, 
    category, 
    readTime, 
    author, 
    date,
    locale,
    data,
    translations,
    translationsTinaFields,
    authorTinaField
}: BlogPostHeaderProps) {
    const formattedDate = formatDate(date, locale) ?? date;

    const labels = {
        by: translations?.by,
        readTime: translations?.readTime,
        publishedOn: translations?.publishedOn,
    };

    return (
        <>
            {/* Category & Read Time */}
            <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                {category && (
                    <MetaBadge 
                        label={category} 
                        variant="blue"
                        tinaField={data ? tinaField(data, 'category') : undefined}
                    />
                )}
                {readTime && labels.readTime && (
                    <span 
                        className="text-sm text-slate-400"
                        data-tina-field={data ? tinaField(data, 'readTime') : undefined}
                    >
                        <span data-tina-field={translationsTinaFields?.readTime}>
                            {labels.readTime.replace('{minutes}', readTime.toString())}
                        </span>
                    </span>
                )}
            </div>

            {/* Title */}
            <h1 
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight wrap-break-word overflow-wrap-anywhere text-center md:text-left"
                data-tina-field={data ? tinaField(data, 'title') : undefined}
            >
                {title}
            </h1>

            {/* Description */}
            <p 
                className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 wrap-break-word overflow-wrap-anywhere text-center md:text-left"
                data-tina-field={data ? tinaField(data, 'description') : undefined}
            >
                {description}
            </p>

            {/* Meta info */}
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-400 mb-8 pb-8 border-b border-slate-700/50">
                <span>
                    {labels.by && (
                        <span data-tina-field={translationsTinaFields?.by}>
                            {labels.by}{' '}
                        </span>
                    )}
                    <span data-tina-field={authorTinaField}>{author}</span>
                </span>
                <span>•</span>
                <span data-tina-field={data ? tinaField(data, 'date') : undefined}>
                    {labels.publishedOn ? (
                        <>
                            <span data-tina-field={translationsTinaFields?.publishedOn}>
                                {labels.publishedOn}{' '}
                            </span>
                            {formattedDate}
                        </>
                    ) : (
                        formattedDate
                    )}
                </span>
            </div>
        </>
    );
}
