'use client';

import React from 'react';
import { tinaField } from 'tinacms/dist/react';
import { RichText } from '@tina/richTextPresets';
import { safeImageSrc } from '@/lib/ui/helpers';
import Image from 'next/image';
import {
  FADE_UP_VARIANTS,
  MOTION_VIEWPORT,
  SECTION_STAGGER_VARIANTS,
  motion,
  useReducedMotion,
} from '@/lib/ui/motion';

import { TinaMarkdownContent } from 'tinacms/dist/rich-text';

interface AboutData {
  label?: string | null;
  title?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  description?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  image?: string | null;
  imageAlt?: string | null;
  [key: string]: unknown;
}

interface AboutProps {
  data: AboutData;
}

export const About: React.FC<AboutProps> = ({ data }) => {
  const imageSrc = safeImageSrc(data.image);
  const reduceMotion = useReducedMotion();
  const splitVariants = {
    hidden: { opacity: 0, x: 42 },
    visible: { opacity: 1, x: 0 },
  };
  const leftVariants = {
    hidden: { opacity: 0, x: -42 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="w-full pt-0 mt-5 pb-4 md:mt-8 md:pt-20 md:pb-6 lg:mt-18 lg:pt-48 lg:pb-8 overflow-visible bg-brand-bg relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={SECTION_STAGGER_VARIANTS}
          initial={reduceMotion ? false : 'hidden'}
          whileInView={reduceMotion ? undefined : 'visible'}
          viewport={reduceMotion ? undefined : MOTION_VIEWPORT}
        >
          {/* Image Column */}
          <motion.div
            className="relative z-20 order-1 lg:order-1"
            data-tina-field={tinaField(data, 'image')}
            variants={leftVariants}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
          >
            {imageSrc && (
              <div className="relative z-20 rounded-lg overflow-hidden shadow-2xl aspect-square">
                <Image
                  src={imageSrc}
                  alt={data.imageAlt || "About section image"}
                  fill
                  className="w-full h-full object-contain"
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 800px"
                  quality={80}
                  priority={false}
                />
              </div>
            )}
          </motion.div>

          {/* Content Column */}
          <motion.div
            className="flex flex-col gap-6 order-2 lg:order-2 lg:translate-y-10"
            variants={splitVariants}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
          >
            <motion.div variants={SECTION_STAGGER_VARIANTS}>
            
            {data.label && (
              <motion.div
                className="inline-flex w-fit items-center gap-2 px-3 py-1.5 mb-1 mt-7 rounded-full border border-blue-500/30 bg-blue-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                data-tina-field={tinaField(data, 'label')}
                variants={FADE_UP_VARIANTS}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-blue-200 text-xs font-bold tracking-widest uppercase drop-shadow-sm font-mono">
                  {data.label}
                </span>
              </motion.div>
            )}

            <motion.div  
              className="prose prose-invert max-w-none [&>h1]:text-3xl [&>h1]:md:text-4xl [&>h1]:font-bold [&>h1]:text-brand-fg [&>h1]:leading-tight [&>h2]:text-3xl [&>h2]:md:text-4xl [&>h2]:font-bold [&>h2]:text-brand-fg [&>h2]:leading-tight"
              data-tina-field={tinaField(data, 'title')}
              variants={FADE_UP_VARIANTS}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
            >
              <RichText content={data.title ?? []} />
            </motion.div>

            <motion.div 
              className="prose prose-invert max-w-none text-brand-text-muted text-base md:text-lg leading-relaxed"
              data-tina-field={tinaField(data, 'description')}
              variants={FADE_UP_VARIANTS}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
            >
              <RichText content={data.description ?? []} />
            </motion.div>

            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
