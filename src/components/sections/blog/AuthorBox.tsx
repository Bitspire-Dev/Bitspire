'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminLink } from '@/hooks/useAdminLink';

interface AuthorBoxProps {
    author?: string;
    authorBox?: {
        title?: string;
        bio?: string;
        contact?: string;
    };
    tinaFields?: {
        author?: string;
        title?: string;
        bio?: string;
        contact?: string;
    };
}

export default function AuthorBox({ author, authorBox, tinaFields }: AuthorBoxProps) {
    const { getLink } = useAdminLink();

    if (!author || !authorBox) {
        return null;
    }

    return (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    {author.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white" data-tina-field={tinaFields?.author}>{author}</h3>
                    <p className="text-xs text-slate-400" data-tina-field={tinaFields?.title}>{authorBox.title}</p>
                </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4" data-tina-field={tinaFields?.bio}>
                {authorBox.bio}
            </p>
            <Link
                href={getLink('/')}
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors group"
                data-tina-field={tinaFields?.contact}
            >
                {authorBox.contact}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </div>
    );
}
