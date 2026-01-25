"use client";
import { useEffect, useMemo, useRef, useState } from "react";

// Simple reusable intersection-based reveal hook
export function useScrollAnimation<T extends HTMLElement>(options: IntersectionObserverInit = { threshold: 0.2 }) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  const thresholdKey = Array.isArray(options.threshold)
    ? options.threshold.join(",")
    : String(options.threshold ?? "");

  const memoOptions = useMemo(
    () => options,
    [options.root, options.rootMargin, thresholdKey]
  );

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node || typeof window === "undefined") return;
    const observer = new window.IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, memoOptions);
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, memoOptions]);

  return { ref, visible } as const;
}