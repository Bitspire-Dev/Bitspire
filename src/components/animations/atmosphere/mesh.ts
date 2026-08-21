import { Geometry, GlProgram, Mesh, Shader, UniformGroup } from 'pixi.js';
import { ATMOSPHERE_VERTEX, ATMOSPHERE_FRAGMENT } from './glsl/shaders';

export interface AtmosphereMeshOptions {
  width?: number;
  height?: number;
  intensity?: number;
  colorDeep?: [number, number, number];
  colorCloud?: [number, number, number];
}

// Fullscreen quad geometry — covers the whole screen with two triangles.
const FULLSCREEN_GEOMETRY = new Geometry({
  attributes: {
    aPosition: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
  },
  indexBuffer: new Uint16Array([0, 1, 2, 1, 3, 2]),
});

/**
 * Fullscreen quad mesh with the atmosphere shader.
 *
 * Owns the geometry + shader + uniforms. The engine drives it by writing to
 * the typed getters/setters each frame (time, mouse, resolution, cloud tint).
 * Keeping the mesh self-contained mirrors the plasma folder's `PlasmaMesh` and
 * lets the engine stay focused on lifecycle / ticker / theme interpolation.
 */
export class AtmosphereMesh extends Mesh<Geometry, Shader> {
  private readonly atmosphereUniforms: UniformGroup;

  constructor(options: AtmosphereMeshOptions = {}) {
    const atmosphereUniforms = new UniformGroup({
      uTime: { value: 0, type: 'f32' },
      uResolution: {
        value: [options.width ?? 1, options.height ?? 1],
        type: 'vec2<f32>',
      },
      uMouse: { value: [0, 0], type: 'vec2<f32>' },
      uIntensity: { value: options.intensity ?? 1, type: 'f32' },
      uColorDeep: {
        value: options.colorDeep ?? [0.016, 0.02, 0.045],
        type: 'vec3<f32>',
      },
      uColorCloud: {
        value: options.colorCloud ?? [0.0, 0.216, 1.0],
        type: 'vec3<f32>',
      },
    });

    const glProgram = GlProgram.from({
      vertex: ATMOSPHERE_VERTEX,
      fragment: ATMOSPHERE_FRAGMENT,
      name: 'atmosphere-mesh',
    });

    const shader = new Shader({
      glProgram,
      resources: {
        atmosphereUniforms,
      },
    });

    super({ geometry: FULLSCREEN_GEOMETRY, shader });

    this.atmosphereUniforms = atmosphereUniforms;
  }

  get time() {
    return this.atmosphereUniforms.uniforms.uTime as number;
  }

  set time(value: number) {
    this.atmosphereUniforms.uniforms.uTime = value;
  }

  get resolution(): [number, number] {
    return this.atmosphereUniforms.uniforms.uResolution as [number, number];
  }

  set resolution(value: [number, number]) {
    this.atmosphereUniforms.uniforms.uResolution = value;
  }

  get mouse(): [number, number] {
    return this.atmosphereUniforms.uniforms.uMouse as [number, number];
  }

  set mouse(value: [number, number]) {
    this.atmosphereUniforms.uniforms.uMouse = value;
  }

  get intensity() {
    return this.atmosphereUniforms.uniforms.uIntensity as number;
  }

  get colorDeep(): [number, number, number] {
    return this.atmosphereUniforms.uniforms.uColorDeep as [number, number, number];
  }

  get colorCloud(): [number, number, number] {
    return this.atmosphereUniforms.uniforms.uColorCloud as [number, number, number];
  }

  set colorCloud(value: [number, number, number]) {
    this.atmosphereUniforms.uniforms.uColorCloud = value;
  }
}
