'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminLink } from '@/hooks/useAdminLink';

interface Article {
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  date?: string;
  readTime?: number | null;
}

interface RelatedArticlesProps {
  articles: Article[];
  currentSlug: string;
  locale: string;
  type?: 'blog' | 'portfolio';
  sectionTitle?: string;
  readMoreLabel?: string;
  readTimeLabel?: string;
  tinaFields?: {
    sectionTitle?: string;
    readMoreLabel?: string;
    readTimeLabel?: string;
  };
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ 
  articles, 
  currentSlug, 
  locale,
  type = 'blog',
  sectionTitle,
  readMoreLabel,
  readTimeLabel,
  tinaFields
}) => {
  const { getLink } = useAdminLink();
  const blurDataUrl =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjE4IiBmaWxsPSIjMGYxNzJhIi8+PC9zdmc+';
  // Filter out current article and limit to 3
  const filteredArticles = articles
    .filter(article => article.slug !== currentSlug)
    .slice(0, 3);

  if (filteredArticles.length === 0) {
    return null;
  }

  return (
  <section className="py-12 md:py-16 px-4 bg-slate-900/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" data-tina-field={tinaFields?.sectionTitle}>
            {sectionTitle}
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={getLink(`/${type}/${article.slug}`)}
            >
              <article className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                {/* Image */}
                {article.image && (
                  <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      placeholder="blur"
                      blurDataURL={blurDataUrl}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                  </div>
                )}

                {/* Content */}
                <div className="p-5 md:p-6">
                  {/* Date and Read Time */}
                  {article.date && (
                    <div className="flex items-center gap-3 mb-1 text-xs text-slate-500">
                      <time dateTime={article.date}>
                        {new Date(article.date).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      {article.readTime && readTimeLabel && (
                        <>
                          <span>•</span>
                          <span data-tina-field={tinaFields?.readTimeLabel}>
                            {readTimeLabel.replace('{minutes}', article.readTime.toString())}
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300 mb-4 leading-tight">
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Read More Link */}
                  {readMoreLabel && (
                    <span
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group/link"
                      data-tina-field={tinaFields?.readMoreLabel}
                    >
                      {readMoreLabel}
                      <span className="group-hover/link:translate-x-1 transition-transform" aria-hidden>→</span>
                    </span>
                  )}
                </div>

                {/* Accent line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-500" />
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
