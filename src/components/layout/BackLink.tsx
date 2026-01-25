import Link from 'next/link';
import { buildAdminLink, type AdminLinkMode } from '@/lib/routing/adminLink';

interface BackLinkProps {
    href: string;
    label?: string;
    tinaField?: string;
    locale?: string;
    linkMode?: AdminLinkMode;
}

export default function BackLink({ href, label, tinaField, locale = 'pl', linkMode = 'production' }: BackLinkProps) {
    
    if (!label) return null;

    const linkHref = buildAdminLink(href, { locale, mode: linkMode });
    
    return (
        <Link 
            href={linkHref}
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
