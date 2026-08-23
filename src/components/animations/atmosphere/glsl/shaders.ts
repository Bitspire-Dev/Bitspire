/**
 * GLSL source for the atmosphere overlay.
 *
 * Rendered via a Pixi v8 Mesh + custom Shader (NOT a Filter), so gl_FragCoord
 * maps directly to canvas pixels. The effect is a layered, twinkling star
 * field with soft brand-tinted clouds that slowly drift and breathe. The
 * canvas is transparent — there is no deep-space base, the CSS background of
 * the hero section shows through. Alpha is derived from the brightest colour
 * channel so empty pixels are fully transparent and additive content (stars,
 * clouds) blends over whatever sits behind the canvas.
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
 * Fragment shader for the atmosphere overlay.
 *
 * Uniforms:
 *   uTime          - elapsed seconds, drives drift + twinkle.
 *   uResolution    - canvas resolution in pixels.
 *   uMouse         - smoothed mouse position (-1..1) for parallax.
 *   uIntensity     - 0..1 quality-driven glow scale.
 *   uColorCloud    - cloud tint (vec3, linear 0..1), read from CSS --brand and
 *                    interpolated on the CPU so theme switches cross-fade smoothly.
 *   uStarColor     - star tint (vec3, linear 0..1), read from CSS --foreground
 *                    so stars stay contrasty against the background in both
 *                    light and dark themes (white on dark, near-black on light).
 *   uCloudStrength - density multiplier for clouds. Light backgrounds wash out
 *                    the additive blend, so the engine pushes this above 1.0
 *                    in light mode to keep the clouds readable.
 *   uParticleMode  - 0 = stars (dark mode, crisp points), 1 = fireflies
 *                    (light mode, soft glow particles). Interpolated on the CPU
 *                    so the transition cross-fades smoothly on theme switch.
 */
export const ATMOSPHERE_FRAGMENT = /* glsl */ `
precision mediump float;

in vec2 vUv;
out vec4 finalColor;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;          // -1..1, smoothed
uniform float uIntensity;      // 0..1 quality-driven
uniform vec3  uColorCloud;     // cloud tint, brand-driven (interpolated on CPU)
uniform vec3  uStarColor;      // star tint, foreground-driven (interpolated on CPU)
uniform float uCloudStrength;  // cloud density multiplier, theme-driven (interpolated)
uniform float uParticleMode;   // 0 = stars, 1 = fireflies, theme-driven (interpolated)

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

// A single layer of soft glow particles (fireflies). Same sparse-grid layout
// as starLayer, but the particles are larger, diffuse, low-opacity, and breathe
// gently instead of twinkling — they read as floating light motes or bubbles
// rather than crisp points. Used in light mode where dark stars would look
// like dirt against the bright background.
float fireflyLayer(vec2 uv, float scale, float threshold, float size, float breatheSpeed) {
  vec2 g = uv * scale;
  vec2 id = floor(g);
  vec2 f = fract(g);

  float h = hash21(id);
  if (h < threshold) return 0.0;

  vec2 sp = vec2(hash21(id + 1.3), hash21(id + 2.7));
  // Slow vertical bob — fireflies float gently rather than sitting still.
  sp.y += 0.1 * sin(uTime * 0.3 + h * 40.0);
  float d = length(f - sp);

  // Larger radius than stars — bail before the expensive smoothstep/pow.
  if (d > size * 3.0) return 0.0;

  // Very soft diffuse glow — no crisp core, just a hazy orb.
  float glow = smoothstep(size * 3.0, 0.0, d);
  glow = pow(glow, 1.5);

  // Gentle breathing, not sharp twinkle.
  float breathe = 0.5 + 0.5 * sin(uTime * breatheSpeed + h * 30.0);
  float bright = (h - threshold) / (1.0 - threshold);

  return glow * breathe * bright * 0.2;
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

  // --- base -----------------------------------------------------------------
  // Transparent canvas: start from black with alpha 0 and add stars + clouds
  // on top. The CSS background of the hero section shows through empty pixels.
  vec3 col = vec3(0.0);

  // --- particles (stars / fireflies) ----------------------------------------
  // Two variants share the same sparse-grid layout:
  //   - Stars (dark mode): crisp points in --foreground, sharp twinkle.
  //   - Fireflies (light mode): soft glow in brand+white, gentle breathing,
  //     larger and diffuse so they read as floating light motes against the
  //     bright background where dark stars would look like dirt.
  // uParticleMode blends between them so a theme switch cross-fades smoothly.
  float s1 = starLayer(starP, 25.0, 0.95, 0.018, 2.0);
  float s2 = starLayer(starP, 12.0, 0.90, 0.028, 1.3);
  float s3 = starLayer(starP,  6.0, 0.82, 0.032, 0.8);
  float starBright = s1 * 0.85 + s2 * 0.95 + s3 * 1.35;

  float f1 = fireflyLayer(starP, 25.0, 0.95, 0.040, 0.5);
  float f2 = fireflyLayer(starP, 12.0, 0.90, 0.060, 0.4);
  float f3 = fireflyLayer(starP,  6.0, 0.82, 0.080, 0.3);
  float fireflyBright = f1 * 0.6 + f2 * 0.8 + f3 * 1.0;

  // Firefly colour: brand tint lifted toward white for a soft light-blue glow.
  vec3 fireflyColor = mix(uColorCloud, vec3(1.0), 0.5);

  // Blend between the two variants based on the theme-driven mode.
  vec3 particleColor = mix(uStarColor, fireflyColor, uParticleMode);
  float particleBright = mix(starBright, fireflyBright, uParticleMode);
  col += particleColor * particleBright;

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

  vec3 cloudColor = uColorCloud; // brand-driven, smoothly interpolated on CPU
  // Strong broad body, then a bright luminous core where density peaks.
  // uCloudStrength compensates for the additive blend washing out on light
  // backgrounds — the engine pushes it above 1.0 in light mode.
  float cs = uCloudStrength;
  col = mix(col, cloudColor, c1 * 0.65 * uIntensity * cs);
  col = mix(col, cloudColor, c2 * 0.65 * uIntensity * cs);
  col = mix(col, cloudColor, c3 * 0.65 * uIntensity * cs);
  col += cloudColor * pow(c1, 2.0) * 0.35 * uIntensity * cs;
  col += cloudColor * pow(c2, 2.0) * 0.35 * uIntensity * cs;
  col += cloudColor * pow(c3, 2.0) * 0.25 * uIntensity * cs;

  // --- finishing ------------------------------------------------------------
  // Vignette — focus toward center, soften the corners. On a transparent
  // canvas this also dims alpha at the edges so the overlay fades out toward
  // the corners instead of ending abruptly. Applied to both col and
  // particleBright so the alpha derivation below stays consistent.
  float vig = smoothstep(1.3, 0.35, length(uv - 0.5));
  float vigMul = mix(0.84, 1.0, vig);
  col *= vigMul;
  particleBright *= vigMul;

  // Alpha from the brightest colour channel OR the particle brightness,
  // whichever is greater. Empty pixels (no particles, no clouds) are fully
  // transparent so the CSS hero background shows through. On dark mode
  // uStarColor is near-white so max(col) already captures star brightness; on
  // light mode the firefly colour is light-blue and max(col) is low, so
  // particleBright carries the alpha instead and the glow stays visible.
  float alpha = clamp(max(max(max(col.r, col.g), col.b), particleBright), 0.0, 1.0);
  finalColor = vec4(col, alpha);
}
`;
