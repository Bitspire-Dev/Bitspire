import { Geometry, GlProgram, Mesh, Shader, UniformGroup } from 'pixi.js';
import { ATMOSPHERE_VERTEX, ATMOSPHERE_FRAGMENT } from './glsl/shaders';

export interface AtmosphereMeshOptions {
  width?: number;
  height?: number;
  intensity?: number;
  colorCloud?: [number, number, number];
  starColor?: [number, number, number];
  cloudStrength?: number;
  particleMode?: number;
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
      uColorCloud: {
        value: options.colorCloud ?? [0.0, 0.216, 1.0],
        type: 'vec3<f32>',
      },
      uStarColor: {
        value: options.starColor ?? [0.925, 0.922, 0.913],
        type: 'vec3<f32>',
      },
      uCloudStrength: {
        value: options.cloudStrength ?? 1,
        type: 'f32',
      },
      uParticleMode: {
        value: options.particleMode ?? 0,
        type: 'f32',
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

  get colorCloud(): [number, number, number] {
    return this.atmosphereUniforms.uniforms.uColorCloud as [number, number, number];
  }

  set colorCloud(value: [number, number, number]) {
    this.atmosphereUniforms.uniforms.uColorCloud = value;
  }

  get starColor(): [number, number, number] {
    return this.atmosphereUniforms.uniforms.uStarColor as [number, number, number];
  }

  set starColor(value: [number, number, number]) {
    this.atmosphereUniforms.uniforms.uStarColor = value;
  }

  get cloudStrength(): number {
    return this.atmosphereUniforms.uniforms.uCloudStrength as number;
  }

  set cloudStrength(value: number) {
    this.atmosphereUniforms.uniforms.uCloudStrength = value;
  }

  get particleMode(): number {
    return this.atmosphereUniforms.uniforms.uParticleMode as number;
  }

  set particleMode(value: number) {
    this.atmosphereUniforms.uniforms.uParticleMode = value;
  }
}
