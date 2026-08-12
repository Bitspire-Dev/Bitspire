'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'motion/react';

import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const LOGOS = [
  'docker',
  'electron',
  'git',
  'graph-ql',
  'nextjs',
  'node-js',
  'pnpm',
  'react',
  'strapi',
  'stripe',
  'tailwind',
  'tina-cms',
  'typescript',
  'vercel',
  'vite',
  'vitest',
];

const ITEM_WIDTH = 64;
const GAP = 8;
const OFFSET = Math.round(ITEM_WIDTH * 0.75);
const MIN_VIEWPORT_WIDTH = 2560;
const MARQUEE_SPEED = 60;

const SEED_ROW_1 = 0x6d2b79f5;
const SEED_ROW_2 = 0x9e3779b9;

const SET_WIDTH = LOGOS.length * ITEM_WIDTH + (LOGOS.length - 1) * GAP;
const BASE_REPEATS = Math.max(2, Math.ceil(MIN_VIEWPORT_WIDTH / SET_WIDTH) * 2);

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
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

function useMarqueeLogos(seed: number) {
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

  const repeatedLogos = useMemo(() => buildSlides(LOGOS, seed, repeats), [repeats, seed]);

  const totalWidth = repeats * SET_WIDTH + (repeats - 1) * GAP;
  const duration = totalWidth / 2 / MARQUEE_SPEED;

  return { containerRef, repeatedLogos, duration };
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
      <AspectRatio ratio={1 / 1} className="w-full rounded">
        <Image
          src={`/logo-carousel/${name}.svg`}
          alt={name}
          fill
          sizes="48px"
          loading="lazy"
          unoptimized
          className={cn(
            'object-contain opacity-50 grayscale transition-all duration-300 hover:scale-110 hover:opacity-100 hover:grayscale-0 dark:invert'
          )}
        />
      </AspectRatio>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  MarqueeRow                                                         */
/* ------------------------------------------------------------------ */

interface MarqueeRowProps {
  offset?: boolean;
}

const MarqueeRow = memo(function MarqueeRow({ offset = false }: MarqueeRowProps) {
  const seed = offset ? SEED_ROW_2 : SEED_ROW_1;
  const { containerRef, repeatedLogos, duration } = useMarqueeLogos(seed);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <div
        className="marquee-track flex w-max gap-2" // eslint-disable-line tailwindcss/no-custom-classname
        style={{
          marginLeft: offset ? `${-OFFSET}px` : undefined,
          willChange: 'transform',
          animation: `marquee ${duration}s linear infinite`,
        }}
      >
        {repeatedLogos.map((name, index) => (
          <LogoIcon key={`${name}-${index}`} name={name} />
        ))}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  TechnologyCarousel – section                                       */
/* ------------------------------------------------------------------ */

export function TechnologyCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0, margin: '100px 0px' });
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (!isInView) {
      const timer = setTimeout(() => setFallback(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <motion.section
      ref={sectionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Technology carousel"
      className="relative w-full overflow-hidden bg-background py-16"
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 300px' }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView || fallback ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-2">
        <MarqueeRow />
        <MarqueeRow offset />
      </div>
    </motion.section>
  );
}
