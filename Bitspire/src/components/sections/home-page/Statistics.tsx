"use client";
import React from 'react';
import { tinaField } from 'tinacms/dist/react';
import { RichText } from '@tina/richTextPresets';
import { 
  Tile, 
  TileNumber, 
  TileTitle, 
  TileDescription, 
  TileContent, 
  type TileVariant,
  type TileSize
} from '@/components/ui/primitives/Tile';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import {
  FADE_UP_VARIANTS,
  MOTION_VIEWPORT,
  SECTION_STAGGER_VARIANTS,
  motion,
  useReducedMotion,
} from '@/lib/ui/motion';

type StatisticsTile = {
  number?: string | null;
  title?: string | null;
  description?: string | null;
  variant?: string | null;
  size?: string | null;
  colStart?: number | null;
  rowStart?: number | null;
  mobileColStart?: number | null;
  mobileRowStart?: number | null;
  withNoise?: boolean | null;
  __typename?: string;
  [key: string]: unknown;
};

interface StatisticsData {
  title?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  description?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  tiles?: StatisticsTile[] | null;
  [key: string]: unknown;
}

export const Statistics: React.FC<{ data: StatisticsData }> = ({ data }) => {
  if (!data) return null;
  const reduceMotion = useReducedMotion();

  const normalizePlacement = (col?: number | string | null, row?: number | string | null) => {
    const parsedCol = typeof col === 'string' ? Number(col) : col;
    const parsedRow = typeof row === 'string' ? Number(row) : row;
    const colValue = Number.isFinite(parsedCol) ? Math.floor(parsedCol as number) : null;
    const rowValue = Number.isFinite(parsedRow) ? Math.floor(parsedRow as number) : null;
    if (!colValue || !rowValue || colValue < 1 || rowValue < 1) return undefined;
    return { colStart: colValue, rowStart: rowValue };
  };

  return (
    <section className="pt-0 pb-2 md:pt-0 md:pb-4 lg:pt-0 lg:pb-4 relative overflow-visible">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(30,58,138,0.10) 0%, transparent 60%)' }} />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          variants={SECTION_STAGGER_VARIANTS}
          initial={reduceMotion ? false : 'hidden'}
          whileInView={reduceMotion ? undefined : 'visible'}
          viewport={reduceMotion ? undefined : MOTION_VIEWPORT}
        >
        <motion.div
          variants={FADE_UP_VARIANTS}
          transition={{ duration: reduceMotion ? 0 : 0.55 }}
          className="mb-12 md:mb-16 max-w-4xl"
        >
            {data.title && (
                <div
                  data-tina-field={tinaField(data, 'title')}
                  className="prose prose-invert max-w-none [&>h1]:text-4xl [&>h1]:md:text-6xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:tracking-tight [&>h1]:text-white/95 [&>h2]:text-4xl [&>h2]:md:text-6xl [&>h2]:font-bold [&>h2]:mb-6 [&>h2]:tracking-tight [&>h2]:text-white/95"
                >
                  <RichText content={data.title} />
                </div>
            )}
            {data.description && (
                <div data-tina-field={tinaField(data, 'description')}>
                    <div className="text-xl text-brand-text-muted leading-relaxed max-w-2xl">
                        <RichText content={data.description} />
                    </div>
                </div>
            )}
        </motion.div>

        {/* Modular Grid System */}
        <motion.div
          variants={SECTION_STAGGER_VARIANTS}
          className="grid gap-3 sm:gap-4 lg:gap-6 [--stat-cols:6] [--stat-rows:10] sm:[--stat-cols:8] sm:[--stat-rows:8] md:[--stat-cols:12] md:[--stat-rows:6]" 
          style={{
            gridTemplateColumns: 'repeat(var(--stat-cols), minmax(0, 1fr))',
            gridTemplateRows: 'repeat(var(--stat-rows), minmax(0, 1fr))',
            aspectRatio: 'calc(var(--stat-cols) / var(--stat-rows))',
          }}
          data-tina-field={tinaField(data, 'tiles')}
        >
          {(data.tiles ?? []).map((tile, i) => (
            (() => {
              if (!tile) return null;
              const variant = (tile.variant as TileVariant) || 'transparent';
              const size = (tile.size as TileSize) || '2x2';
              const colSpan = size === '4x2' ? 4 : 2;
              const rowSpan = 2;

              const mobileLayout: Array<{ colStart: number; rowStart: number }> = [
                { colStart: 1, rowStart: 1 },
                { colStart: 5, rowStart: 2 },
                { colStart: 3, rowStart: 4 },
                { colStart: 1, rowStart: 5 },
                { colStart: 5, rowStart: 6 },
                { colStart: 2, rowStart: 7 },
                { colStart: 4, rowStart: 8 },
                { colStart: 1, rowStart: 9 },
              ];

              const mobilePlacement =
                normalizePlacement(tile.mobileColStart, tile.mobileRowStart) ?? mobileLayout[i];
              const basePlacement = mobilePlacement;
              const mdPlacement = normalizePlacement(tile.colStart, tile.rowStart);

              const gridStyle = {
                '--stat-col-span': String(colSpan),
                '--stat-row-span': String(rowSpan),
                '--stat-col-span-md': String(colSpan),
                '--stat-row-span-md': String(rowSpan),
                ...(basePlacement
                  ? {
                      '--stat-col-start': String(basePlacement.colStart),
                      '--stat-row-start': String(basePlacement.rowStart),
                    }
                  : {}),
                ...(mdPlacement
                  ? {
                      '--stat-col-start-md': String(mdPlacement.colStart),
                      '--stat-row-start-md': String(mdPlacement.rowStart),
                    }
                  : {}),
              } as React.CSSProperties;

              const placementClassName =
                basePlacement || mdPlacement
                  ? 'col-[var(--stat-col-start)_/_span_var(--stat-col-span)] row-[var(--stat-row-start)_/_span_var(--stat-row-span)] md:col-[var(--stat-col-start-md)_/_span_var(--stat-col-span-md)] md:row-[var(--stat-row-start-md)_/_span_var(--stat-row-span-md)]'
                  : undefined;
              
              const finalClassName = placementClassName || (size === '4x2' ? 'col-span-4 row-span-2' : 'col-span-2 row-span-2');

              const useAnimatedGradient =
                variant === 'solid-white' || variant === 'solid-black' || variant === 'transparent';

              const gradientStyle = useAnimatedGradient
                ? {
                    backgroundImage: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 50%, #3b82f6 100%)',
                    backgroundSize: '200% 200%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent',
                  }
                : undefined;

              const isWide = size === '4x2';
              const numberStyle = {
                ...(gradientStyle ?? {}),
                '--tile-number-scale': isWide ? '1' : '1.12',
              } as React.CSSProperties;

              return (
                <motion.div
                  key={i}
                  style={gridStyle}
                  className={finalClassName}
                  variants={FADE_UP_VARIANTS}
                  transition={{ duration: reduceMotion ? 0 : 0.4 }}
                >
            <Tile 
              variant={variant}
              gridSize={size}
              withNoise={tile.withNoise === true}
              className="w-full h-full"
            >
                <div className="flex items-start w-full gap-3">
                  <div className="shrink-0">
                    {tile.number && (
                      <TileNumber
                        className={useAnimatedGradient ? 'animate-gradient-x' : undefined}
                        style={numberStyle}
                      >
                        {tile.number}
                      </TileNumber>
                    )}
                 </div>
                 
                  {isWide && tile.description && (
                    <div className="ml-auto min-w-0 max-w-[58%] text-right">
                      <TileDescription className="text-balance overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
                        {tile.description}
                      </TileDescription>
                    </div>
                  )}
              </div>
              
              <TileContent>
                {tile.title && <TileTitle>{tile.title}</TileTitle>}
                {!isWide && tile.description && <TileDescription>{tile.description}</TileDescription>}
              </TileContent>
            </Tile>
            </motion.div>
              );
            })()
          ))}
        </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
