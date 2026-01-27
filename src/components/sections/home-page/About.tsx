'use client';

import React from 'react';
import { tinaField } from 'tinacms/dist/react';
import { RichTextLite } from '@tina/richTextPresets';
import { safeImageSrc } from '@/lib/ui/helpers';
import Image from 'next/image';

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

  return (
    <section className="w-full py-section lg:pt-64 overflow-hidden bg-brand-bg relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div 
            className="relative order-1 lg:order-1"
            data-tina-field={tinaField(data, 'image')}
          >
            {imageSrc && (
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={imageSrc}
                  alt={data.imageAlt || "About section image"}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>

          {/* Content Column */}
          <div className="flex flex-col gap-6 order-2 lg:order-2">
            
            {data.label && (
              <div
                className="inline-flex w-fit items-center gap-2 px-3 py-1.5 mb-1 mt-[15px] rounded-full border border-blue-500/30 bg-blue-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]"
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
              className="prose prose-invert max-w-none [&>h1]:text-3xl [&>h1]:md:text-4xl [&>h1]:font-bold [&>h1]:text-brand-fg [&>h1]:leading-tight"
              data-tina-field={tinaField(data, 'title')}
            >
              <RichTextLite content={data.title ?? []} />
            </div>

            <div 
              className="prose prose-invert max-w-none text-brand-text-muted text-base md:text-lg leading-relaxed"
              data-tina-field={tinaField(data, 'description')}
            >
              <RichTextLite content={data.description ?? []} />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
