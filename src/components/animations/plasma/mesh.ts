import { GlProgram, Mesh, MeshGeometry, Shader, UniformGroup } from 'pixi.js';
import { PLASMA_VERTEX, PLASMA_FRAGMENT } from './glsl/shaders';

export interface PlasmaMeshOptions {
  brandColor?: [number, number, number];
  width?: number;
  height?: number;
}

/**
 * Full-screen quad mesh with a custom plasma shader.
 *
 * Uses gl_FragCoord (canvas pixels) for positioning, which maps exactly to
 * the canvas/parent bounds with no offset from the filter pipeline.
 */
export class PlasmaMesh extends Mesh<MeshGeometry, Shader> {
  private readonly plasmaUniforms: UniformGroup;

  constructor(options: PlasmaMeshOptions = {}) {
    const geometry = new MeshGeometry({
      positions: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
    });

    const plasmaUniforms = new UniformGroup({
      uTime: { value: 0, type: 'f32' },
      uResolution: {
        value: [options.width ?? 1, options.height ?? 1],
        type: 'vec2<f32>',
      },
      uBrandColor: {
        value: options.brandColor ?? [0, 0.216, 1],
        type: 'vec3<f32>',
      },
    });

    const glProgram = GlProgram.from({
      vertex: PLASMA_VERTEX,
      fragment: PLASMA_FRAGMENT,
      name: 'plasma-mesh',
    });

    const shader = new Shader({
      glProgram,
      resources: {
        plasmaUniforms,
      },
    });

    super({ geometry, shader });

    this.plasmaUniforms = plasmaUniforms;
  }

  get time() {
    return this.plasmaUniforms.uniforms.uTime as number;
  }

  set time(value: number) {
    this.plasmaUniforms.uniforms.uTime = value;
  }

  get canvasResolution() {
    return this.plasmaUniforms.uniforms.uResolution as [number, number];
  }

  set canvasResolution(value: [number, number]) {
    this.plasmaUniforms.uniforms.uResolution = value;
  }

  get brandColor() {
    return this.plasmaUniforms.uniforms.uBrandColor as [number, number, number];
  }

  set brandColor(value: [number, number, number]) {
    this.plasmaUniforms.uniforms.uBrandColor = value;
  }
}
