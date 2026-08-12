// Adaptive quality detection — scales resolution and shader intensity based
// on device capability so weaker hardware stays smooth.

export type QualityTier = 'low' | 'medium' | 'high';

export interface QualityConfig {
  tier: QualityTier;
  resolution: number; // renderer resolution multiplier (capped DPR)
  shaderIntensity: number; // 0..1 — scales expensive glow in fragment shader
  maxFps: number;
}

function detectTier(): QualityTier {
  if (typeof navigator === 'undefined') return 'high';

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const dpr = window.devicePixelRatio || 1;

  if (isMobile || cores <= 4 || memory <= 2) return 'low';
  if (cores <= 6 || memory <= 4 || dpr >= 2.5) return 'medium';
  return 'high';
}

export function getQualityConfig(): QualityConfig {
  const tier = detectTier();

  switch (tier) {
    case 'low':
      return {
        tier,
        resolution: Math.min(window.devicePixelRatio || 1, 1),
        shaderIntensity: 0.55,
        maxFps: 30,
      };
    case 'medium':
      return {
        tier,
        resolution: Math.min(window.devicePixelRatio || 1, 1.5),
        shaderIntensity: 0.75,
        maxFps: 45,
      };
    case 'high':
    default:
      return {
        tier,
        resolution: Math.min(window.devicePixelRatio || 1, 1.75),
        shaderIntensity: 0.9,
        maxFps: 60,
      };
  }
}
