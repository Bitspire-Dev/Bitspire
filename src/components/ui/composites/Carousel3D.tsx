'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaChevronLeft, FaChevronRight } from '@/components/ui/icons';

interface Carousel3DProps<T> {
  items: T[];
  renderItem: (item: T, index: number, isCenter: boolean) => React.ReactNode;
  getKey: (item: T, index: number) => string;
  controlLabels: { prev: string; next: string };
  className?: string;
}

export default function Carousel3D<T>({
  items,
  renderItem,
  getKey,
  controlLabels,
  className = '',
}: Carousel3DProps<T>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: false,
  });

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tweenFrameRef = useRef<number | null>(null);
  const equalizeFrameRef = useRef<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tweenCards = useCallback(() => {
    if (!emblaApi) return;

    const rootNode = emblaApi.rootNode();
    const rootRect = rootNode.getBoundingClientRect();
    const rootWidth = rootRect.width;
    const rootCenter = rootRect.left + rootWidth / 2;

    const radius = Math.min(rootWidth * 0.22, 240);
    const slideNodes = emblaApi.slideNodes();
    const N = slideNodes.length;
    if (N === 0) return;

    const updates: Array<{
      card: HTMLDivElement;
      slideNode: HTMLElement;
      transform: string;
      filter: string;
      zIndex: string;
    }> = [];

    // Read phase: collect geometry and compute next styles.
    slideNodes.forEach((slideNode, slideIndex) => {
      const card = cardRefs.current[slideIndex];
      if (!card) return;

      const slideRect = slideNode.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const posNorm = (slideCenter - rootCenter) / rootWidth;
      const angle = posNorm * (2 * Math.PI / N);
      const circularX = Math.sin(angle) * radius;
      const totalX = circularX - (slideCenter - rootCenter);
      const cosVal = Math.cos(angle);
      const t = (cosVal + 1) / 2;

      const scale = 0.75 + 0.3 * t;
      const blur = (1 - t) * 3;
      const zIdx = Math.round(t * 20);

      updates.push({
        card,
        slideNode,
        transform: `translateX(${totalX}px) scale(${scale})`,
        filter: blur > 0.5 ? `blur(${blur}px)` : 'none',
        zIndex: `${zIdx}`,
      });
    });

    // Write phase: apply styles after reads to avoid layout thrash.
    updates.forEach(({ card, slideNode, transform, filter, zIndex }) => {
      card.style.transform = transform;
      card.style.filter = filter;
      slideNode.style.zIndex = zIndex;
    });
  }, [emblaApi]);

  const equalizeCardHeights = useCallback(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    cards.forEach((card) => {
      card.style.height = 'auto';
    });

    let maxH = 0;
    cards.forEach((card) => {
      const height = card.getBoundingClientRect().height;
      if (height > maxH) maxH = height;
    });

    if (maxH > 0) {
      cards.forEach((card) => {
        card.style.height = `${maxH}px`;
      });
    }
  }, []);

  const scheduleTween = useCallback(() => {
    if (tweenFrameRef.current != null) return;
    tweenFrameRef.current = window.requestAnimationFrame(() => {
      tweenFrameRef.current = null;
      tweenCards();
    });
  }, [tweenCards]);

  const scheduleEqualize = useCallback(() => {
    if (equalizeFrameRef.current != null) return;
    equalizeFrameRef.current = window.requestAnimationFrame(() => {
      equalizeFrameRef.current = null;
      equalizeCardHeights();
    });
  }, [equalizeCardHeights]);

  useEffect(() => {
    if (!emblaApi || typeof ResizeObserver === 'undefined') {
      return;
    }

    const rootNode = emblaApi.rootNode();
    const onResize = () => {
      scheduleEqualize();
      scheduleTween();
    };

    onResize();

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(rootNode);

    return () => {
      resizeObserver.disconnect();
    };
  }, [emblaApi, scheduleEqualize, scheduleTween]);

  useEffect(() => {
    if (!emblaApi) return;

    scheduleEqualize();
    scheduleTween();

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onResize = () => {
      scheduleEqualize();
      scheduleTween();
    };

    emblaApi.on('scroll', scheduleTween);
    emblaApi.on('reInit', scheduleTween);
    emblaApi.on('select', onSelect);
    emblaApi.on('resize', onResize);

    onSelect();

    return () => {
      emblaApi.off('scroll', scheduleTween);
      emblaApi.off('reInit', scheduleTween);
      emblaApi.off('select', onSelect);
      emblaApi.off('resize', onResize);

      if (tweenFrameRef.current != null) {
        window.cancelAnimationFrame(tweenFrameRef.current);
        tweenFrameRef.current = null;
      }
      if (equalizeFrameRef.current != null) {
        window.cancelAnimationFrame(equalizeFrameRef.current);
        equalizeFrameRef.current = null;
      }
    };
  }, [emblaApi, scheduleEqualize, scheduleTween]);

  if (items.length === 0) return null;

  return (
    <div className={`relative h-[340px] md:h-[460px] ${className}`}>
      <div
        ref={emblaRef}
        className="h-full overflow-visible cursor-grab active:cursor-grabbing"
      >
        <div className="flex h-full items-center">
          {items.map((item, index) => (
            <div
              key={getKey(item, index)}
              className="flex-[0_0_100%] min-w-0 flex items-center justify-center relative"
            >
              <div
                ref={(el) => { cardRefs.current[index] = el; }}
                className="w-[220px] md:w-[300px] will-change-transform"
                onClick={() => {
                  if (index !== selectedIndex) emblaApi?.scrollTo(index);
                }}
              >
                {renderItem(item, index, index === selectedIndex)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        aria-label={controlLabels.prev}
      >
        <span className="sr-only">{controlLabels.prev}</span>
        <FaChevronLeft className="text-white text-xl" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        aria-label={controlLabels.next}
      >
        <span className="sr-only">{controlLabels.next}</span>
        <FaChevronRight className="text-white text-xl" />
      </button>
    </div>
  );
}
