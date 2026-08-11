import { Badge } from '@/components/ui/primitives/Badge';

interface TagsListProps {
    tags: (string | null)[];
    variant?: 'blue' | 'cyan';
    maxTags?: number;
    size?: 'sm' | 'md';
}

export default function TagsList({ tags, variant = 'blue', maxTags = 3, size = 'sm' }: TagsListProps) {
    const filteredTags = tags.filter((tag): tag is string => !!tag).slice(0, maxTags);

    if (filteredTags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => (
                <Badge
                    key={tag}
                    variant={variant}
                    size={size}
                    shape="md"
                >
                    {tag}
                </Badge>
            ))}
        </div>
    );
}
