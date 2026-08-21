/**
 * Reusable GLSL noise helpers for the atmosphere shader, exported as a string
 * so they can be composed into the fragment shader without duplicating source.
 *
 * Provides a cheap hash-based value noise plus FBM built on top of it — enough
 * for the soft, billowy clouds and twinkling star field of the deep-space
 * backdrop without paying for Simplex noise on low-power GPUs.
 *
 * All functions are GLSL ES 3.0 compatible (Pixi v8 mesh pipeline).
 */
export const NOISE_GLSL = /* glsl */ `
// --- hash / noise ----------------------------------------------------------

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion — 4 octaves gives a soft, billowy cloud field
// while staying cheap enough for low-power GPUs.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}
`;
