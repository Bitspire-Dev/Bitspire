'use client';

import React from 'react';
import Image from 'next/image';
import { CTAButton } from '@/components/ui/buttons/CTA__button';
import { tinaField } from 'tinacms/dist/react';
import { RichTextLite } from '@/components/ui/tina/RichTextLite';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { safeImageSrc } from '@/lib/ui/helpers';

const HERO_BLUR_DATA_URL =
  'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

interface HeroData {
  title?: Record<string, unknown> | null;
  subtitle?: Record<string, unknown> | null;
  image?: string | null;
  _tina_metadata?: unknown;
  [key: string]: unknown;
}

interface HeroProps {
  data?: HeroData;
  locale?: string;
}

// Hardcoded button texts per locale
const buttonTexts = {
  pl: {
    cta: 'Rozpocznij projekt',
  },
  en: {
    cta: 'Start project',
  },
} as const;

export const Hero: React.FC<HeroProps> = ({ data, locale = 'pl' }) => {
  const texts = buttonTexts[locale as keyof typeof buttonTexts] || buttonTexts.pl;
  const imageSrc = safeImageSrc(data?.image);

  return (
    <section
      className="relative py-20 lg:py-32 overflow-hidden"
      data-tina-field={data ? tinaField(data) : undefined}
    >
      {/* Cybernetic Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Spotlight Effect - Enhanced */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-125 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-screen animate-pulse" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side - Text */}
          <div className="text-center lg:text-left relative z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-blue-500/30 bg-blue-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-200 text-xs font-bold tracking-widest uppercase drop-shadow-sm font-mono">
                System Online
              </span>
            </div>

            <div data-tina-field={data ? tinaField(data, 'title') : undefined}>
              <RichTextLite
                content={data?.title as TinaMarkdownContent | TinaMarkdownContent[]}
                preset="hero-title"
                className="mb-8"
              />
            </div>

            <div data-tina-field={data ? tinaField(data, 'subtitle') : undefined}>
              <RichTextLite
                content={data?.subtitle as TinaMarkdownContent | TinaMarkdownContent[]}
                preset="subtitle"
                className="mb-10 max-w-2xl mx-auto lg:mx-0 border-l-2 border-blue-500/30 pl-6"
              />
            </div>

            {/* Buttons - hardcoded per locale */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <CTAButton>{texts.cta}</CTAButton>
            </div>
          </div>

          {/* Right Side - Visuals */}
          <div className="relative h-96 lg:h-150 flex items-center justify-center perspective-[1000px]">
            {imageSrc ? (
              <div className="relative w-full h-full animate-float transform-3d">
                {/* Cybernetic Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-blue-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-cyan-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse] border-dashed" />

                <div className="absolute inset-0 bg-[linear-gradient(to_top_right,rgba(59,130,246,0.1),rgba(6,182,212,0.1))] rounded-3xl blur-3xl -z-10" />
                <Image
                  src={imageSrc}
                  alt="Hero illustration"
                  width={1200}
                  height={900}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-full object-contain filter-[drop-shadow(0_0_50px_rgba(59,130,246,0.3))]"
                  data-tina-field={data ? tinaField(data, 'image') : undefined}
                  priority
                  placeholder="blur"
                  blurDataURL={HERO_BLUR_DATA_URL}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
