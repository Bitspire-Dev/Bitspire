// Smoothed mouse tracker with parallax — provides a normalized (-1..1)
// mouse position that eases toward the real cursor for fluid interaction.

export class MouseController {
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private active = false;

  constructor(private readonly el: HTMLElement | Window) {}

  attach() {
    // Skip on touch devices — there's no cursor, so mouse parallax would
    // never move and the listeners would only waste CPU on touch events.
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      this.active = false;
      return;
    }
    const node = this.el;
    node.addEventListener('pointermove', this.onMove, { passive: true });
    node.addEventListener('pointerleave', this.onLeave, { passive: true });
    node.addEventListener('pointerout', this.onLeave, { passive: true });
  }

  detach() {
    const node = this.el;
    node.removeEventListener('pointermove', this.onMove);
    node.removeEventListener('pointerleave', this.onLeave);
    node.removeEventListener('pointerout', this.onLeave);
  }

  private onMove = (e: Event) => {
    const pe = e as PointerEvent;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.targetX = (pe.clientX / w) * 2 - 1;
    this.targetY = (pe.clientY / h) * 2 - 1;
    this.active = true;
  };

  private onLeave = () => {
    this.targetX = 0;
    this.targetY = 0;
  };

  /** Eases current toward target. Call every frame.
   *  `dt` is in 60fps-frame units (PixiJS ticker.deltaTime); `smoothing` is
   *  the per-60fps-frame approach factor, made framerate-independent here. */
  update(dt: number, smoothing = 0.06) {
    const k = 1 - Math.pow(1 - smoothing, dt);
    this.currentX += (this.targetX - this.currentX) * k;
    this.currentY += (this.targetY - this.currentY) * k;
    // Snap to target once close enough — stops the asymptotic creep so the
    // caller can skip uploading an unchanged mouse uniform when at rest.
    if (Math.abs(this.targetX - this.currentX) < 1e-4) this.currentX = this.targetX;
    if (Math.abs(this.targetY - this.currentY) < 1e-4) this.currentY = this.targetY;
  }

  get x() {
    return this.currentX;
  }

  get y() {
    return this.currentY;
  }

  get isActive() {
    return this.active;
  }
}
