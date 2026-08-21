/**
 * GLSL source for the diagonal plasma background.
 *
 * Rendered via a Pixi v8 Mesh + custom Shader (NOT a Filter), so gl_FragCoord
 * maps directly to canvas pixels. This eliminates the filter pipeline's
 * vTextureCoord / uOutputFrame ambiguity that caused beam positioning offsets.
 *
 * The effect is built from these layers:
 *   1. gl_FragCoord / uResolution -> normalized [0,1] coords, centered to
 *      [-0.5, 0.5]. BL = (0,0), TR = (1,1) — always exact canvas corners.
 *   2. 45deg rotation aligns +P.x with the BL->TR diagonal (y = x).
 *   3. Domain warping: bounded FBM displaces P.y for organic meander.
 *   4. High-frequency ridged FBM on rotated X, pow(., 2.2) -> needle fibres
 *      running parallel to the band axis (90deg fibre rotation). Time scrolls
 *      the noise along the beam axis so fibres flow BL->TR, with parallax
 *      between the two fibre layers and slower curtains for depth.
 *   5. Envelope mask: smoothstep band + bright core, fades to black at edges.
 *   6. Color grading: black -> brand -> white-blue core, HDR additive glow.
 */
import { NOISE_GLSL } from './noise';

/**
 * Vertex shader for a full-screen quad mesh.
 * aPosition is [0,0, 1,0, 1,1, 0,1]. We map it to clip space [-1,1].
 */
export const PLASMA_VERTEX = /* glsl */ `
  in vec2 aPosition;

  void main(void)
  {
    // Map [0,1] quad to NDC [-1,1], flipping Y so (0,0) = top-left screen.
    vec2 ndc = vec2(aPosition.x * 2.0 - 1.0, 1.0 - aPosition.y * 2.0);
    gl_Position = vec4(ndc, 0.0, 1.0);
  }
`;

/**
 * Fragment shader for the diagonal plasma beam.
 * Uses gl_FragCoord (canvas pixels) for positioning — no filter texture coords.
 *
 * Uniforms:
 *   uTime       - elapsed seconds, drives drift.
 *   uResolution - canvas resolution in pixels.
 *   uBrandColor - brand color (vec3, linear 0..1) for the fibre tint.
 */
export const PLASMA_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uBrandColor;

  out vec4 finalColor;

  ${NOISE_GLSL}

  const vec3 CORE = vec3(0.87843, 0.96862, 1.0); // #e0f7ff

  // Compute one diagonal plasma beam. rot aligns +P.x with the desired
  // diagonal. seed offsets the noise domain so beams look distinct.
  float beam(vec2 n, float aspect, float time, mat2 rot, vec2 seed)
  {
    vec2 P = rot * n;
    vec2 Pn = vec2(P.x * aspect, P.y);

    // --- Cheap envelope check BEFORE expensive noise ---
    // Most pixels are outside the band; bail out early to skip ~15 snoise
    // calls per pixel. The threshold (0.01) is below visible intensity.
    float dist = abs(P.y);
    float bandWidth = 0.14;
    float halfDiag = 1.2;
    float lengthFade = smoothstep(halfDiag, halfDiag * 0.5, abs(P.x));
    float band = smoothstep(bandWidth, 0.0, dist);
    if (band * lengthFade < 0.01) return 0.0;

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
    // 90deg rotation so needles run PARALLEL to the band axis.
    // mat2(0, -1, 1, 0) is the hardcoded 90deg rotation matrix.
    vec2 fibreUv = mat2(0.0, -1.0, 1.0, 0.0) * Pn;

    float rayFreq = 75.0;
    float rayNoise = ridgedFbm(vec2(fibreUv.x * rayFreq + time * 0.4, fibreUv.y * 2.0 + time * 0.5) + seed);
    rayNoise = pow(rayNoise, 2.2);

    // Secondary finer fibre layer for density. Faster flow = parallax.
    float rayNoise2 = ridgedFbm(vec2(fibreUv.x * 120.0 - time * 0.3, fibreUv.y * 3.0 + time * 0.7) + seed * 2.1);
    rayNoise2 = pow(rayNoise2, 2.6);
    rayNoise = max(rayNoise, rayNoise2 * 0.6);

    // Soft curtains fill between needles. Slowest flow = depth.
    float curtains = fbm(vec2(fibreUv.x * 10.0 + time * 0.08, fibreUv.y * 1.5 + time * 0.3) + seed);
    curtains = smoothstep(0.5, 0.9, curtains);

    // Envelope: wider band + bright core (band/lengthFade already computed).
    float core = smoothstep(0.05, 0.0, dist);
    core *= lengthFade;

    float intensity = band * (rayNoise * 0.9 + curtains * 0.3) + core * rayNoise * 0.6;
    return pow(intensity, 1.3);
  }

  void main()
  {
    // gl_FragCoord maps directly to canvas pixels — no filter pipeline,
    // no vTextureCoord ambiguity. Origin (0,0) = bottom-left of canvas.
    vec2 uv = gl_FragCoord.xy / uResolution;

    // Normalized coords: BL = (0,0) -> (-0.5,-0.5), TR = (1,1) -> (0.5,0.5).
    float aspect = uResolution.x / max(uResolution.y, 0.001);
    vec2 n = (uv - 0.5);

    // 45deg rotation -> band along BL->TR diagonal (y = x).
    const float k = 0.70710678;
    mat2 rot = mat2(k, -k, k, k);

    // Single beam, BL->TR, seed 0.0.
    float intensity = beam(n, aspect, uTime, rot, vec2(0.0));

    // --- Color grading: black -> brand -> core ---
    // Split by mode. Light mode has a dark brand (#0037ff), dark mode has a
    // light brand (#3d8bff). Use a hard threshold so dark mode keeps the
    // original grading (no blue haze), while light mode gets a brand-tinted,
    // longer blue range.
    float brandLuma = dot(uBrandColor, vec3(0.2126, 0.7152, 0.0722));
    float darkBrand = 1.0 - step(0.42, brandLuma);

    // Light mode: don't brighten brand. Dark mode: keep the original 1.4x glow.
    float brandBoost = mix(1.4, 1.0, darkBrand);
    vec3 brand = uBrandColor * brandBoost;

    // Light mode: 0.4-1.0 brand mix over 0.1-0.6 (blue from the start).
    // Dark mode: 0-1.0 brand mix over 0.1-0.5 (original).
    float brandStart = mix(0.1, 0.1, darkBrand);
    float brandEnd = mix(0.5, 0.6, darkBrand);
    float minBrand = mix(0.0, 0.4, darkBrand);
    float brandMix = smoothstep(brandStart, brandEnd, intensity);
    brandMix = mix(minBrand, 1.0, brandMix);
    vec3 color = mix(vec3(0.0), brand, brandMix);

    // Light mode: later, brand-tinted core. Dark mode: earlier, pure white core.
    float coreStart = mix(0.5, 0.7, darkBrand);
    float coreBrandMix = mix(0.0, 0.35, darkBrand);
    float coreT = smoothstep(coreStart, 1.0, intensity);
    coreT = pow(coreT, 1.5);
    vec3 coreTint = mix(CORE, uBrandColor, coreBrandMix);
    color = mix(color, coreTint, coreT);

    // Additive glow matches the core.
    color += coreTint * pow(intensity, 4.0) * 0.4;

    finalColor = vec4(color, intensity);
  }
`;
