"use client";

import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import { tinaField } from "tinacms/dist/react";
import { RichText } from "@tina/richTextPresets";
import { safeImageSrc } from "@/lib/ui/helpers";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TechnologyItem = Record<string, unknown> & {
  name?: string | null;
  icon?: string | null;
};

interface TechnologyData {
  title?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  description?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  items?: TechnologyItem[] | null;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Width of each logo slot in pixels. */
const ITEM_WIDTH = 140;

/** CSS mask that fades edges to transparent. */
const EDGE_FADE =
  "linear-gradient(to right, transparent, black 8%, black 92%, transparent)";

/** Minimum total slide width needed for seamless loop (covers 4K). */
const MIN_TOTAL_WIDTH = 2560;

/* ------------------------------------------------------------------ */
/*  LogoIcon                                                           */
/* ------------------------------------------------------------------ */

function LogoIcon({
  item,
  src,
}: {
  item: TechnologyItem;
  src: string | undefined;
}) {
  const isVite = item.name === "Vite";

  return (
    <div
      className="flex w-[140px] shrink-0 items-center justify-center px-4"
      data-tina-field={tinaField(item)}
    >
      <div className="relative w-full h-[60px] grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer">
        {src ? (
          <Image
            src={src}
            alt={item.name ?? "Technology logo"}
            fill
            sizes="140px"
            loading="eager"
            className={`object-contain opacity-90 ${
              isVite
                ? "filter-[brightness(1.75)]"
                : "filter-[brightness(0)_invert(1)_brightness(1.75)]"
            }`}
          />
        ) : (
          <span className="text-brand-text-muted text-sm font-bold">
            {item.name}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LogoCarousel                                                       */
/* ------------------------------------------------------------------ */

function LogoCarousel({
  items,
  srcs,
}: {
  items: TechnologyItem[];
  srcs: (string | undefined)[];
}) {
  // Duplicate items enough times to fill the viewport for seamless loop
  const { slides, slideSrcs } = useMemo(() => {
    const repeats = Math.max(1, Math.ceil(MIN_TOTAL_WIDTH / (items.length * ITEM_WIDTH)));
    const s: TechnologyItem[] = [];
    const ss: (string | undefined)[] = [];
    for (let r = 0; r < repeats; r++) {
      for (let i = 0; i < items.length; i++) {
        s.push(items[i]);
        ss.push(srcs[i]);
      }
    }
    return { slides: s, slideSrcs: ss };
  }, [items, srcs]);

  const autoScrollPlugin = useMemo(
    () =>
      AutoScroll({
        speed: 1,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnFocusIn: false,
      }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      align: "start",
      containScroll: false,
    },
    [autoScrollPlugin],
  );

  // Pause auto-scroll on hover, resume on leave
  const onMouseEnter = useCallback(() => {
    const plugin = emblaApi?.plugins()?.autoScroll;
    if (plugin && 'stop' in plugin) (plugin as { stop: () => void }).stop();
  }, [emblaApi]);

  const onMouseLeave = useCallback(() => {
    const plugin = emblaApi?.plugins()?.autoScroll;
    if (plugin && 'play' in plugin) (plugin as { play: () => void }).play();
  }, [emblaApi]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
        <div className="flex">
          {slides.map((item, slideIndex) => (
            <div key={slideIndex} className="flex-[0_0_auto]">
              <LogoIcon item={item} src={slideSrcs[slideIndex]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Technology – main section                                          */
/* ------------------------------------------------------------------ */

const Technology: React.FC<{ data?: TechnologyData }> = ({ data }) => {
  const items = data?.items ?? [];
  const locale = useLocale();

  const srcs = useMemo(
    () => items.map((it) => safeImageSrc(it?.icon ?? undefined)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length, locale],
  );

  if (!data || items.length === 0) return null;

  return (
    <section
      className="pt-2 pb-2 md:pt-2 md:pb-4 lg:pt-2 lg:pb-4 relative bg-brand-bg text-brand-fg overflow-visible"
      data-tina-field={tinaField(data)}
    >
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />

      {/* Header */}
      <motion.div
        className="container mx-auto px-4 relative z-10 mb-6 lg:mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0, margin: "100px 0px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center max-w-3xl mx-auto">
          {data.title && (
            <div
              className="prose prose-invert max-w-none [&>h1]:text-3xl [&>h1]:md:text-4xl [&>h1]:font-bold [&>h2]:text-3xl [&>h2]:md:text-4xl [&>h2]:font-bold mb-4"
              data-tina-field={tinaField(data, "title")}
            >
              <RichText content={data.title} />
            </div>
          )}
          {data.description && (
            <div
              className="prose prose-invert max-w-none text-brand-text-muted text-lg"
              data-tina-field={tinaField(data, "description")}
            >
              <RichText content={data.description} />
            </div>
          )}
        </div>
      </motion.div>

      {/* Logo carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0, margin: "100px 0px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <LogoCarousel items={items} srcs={srcs} />
      </motion.div>
    </section>
  );
};

export default Technology;
