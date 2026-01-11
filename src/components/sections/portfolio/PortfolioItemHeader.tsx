import { tinaField } from 'tinacms/dist/react';
import MetaBadge from '@/components/ui/MetaBadge';

interface PortfolioItemHeaderProps {
    title: string;
    description: string;
    category?: string | null;
    year?: string | null;
    data?: Record<string, unknown>;
    translations: {
        year: string;
    };
}

export default function PortfolioItemHeader({ 
    title, 
    description, 
    category, 
    year,
    data,
    translations: _t 
}: PortfolioItemHeaderProps) {
    return (
        <>
            {/* Category & Year */}
            <div className="flex items-center gap-4 mb-4">
                {category && (
                    <MetaBadge 
                        label={category} 
                        variant="blue"
                        tinaField={data ? tinaField(data, 'category') : undefined}
                    />
                )}
                {year && (
                    <span 
                        className="text-sm text-slate-400"
                        data-tina-field={data ? tinaField(data, 'year') : undefined}
                    >
                        {year}
                    </span>
                )}
            </div>

            {/* Title */}
            <h1 
                className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
                data-tina-field={data ? tinaField(data, 'title') : undefined}
            >
                {title}
            </h1>

            {/* Description */}
            <p 
                className="text-xl text-slate-300 mb-8"
                data-tina-field={data ? tinaField(data, 'description') : undefined}
            >
                {description}
            </p>
        </>
    );
}
