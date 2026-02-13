'use client';

import React, { useState } from 'react';
import { tinaField } from 'tinacms/dist/react';
import { RichText } from '@tina/richTextPresets';
import { safeImageSrc } from '@/lib/ui/helpers';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLocale } from 'next-intl';
import { buildLocalePath } from '@/lib/seo/metadata';
import type { Locale } from '@/i18n/locales';
import { getTranslations } from '@/i18n/translations';

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
  const [currentIndex, setCurrentIndex] = useState(1);
  const locale = useLocale() as Locale;
  const t = getTranslations(locale);
  const controlLabels = {
    prev: t.carousel.prev,
    next: t.carousel.next,
  };
  
  if (!data) return null;

  // Filter out any items that don't have a project or valid project data
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

  // Ensure we have at least 3 items for the carousel effect by duplicating if needed?
  // User asked to show 3 selected projects. I'll assume they select 3.
  // If they select < 3, we just show them centered.
  
  // Safe circular index
  const getIndex = (idx: number) => {
    const len = projects.length;
    return ((idx % len) + len) % len;
  };

  const handleNext = () => {
    setCurrentIndex((prev) => getIndex(prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => getIndex(prev - 1));
  };

  return (
    <section className="-mt-12 py-16 md:py-20 bg-brand-bg text-brand-fg overflow-visible relative" data-tina-field={tinaField(data)}>

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
          className="relative h-125 flex items-center justify-center perspective-1000"
        >
          <AnimatePresence mode='popLayout'>
            {[-1, 0, 1].map((offset) => {
              const index = getIndex(currentIndex + offset);
              const project = projects[index];
              if (!project) return null;

              // Determine visual state based on offset
              const isCenter = offset === 0;
              
              // Only render 3 items: prev, current, next
              // If we have fewer than 3 items, the logic might need adjustment but for 3 selects it's fine.
              
              const xOffset = offset * 320; // 320px spacing
              const scale = isCenter ? 1.1 : 0.85;
              const opacity = isCenter ? 1 : 0.5;
              const zIndex = isCenter ? 10 : 0;
              const rotateY = offset * -25; // slight rotation for "3D" feel

              const imageUrl = safeImageSrc(project.image) || '/blog/web-design-mistakes.avif'; // fallback
              const slug = project.slug || project._sys?.filename;

              return (
                <motion.div
                  key={`${project._sys?.filename}-${index}`}
                  layoutId={project._sys?.filename}
                  initial={{ x: xOffset, scale, opacity, zIndex, rotateY }}
                  animate={{ 
                    x: xOffset, 
                    scale, 
                    opacity, 
                    zIndex,
                    rotateY
                  }}
                  transition={{ 
                    duration: 0.5, 
                    ease: "circOut" 
                  }}
                  style={{
                    position: 'absolute',
                    width: '350px', 
                    // height: '450px',
                  }}
                  className="rounded-2xl cursor-pointer"
                  onClick={() => {
                    if (offset !== 0) setCurrentIndex(index);
                  }}
                >
                  <div className="bg-brand-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
                     {/* Image */}
                     <div className="relative h-64 w-full overflow-hidden">
                        <Image 
                            src={imageUrl} 
                            alt={project.title || 'Project'} 
                            fill
                            className="object-cover"
                        />
                     </div>
                     {/* Content */}
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
                </motion.div>
              );
            })}
          </AnimatePresence>
          
           {/* Controls */}
           <button 
             onClick={handlePrev}
             className="absolute left-4 md:left-10 z-20 p-3 rounded-full bg-black/30 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors"
             aria-label={controlLabels.prev}
           >
             <span className="sr-only">{controlLabels.prev}</span>
             <FaChevronLeft className="text-white text-xl" />
           </button>
           <button 
             onClick={handleNext}
             className="absolute right-4 md:right-10 z-20 p-3 rounded-full bg-black/30 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors"
             aria-label={controlLabels.next}
           >
             <span className="sr-only">{controlLabels.next}</span>
             <FaChevronRight className="text-white text-xl" />
           </button>
        </motion.div>
      </div>
    </section>
  );
}
