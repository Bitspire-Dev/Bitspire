"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { tinaField } from 'tinacms/dist/react';
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { RichTextLite } from '@/components/ui/tina/RichTextLite';

interface TechnologyData {
  title?: Record<string, unknown>;
  description?: Record<string, unknown>;
  [key: string]: unknown;
}

const logos = [
  { src: "/logo/Nextjs.svg", alt: "Next.js Logo" },
  { src: "/logo/React.svg", alt: "React Logo" },
  { src: "/logo/TypeScript.svg", alt: "TypeScript Logo" },
  { src: "/logo/Vercel_logo.svg", alt: "Vercel Logo" },
  { src: "/logo/Tailwind_CSS.svg", alt: "Tailwind CSS Logo" },
  { src: "/logo/Vite.svg", alt: "Vite Logo" },
  { src: "/logo/Stripe.svg", alt: "Stripe Logo" },
	{ src: "/logo/Docker.svg", alt: "Docker Logo" },
];

const LOGO_WIDTH = 140; // 80px image + 60px gap
const SPEED = 0.8; // Faster speed

const Technology: React.FC<{ data?: TechnologyData }> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
	const [logoCount, setLogoCount] = useState(logos.length * 8);
	// animation state stored in refs to avoid React re-renders on every frame
	const positionsRef = useRef<number[]>([]);
	const rafRef = useRef<number | null>(null);
	const itemsRef = useRef<Array<HTMLSpanElement | null>>([]);
	const lastWidthRef = useRef<number>(0);
	const resizeTimeoutRef = useRef<number | null>(null);
  
  // Use scroll animation hook
  const { ref: sectionRef, visible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  useEffect(() => {
		// Calculate how many logos are needed to fill the container + buffer
		const computeCount = () => {
			const vw = window.visualViewport?.width || window.innerWidth || 2200;
			// ignore tiny changes that occur when mobile address bar hides/shows
			if (Math.abs(vw - lastWidthRef.current) < 10 && positionsRef.current.length) return;
			lastWidthRef.current = vw;
			const minCount = Math.ceil(vw / LOGO_WIDTH) + logos.length * 5;
			setLogoCount((prev) => (prev === minCount ? prev : minCount));
			// initialize or preserve a smooth offset
			if (!positionsRef.current.length) {
				positionsRef.current = Array.from({ length: minCount }, (_, i) => i * LOGO_WIDTH);
			} else {
				const base = positionsRef.current[0];
				positionsRef.current = Array.from({ length: minCount }, (_, i) => base + i * LOGO_WIDTH);
			}
		};

		const onResize = () => {
			if (resizeTimeoutRef.current) window.clearTimeout(resizeTimeoutRef.current);
			resizeTimeoutRef.current = window.setTimeout(() => computeCount(), 120) as unknown as number;
		};

		computeCount();
		window.visualViewport?.addEventListener("resize", onResize);
		window.addEventListener("resize", onResize);
		return () => {
			window.visualViewport?.removeEventListener("resize", onResize);
			window.removeEventListener("resize", onResize);
			if (resizeTimeoutRef.current) window.clearTimeout(resizeTimeoutRef.current);
		};
  }, []);

  useEffect(() => {
		const vw = window.visualViewport?.width || window.innerWidth || 2200;
		const isMobile = vw < 768;
		const currentSpeed = isMobile ? 1.2 : SPEED;

		// per-frame transform updates (no React state churn)
		const step = () => {
			const arr = positionsRef.current;
			if (!arr.length) {
				rafRef.current = requestAnimationFrame(step);
				return;
			}
			// compute max only once per frame
			let maxPos = -Infinity;
			for (let i = 0; i < arr.length; i++) {
				if (arr[i] > maxPos) maxPos = arr[i];
			}

			for (let i = 0; i < arr.length; i++) {
				let p = arr[i] - currentSpeed;
				if (p < -LOGO_WIDTH) p = maxPos + LOGO_WIDTH;
				arr[i] = p;
				const el = itemsRef.current[i];
				if (el) el.style.transform = `translate3d(${p}px, -50%, 0)`;
			}
			rafRef.current = requestAnimationFrame(step);
		};

		if (visible && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			// initialize transforms immediately to avoid flicker
			for (let i = 0; i < positionsRef.current.length; i++) {
				const el = itemsRef.current[i];
				if (el) el.style.transform = `translate3d(${positionsRef.current[i]}px, -50%, 0)`;
			}
			rafRef.current = requestAnimationFrame(step);
		}

		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		};
	}, [visible, logoCount]);

	return (
		<section
			ref={sectionRef}
			className="w-full py-12 relative overflow-hidden"
			data-tina-field={tinaField(data)}
		>
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
		  <div className="w-16 h-0.5 bg-linear-to-r from-blue-600 to-cyan-500 mb-4"></div>
          <div data-tina-field={tinaField(data, 'title')}>
			<RichTextLite content={data?.title} preset="section-title" className="mb-3" />
          </div>
          <div data-tina-field={tinaField(data, 'description')}>
			<RichTextLite content={data?.description} preset="description" />
          </div>
        </div>
      </div>
      
	  <div className="w-full">
		<div
		  className="relative mx-auto h-32 flex items-center overflow-hidden"
		  style={{
			maxWidth: '1600px',
			minHeight: '8rem',
			WebkitMaskImage:
			  'linear-gradient(to right, transparent 0px, black 128px, black calc(100% - 128px), transparent 100%)',
			maskImage:
			  'linear-gradient(to right, transparent 0px, black 128px, black calc(100% - 128px), transparent 100%)'
		  }}
		  ref={containerRef}
		>
		  <div className="absolute left-0 top-0 w-full h-full" role="list" aria-label="Technologie" style={{ pointerEvents: "none" }}>
			{Array.from({ length: logoCount }).map((_, i) => {
			  const { src, alt } = logos[i % logos.length];
			  return (
				<span
				  key={i}
				  role="listitem"
				  ref={(el) => {
					itemsRef.current[i] = el;
				  }}
				  className="marquee-item transform-gpu will-change-transform"
				  style={{
					position: "absolute",
					left: 0,
					top: "50%",
					transform: `translate3d(${positionsRef.current[i] ?? i * LOGO_WIDTH}px, -50%, 0)`,
					width: "80px",
					display: "flex",
					justifyContent: "center"
				  }}
				>
          <div className="relative group flex justify-center items-center h-full w-full">
            <Image
              src={src}
              alt={alt}
              width={80}
              height={60}
              className="h-14 w-auto object-contain opacity-60 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 relative z-10 brightness-0 invert"
              loading="lazy"
              sizes="80px"
              style={{ height: 'auto' }}
            />
          </div>
				</span>
			  );
			})}
		  </div>
		</div>
	  </div>
	</section>
  );
};


export default Technology;

