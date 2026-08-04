'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const LOGOS = [
  'docker',
  'electron',
  'graph-ql',
  'next-js',
  'node-js',
  'react',
  'strapi',
  'stripe',
  'tailwind-css',
  'tina-cms',
  'typescript',
  'vercel',
  'vite',
];

const INVERTED_LOGOS = new Set(['next-js', 'stripe', 'vercel']);

const ITEM_WIDTH = 64;
const GAP = 8;
const OFFSET = Math.round(ITEM_WIDTH * 0.75);
const MIN_TOTAL_WIDTH = 2560;

const SET_WIDTH = LOGOS.length * ITEM_WIDTH + (LOGOS.length - 1) * GAP;
const BASE_REPEATS = Math.max(2, Math.ceil(MIN_TOTAL_WIDTH / SET_WIDTH) * 2);

const EDGE_FADE = 'linear-gradient(to right, black 0%, black 92%, transparent)';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return function random() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function shuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  const random = seededRandom(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildSlides(logos: string[], seed: number, repeats: number) {
  const shuffled = shuffle([...logos], seed);
  const total = shuffled.length * repeats;
  const result = new Array<string>(total);
  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < shuffled.length; i++) {
      result[r * shuffled.length + i] = shuffled[i];
    }
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  LogoIcon                                                           */
/* ------------------------------------------------------------------ */

interface LogoIconProps {
  name: string;
}

const LogoIcon = memo(function LogoIcon({ name }: LogoIconProps) {
  return (
    <div className="flex size-16 shrink-0 items-center justify-center p-2">
      <div className="relative size-full overflow-hidden rounded opacity-50 grayscale transition-all duration-300 hover:scale-110 hover:opacity-100 hover:grayscale-0">
        <Image
          src={`/logo-carousel/${name}.svg`}
          alt={name}
          fill
          sizes="48px"
          loading="eager"
          className={cn(
            'object-contain',
            INVERTED_LOGOS.has(name)
              ? 'filter-[brightness(0)_invert(1)_brightness(1.75)]'
              : 'filter-[brightness(1.75)]'
          )}
        />
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  MarqueeRow                                                         */
/* ------------------------------------------------------------------ */

interface MarqueeRowProps {
  offset?: boolean;
}

function MarqueeRow({ offset = false }: MarqueeRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [repeats, setRepeats] = useState(BASE_REPEATS);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      const needed = Math.max(1, Math.ceil(width / SET_WIDTH));
      setRepeats(Math.max(BASE_REPEATS, needed * 2));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const seed = offset ? 0x9e3779b9 : 0x6d2b79f5;
  const repeatedLogos = useMemo(() => buildSlides(LOGOS, seed, repeats), [repeats, seed]);

  const totalWidth = repeats * SET_WIDTH + (repeats - 1) * GAP;
  const duration = totalWidth / 2 / 60;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
    >
      <div
        className="flex w-max gap-2"
        style={{
          marginLeft: offset ? `${-OFFSET}px` : undefined,
          animation: `marquee ${duration}s linear infinite`,
        }}
      >
        {repeatedLogos.map((name, index) => (
          <LogoIcon key={`${name}-${index}`} name={name} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TechnologyCarousel – section                                       */
/* ------------------------------------------------------------------ */

export function TechnologyCarousel() {
  return (
    <motion.section
      role="region"
      aria-roledescription="carousel"
      aria-label="Technology carousel"
      className="relative w-full overflow-hidden bg-background py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0, margin: '100px 0px' }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="flex flex-col gap-2">
        <MarqueeRow />
        <MarqueeRow offset />
      </div>
    </motion.section>
  );
}
