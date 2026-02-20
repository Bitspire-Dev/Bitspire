'use client';

import React from 'react';
import { Button } from '@/components/ui/primitives/Button';
import { tinaField } from 'tinacms/dist/react';
import { RichText } from '@tina/richTextPresets';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { safeImageSrc } from '@/lib/ui/helpers';
import { Link, resolvePathnameKey } from '@/i18n/routing';
import NextLink from 'next/link';
import { buildLocalePath } from '@/lib/seo/metadata';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';

const HERO_BLUR_DATA_URL =
  'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

interface HeroAction {
  label: string;
  url: string;
  type: 'primary' | 'secondary' | 'outline';
}

interface HeroData {
  title?: Record<string, unknown> | string | null;
  subtitle?: Record<string, unknown> | string | null;
  image?: string | null;
  actions?: HeroAction[] | null;
  _tina_metadata?: unknown;
  [key: string]: unknown;
}

interface HeroProps {
  data?: HeroData;
  locale?: string;
}

export const Hero: React.FC<HeroProps> = ({ data }) => {
  const imageSrc = safeImageSrc(data?.image);
  const titleValue = data?.title;
  const subtitleValue = data?.subtitle;
  const actions = data?.actions || [];
  const locale = useLocale() as Locale;

  const renderTitle = () => {
    if (!titleValue) return null;
    if (typeof titleValue === 'string') {
      return (
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl text-center">
          {titleValue}
        </h1>
      );
    }
      return (
        <RichText
        content={titleValue as TinaMarkdownContent | TinaMarkdownContent[]}
        preset="hero-title"
        className="mb-6 text-center"
      />
    );
  };

  const renderSubtitle = () => {
    if (!subtitleValue) return null;
    if (typeof subtitleValue === 'string') {
      return (
        <p className="text-base md:text-lg lg:text-xl text-brand-text-muted-2 leading-relaxed mb-8 max-w-2xl mx-auto text-center px-4">
          {subtitleValue}
        </p>
      );
    }
    return (
      <RichText
        content={subtitleValue as TinaMarkdownContent | TinaMarkdownContent[]}
        preset="subtitle"
        className="mb-8 max-w-2xl mx-auto text-center px-4"
      />
    );
  };

  return (
    <section
      className="relative min-h-[90dvh] w-full flex flex-col items-center text-white overflow-visible pt-16 md:pt-24 pb-10 justify-start lg:justify-center lg:pt-0 lg:pb-0"
      data-tina-field={data ? tinaField(data) : undefined}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-75 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"
      />

      {/* Content — CSS animation, no JS hydration needed */}
      <div
        className="container mx-auto px-4 relative z-20 flex flex-col items-center justify-start lg:justify-center lg:grow lg:pb-48"
      >
        {/* Badge */}
        <div className="hero-animate hero-animate-delay-1 inline-flex items-center gap-2 px-3 py-1.5 mb-1 mt-4 lg:mt-0 rounded-full border border-blue-500/30 bg-blue-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-blue-200 text-xs font-bold tracking-widest uppercase drop-shadow-sm font-mono">
            System Online
          </span>
        </div>

        <div
          className="hero-animate hero-animate-delay-2 max-w-4xl w-full"
          data-tina-field={data ? tinaField(data, 'title') : undefined}
        >
          {renderTitle()}
        </div>

        <div
          className="hero-animate hero-animate-delay-3 max-w-3xl w-full"
          data-tina-field={data ? tinaField(data, 'subtitle') : undefined}
        >
          {renderSubtitle()}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div
            className="hero-animate hero-animate-delay-4 flex flex-wrap gap-4 justify-center mt-2 relative z-30"
          >
            {actions.map((action, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {(() => {
                  const resolvedPathname = resolvePathnameKey(action.url, locale);
                  const isExternal = /^(https?:)?\/\//.test(action.url) || action.url.startsWith('mailto:') || action.url.startsWith('tel:');
                  const isHashOnly = action.url.startsWith('#');

                  if (resolvedPathname) {
                    return (
                      <Button
                        asChild
                        variant={action.type}
                        size="lg"
                        className="shadow-lg shadow-blue-500/20"
                      >
                        <Link href={resolvedPathname}>{action.label}</Link>
                      </Button>
                    );
                  }

                  if (!isExternal) {
                    const base = isHashOnly ? '/' : action.url;
                    const [pathAndQuery, hash] = base.split('#');
                    const [path, query] = pathAndQuery.split('?');
                    const localizedPath = buildLocalePath(locale as 'pl' | 'en', path || '/');
                    const withQuery = query ? `${localizedPath}?${query}` : localizedPath;
                    const localizedHref = hash ? `${withQuery}#${hash}` : withQuery;

                    return (
                      <Button
                        asChild
                        variant={action.type}
                        size="lg"
                        className="shadow-lg shadow-blue-500/20"
                      >
                        <NextLink href={localizedHref}>{action.label}</NextLink>
                      </Button>
                    );
                  }

                  return (
                    <Button
                      asChild
                      variant={action.type}
                      size="lg"
                      className="shadow-lg shadow-blue-500/20"
                    >
                      <a
                        href={action.url}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noreferrer noopener' : undefined}
                      >
                        {action.label}
                      </a>
                    </Button>
                  );
                })()}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Hero Image — CSS animation, no JS hydration needed */}
      {imageSrc && (
        <div
            className="hero-animate-image relative w-full z-10 flex justify-center mt-2 lg:mt-0 lg:absolute lg:bottom-0 pointer-events-none"
        >
             <div className="w-[120vw] max-w-none shrink-0 translate-y-10 lg:translate-y-[calc(30%+5.25rem)]">
               <div className="relative aspect-video lg:aspect-[1.8/1] w-full">
                   <Image
                    src={imageSrc}
                    alt="Hero illustration"
                    fill
                    className="object-contain object-bottom"
                    sizes="(max-width: 768px) 130vw, (max-width: 1280px) 130vw, 130vw"
                    quality={90}
                    data-tina-field={data ? tinaField(data, 'image') : undefined}
                    priority
                    fetchPriority="high"
                    loading="eager"
                    placeholder="blur"
                    blurDataURL={HERO_BLUR_DATA_URL}
                   />
                  <div
                    className="absolute left-0 right-0 -bottom-25 h-50 z-20 pointer-events-none"
                    style={{
                       background: 'linear-gradient(to bottom, transparent 0%, #020617 50%, transparent 100%)',
                    }}
                  />
               </div>
             </div>
        </div>
      )}
    </section>
  );
};
