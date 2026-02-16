'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Carousel3DProps<T> {
  items: T[];
  renderItem: (item: T, index: number, isCenter: boolean) => React.ReactNode;
  getKey: (item: T, index: number) => string;
  controlLabels: { prev: string; next: string };
  initialIndex?: number;
  className?: string;
  containerHeight?: string;
}

export default function Carousel3D<T>({
  items,
  renderItem,
  getKey,
  controlLabels,
  initialIndex = 1,
  className = '',
  containerHeight = 'h-125',
}: Carousel3DProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (items.length === 0) return null;

  const getIndex = (idx: number) => {
    const len = items.length;
    return ((idx % len) + len) % len;
  };

  const handleNext = () => setCurrentIndex((prev) => getIndex(prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => getIndex(prev - 1));

  return (
    <div className={`relative ${containerHeight} flex items-center justify-center perspective-1000 ${className}`}>
      <AnimatePresence mode="popLayout">
        {[-1, 0, 1].map((offset) => {
          const index = getIndex(currentIndex + offset);
          const item = items[index];
          if (!item) return null;

          const isCenter = offset === 0;
          const xOffset = offset * 320;
          const scale = isCenter ? 1.1 : 0.85;
          const opacity = isCenter ? 1 : 0.5;
          const zIndex = isCenter ? 10 : 0;
          const rotateY = offset * -25;

          const key = getKey(item, index);

          return (
            <motion.div
              key={`${key}-${index}`}
              layoutId={key}
              initial={{ x: xOffset, scale, opacity, zIndex, rotateY }}
              animate={{ x: xOffset, scale, opacity, zIndex, rotateY }}
              transition={{ duration: 0.5, ease: 'circOut' }}
              style={{ position: 'absolute', width: '350px' }}
              className="rounded-2xl cursor-pointer"
              onClick={() => {
                if (offset !== 0) setCurrentIndex(index);
              }}
            >
              {renderItem(item, index, isCenter)}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 z-20 p-3 rounded-full bg-black/30 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors"
        aria-label={controlLabels.prev}
      >
        <span className="sr-only">{controlLabels.prev}</span>
        <FaChevronLeft className="text-white text-xl" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 z-20 p-3 rounded-full bg-black/30 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors"
        aria-label={controlLabels.next}
      >
        <span className="sr-only">{controlLabels.next}</span>
        <FaChevronRight className="text-white text-xl" />
      </button>
    </div>
  );
}
