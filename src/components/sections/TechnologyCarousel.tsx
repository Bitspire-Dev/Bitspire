'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

// Filenames in /public/logo-carousel do not all match the canonical logo names.
const LOGO_FILE_NAMES: Record<string, string> = {
  docker: 'Docker',
  react: 'React',
  strapi: 'Strapi',
  stripe: 'Stripe',
  typescript: 'Typescript',
  vite: 'Vite',
};

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

const ITEM_WIDTH = 36;
const GAP = 16;
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
    <div className="flex size-9 shrink-0 items-center justify-center p-1">
      <AspectRatio ratio={1 / 1} className="w-full rounded">
        <Image
          src={`/logo-carousel/${LOGO_FILE_NAMES[name] ?? name}.svg`}
          alt={name}
          fill
          sizes="32px"
          loading="eager"
          className={cn(
            'object-contain opacity-60 grayscale transition-all duration-300 hover:scale-110 hover:opacity-100 hover:grayscale-0 dark:invert dark:opacity-60'
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
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
    >
      <div
        className="marquee-track flex w-max gap-4" // eslint-disable-line tailwindcss/no-custom-classname
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

function TechnologyCarouselContent() {
  return (
    <motion.section
      role="region"
      aria-roledescription="carousel"
      aria-label="Technology carousel"
      className="relative w-full overflow-hidden border-b border-border/50 bg-background py-12 text-foreground"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0, margin: '100px 0px' }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <MarqueeRow />
    </motion.section>
  );
}

export const TechnologyCarousel = memo(TechnologyCarouselContent);
