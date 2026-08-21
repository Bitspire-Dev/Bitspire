// Main PixiJS scene orchestrator — owns the Application lifecycle, ticker,
// resize handling, mouse parallax, visibility pausing and theme cross-fade.
// The actual shader + geometry live in AtmosphereMesh (./mesh); the engine
// just drives its uniforms every frame.

import { Application } from 'pixi.js';
import { AtmosphereMesh } from './mesh';
import { MouseController } from './mouse';
import { getQualityConfig, type QualityConfig } from './quality';

export type SceneTheme = 'dark' | 'light';

interface SceneColors {
  deep: [number, number, number];
  cloud: [number, number, number];
}

// One universal deep-space palette shared by both UI themes. The cosmos
// backdrop always reads as dark space (the hero text is white either way),
// so a single palette means the scene never has to re-initialise on theme
// switch — only the cloud tint interpolates (see setTheme / tick), so the
// transition between light/dark is seamless with no flash or re-render.
const UNIVERSAL_COLORS: SceneColors = {
  deep: [0.016, 0.02, 0.045], // #04050b — deep space black with a faint navy lift
  cloud: [0.0, 0.216, 1.0], // #0037ff — default (dark) cloud tint
};

const THEME_COLORS: Record<SceneTheme, SceneColors> = {
  dark: { ...UNIVERSAL_COLORS, cloud: [0.0, 0.216, 1.0] }, // #0037ff
  light: { ...UNIVERSAL_COLORS, cloud: [0.0, 0.6, 1.0] }, // #0099ff
};

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
  // Cloud tint is the only theme-dependent value. We keep a current (displayed)
  // and target colour and lerp current → target each frame, so a theme switch
  // cross-fades smoothly instead of re-initialising the whole WebGL scene.
  private cloudCurrent: [number, number, number];
  private cloudTarget: [number, number, number];
  // Pre-allocated arrays to avoid per-frame GC pressure in tick()
  private readonly _mouseBuf: Float32Array = new Float32Array(2);
  private readonly _resBuf: Float32Array = new Float32Array(2);
  private readonly _cloudBuf: Float32Array = new Float32Array(3);

  constructor(
    private container: HTMLElement,
    private theme: SceneTheme
  ) {
    this.quality = getQualityConfig();
    this.app = new Application();
    this.mouse = new MouseController(window);
    this.cloudCurrent = [...THEME_COLORS[this.theme].cloud];
    this.cloudTarget = [...THEME_COLORS[this.theme].cloud];
  }

  /**
   * Switch the cloud tint target. The actual colour is interpolated toward
   * this target every frame in `tick()`, so calling this is instant and cheap —
   * no scene rebuild, no flash, just a smooth cross-fade (~0.4s at 60fps).
   */
  setTheme(theme: SceneTheme) {
    if (this.theme === theme) return;
    this.theme = theme;
    this.cloudTarget = [...THEME_COLORS[theme].cloud];
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

    const colors = THEME_COLORS[this.theme];
    this.mesh = new AtmosphereMesh({
      width: this.app.screen.width,
      height: this.app.screen.height,
      intensity: this.quality.shaderIntensity,
      colorDeep: colors.deep,
      colorCloud: [...this.cloudCurrent],
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

    // Smoothly chase the theme's cloud tint. Exponential approach, framerate-
    // independent (dt is in 60fps frames): ~95% in ~0.4s. This is the only
    // thing that changes on a theme switch, so the cross-fade is clean — no
    // flash, no re-init, no animation overload. Once settled we snap to the
    // target and stop uploading uColorCloud, so idle frames write nothing.
    const k = 1 - Math.pow(0.88, dt);
    const r = this.cloudCurrent[0] + (this.cloudTarget[0] - this.cloudCurrent[0]) * k;
    const g = this.cloudCurrent[1] + (this.cloudTarget[1] - this.cloudCurrent[1]) * k;
    const b = this.cloudCurrent[2] + (this.cloudTarget[2] - this.cloudCurrent[2]) * k;
    const settled =
      Math.abs(r - this.cloudCurrent[0]) < 1e-5 &&
      Math.abs(g - this.cloudCurrent[1]) < 1e-5 &&
      Math.abs(b - this.cloudCurrent[2]) < 1e-5;
    this.cloudCurrent[0] = r;
    this.cloudCurrent[1] = g;
    this.cloudCurrent[2] = b;
    if (settled) {
      this.cloudCurrent[0] = this.cloudTarget[0];
      this.cloudCurrent[1] = this.cloudTarget[1];
      this.cloudCurrent[2] = this.cloudTarget[2];
    } else {
      this._cloudBuf[0] = r;
      this._cloudBuf[1] = g;
      this._cloudBuf[2] = b;
      this.mesh.colorCloud = this._cloudBuf as unknown as [number, number, number];
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
