'use client';

import React from 'react';
import { tinaField } from 'tinacms/dist/react';
import { RichText } from '@tina/richTextPresets';
import { safeImageSrc } from '@/lib/ui/helpers';
import Image from 'next/image';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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

const FeatureCardContent = ({ feature }: { feature: FeatureItem }) => {
    const iconSrc = safeImageSrc(feature.icon || undefined);
    return (
        <>
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
            
            <h2 
              className="text-2xl font-bold mb-3 text-brand-fg group-hover:text-blue-400 transition-colors duration-300 text-center" 
              data-tina-field={tinaField(feature, 'title')}
            >
              {feature.title}
            </h2>
            <p 
                className="text-brand-text-muted leading-relaxed text-base"
                data-tina-field={tinaField(feature, 'description')}
            >
                {feature.description}
            </p>
        </>
    );
};

export default function Features({ data }: FeaturesProps) {
  if (!data) return null;
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const features = data.features || [];

  const getIndex = (idx: number) => {
    const len = features.length;
    if (len === 0) return 0;
    return ((idx % len) + len) % len;
  };

  const handleNext = () => {
    setCurrentIndex((prev) => getIndex(prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => getIndex(prev - 1));
  };

  return (
    <section className="-mt-2.5 py-16 md:py-20 lg:py-24 bg-brand-bg relative z-10 text-brand-fg overflow-visible" data-tina-field={tinaField(data)}>
       {/* Background gradient effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          key={`features-header-${locale}`}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
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
            className="prose prose-invert max-w-none [&>h1]:text-4xl [&>h1]:md:text-5xl [&>h1]:font-bold [&>h1]:leading-tight [&>h2]:text-4xl [&>h2]:md:text-5xl [&>h2]:font-bold [&>h2]:leading-tight mb-6"
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

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 md:gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={`${locale}-${index}`} 
                className="group relative flex flex-col p-6 rounded-2xl border border-blue-500/30 bg-blue-950/20 hover:bg-blue-950/40 hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
            > 
               <FeatureCardContent feature={feature} />
            </motion.div>
          ))}
        </div>

        {/* Mobile 3D Infinite Carousel */}
        <div className="md:hidden relative h-125 flex items-center justify-center perspective-1000">
           <AnimatePresence mode='popLayout'>
            {[-1, 0, 1].map((offset) => {
              const index = getIndex(currentIndex + offset);
              const feature = features[index];
              if (!feature) return null;

              const isCenter = offset === 0;
              // Adjusted parameters to match PortfolioHighlights exactly
              const xOffset = offset * 320; 
              const scale = isCenter ? 1.1 : 0.85;
              const opacity = isCenter ? 1 : 0.5;
              const zIndex = isCenter ? 10 : 0;
              const rotateY = offset * -25;

              const layoutKey = typeof feature.title === 'string' ? feature.title : `feature-${index}`;

              return (
                <motion.div
                  key={`${layoutKey}-${index}`}
                  layoutId={layoutKey}
                  initial={{ x: xOffset, scale, opacity, zIndex, rotateY }}
                  animate={{ 
                    x: xOffset, 
                    scale, 
                    opacity, 
                    zIndex,
                    rotateY,
                    filter: isCenter ? 'blur(0px)' : 'blur(2px)' 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    ease: "circOut" 
                  }}
                  style={{
                    position: 'absolute',
                    width: '350px',
                  }}
                  className="rounded-2xl cursor-pointer"
                  onClick={() => {
                    if (offset !== 0) setCurrentIndex(index);
                  }}
                >
                  <div className={`p-6 rounded-2xl border border-blue-500/30 bg-blue-950/20 backdrop-blur-sm flex flex-col h-full transition-all duration-300 ${isCenter ? 'border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-blue-950/40' : ''}`}>
                    <FeatureCardContent feature={feature} />
                  </div>
                </motion.div>
              );
            })}
           </AnimatePresence>

           {/* Mobile Controls */}
           <button 
             onClick={handlePrev}
            className="absolute left-4 z-20 p-3 rounded-full bg-black/30 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors"
             aria-label="Previous feature"
           >
             <FaChevronLeft className="text-white text-xl" />
           </button>
           <button 
             onClick={handleNext}
             className="absolute right-4 z-20 p-3 rounded-full bg-black/30 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors"
             aria-label="Next feature"
           >
             <FaChevronRight className="text-white text-xl" />
           </button>
        </div>

      </div>
    </section>
  );
}
