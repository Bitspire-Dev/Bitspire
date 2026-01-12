'use client';

import Image from "next/image";
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { tinaField } from 'tinacms/dist/react';
import PageBackground from '@/components/layout/PageBackground';
import BackLink from '@/components/layout/BackLink';
import PortfolioItemHeader from '@/components/sections/portfolio/PortfolioItemHeader';

interface PortfolioItemData {
    title?: string;
    description?: string | null;
    year?: string | null;
    category?: string | null;
    tags?: (string | null)[] | null;
    image?: string | null;
    imageAlt?: string | null;
    link?: string | null;
    body?: Record<string, unknown> | null;
    locale?: string;
    [key: string]: unknown;
}

interface PortfolioItemWrapperProps {
    data: PortfolioItemData;
}

const translations = {
    pl: {
        backToPortfolio: 'Powrót do portfolio',
        viewProject: 'Zobacz projekt',
        year: 'Rok',
    },
    en: {
        backToPortfolio: 'Back to portfolio',
        viewProject: 'View project',
        year: 'Year',
    },
};

export default function PortfolioItemWrapper({ data }: PortfolioItemWrapperProps) {
    const locale = data?.locale || 'pl';
    const t = translations[locale as keyof typeof translations] || translations.en;

    return (
        <PageBackground variant="mixed">
            <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
                <BackLink href="/portfolio" label={t.backToPortfolio} />

                <article>
                    <PortfolioItemHeader
                        title={data.title}
                        description={data.description}
                        category={data.category}
                        year={data.year}
                        data={data}
                        translations={t}
                    />

                    {/* Featured Image */}
                    {data.image && (
                        <div 
                            className="relative w-full h-100 md:h-125 rounded-xl overflow-hidden mb-12 shadow-2xl"
                            data-tina-field={tinaField(data, 'image')}
                        >
                            <Image
                                src={data.image}
                                alt={data.imageAlt || data.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Project Content - Rich Text with Styling */}
                    <div className="prose prose-invert prose-xl max-w-none
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:leading-tight
                        prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-700/30 prose-h2:text-white
                        prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-slate-100
                        prose-h4:text-xl prose-h4:mt-10 prose-h4:mb-4 prose-h4:text-slate-200
                        prose-p:text-slate-300 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-lg
                        prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline prose-a:transition-colors
                        prose-strong:text-white prose-strong:font-bold
                        prose-em:text-slate-300 prose-em:italic
                        prose-ul:my-8 prose-ul:space-y-3 prose-ul:text-slate-300 prose-ul:text-lg
                        prose-ol:my-8 prose-ol:space-y-3 prose-ol:text-slate-300 prose-ol:text-lg
                        prose-li:text-slate-300 prose-li:leading-[1.8] prose-li:my-2
                        prose-li:marker:text-blue-400 prose-li:marker:font-bold
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-800/50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:my-8 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-300 prose-blockquote:text-lg
                        prose-code:text-blue-300 prose-code:bg-slate-800/70 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-base prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                        prose-pre:bg-slate-900/70 prose-pre:border prose-pre:border-slate-700/50 prose-pre:rounded-2xl prose-pre:p-8 prose-pre:my-10 prose-pre:shadow-2xl prose-pre:overflow-x-auto
                        prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-12
                        prose-hr:border-slate-700/30 prose-hr:my-16 prose-hr:border-t-2
                        prose-table:border-collapse prose-table:w-full prose-table:my-10
                        prose-th:bg-slate-800/70 prose-th:p-4 prose-th:text-left prose-th:border prose-th:border-slate-700/50 prose-th:font-bold prose-th:text-slate-100
                        prose-td:p-4 prose-td:border prose-td:border-slate-700/30 prose-td:text-slate-300
                        first:prose-p:text-xl first:prose-p:leading-[1.9] first:prose-p:text-slate-200
                    ">
                        <TinaMarkdown content={data.body} />
                    </div>

                    {/* Tags */}
                    {data.tags && data.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-slate-700/50">
                            <div className="flex flex-wrap gap-2">
                                {data.tags.filter(tag => tag).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-sm text-slate-400 bg-slate-800/50 rounded-full border border-slate-700/50 hover:border-blue-500/50 hover:text-blue-400 transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Project Link */}
                    {data.link && (
                        <div className="mt-12 pt-8 border-t border-slate-700/50">
                            <a
                                href={data.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-8 py-4 shadow-lg shadow-blue-600/30 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:ring-offset-slate-900"
                            >
                                {t.viewProject}
                                <span aria-hidden>→</span>
                            </a>
                        </div>
                    )}
                </article>
            </main>
        </PageBackground>
    );
}
