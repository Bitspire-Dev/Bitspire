// Fixed quality configuration for the atmosphere scene.
//
// Previous attempts at adaptive tiering (low/medium/high) introduced a second
// WebGL init, cascading re-renders, and unpredictable performance. We now use
// a single conservative config everywhere the scene runs: capped resolution,
// capped FPS, no antialiasing, and a moderate shader intensity. The scene is
// only mounted at all on non-touch, non-mobile, non-reduced-motion devices
// (see Hero.tsx), so this config is safe for the desktops that actually reach
// it.

export interface QualityConfig {
  /** Renderer resolution multiplier (capped DPR). */
  resolution: number;
  /** 0..1 — scales the expensive glow in the fragment shader. */
  shaderIntensity: number;
  maxFps: number;
}

/**
 * Returns the one quality config used by PixiSceneEngine.
 *   - resolution 1.0: no DPR scaling, keeps WebGL fill-rate low.
 *   - shaderIntensity 0.7: visible effect without overloading mobile GPUs.
 *   - maxFps 30: smooth enough for slow drifting clouds, much less CPU/GPU
 *     pressure than 60 FPS.
 */
export function getQualityConfig(): QualityConfig {
  return {
    resolution: 1,
    shaderIntensity: 0.7,
    maxFps: 30,
  };
}
