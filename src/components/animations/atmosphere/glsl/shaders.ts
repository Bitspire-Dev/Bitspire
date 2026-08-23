/**
 * GLSL source for the deep-space atmosphere background.
 *
 * Rendered via a Pixi v8 Mesh + custom Shader (NOT a Filter), so gl_FragCoord
 * maps directly to canvas pixels. The effect is a layered, twinkling star
 * field drifting over a near-black cosmos with soft sky-blue clouds that
 * slowly drift and breathe. The palette is universal: the backdrop stays dark
 * under both light and dark UI themes, so one animation fits both.
 */
import { NOISE_GLSL } from './noise';

/**
 * Vertex shader for a fullscreen quad mesh.
 * aPosition is [0,0, 1,0, 0,1, 1,1]. We map it to clip space [-1,1] and pass
 * through vUv so the fragment shader can use normalized [0,1] coords.
 */
export const ATMOSPHERE_VERTEX = /* glsl */ `
in vec2 aPosition;
out vec2 vUv;

uniform vec4 uScreen;

void main() {
  vUv = aPosition;
  vec2 pos = aPosition * 2.0 - 1.0;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;

/**
 * Fragment shader for the deep-space backdrop.
 *
 * Uniforms:
 *   uTime       - elapsed seconds, drives drift + twinkle.
 *   uResolution - canvas resolution in pixels.
 *   uMouse      - smoothed mouse position (-1..1) for parallax.
 *   uIntensity  - 0..1 quality-driven glow scale.
 *   uColorDeep  - near-black base color (vec3, linear 0..1).
 *   uColorCloud - cloud tint (vec3, linear 0..1), theme-driven, interpolated
 *                 on the CPU so theme switches cross-fade smoothly.
 */
export const ATMOSPHERE_FRAGMENT = /* glsl */ `
precision mediump float;

in vec2 vUv;
out vec4 finalColor;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;       // -1..1, smoothed
uniform float uIntensity;   // 0..1 quality-driven
uniform vec3  uColorDeep;   // near-black base
uniform vec3  uColorCloud;  // cloud tint, theme-driven (interpolated on CPU)

${NOISE_GLSL}

// A single soft cloud volume anchored near \`center\`. Returns a smooth
// density in 0..1 — diffuse in the middle, feathering gently to nothing at
// the edges so it always melts into the backdrop with no hard boundary.
float cloud(vec2 p, vec2 center, float t, float seed, float size, vec2 stretch) {
  vec2 d = p - center;

  // Elliptical falloff — stretch controls the aspect (x vs y sensitivity).
  // Computed first so we can bail out before the expensive fbm calls when the
  // pixel is outside the cloud (fall ≈ 0 → contribution below 8-bit precision).
  float fall = 1.0 - smoothstep(0.0, size, length(d * stretch));
  if (fall < 0.001) return 0.0;
  fall = fall * fall;

  // Slow domain warp for organic, drifting shape.
  vec2 warp = vec2(
    fbm(p * 1.1 + t * 0.15 + seed),
    fbm(p * 1.1 - t * 0.12 + seed + 7.3)
  ) - 0.5;

  float density = fbm(p * 1.35 + warp * 0.9 + vec2(t * 0.05, -t * 0.03) + seed);

  // Gentle vertical breathing so it feels alive without any motion lines.
  float breathe = 0.5 + 0.5 * sin(t * 0.4 + seed);

  return smoothstep(0.30, 0.95, density) * fall * (0.82 + 0.18 * breathe);
}

// A single layer of the star field. The screen is split into a grid of cells;
// only a sparse fraction host a star (gated by \`threshold\`), jittered to a
// random position within the cell so the field never reads as a grid. Each
// star has a soft round core with a faint halo, twinkles on its own phase,
// and varies in brightness — together giving a natural, organic look.
float starLayer(vec2 uv, float scale, float threshold, float size, float twinkleSpeed) {
  vec2 g = uv * scale;
  vec2 id = floor(g);
  vec2 f = fract(g);

  float h = hash21(id);
  // Sparse — only the brightest cells (h above threshold) host a star.
  if (h < threshold) return 0.0;

  // Jittered position within the cell.
  vec2 sp = vec2(hash21(id + 1.3), hash21(id + 2.7));
  float d = length(f - sp);

  // Outside the halo radius — both core and halo are 0, bail before sin/smoothstep.
  if (d > size * 2.2) return 0.0;

  // Soft round core plus a tight faint halo around it — kept small so stars
  // read as crisp points rather than soft dust motes.
  float core = smoothstep(size, 0.0, d);
  float halo = smoothstep(size * 2.2, 0.0, d) * 0.10;

  // Per-star twinkle, each on its own phase. Kept gentle so the sky stays calm.
  float tw = 0.7 + 0.3 * sin(uTime * twinkleSpeed + h * 60.0);

  // Brightness varies per star (h normalised to 0..1 above the threshold).
  float bright = (h - threshold) / (1.0 - threshold);

  return (core + halo) * tw * bright;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Subtle parallax from the mouse — the scene drifts toward the cursor.
  // Y is flipped because DOM mouse Y grows downward while vUv.y grows upward,
  // so without the negation moving the mouse down would push clouds up.
  vec2 par = uMouse * vec2(0.03, -0.03);
  p -= par;

  // Stars are "far away", so they ride a gentler parallax than the clouds.
  vec2 starP = vec2(uv.x * aspect, uv.y) - par * 0.3;

  float t = uTime * 0.08;

  // --- deep space base ------------------------------------------------------
  // Radial darkening from a slightly-lifted center out to near-black corners,
  // so the cosmos feels deep rather than a flat fill.
  float d0 = length(uv - vec2(0.5, 0.45));
  vec3 col = mix(uColorDeep * 1.3, uColorDeep * 0.55, smoothstep(0.1, 1.1, d0));

  // --- star field -----------------------------------------------------------
  // Three layers at different densities and sizes give a sense of depth: many
  // tiny far stars, fewer medium ones, and a handful of bright near stars.
  // Near stars are pushed whiter and kept a touch smaller so they read as crisp
  // points; far stars are kept at their size but brightened so the whole field
  // reads as clearly white against the blue-tinted cosmos. Each twinkles on its
  // own phase and varies in brightness, so the field reads as natural rather
  // than a regular grid.
  float s1 = starLayer(starP, 25.0, 0.95, 0.018, 2.0); // far  — tiny, many, whiter
  float s2 = starLayer(starP, 12.0, 0.90, 0.028, 1.3); // mid  — medium
  float s3 = starLayer(starP,  6.0, 0.82, 0.032, 0.8); // near — few, bright, smaller
  col += vec3(s1 * 0.85 + s2 * 0.95 + s3 * 1.35);

  // --- clouds ---------------------------------------------------------------
  // A balanced, natural composition: two main clouds mirrored across the
  // center with converging/diverging drift, plus a smaller, fainter cloud
  // higher up to complete the cluster. A small phase offset on the right
  // cloud breaks the perfect mirror so it doesn't read as mechanically
  // flipped — symmetry without artifice.
  float driftX = 0.025 * sin(t * 0.14);
  float driftY = 0.018 * cos(t * 0.11);
  vec2 leftCenter  = vec2((0.34 + driftX) * aspect, 0.50 + driftY);
  vec2 rightCenter = vec2((0.66 - driftX) * aspect, 0.50 + driftY + 0.012 * sin(t * 0.09 + 0.7));
  vec2 topCenter   = vec2(0.50 * aspect, 0.66 + 0.015 * sin(t * 0.08 + 2.0));

  // Large, tall clouds — stretch y less than x so they read as full-height.
  float c1 = cloud(p, leftCenter, t, 0.0, 2.6, vec2(0.75, 0.45));
  float c2 = cloud(p, rightCenter, t, 13.7, 2.6, vec2(0.75, 0.45));
  float c3 = cloud(p, topCenter, t, 27.4, 3.4, vec2(0.85, 0.50)) * 0.6;

  vec3 cloudColor = uColorCloud; // theme-driven, smoothly interpolated on CPU
  // Strong broad body, then a bright luminous core where density peaks.
  col = mix(col, cloudColor, c1 * 0.65 * uIntensity);
  col = mix(col, cloudColor, c2 * 0.65 * uIntensity);
  col = mix(col, cloudColor, c3 * 0.65 * uIntensity);
  col += cloudColor * pow(c1, 2.0) * 0.35 * uIntensity;
  col += cloudColor * pow(c2, 2.0) * 0.35 * uIntensity;
  col += cloudColor * pow(c3, 2.0) * 0.25 * uIntensity;

  // --- finishing ------------------------------------------------------------
  // Vignette — focus toward center, soften the corners.
  float vig = smoothstep(1.3, 0.35, length(uv - 0.5));
  col *= mix(0.84, 1.0, vig);

  // Subtle film grain to break banding on the flat dark areas.
  float grain = (hash21(uv * uResolution + t * 20.0) - 0.5) * 0.012;
  col += grain;

  finalColor = vec4(col, 1.0);
}
`;
