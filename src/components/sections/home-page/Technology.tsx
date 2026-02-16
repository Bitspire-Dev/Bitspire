"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { tinaField } from "tinacms/dist/react";
import { RichText } from "@tina/richTextPresets";
import { safeImageSrc } from "@/lib/ui/helpers";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { useLocale } from "next-intl";

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

/** Seconds per logo — controls scroll speed. */
const SECONDS_PER_ITEM = 3;

/** Width of each logo slot in pixels (must match w-[140px] in LogoIcon). */
const ITEM_WIDTH = 140;

/**
 * Minimum width (px) one set of logos must span.
 * Must be >= the widest expected viewport (2560px covers 4K scaled).
 * This guarantees the set fills the screen at every animation frame
 * so the infinite loop has no gaps.
 */
const MIN_SET_WIDTH = 2560;

/** CSS mask that fades edges to transparent. */
const EDGE_FADE =
  "linear-gradient(to right, transparent, black 8%, black 92%, transparent)";

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
/*  MarqueeTrack                                                       */
/* ------------------------------------------------------------------ */

function MarqueeTrack({
  items,
  srcs,
}: {
  items: TechnologyItem[];
  srcs: (string | undefined)[];
}) {
  // How many times to repeat the item list so one set >= MIN_SET_WIDTH.
  // e.g. 8 items × 140px = 1120px per round → ceil(2560/1120) = 3 rounds
  // → one set = 3360px, always wider than the viewport.
  const repeatCount = Math.max(1, Math.ceil(MIN_SET_WIDTH / (items.length * ITEM_WIDTH)));

  // Duration scales with total items in one set to keep scroll speed constant.
  const duration = repeatCount * items.length * SECONDS_PER_ITEM;

  const renderSet = () =>
    Array.from({ length: repeatCount }, (_, r) =>
      items.map((item, i) => (
        <LogoIcon key={`${r}-${i}`} item={item} src={srcs[i]} />
      ))
    );

  return (
    <div
      className="relative w-full overflow-hidden group"
      style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
    >
      {/*
        Track: w-max prevents wrapping. Contains two identical sets.
        CSS animates translate(-50%) = exactly one set width → seamless loop.
        Each set repeats the items enough times to be wider than any viewport.
      */}
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={
          { "--marquee-duration": `${duration}s` } as React.CSSProperties
        }
      >
        <div className="flex shrink-0">{renderSet()}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {renderSet()}
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
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-250 h-75 bg-brand-accent-2/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="container mx-auto px-4 relative z-10 mb-6 lg:mb-8">
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
      </div>

      {/* Marquee */}
      <MarqueeTrack items={items} srcs={srcs} />
    </section>
  );
};

export default Technology;
