// Adaptive quality configuration — scales resolution, shader intensity and
// max FPS based on a device tier provided by DeviceCapabilityProvider.
//
// Previously this module ran its own `navigator.hardwareConcurrency` sniff.
// That worked but duplicated the heuristics that now live in
// `src/lib/device-capability.ts`. Centralising the tier detection means every
// heavy component (Hero, Pixi, carousel) reacts to the same signal, and a
// future change to the heuristics propagates everywhere automatically.

import type { DeviceTier } from '@/lib/device-capability';

export type QualityTier = DeviceTier;

export interface QualityConfig {
  tier: QualityTier;
  /** Renderer resolution multiplier (capped DPR). */
  resolution: number;
  /** 0..1 — scales expensive glow in the fragment shader. */
  shaderIntensity: number;
  maxFps: number;
}

/**
 * Returns the quality config for a given tier. On the server (or before the
 * DeviceCapabilityProvider has hydrated) callers should pass `'high'` so the
 * SSR markup matches the richest client render; the real tier is applied on
 * the first client effect.
 */
export function getQualityConfig(tier: QualityTier = 'high'): QualityConfig {
  switch (tier) {
    case 'low':
      return {
        tier,
        // Render at exactly 1× — no DPR scaling. WebGL fill rate is the main
        // cost on weak GPUs, so dropping resolution is the highest-leverage
        // lever we have.
        resolution: 1,
        shaderIntensity: 0.4,
        // 24 FPS is enough for a slow-drifting cloud field and keeps the
        // ticker out of the way of input handling on a busy main thread.
        maxFps: 24,
      };
    case 'medium':
      return {
        tier,
        resolution: 1,
        shaderIntensity: 0.6,
        maxFps: 30,
      };
    case 'high':
    default:
      return {
        tier,
        resolution: Math.min(
          typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
          1.75
        ),
        shaderIntensity: 0.9,
        maxFps: 60,
      };
  }
}
