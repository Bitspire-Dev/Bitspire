"use client";
import React from 'react';
import { tinaField } from 'tinacms/dist/react';
import { RichTextLite } from '@tina/richTextPresets';
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

type StatisticsTile = {
  number?: string | null;
  title?: string | null;
  description?: string | null;
  variant?: string | null;
  size?: string | null;
  colStart?: number | null;
  rowStart?: number | null;
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

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-250 h-250 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-20 max-w-4xl">
            {data.title && (
                <div data-tina-field={tinaField(data, 'title')}>
                   <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white/95">
                     <RichTextLite content={data.title} />
                   </h2>
                </div>
            )}
            {data.description && (
                <div data-tina-field={tinaField(data, 'description')}>
                    <div className="text-xl text-brand-text-muted leading-relaxed max-w-2xl">
                        <RichTextLite content={data.description} />
                    </div>
                </div>
            )}
        </div>

        {/* Modular Grid System */}
        <div 
          className="grid grid-rows-6 gap-4 [--stat-cols:5] md:[--stat-cols:12]" 
          style={{
            gridTemplateColumns: 'repeat(var(--stat-cols), minmax(0, 1fr))',
            aspectRatio: 'calc(var(--stat-cols) / 6)',
            gridTemplateRows: 'repeat(6, minmax(0, 1fr))',
          }}
          data-tina-field={tinaField(data, 'tiles')}
        >
          {data.tiles?.map((tile, i) => (
            (() => {
              const variant = (tile.variant as TileVariant) || 'transparent';
              const size = (tile.size as TileSize) || '2x2';
              const colSpan = size === '4x2' ? 4 : 2;
              const rowSpan = 2;

              const gridStyle = tile.colStart && tile.rowStart
                ? {
                    gridColumn: `${tile.colStart} / span ${colSpan}`,
                    gridRow: `${tile.rowStart} / span ${rowSpan}`,
                  }
                : undefined;
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

              return (
            <Tile 
              key={i} 
              variant={variant}
              gridSize={size}
              withNoise={tile.withNoise === true}
              style={gridStyle}
            >
              <div className="flex justify-between items-start w-full">
                 <div>
                    {tile.number && (
                      <TileNumber
                        className={useAnimatedGradient ? 'animate-gradient-x' : undefined}
                        style={gradientStyle}
                      >
                        {tile.number}
                      </TileNumber>
                    )}
                 </div>
                 
                 {isWide && tile.description && (
                    <div className="pl-4 max-w-60 text-right">
                       <TileDescription className="text-xs sm:text-sm text-balance">
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
              );
            })()
          ))}
        </div>
      </div>
    </section>
  );
};
