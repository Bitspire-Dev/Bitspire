import Link from 'next/link';
import { useAdminLink } from '@/hooks/useAdminLink';

interface BackLinkProps {
    href: string;
    label?: string;
    tinaField?: string;
}

export default function BackLink({ href, label, tinaField }: BackLinkProps) {
    const { getLink } = useAdminLink();
    
    if (!label) return null;
    
    return (
        <Link 
            href={getLink(href)}
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8 group"
            data-tina-field={tinaField}
        >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {label}
        </Link>
    );
}
