'use client';

import { Filter, GlProgram, UniformGroup } from 'pixi.js';
import { PLASMA_VERTEX, PLASMA_FRAGMENT } from './plasma-shaders';

export interface PlasmaFilterOptions {
  brandColor?: [number, number, number];
  backgroundColor?: [number, number, number];
}

/**
 * Pixi v8 filter that renders a diagonal aurora/plasma band.
 *
 * The GLSL lives in `plasma-shaders.ts` (composed from `glsl-noise.ts`); this
 * class only wires the uniforms and exposes typed accessors for the React
 * component that drives it.
 */
export class PlasmaFilter extends Filter {
  constructor(options: PlasmaFilterOptions = {}) {
    const glProgram = GlProgram.from({
      vertex: PLASMA_VERTEX,
      fragment: PLASMA_FRAGMENT,
      name: 'plasma-filter',
    });

    super({
      glProgram,
      resources: {
        globals: new UniformGroup({
          uTime: { value: 0, type: 'f32' },
          uResolution: { value: [1, 1], type: 'vec2<f32>' },
          uBrandColor: {
            value: options.brandColor ?? [0, 0.216, 1],
            type: 'vec3<f32>',
          },
          uBackgroundColor: {
            value: options.backgroundColor ?? [0, 0, 0],
            type: 'vec3<f32>',
          },
        }),
      },
    });
  }

  get time() {
    return this.resources.globals.uniforms.uTime as number;
  }

  set time(value: number) {
    this.resources.globals.uniforms.uTime = value;
  }

  get canvasResolution() {
    return this.resources.globals.uniforms.uResolution as [number, number];
  }

  set canvasResolution(value: [number, number]) {
    this.resources.globals.uniforms.uResolution = value;
  }

  get brandColor() {
    return this.resources.globals.uniforms.uBrandColor as [number, number, number];
  }

  set brandColor(value: [number, number, number]) {
    this.resources.globals.uniforms.uBrandColor = value;
  }

  get backgroundColor() {
    return this.resources.globals.uniforms.uBackgroundColor as [number, number, number];
  }

  set backgroundColor(value: [number, number, number]) {
    this.resources.globals.uniforms.uBackgroundColor = value;
  }
}
