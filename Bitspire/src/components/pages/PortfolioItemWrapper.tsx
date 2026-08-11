import Image from "next/image";
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import type { PortfolioItemData } from '@/lib/tina/types';
import { tinaField } from 'tinacms/dist/react';
import PageBackground from '@/components/layout/PageBackground';
import BackLink from '@/components/layout/BackLink';
import PortfolioItemHeader from '@/components/sections/portfolio/PortfolioItemHeader';
import { RichText } from '@tina/richTextPresets';

const PORTFOLIO_BLUR_DATA_URL =
    'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

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

    const title = data.title ?? "";
    const description = data.description ?? "";

    const imageSrc = data.image ?? undefined;
    const imageAlt = data.imageAlt ?? data.title ?? "Project image";
    const bodyContent = (data.body ?? []) as TinaMarkdownContent | TinaMarkdownContent[];

    return (
        <PageBackground variant="mixed">
            <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
                <BackLink href="/portfolio" label={t.backToPortfolio} locale={locale} />

                <article>
                    <PortfolioItemHeader
                        title={title}
                        description={description}
                        category={data.category}
                        year={data.year}
                        data={data}
                        translations={t}
                    />

                    {/* Featured Image */}
                    {imageSrc && (
                        <div 
                            className="relative w-full h-100 md:h-125 rounded-xl overflow-hidden mb-12 shadow-2xl"
                            data-tina-field={tinaField(data, 'image')}
                        >
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                width={1200}
                                height={750}
                                sizes="100vw"
                                className="w-full h-full object-cover"
                                priority
                                placeholder="blur"
                                blurDataURL={PORTFOLIO_BLUR_DATA_URL}
                            />
                        </div>
                    )}

                    {/* Project Content - Rich Text */}
                    <div data-tina-field={tinaField(data, 'body')}>
                        <RichText content={bodyContent} preset="body" />
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
