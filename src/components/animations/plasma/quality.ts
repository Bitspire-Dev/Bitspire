// Adaptive quality for the plasma background — caps resolution and frame rate
// on weaker / mobile devices to keep TBT/INP low.

export interface PlasmaQuality {
  dpr: number;
  maxFps: number;
}

function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export function getPlasmaQuality(): PlasmaQuality {
  const baseDpr = window.devicePixelRatio || 1;
  const mobile = isMobile();

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  if (mobile || cores <= 4 || memory <= 2) {
    return { dpr: Math.min(baseDpr, 1), maxFps: 30 };
  }

  if (cores <= 6 || memory <= 4 || baseDpr >= 2.5) {
    return { dpr: Math.min(baseDpr, 1.5), maxFps: 45 };
  }

  return { dpr: Math.min(baseDpr, 1.5), maxFps: 60 };
}
