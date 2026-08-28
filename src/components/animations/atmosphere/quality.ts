// Adaptive quality configuration for the atmosphere scene.
//
// The scene now runs on mobile too, so we pick a config based on viewport
// width: phones get a heavily reduced resolution, lower shader intensity and
// a lower FPS cap to keep the GPU/CPU cost acceptable. Desktops keep the
// original conservative config.

export interface QualityConfig {
  /** Renderer resolution multiplier (capped DPR). */
  resolution: number;
  /** 0..1 — scales the expensive glow in the fragment shader. */
  shaderIntensity: number;
  maxFps: number;
}

/**
 * Returns the quality config used by PixiSceneEngine.
 *
 * Mobile (max-width: 768px):
 *   - resolution 0.5: half-resolution rendering, ~4x less fill-rate.
 *   - shaderIntensity 0.4: reduced glow, fewer effective cloud layers.
 *   - maxFps 24: smooth enough for slow drifting clouds, minimal CPU/GPU.
 *
 * Desktop:
 *   - resolution 1.0: no DPR scaling, keeps WebGL fill-rate low.
 *   - shaderIntensity 0.7: visible effect without overloading mobile GPUs.
 *   - maxFps 30: smooth enough for slow drifting clouds, much less CPU/GPU
 *     pressure than 60 FPS.
 */
export function getQualityConfig(): QualityConfig {
  if (typeof window !== 'undefined') {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      return {
        resolution: 0.5,
        shaderIntensity: 0.4,
        maxFps: 24,
      };
    }
  }
  return {
    resolution: 1,
    shaderIntensity: 0.7,
    maxFps: 30,
  };
}
