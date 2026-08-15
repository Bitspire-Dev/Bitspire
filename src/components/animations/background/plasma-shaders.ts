/**
 * GLSL source for the diagonal aurora/plasma background.
 *
 * Implemented strictly per the migration spec:
 *
 *   1. UV transform + aspect correction + 35deg rotation -> diagonal axis P.
 *   2. Domain warping: P.y is displaced by FBM * u_time * 0.3 (floating smoke).
 *   3. High-frequency rays: warped P.x * 38.0 through FBM, then pow(., 2.2)
 *      to force sharp needle-like fibres (no smooth blobs).
 *   4. Envelope mask: smoothstep(width, 0.0, abs(P.y + warp)) fades edges.
 *   5. Color grading: 3-step ramp
 *        deep navy #020a30 -> cyan #00a8ff -> white-blue #e0f7ff
 *      with non-linear mix and HDR core boost.
 *
 * Noise is Simplex (Ashima/Gustavson) from glsl-noise.ts — no sin/cos blobs,
 * no symmetric patterns. Aspect ratio is corrected inside the shader so the
 * band keeps its diagonal angle at any window size.
 *
 * GLSL ES 3.0 (Pixi v8 filter pipeline). Pixi injects precision/version and
 * rewrites `texture` for WebGL1.
 */
import { NOISE_GLSL } from './glsl-noise';

/** Standard Pixi v8 filter quad vertex shader. */
export const PLASMA_VERTEX = /* glsl */ `
  in vec2 aPosition;
  out vec2 vTextureCoord;

  uniform vec4 uInputSize;
  uniform vec4 uOutputFrame;
  uniform vec4 uOutputTexture;

  vec4 filterVertexPosition(void)
  {
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
    return vec4(position, 0.0, 1.0);
  }

  vec2 filterTextureCoord(void)
  {
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
  }

  void main(void)
  {
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
  }
`;

/**
 * Fragment shader for the diagonal aurora.
 *
 * Uniforms:
 *   uTexture         - sampler for the filtered sprite (used for alpha).
 *   uTime            - elapsed seconds, drives drift.
 *   uResolution      - canvas resolution in pixels (aspect correction).
 *   uBrandColor      - deep brand color (vec3, linear 0..1) — used as the
 *                      outermost tint before the navy ramp.
 *   uBackgroundColor - page background color (vec3, linear 0..1) for vignette.
 */
export const PLASMA_FRAGMENT = /* glsl */ `
  in vec2 vTextureCoord;
  out vec4 finalColor;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uBrandColor;
  uniform vec3 uBackgroundColor;

  ${NOISE_GLSL}

  // 3-step color ramp from the spec (linear 0..1).
  const vec3 NAVY  = vec3(0.00784, 0.03921, 0.18823); // #020a30
  const vec3 CYAN  = vec3(0.0,      0.65882, 1.0);    // #00a8ff
  const vec3 CORE  = vec3(0.87843, 0.96862, 1.0);     // #e0f7ff

  // Compute one diagonal aurora beam. rot aligns +P.x with the desired
  // diagonal (45deg for BL->TR, -45deg for TL->BR). seed offsets the noise
  // domain so two beams don't look identical. Returns intensity in ~[0,1].
  float beam(vec2 n, float aspect, float time, mat2 rot, vec2 seed)
  {
    vec2 P = rot * n;
    vec2 Pn = vec2(P.x * aspect, P.y);

    // Bounded meander: FBM input animates with time, amplitude is constant
    // and smaller than bandWidth so the band stays a gentle wave on the axis.
    float warpAmount = 0.035;
    float warp = fbm(Pn * 2.0 + seed + vec2(0.0, time * 0.15));
    warp = (warp - 0.5) * 2.0;
    P.y += warp * warpAmount;
    float warp2 = fbm(Pn * 1.3 + seed * 3.7 + vec2(time * 0.05, 10.0));
    P.x += (warp2 - 0.5) * 0.04;
    Pn = vec2(P.x * aspect, P.y);

    // High-frequency needles along the band, sharpened with pow.
    float rayFreq = 38.0;
    float rayNoise = ridgedFbm(vec2(Pn.x * rayFreq + time * 0.4, Pn.y * 2.0) + seed);
    rayNoise = pow(rayNoise, 2.2);

    // Soft curtains fill between needles.
    float curtains = fbm(vec2(Pn.x * 5.0 + time * 0.08, Pn.y * 1.5) + seed);
    curtains = smoothstep(0.5, 0.9, curtains);

    // Envelope: tight band on the (warped) center line + bright core.
    float dist = abs(P.y);
    float bandWidth = 0.07;
    float band = smoothstep(bandWidth, 0.0, dist);
    float core = smoothstep(0.025, 0.0, dist);
    float halfDiag = 0.70711;
    float lengthFade = smoothstep(halfDiag, halfDiag * 0.4, abs(P.x));
    band *= lengthFade;
    core *= lengthFade;

    float intensity = band * (rayNoise * 0.9 + curtains * 0.3) + core * rayNoise * 0.6;
    return pow(intensity, 1.3);
  }

  void main()
  {
    vec2 uv = vTextureCoord;

    // Raw normalized coords: BL = (-0.5,-0.5), TR = (0.5,0.5).
    float aspect = uResolution.x / max(uResolution.y, 0.001);
    vec2 n = (uv - 0.5);

    // -45deg rotation -> band along BL->TR diagonal (y = x).
    const float k = 0.70710678;
    mat2 rot = mat2(k, k, -k, k);

    // Single beam, BL->TR, seed 0.0.
    float intensity = beam(n, aspect, uTime, rot, vec2(0.0));

    // --- Step 5: color grading (3-step ramp + HDR core) -------------------
    // Outer tint blends the page brand color into the spec navy so the
    // background stays on-brand at the very edges.
    vec3 deep = mix(NAVY, uBrandColor * 0.4 + NAVY * 0.6, 0.35);

    // Navy -> cyan across the lower intensity range.
    vec3 color = mix(deep, CYAN, smoothstep(0.1, 0.55, intensity));
    // Cyan -> white-blue core at high intensity, with a non-linear boost.
    float coreT = smoothstep(0.55, 1.0, intensity);
    coreT = pow(coreT, 1.5);
    color = mix(color, CORE, coreT);
    // HDR-ish additive glow on the brightest needles.
    color += CORE * pow(intensity, 4.0) * 0.4;

    // --- Vignette: fade into the page background --------------------------
    // Use raw normalized coords (no aspect stretch) so the vignette is a true
    // ellipse aligned with the screen, not a squashed circle.
    float vignette = 1.0 - smoothstep(0.45, 0.85, length(n) * 1.1);
    color = mix(uBackgroundColor, color, vignette);

    // Keep the filtered sprite's alpha (Pixi expects the texture sampled).
    vec4 tex = texture(uTexture, vTextureCoord);
    finalColor = vec4(color, tex.a);
  }
`;
