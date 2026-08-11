import { Badge } from '@/components/ui/primitives/Badge';

interface MetaBadgeProps {
    label: string;
    variant?: 'blue' | 'cyan' | 'slate';
    tinaField?: string;
}

export default function MetaBadge({ label, variant = 'blue', tinaField }: MetaBadgeProps) {
    return (
        <Badge
            variant={variant}
            size="sm"
            shape="pill"
            className="px-3"
            data-tina-field={tinaField}
        >
            {label}
        </Badge>
    );
}
