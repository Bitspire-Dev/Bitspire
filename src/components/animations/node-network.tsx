'use client';

import { useEffect, useRef } from 'react';
import { Application, Graphics } from 'pixi.js';
import { useReducedMotion } from 'motion/react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface NodeNetworkProps {
  className?: string;
}

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  brightness: number;
}

interface Edge {
  a: number;
  b: number;
}

const SPACING = 70;
const DOT_RADIUS = 2.5;
const CURSOR_RADIUS = 150;
const REPEL_FORCE = 3.5;
const SPRING = 0.08;
const DAMPING = 0.86;
const BRIGHTNESS_DECAY = 0.92;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(c1: number, c2: number, t: number) {
  const r = Math.round(lerp((c1 >> 16) & 0xff, (c2 >> 16) & 0xff, t));
  const g = Math.round(lerp((c1 >> 8) & 0xff, (c2 >> 8) & 0xff, t));
  const b = Math.round(lerp(c1 & 0xff, c2 & 0xff, t));
  return (r << 16) | (g << 8) | b;
}

export function NodeNetwork({ className }: NodeNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const colorsRef = useRef<{
    base: number;
    accent: number;
    baseAlpha: number;
    accentAlpha: number;
  }>({
    base: 0x6e6b66,
    accent: 0x0037ff,
    baseAlpha: 0.14,
    accentAlpha: 0.55,
  });
  const shouldReduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const isDark = resolvedTheme === 'dark';
    colorsRef.current = {
      base: isDark ? 0xa3a09a : 0x6e6b66,
      accent: isDark ? 0x3d8bff : 0x0037ff,
      baseAlpha: isDark ? 0.25 : 0.14,
      accentAlpha: isDark ? 0.75 : 0.55,
    };
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let app: Application | null = null;
    let graphics: Graphics | null = null;
    let isActive = true;

    const buildGrid = (width: number, height: number) => {
      const cols = Math.max(2, Math.ceil(width / SPACING));
      const rows = Math.max(2, Math.ceil(height / SPACING));
      const stepX = width / cols;
      const stepY = height / rows;
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * stepX + stepX / 2;
          const y = r * stepY + stepY / 2;
          const index = r * cols + c;
          nodes.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0, brightness: 0 });

          if (c < cols - 1) edges.push({ a: index, b: index + 1 });
          if (r < rows - 1) edges.push({ a: index, b: index + cols });
          if (c < cols - 1 && r < rows - 1) {
            edges.push({ a: index, b: index + cols + 1 });
          }
          if (c > 0 && r < rows - 1) {
            edges.push({ a: index, b: index + cols - 1 });
          }
        }
      }

      nodesRef.current = nodes;
      edgesRef.current = edges;
    };

    const draw = () => {
      if (!graphics) return;
      const { base, accent, baseAlpha, accentAlpha } = colorsRef.current;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      graphics.clear();

      for (const edge of edges) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        if (!a || !b) continue;

        const brightness = (a.brightness + b.brightness) / 2;
        const color = lerpColor(base, accent, brightness);
        const alpha = lerp(baseAlpha, accentAlpha, brightness);

        graphics.moveTo(a.x, a.y).lineTo(b.x, b.y).stroke({ width: 1, color, alpha });
      }

      for (const node of nodes) {
        const color = lerpColor(base, accent, node.brightness);
        const alpha = lerp(baseAlpha, accentAlpha, node.brightness);
        graphics.circle(node.x, node.y, DOT_RADIUS).fill(color, alpha);
      }
    };

    const update = () => {
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      for (const node of nodes) {
        let targetBrightness = 0;

        if (mouse.active) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < CURSOR_RADIUS && dist > 0) {
            const force = (1 - dist / CURSOR_RADIUS) * REPEL_FORCE;
            const angle = Math.atan2(dy, dx);
            node.vx += Math.cos(angle) * force;
            node.vy += Math.sin(angle) * force;
            targetBrightness = 1 - dist / CURSOR_RADIUS;
          }
        }

        node.brightness = Math.max(node.brightness * BRIGHTNESS_DECAY, targetBrightness);

        node.vx += (node.baseX - node.x) * SPRING;
        node.vy += (node.baseY - node.y) * SPRING;
        node.vx *= DAMPING;
        node.vy *= DAMPING;
        node.x += node.vx;
        node.y += node.vy;
      }

      draw();
    };

    const handleResize = () => {
      if (!app) return;
      buildGrid(app.screen.width, app.screen.height);
      draw();
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    const init = async () => {
      try {
        app = new Application();
        await app.init({
          canvas,
          resizeTo: container,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          antialias: true,
          backgroundAlpha: 0,
          preference: 'webgl',
        });

        if (!isActive) {
          app.destroy(true, { children: true });
          return;
        }

        appRef.current = app;
        graphics = new Graphics();
        app.stage.addChild(graphics);

        buildGrid(app.screen.width, app.screen.height);

        if (shouldReduceMotion) {
          draw();
        } else {
          app.ticker.add(update);
        }

        app.renderer.on('resize', handleResize);
        container.addEventListener('pointermove', handlePointerMove);
        container.addEventListener('pointerleave', handlePointerLeave);
      } catch (error) {
        console.error('NodeNetwork: Pixi initialization failed', error);
      }
    };

    init();

    return () => {
      isActive = false;
      if (appRef.current) {
        appRef.current.ticker?.remove(update);
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerleave', handlePointerLeave);
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [shouldReduceMotion]);

  return (
    <div ref={containerRef} className={cn('absolute inset-0 overflow-hidden', className)}>
      <canvas ref={canvasRef} className="pointer-events-none block size-full" />
    </div>
  );
}
