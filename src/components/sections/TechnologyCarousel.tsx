'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

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

const ITEM_WIDTH = 64;
const GAP = 8;
const OFFSET = Math.round(ITEM_WIDTH * 0.75);
const MIN_TOTAL_WIDTH = 2560;

const EDGE_FADE = 'linear-gradient(to right, black 0%, black 92%, transparent)';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function repeatLogos(logos: string[]) {
  const setWidth = logos.length * ITEM_WIDTH + (logos.length - 1) * GAP;
  const repeats = Math.max(1, Math.ceil(MIN_TOTAL_WIDTH / setWidth));

  const result: string[] = [];
  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < logos.length; i++) {
      result.push(logos[i]);
    }
  }
  return result;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  LogoIcon                                                           */
/* ------------------------------------------------------------------ */

interface LogoIconProps {
  name: string;
}

function LogoIcon({ name }: LogoIconProps) {
  const needsInvert = ['next-js', 'stripe', 'vercel'].includes(name);

  return (
    <div className="flex size-16 shrink-0 items-center justify-center p-2">
      <div className="relative size-full overflow-hidden rounded opacity-50 grayscale transition-all duration-300 hover:scale-110 hover:opacity-100 hover:grayscale-0">
        <Image
          src={`/logo-carousel/${name}.svg`}
          alt={name}
          fill
          sizes="48px"
          loading="eager"
          className={`object-contain ${
            needsInvert
              ? 'filter-[brightness(0)_invert(1)_brightness(1.75)]'
              : 'filter-[brightness(1.75)]'
          }`}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LogoRow                                                            */
/* ------------------------------------------------------------------ */

interface LogoRowProps {
  offset?: boolean;
}

function LogoRow({ offset = false }: LogoRowProps) {
  const repeatedLogos = useMemo(() => repeatLogos(shuffle([...LOGOS])), []);

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      containScroll: false,
      watchDrag: false,
    },
    [
      AutoScroll({
        speed: 1,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnFocusIn: false,
        stopOnMouseEnter: false,
      }),
    ]
  );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-2" style={{ marginLeft: offset ? `${-OFFSET}px` : undefined }}>
          {repeatedLogos.map((name, index) => (
            <LogoIcon key={`${name}-${index}`} name={name} />
          ))}
        </div>
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
      className="relative w-full overflow-hidden bg-background py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0, margin: '100px 0px' }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="flex flex-col gap-2">
        <LogoRow />
        <LogoRow offset />
      </div>
    </motion.section>
  );
}
