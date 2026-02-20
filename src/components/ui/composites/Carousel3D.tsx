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
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ---------------------------------------------------------------
  // Pure pixel-based tween — no scrollProgress / snapList / loopPoints.
  // We read each slideNode's actual getBoundingClientRect position,
  // compute how far it is from viewport center (in slide-widths),
  // and derive ALL visual effects from that single number.
  // If the slide is physically centered → posNorm = 0 → opacity 1, blur 0.
  // ---------------------------------------------------------------
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

    slideNodes.forEach((slideNode, slideIndex) => {
      const card = cardRefs.current[slideIndex];
      if (!card) return;

      // Actual pixel center of this slide (includes embla scroll + loop repositioning)
      const slideRect = slideNode.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;

      // How many slide-widths away from viewport center
      const posNorm = (slideCenter - rootCenter) / rootWidth;

      // Map to angle on the circle: N items = N equally-spaced points
      const angle = posNorm * (2 * Math.PI / N);

      // Desired circular X position (relative to viewport center)
      const circularX = Math.sin(angle) * radius;

      // Translate from where embla placed the slide to our circular position
      const totalX = circularX - (slideCenter - rootCenter);

      // Depth: cos=1 → front, cos=-1 → back, normalised to 0..1
      const cosVal = Math.cos(angle);
      const t = (cosVal + 1) / 2;

      const scale = 0.75 + 0.3 * t;
      const blur = (1 - t) * 3;
      const zIdx = Math.round(t * 20);

      card.style.transform = `translateX(${totalX}px) scale(${scale})`;
      card.style.filter = blur > 0.5 ? `blur(${blur}px)` : 'none';

      // zIndex must live on the slide node, not the card.
      // Embla applies translate3d to slide nodes for loop repositioning,
      // which creates isolated stacking contexts — a card's zIndex inside
      // one slide node cannot compete with cards in other slide nodes.
      // Setting zIndex on the slide node itself solves this.
      slideNode.style.zIndex = `${zIdx}`;
    });
  }, [emblaApi]);

  // Equal height equalization — all cards match the tallest one
  useEffect(() => {
    const equalize = () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;

      cards.forEach(c => { c.style.height = 'auto'; });

      let maxH = 0;
      cards.forEach(c => { maxH = Math.max(maxH, c.offsetHeight); });

      if (maxH > 0) {
        cards.forEach(c => { c.style.height = `${maxH}px`; });
      }
    };

    equalize();

    window.addEventListener('resize', equalize);
    return () => window.removeEventListener('resize', equalize);
  }, [items]);

  useEffect(() => {
    if (!emblaApi) return;

    tweenCards();

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    emblaApi.on('scroll', tweenCards);
    emblaApi.on('reInit', tweenCards);
    emblaApi.on('select', onSelect);
    emblaApi.on('resize', tweenCards);

    onSelect();

    return () => {
      emblaApi.off('scroll', tweenCards);
      emblaApi.off('reInit', tweenCards);
      emblaApi.off('select', onSelect);
      emblaApi.off('resize', tweenCards);
    };
  }, [emblaApi, tweenCards]);

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
