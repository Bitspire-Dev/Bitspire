import PageListHeader from '@/components/sections/blog/BlogHeader';

interface PortfolioHeaderProps {
    title?: string;
    description?: string;
    locale?: string;
    data?: Record<string, unknown>;
}

export default function PortfolioHeader({ title, description, locale = 'pl', data }: PortfolioHeaderProps) {
    return (
        <PageListHeader
            badgeLabel="Portfolio"
            title={title}
            description={description}
            data={data}
        />
    );
}
