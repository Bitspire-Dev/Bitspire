import Link from 'next/link';
import { tinaField } from 'tinacms/dist/react';
import TagsList from '@/components/ui/composites/TagsList';
import CardTitle from '@/components/ui/composites/CardTitle';
import { Button } from '@/components/ui/primitives/Button';
import { Card, CardAccent, CardContent, CardMedia } from '@/components/ui/primitives/Card';
import { Text } from '@/components/ui/primitives/Text';
import FeaturedImage from '@/components/ui/media/FeaturedImage';
import { formatDate, safeImageSrc, safeLink, toSlug } from '@/lib/ui/helpers';
import { getBlogUiCopy } from '@/lib/ui/blogCopy';

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
    getLink: (path: string) => string;
    isAdmin?: boolean;
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
    getLink,
    isAdmin = false,
    priority = false,
    data
}: BlogCardProps) {
    const copy = getBlogUiCopy(locale);
    const resolvedSlug = slug || toSlug(title);
    const postPath = getLink(`/blog/${resolvedSlug}`);
    const postHref = safeLink(postPath) ?? postPath;
    const formattedDate = formatDate(date, locale) ?? date;
    const imageSrc = safeImageSrc(image);
    const unoptimizedImage = Boolean(imageSrc && imageSrc.startsWith('/') && imageSrc.endsWith('.avif'));
    const isLinked = !isAdmin;

    return (
        <Card
            as="article"
            variant="blue"
            data-tina-field={data ? tinaField(data) : undefined}
        >
            {isLinked && (
                <Link
                    href={postHref}
                    prefetch
                    className="absolute inset-0 z-10"
                    aria-label={title}
                >
                    <span className="sr-only">{title}</span>
                </Link>
            )}
            {/* Image */}
            {imageSrc && (
                <CardMedia>
                    <FeaturedImage
                        src={imageSrc}
                        alt={imageAlt || title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        tinaField={data ? tinaField(data, 'image') : undefined}
                        priority={priority}
                        placeholder={priority ? 'blur' : 'empty'}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized={unoptimizedImage}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                </CardMedia>
            )}

            {/* Content */}
            <CardContent padding="sm">
                {/* Date and Read Time */}
                <div className="flex items-center gap-3 mb-1 text-xs text-slate-500">
                    <time dateTime={date}>
                        <span data-tina-field={data ? tinaField(data, 'date') : undefined}>{formattedDate}</span>
                    </time>
                    {readTime && copy.readTime && (
                        <>
                            <span>•</span>
                            <span data-tina-field={data ? tinaField(data, 'readTime') : undefined}>
                                {copy.readTime.replace('{minutes}', readTime.toString())}
                            </span>
                        </>
                    )}
                </div>

                <CardTitle variant="blue" tinaField={data ? tinaField(data, 'title') : undefined}>
                    {title}
                </CardTitle>

                <Text
                    size="sm"
                    className="md:text-base leading-relaxed mb-4"
                    data-tina-field={data ? tinaField(data, excerpt ? 'excerpt' : 'description') : undefined}
                >
                    {excerpt || description}
                </Text>

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="mb-4">
                        <TagsList tags={tags} variant="blue" maxTags={3} />
                    </div>
                )}

                {/* Read More */}
                {isAdmin ? (
                    <Button asChild variant="link" size="link" className="group/link relative z-20">
                        <Link href={postHref} prefetch>
                            {copy.readMore}
                            <span className="group-hover/link:translate-x-1 transition-transform" aria-hidden>
                                →
                            </span>
                        </Link>
                    </Button>
                ) : (
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:text-cyan-300 transition-colors relative z-20">
                        <span>{copy.readMore}</span>
                        <span className="group-hover:translate-x-1 transition-transform" aria-hidden>
                            →
                        </span>
                    </div>
                )}
            </CardContent>

            {/* Accent line */}
            <CardAccent variant="blue" />
        </Card>
    );
}
