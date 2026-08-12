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

  /** Eases current toward target. Call every frame. */
  update(smoothing = 0.06) {
    this.currentX += (this.targetX - this.currentX) * smoothing;
    this.currentY += (this.targetY - this.currentY) * smoothing;
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
