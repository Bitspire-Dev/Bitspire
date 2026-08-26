'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { tinaField } from 'tinacms/dist/react';
import type { PagePartsFragment, Project } from '@tina/__generated__/types';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import {
  getProjectHref,
  isPortfolioCategoryId,
  type PortfolioCategoryId,
} from '@/lib/portfolio/categories';
import { Badge } from '@/components/ui/primitives/badge';
import { Button } from '@/components/ui/primitives/button';
import { isUnoptimizedImage } from '@/lib/image';
import { extractContentSlug } from '@/lib/string';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/primitives/card';
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';
import { FadeIn } from '@/components/animations/primitives/fade-in';

interface PortfolioHighlightsProps {
  page: PagePartsFragment;
}

const UI: Record<string, { cta: string; titleFallback: string }> = {
  pl: {
    cta: 'Zobacz case study',
    titleFallback: 'Wybrane case studies',
  },
  en: {
    cta: 'See case study',
    titleFallback: 'Featured case studies',
  },
};

type RawHighlights = NonNullable<PagePartsFragment['portfolioHighlights']>;
type RawItems = NonNullable<RawHighlights['items']>;
type RawItem = NonNullable<RawItems[number]>;
type HighlightItem = RawItem & { project: Project };

function getProjectLink(project: Project, locale: string) {
  const relativePath = project._sys?.relativePath;
  if (!relativePath) {
    return null;
  }

  const parts = relativePath.split('/');
  const category = parts[1];
  const filename = parts[2];

  if (!category || !filename || !isPortfolioCategoryId(category)) {
    return null;
  }

  const slug = extractContentSlug(filename);

  return getProjectHref(locale, category as PortfolioCategoryId, slug);
}

function getSlideOffset(index: number, selected: number, total: number) {
  let diff = index - selected;
  if (diff > 1) diff -= total;
  if (diff < -1) diff += total;
  return diff;
}

function getTweenStyles(offset: number, cardWidth: number) {
  const d = Math.abs(offset);
  const width = cardWidth || 400;
  const scale = 1 - 0.15 * d;
  const rotateY = offset * 45;
  const translateZ = -d * Math.round(width * 0.3);
  const opacity = 1 - 0.35 * d;
  const blur = d * Math.max(2, Math.round(width * 0.005));
  const brightness = 1 - 0.25 * d;
  const zIndex = 10 - Math.round(d * 10);
  const gap = blur + 1;
  const gapPercent = d === 0 ? 0 : (gap / width) * 100;
  const translateX = offset * gapPercent;
  return {
    scale,
    rotateY,
    translateZ,
    opacity,
    blur,
    brightness,
    zIndex,
    translateX,
  };
}

const ProjectCard = memo(function ProjectCard({
  item,
  isCenter,
  locale,
  ui,
}: {
  item: HighlightItem;
  isCenter: boolean;
  locale: string;
  ui: { cta: string };
}): ReactNode {
  const project = item.project;
  const href = getProjectLink(project, locale);
  const technologies = (project.technologies ?? [])
    .filter((tech): tech is string => !!tech)
    .slice(0, isCenter ? 5 : 3);
  const isUnoptimized = isUnoptimizedImage(project.screenshot);

  return (
    <AspectRatio ratio={10 / 14} className="w-full">
      <Card
        data-tina-field={tinaField(item, 'project')}
        className="group/card relative size-full overflow-hidden rounded-lg pt-0 transition-shadow duration-300 hover:shadow-lg"
      >
        <div
          className={cn(
            'relative min-h-0 w-full flex-1 rounded-t-lg bg-muted',
            isUnoptimized && 'bg-muted/50'
          )}
        >
          {project.screenshot ? (
            <Image
              src={project.screenshot}
              alt={project.title}
              fill
              unoptimized={isUnoptimized}
              sizes="(max-width: 768px) 100vw, 45vw"
              className={cn(
                'transition-transform duration-500',
                isUnoptimized
                  ? 'object-contain p-8'
                  : 'object-cover object-top group-hover/card:scale-105'
              )}
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted">
              <span className="font-sans text-xs text-muted-foreground">{project.title}</span>
            </div>
          )}
        </div>

        <CardHeader className="shrink-0 items-start gap-2 px-(--card-spacing)">
          <CardTitle
            as="h3"
            data-tina-field={tinaField(project, 'title')}
            className={cn(
              'font-heading font-medium text-foreground',
              isCenter ? 'text-lg' : 'text-base'
            )}
          >
            {project.title}
          </CardTitle>

          {project.tagline ? (
            <CardDescription
              data-tina-field={tinaField(project, 'tagline')}
              className="line-clamp-1 font-sans text-xs text-muted-foreground"
            >
              {project.tagline}
            </CardDescription>
          ) : null}

          {project.description ? (
            <CardDescription
              data-tina-field={tinaField(project, 'description')}
              className="line-clamp-2 font-sans text-sm text-muted-foreground"
            >
              {project.description}
            </CardDescription>
          ) : null}
        </CardHeader>

        {technologies.length > 0 ? (
          <div className="flex max-h-12 shrink-0 flex-wrap gap-2 overflow-hidden px-(--card-spacing)">
            {technologies.map(tech => (
              <Badge key={tech} variant="secondary" className="font-sans text-[0.625rem]">
                {tech}
              </Badge>
            ))}
          </div>
        ) : null}

        {href ? (
          <CardFooter className="shrink-0 px-(--card-spacing)">
            <Button asChild variant={isCenter ? 'default' : 'outline'} size="sm">
              <Link href={href}>{ui.cta}</Link>
            </Button>
          </CardFooter>
        ) : null}
      </Card>
    </AspectRatio>
  );
});

interface MobileCarouselProps {
  items: HighlightItem[];
  selected: number;
  locale: string;
  ui: { cta: string };
}

const MobileCarousel = memo(function MobileCarousel({
  items,
  selected,
  locale,
  ui,
}: MobileCarouselProps) {
  return (
    <div className="overflow-hidden md:hidden">
      <div
        className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${selected * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={`mobile-${item.project.id}`} className="w-full shrink-0 grow-0 basis-full px-0">
            <ProjectCard item={item} isCenter={index === selected} locale={locale} ui={ui} />
          </div>
        ))}
      </div>
    </div>
  );
});

interface DesktopCarouselProps {
  items: HighlightItem[];
  selected: number;
  cardWidth: number;
  locale: string;
  ui: { cta: string };
  desktopRef: React.RefObject<HTMLDivElement | null>;
}

const DesktopCarousel = memo(function DesktopCarousel({
  items,
  selected,
  cardWidth,
  locale,
  ui,
  desktopRef,
}: DesktopCarouselProps) {
  return (
    <div
      ref={desktopRef}
      className="relative hidden size-full md:block"
      style={{ transformStyle: 'preserve-3d', minHeight: 560 }}
    >
      {items.map((item, index) => {
        const offset = getSlideOffset(index, selected, items.length);
        const isCenter = offset === 0;
        const t = getTweenStyles(offset, cardWidth);
        const transformOrigin =
          offset > 0 ? 'left center' : offset < 0 ? 'right center' : 'center center';

        const left = isCenter ? '25%' : offset > 0 ? '75%' : '-25%';

        return (
          <div
            key={`desktop-${item.project.id}`}
            className="absolute top-1/2 w-1/2 transition-[transform,opacity,filter,left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left,
              transform: `translateY(-50%) translateX(${t.translateX}%) rotateY(${t.rotateY}deg) translateZ(${t.translateZ}px) scale(${t.scale})`,
              transformOrigin,
              opacity: t.opacity,
              filter: isCenter ? 'none' : `blur(${t.blur}px) brightness(${t.brightness})`,
              zIndex: t.zIndex,
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity, filter',
            }}
          >
            <ProjectCard item={item} isCenter={isCenter} locale={locale} ui={ui} />
          </div>
        );
      })}
    </div>
  );
});

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
}

const CarouselControls = memo(function CarouselControls({ onPrev, onNext }: CarouselControlsProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full md:-left-4"
        onClick={onPrev}
        aria-label="Poprzedni projekt"
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full md:-right-4"
        onClick={onNext}
        aria-label="Następny projekt"
      >
        <ChevronRightIcon />
      </Button>
    </>
  );
});

function PortfolioHighlightsContent({ page }: PortfolioHighlightsProps) {
  const locale = useLocale();
  const highlights = page.portfolioHighlights;
  const ui = UI[locale] ?? UI.pl;

  const items = useMemo(
    () =>
      highlights?.items?.length
        ? highlights.items.filter(
            (item): item is NonNullable<typeof item> & { project: Project } =>
              !!item && !!item.project
          )
        : [],
    [highlights?.items]
  );

  const [selected, setSelected] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = desktopRef.current;
    if (!el) return;
    const update = () => setCardWidth(Math.round(el.clientWidth / 2));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const next = useCallback(() => setSelected(prev => (prev + 1) % items.length), [items.length]);
  const prev = useCallback(
    () => setSelected(prev => (prev - 1 + items.length) % items.length),
    [items.length]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchStartX.current;
      const end = e.changedTouches[0].screenX;
      touchStartX.current = null;

      if (start === null) return;
      const diff = start - end;

      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
    },
    [next, prev]
  );

  if (!highlights || !items.length) {
    return null;
  }

  return (
    <section className="relative w-full scroll-mt-20 bg-background">
      <div className="container mx-auto max-w-360 px-4 py-16 md:px-6 md:py-24">
        <FadeIn className="mb-12 max-w-2xl">
          <h2
            data-tina-field={tinaField(highlights, 'title')}
            className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground md:text-4xl"
          >
            {highlights.title ?? ui.titleFallback}
          </h2>

          {highlights.description ? (
            <p
              data-tina-field={tinaField(highlights, 'description')}
              className="mt-4 font-sans text-base leading-relaxed text-pretty text-muted-foreground md:text-lg"
            >
              {highlights.description}
            </p>
          ) : null}
        </FadeIn>

        <FadeIn delay={0.15}>
          <div
            className="relative mx-auto w-full max-w-4xl px-4 md:px-12"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ perspective: '1500px' }}
          >
            <MobileCarousel items={items} selected={selected} locale={locale} ui={ui} />
            <DesktopCarousel
              items={items}
              selected={selected}
              cardWidth={cardWidth}
              locale={locale}
              ui={ui}
              desktopRef={desktopRef}
            />
            <CarouselControls onPrev={prev} onNext={next} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export const PortfolioHighlights = memo(PortfolioHighlightsContent);
