import Link from 'next/link';
import { tinaField } from 'tinacms/dist/react';
import TagsList from '@/components/ui/composites/TagsList';
import CardTitle from '@/components/ui/composites/CardTitle';
import { Badge } from '@/components/ui/primitives/Badge';
import { Button } from '@/components/ui/primitives/Button';
import { Card, CardAccent, CardContent, CardMedia } from '@/components/ui/primitives/Card';
import { Text } from '@/components/ui/primitives/Text';
import FeaturedImage from '@/components/ui/media/FeaturedImage';
import { safeImageSrc, safeLink } from '@/lib/ui/helpers';

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
    const safeHref = safeLink(link);
    const imageSrc = safeImageSrc(image);

    return (
        <Card as="article" variant="blue">
            {/* Image */}
            {imageSrc && (
                <CardMedia
                    data-tina-field={data ? tinaField(data, `projects.${index}.image`) : undefined}
                >
                    <FeaturedImage
                        src={imageSrc}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-cyan-600/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                </CardMedia>
            )}

            {/* Content */}
            <CardContent>
                {/* Year Badge */}
                {year && (
                    <div className="flex items-center gap-2 mb-1">
                        <Badge
                            variant="slate"
                            size="sm"
                            shape="md"
                            data-tina-field={data ? tinaField(data, `projects.${index}.year`) : undefined}
                        >
                            {year}
                        </Badge>
                    </div>
                )}

                <CardTitle
                    variant="blue"
                    tinaField={data ? tinaField(data, `projects.${index}.title`) : undefined}
                >
                    {title}
                </CardTitle>

                <Text
                    size="md"
                    className="leading-relaxed mb-4"
                    data-tina-field={data ? tinaField(data, `projects.${index}.description`) : undefined}
                >
                    {description}
                </Text>

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="mb-4">
                        <TagsList tags={tags} variant="blue" maxTags={3} />
                    </div>
                )}

                {/* View Project Link */}
                {safeHref && (
                    <Button asChild variant="link" size="link" className="group/link text-blue-400 hover:text-blue-300">
                        <Link
                            href={safeHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-tina-field={data ? tinaField(data, `projects.${index}.link`) : undefined}
                        >
                            {t.viewProject}
                            <span className="group-hover/link:translate-x-1 transition-transform" aria-hidden>→</span>
                        </Link>
                    </Button>
                )}
            </CardContent>

            {/* Accent line */}
            <CardAccent variant="blue" />
        </Card>
    );
}
