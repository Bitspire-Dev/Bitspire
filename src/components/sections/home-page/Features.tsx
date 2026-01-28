'use client';

import React from 'react';
import { tinaField } from 'tinacms/dist/react';
import { RichText } from '@tina/richTextPresets';
import { safeImageSrc } from '@/lib/ui/helpers';
import Image from 'next/image';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';

type FeatureItem = Record<string, unknown> & {
  icon?: string | null;
  title?: string | null;
  description?: string | null;
};

interface FeaturesData {
  label?: string | null;
  title?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  subtitle?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  features?: FeatureItem[] | null;
  [key: string]: unknown;
}

interface FeaturesProps {
  data?: FeaturesData;
}

export default function Features({ data }: FeaturesProps) {
  if (!data) return null;
  const locale = useLocale();

  return (
    <section className="py-section pt-32 lg:pt-40 bg-brand-bg relative z-10 text-brand-fg overflow-hidden" data-tina-field={tinaField(data)}>
       {/* Background gradient effects similar to other sections if needed, or keeping it clean */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          key={`features-header-${locale}`}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {data.label && (
             <div
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-blue-500/30 bg-blue-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                data-tina-field={tinaField(data, 'label')}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-blue-200 text-xs font-bold tracking-widest uppercase drop-shadow-sm font-mono">
                  {data.label}
                </span>
              </div>
          )}
          
          <div 
            data-tina-field={tinaField(data, 'title')} 
            className="prose prose-invert max-w-none [&>h1]:text-4xl [&>h1]:md:text-5xl [&>h1]:font-bold [&>h1]:leading-tight mb-6"
          >
             {data.title && <RichText content={data.title} />}
          </div>

          <div 
            data-tina-field={tinaField(data, 'subtitle')}
            className="prose prose-invert max-w-none text-brand-text-muted text-lg md:text-xl leading-relaxed"
          >
              {data.subtitle && <RichText content={data.subtitle} />}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
          {data.features?.map((feature, index) => {
            const iconSrc = safeImageSrc(feature.icon || undefined);
            return (
            <motion.div 
              key={`${locale}-${index}`} 
                className="group relative flex flex-col p-6 rounded-2xl border border-blue-500/30 bg-blue-950/20 hover:bg-blue-950/40 hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
            > 
                {/* Image Container */}
              <div 
                className="w-full aspect-4/3 mb-6 relative overflow-hidden rounded-xl bg-blend-multiply bg-brand-surface-2/50 shadow-inner"
                data-tina-field={tinaField(feature, 'icon')}
              >
                 {iconSrc ? (
                    <Image
                        src={iconSrc}
                        alt={feature.title || "Feature icon"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-text-muted/20">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                 )}
              </div>
              
              <h3 
                className="text-2xl font-bold mb-3 text-brand-fg group-hover:text-blue-400 transition-colors duration-300 text-center" 
                data-tina-field={tinaField(feature, 'title')}
              >
                {feature.title}
              </h3>
              <p 
                className="text-brand-text-muted leading-relaxed text-base"
                data-tina-field={tinaField(feature, 'description')}
              >
                {feature.description}
              </p>
            </motion.div>
          );})}
        </div>
      </div>
    </section>
  );
}
