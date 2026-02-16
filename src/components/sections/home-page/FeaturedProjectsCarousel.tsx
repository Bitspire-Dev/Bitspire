'use client';

import React from 'react';
import { tinaField } from 'tinacms/dist/react';
import { RichText } from '@tina/richTextPresets';
import { safeImageSrc } from '@/lib/ui/helpers';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { useLocale } from 'next-intl';
import { buildLocalePath } from '@/lib/seo/metadata';
import type { Locale } from '@/i18n/locales';
import { getTranslations } from '@/i18n/translations';
import Carousel3D from '@/components/ui/composites/Carousel3D';

interface PortfolioProject {
  title?: string;
  excerpt?: string;
  description?: string | null;
  image?: string;
  slug?: string;
  _sys?: {
    filename?: string;
    relativePath?: string;
  };
}

interface PortfolioHighlightsItem {
  project?: PortfolioProject | string; // Could be string path if not expanded
}

interface PortfolioHighlightsData {
  title?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  subtitle?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  projects?: PortfolioHighlightsItem[] | null;
  [key: string]: unknown;
}

interface PortfolioHighlightsProps {
  data?: PortfolioHighlightsData;
  projectsIndex?: Array<Record<string, unknown>>;
}

function toSlug(value?: string | null) {
  if (!value) return '';
  return value.replace(/^content\/portfolio\//, '').replace(/\.mdx$/, '').split('/').pop() || '';
}

function titleFromSlug(slug: string) {
  if (!slug) return 'Project';
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeIndexProject(item: Record<string, unknown>): PortfolioProject {
  const sys = item._sys as { filename?: string; relativePath?: string } | undefined;
  return {
    title: typeof item.title === 'string' ? item.title : undefined,
    excerpt: typeof item.excerpt === 'string' ? item.excerpt : undefined,
    description: typeof item.description === 'string' ? item.description : undefined,
    image: typeof item.image === 'string' ? item.image : undefined,
    slug: typeof item.slug === 'string' ? item.slug : sys?.filename?.replace(/\.mdx$/, ''),
    _sys: sys,
  };
}

export default function FeaturedProjectsCarousel({ data, projectsIndex }: PortfolioHighlightsProps) {
  const locale = useLocale() as Locale;
  const t = getTranslations(locale);
  const controlLabels = {
    prev: t.carousel.prev,
    next: t.carousel.next,
  };

  if (!data) return null;

  const indexLookup = (projectsIndex || [])
    .map(item => normalizeIndexProject(item))
    .reduce<Record<string, PortfolioProject>>((acc, item) => {
      const slug = item.slug || item._sys?.filename || '';
      const relative = item._sys?.relativePath || '';
      if (slug) acc[slug] = item;
      if (relative) acc[relative.replace(/\.mdx$/, '')] = item;
      return acc;
    }, {});

  const projects = (data.projects || [])
    .map(item => {
      if (typeof item.project === 'object' && item.project) {
        return item.project as PortfolioProject;
      }

      if (typeof item.project === 'string') {
        const slug = toSlug(item.project);
        return (
          indexLookup[slug] ||
          indexLookup[item.project.replace(/\.mdx$/, '')] ||
          {
            slug,
            title: titleFromSlug(slug),
          }
        );
      }

      return null;
    })
    .filter((p): p is PortfolioProject => p !== null);

  if (projects.length === 0) return null;

  return (
    <section className="pt-0 pb-12 md:pt-0 md:pb-16 lg:pt-0 lg:pb-16 bg-brand-bg text-brand-fg overflow-visible relative" data-tina-field={tinaField(data)}>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          key={`portfolio-highlights-header-${locale}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12 max-w-2xl mx-auto"
        >
          {data.title && (
            <div className="mb-4" data-tina-field={tinaField(data, 'title')}>
              <RichText content={data.title} />
            </div>
          )}
          {data.subtitle && (
            <div className="text-brand-fg/60 text-lg" data-tina-field={tinaField(data, 'subtitle')}>
              <RichText content={data.subtitle} />
            </div>
          )}
        </motion.div>

        {/* Carousel */}
        <motion.div
          key={`portfolio-highlights-carousel-${locale}`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Carousel3D<PortfolioProject>
            items={projects}
            getKey={(project) => project._sys?.filename || project.slug || 'project'}
            controlLabels={controlLabels}
            renderItem={(project, _index, isCenter) => {
              const imageUrl = safeImageSrc(project.image) || '/blog/web-design-mistakes.avif';
              const slug = project.slug || project._sys?.filename;
              return (
                <div className="bg-brand-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={project.title || 'Project'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <h2 className="text-xl font-bold mb-2 text-white">{project.title}</h2>
                    <p className="text-white/60 text-sm line-clamp-3 mb-4 grow">
                      {project.excerpt || project.description || t.portfolio.viewDetails}
                    </p>
                    <div className={`mt-auto transition-opacity duration-300 ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                      {slug && (
                        <Link
                          href={buildLocalePath(locale, `/portfolio/${slug}`)}
                          className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-accent/80 font-medium text-sm transition-colors"
                        >
                          {t.portfolio.viewProject} <FaArrowRight />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
