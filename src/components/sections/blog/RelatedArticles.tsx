'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminLink } from '@/hooks/useAdminLink';
import { Button } from '@/components/ui/primitives/Button';
import { Card, CardAccent, CardContent, CardMedia } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import FeaturedImage from '@/components/ui/media/FeaturedImage';
import { safeImageSrc } from '@/lib/ui/helpers';

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
          <Heading as="h2" size="2xl" className="text-3xl md:text-4xl mb-3" data-tina-field={tinaFields?.sectionTitle}>
            {sectionTitle}
          </Heading>
          <div className="w-20 h-1 bg-linear-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={getLink(`/${type}/${article.slug}`)}
              prefetch
              className="block"
            >
              <Card as="article" variant="blue">
                {/* Image */}
                {safeImageSrc(article.image) && (
                  <CardMedia>
                    <FeaturedImage
                      src={safeImageSrc(article.image) as string}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                  </CardMedia>
                )}

                {/* Content */}
                <CardContent padding="sm">
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

                  <Heading
                    as="h3"
                    size="lg"
                    className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300 mb-4 leading-tight"
                  >
                    {article.title}
                  </Heading>

                  {article.excerpt && (
                    <Text size="sm" className="md:text-base leading-relaxed mb-4">
                      {article.excerpt}
                    </Text>
                  )}

                  {/* Read More Link */}
                  {readMoreLabel && (
                    <Button asChild variant="link" size="link" className="group/link" data-tina-field={tinaFields?.readMoreLabel}>
                      <span aria-hidden>
                        {readMoreLabel}
                        <span className="group-hover/link:translate-x-1 transition-transform" aria-hidden>→</span>
                      </span>
                    </Button>
                  )}
                </CardContent>

                {/* Accent line */}
                <CardAccent variant="blue" />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
