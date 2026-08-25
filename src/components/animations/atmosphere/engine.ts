// Main PixiJS scene orchestrator — owns the Application lifecycle, ticker,
// resize handling, mouse parallax, visibility pausing and theme cross-fade.
// The actual shader + geometry live in AtmosphereMesh (./mesh); the engine
// just drives its uniforms every frame.

import { Application } from 'pixi.js';
import { AtmosphereMesh } from './mesh';
import { MouseController } from './mouse';
import { getQualityConfig, type QualityConfig } from './quality';
import { getCssColor } from '@/lib/color';

export type SceneTheme = 'dark' | 'light';

// Fallback colours (dark-mode values) used when the CSS variables can't be
// read (SSR guard or missing variable). Match globals.css `.dark`.
const BRAND_FALLBACK: [number, number, number] = [0.239, 0.545, 1.0]; // #3d8bff
const FOREGROUND_FALLBACK: [number, number, number] = [0.925, 0.922, 0.913]; // #ecebe9

// Cloud density multiplier per theme. The shader blends clouds additively,
// which washes out on light backgrounds — pushing this above 1.0 in light mode
// keeps the clouds readable against white.
const CLOUD_STRENGTH_DARK = 1.0;
const CLOUD_STRENGTH_LIGHT = 2.5;

function getCloudStrength(theme: SceneTheme): number {
  return theme === 'light' ? CLOUD_STRENGTH_LIGHT : CLOUD_STRENGTH_DARK;
}

// Particle mode: 0 = stars (dark mode), 1 = fireflies (light mode).
function getParticleMode(theme: SceneTheme): number {
  return theme === 'light' ? 1.0 : 0.0;
}

export class PixiSceneEngine {
  private app: Application;
  private mesh: AtmosphereMesh | null = null;
  private mouse: MouseController;
  private quality: QualityConfig;
  private visibilityHandler: (() => void) | null = null;
  private tickerFn: ((ticker: { deltaTime: number }) => void) | null = null;
  private destroyed = false;
  // True once `app.init()` has resolved. `Application.destroy()` invokes the
  // ResizePlugin, which calls `_cancelResize` — a function only assigned during
  // `app.init()`. Calling `app.destroy()` before init completes throws
  // `this._cancelResize is not a function`, so we must gate it on this flag.
  private initialized = false;
  private startTime = 0;
  // Theme-dependent shader values, each interpolated current → target every
  // frame so a theme switch cross-fades smoothly instead of re-initialising the
  // WebGL scene. Three channels: cloud tint (--brand), star tint (--foreground),
  // and cloud density multiplier (compensates for additive blend washing out on
  // light backgrounds).
  private cloudCurrent: [number, number, number];
  private cloudTarget: [number, number, number];
  private starCurrent: [number, number, number];
  private starTarget: [number, number, number];
  private strengthCurrent: number;
  private strengthTarget: number;
  private particleModeCurrent: number;
  private particleModeTarget: number;
  // True once all three interpolations have reached their targets — skips the
  // per-frame work in tick() until setTheme() resets it.
  private themeSettled = false;
  // Pre-allocated arrays to avoid per-frame GC pressure in tick()
  private readonly _mouseBuf: Float32Array = new Float32Array(2);
  private readonly _resBuf: Float32Array = new Float32Array(2);
  private readonly _cloudBuf: Float32Array = new Float32Array(3);
  private readonly _starBuf: Float32Array = new Float32Array(3);

  constructor(
    private container: HTMLElement,
    private theme: SceneTheme
  ) {
    this.quality = getQualityConfig();
    this.app = new Application();
    this.mouse = new MouseController(window);
    const brand = getCssColor('--brand', BRAND_FALLBACK);
    this.cloudCurrent = [...brand];
    this.cloudTarget = [...brand];
    const fg = getCssColor('--foreground', FOREGROUND_FALLBACK);
    this.starCurrent = [...fg];
    this.starTarget = [...fg];
    this.strengthCurrent = getCloudStrength(theme);
    this.strengthTarget = this.strengthCurrent;
    this.particleModeCurrent = getParticleMode(theme);
    this.particleModeTarget = this.particleModeCurrent;
  }

  /**
   * Re-read the theme-dependent colours and density from the DOM and chase
   * them via the ticker. The MutationObserver in scene.tsx calls this after
   * the <html> class changes, so getComputedStyle already returns the new
   * theme's variables. Everything is interpolated toward the targets every
   * frame in `tick()`, so calling this is instant and cheap — no scene rebuild,
   * no flash, just a smooth cross-fade (~0.4s at 60fps).
   */
  setTheme(theme: SceneTheme) {
    if (this.theme === theme) return;
    this.theme = theme;
    this.cloudTarget = [...getCssColor('--brand', BRAND_FALLBACK)];
    this.starTarget = [...getCssColor('--foreground', FOREGROUND_FALLBACK)];
    this.strengthTarget = getCloudStrength(theme);
    this.particleModeTarget = getParticleMode(theme);
    this.themeSettled = false;
  }

  async init() {
    await this.app.init({
      resizeTo: this.container,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: this.quality.resolution,
      powerPreference: 'high-performance',
    });

    // Init finished — from here `app.destroy()` is safe. Set this before the
    // destroyed check so that a deferred destroy (requested while awaiting)
    // can safely tear down the now-fully-initialized application.
    this.initialized = true;

    if (this.destroyed) {
      this.destroyInternal();
      return;
    }

    this.app.canvas.classList.add('absolute', 'inset-0', 'size-full');
    this.container.appendChild(this.app.canvas);

    this.mesh = new AtmosphereMesh({
      width: this.app.screen.width,
      height: this.app.screen.height,
      intensity: this.quality.shaderIntensity,
      colorCloud: [...this.cloudCurrent],
      starColor: [...this.starCurrent],
      cloudStrength: this.strengthCurrent,
      particleMode: this.particleModeCurrent,
    });

    // Layer order: background only (star field + clouds live entirely in-shader)
    this.app.stage.addChild(this.mesh);

    this.mouse.attach();
    this.startTime = performance.now();

    // Ticker — single callback, minimal allocations
    this.tickerFn = ticker => this.tick(ticker.deltaTime);
    this.app.ticker.add(this.tickerFn);
    this.app.ticker.maxFPS = this.quality.maxFps;

    this.setupVisibility();
  }

  private tick(dt: number) {
    if (!this.mesh) return;

    const time = performance.now() - this.startTime;

    // Smooth mouse — framerate-independent easing toward the cursor.
    this.mouse.update(dt, 0.06);

    // Update background shader uniforms — reuse pre-allocated buffers to avoid
    // creating new arrays every frame (GC pressure on hot path).
    this.mesh.time = time / 1000;

    // Mouse uniform — only upload when the smoothed value actually moved, so
    // a resting cursor costs nothing on the hot path.
    if (this._mouseBuf[0] !== this.mouse.x || this._mouseBuf[1] !== this.mouse.y) {
      this._mouseBuf[0] = this.mouse.x;
      this._mouseBuf[1] = this.mouse.y;
      this.mesh.mouse = this._mouseBuf as unknown as [number, number];
    }

    // Resolution only changes on resize — skip the upload when the cached
    // size still matches to avoid a per-frame GPU uniform write.
    const screen = this.app.screen;
    if (screen.width !== this._resBuf[0] || screen.height !== this._resBuf[1]) {
      this._resBuf[0] = screen.width;
      this._resBuf[1] = screen.height;
      this.mesh.resolution = this._resBuf as unknown as [number, number];
    }

    // Smoothly chase the theme-dependent shader values (cloud tint, star tint,
    // cloud density). Exponential approach, framerate-independent (dt is in
    // 60fps frames): ~95% in ~0.4s. Once everything has settled we snap to the
    // targets and stop uploading, so idle frames between theme switches write
    // nothing to the GPU.
    if (!this.themeSettled) {
      const k = 1 - Math.pow(0.88, dt);

      // Cloud tint
      const cr = this.cloudCurrent[0] + (this.cloudTarget[0] - this.cloudCurrent[0]) * k;
      const cg = this.cloudCurrent[1] + (this.cloudTarget[1] - this.cloudCurrent[1]) * k;
      const cb = this.cloudCurrent[2] + (this.cloudTarget[2] - this.cloudCurrent[2]) * k;
      const cloudSettled =
        Math.abs(cr - this.cloudCurrent[0]) < 1e-5 &&
        Math.abs(cg - this.cloudCurrent[1]) < 1e-5 &&
        Math.abs(cb - this.cloudCurrent[2]) < 1e-5;
      this.cloudCurrent[0] = cr;
      this.cloudCurrent[1] = cg;
      this.cloudCurrent[2] = cb;
      if (cloudSettled) {
        this.cloudCurrent[0] = this.cloudTarget[0];
        this.cloudCurrent[1] = this.cloudTarget[1];
        this.cloudCurrent[2] = this.cloudTarget[2];
      } else {
        this._cloudBuf[0] = cr;
        this._cloudBuf[1] = cg;
        this._cloudBuf[2] = cb;
        this.mesh.colorCloud = this._cloudBuf as unknown as [number, number, number];
      }

      // Star tint
      const sr = this.starCurrent[0] + (this.starTarget[0] - this.starCurrent[0]) * k;
      const sg = this.starCurrent[1] + (this.starTarget[1] - this.starCurrent[1]) * k;
      const sb = this.starCurrent[2] + (this.starTarget[2] - this.starCurrent[2]) * k;
      const starSettled =
        Math.abs(sr - this.starCurrent[0]) < 1e-5 &&
        Math.abs(sg - this.starCurrent[1]) < 1e-5 &&
        Math.abs(sb - this.starCurrent[2]) < 1e-5;
      this.starCurrent[0] = sr;
      this.starCurrent[1] = sg;
      this.starCurrent[2] = sb;
      if (starSettled) {
        this.starCurrent[0] = this.starTarget[0];
        this.starCurrent[1] = this.starTarget[1];
        this.starCurrent[2] = this.starTarget[2];
      } else {
        this._starBuf[0] = sr;
        this._starBuf[1] = sg;
        this._starBuf[2] = sb;
        this.mesh.starColor = this._starBuf as unknown as [number, number, number];
      }

      // Cloud density multiplier
      const sn = this.strengthCurrent + (this.strengthTarget - this.strengthCurrent) * k;
      const strengthSettled = Math.abs(sn - this.strengthCurrent) < 1e-4;
      this.strengthCurrent = sn;
      if (strengthSettled) {
        this.strengthCurrent = this.strengthTarget;
      } else {
        this.mesh.cloudStrength = sn;
      }

      // Particle mode (stars ↔ fireflies)
      const pm =
        this.particleModeCurrent + (this.particleModeTarget - this.particleModeCurrent) * k;
      const particleSettled = Math.abs(pm - this.particleModeCurrent) < 1e-4;
      this.particleModeCurrent = pm;
      if (particleSettled) {
        this.particleModeCurrent = this.particleModeTarget;
      } else {
        this.mesh.particleMode = pm;
      }

      if (cloudSettled && starSettled && strengthSettled && particleSettled) {
        this.themeSettled = true;
      }
    }
  }

  private setupVisibility() {
    this.visibilityHandler = () => {
      if (document.hidden) {
        this.app.ticker.stop();
      } else {
        this.app.ticker.start();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler, { passive: true });
  }

  private destroyInternal() {
    if (this.tickerFn) this.app.ticker.remove(this.tickerFn);
    this.tickerFn = null;
    this.mouse.detach();
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    this.mesh?.destroy();
    this.mesh = null;
    // Only destroy the application once it has finished initializing — see the
    // `initialized` field comment above. If init is still pending, `init()`
    // will call `destroyInternal()` itself when the await resolves.
    if (this.initialized) {
      this.app.destroy(true, { children: true, texture: true });
      this.initialized = false;
    }
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    // If init hasn't completed yet, defer teardown: destroying the app now
    // would crash (ResizePlugin._cancelResize is undefined). The `init()`
    // method sees `this.destroyed` after its await and runs destroyInternal.
    if (this.initialized) {
      this.destroyInternal();
    }
  }
}
