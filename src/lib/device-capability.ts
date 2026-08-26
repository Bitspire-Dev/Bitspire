// Device capability detection — runs once on the client and provides a tier
// (`low | medium | high`) plus individual signals that components can use to
// decide how much work to do. Centralising this avoids every component running
// its own `navigator.hardwareConcurrency` check and keeps the heuristics in
// one place.
//
// The detection is intentionally conservative: when in doubt we pick the lower
// tier. A false `low` is a missed visual flourish; a false `high` is a janky
// page on a weak phone.

export type DeviceTier = 'low' | 'medium' | 'high';

export interface DeviceCapability {
  tier: DeviceTier;
  isMobile: boolean;
  isTouch: boolean;
  isReducedMotion: boolean;
  /** User has requested data saving (Navigator.deviceData / Save-Data header). */
  saveData: boolean;
  /** Effective connection type from Network Information API, if available. */
  effectiveConnectionType: string | null;
  /** Capped device pixel ratio — high DPR screens are expensive for WebGL. */
  pixelRatio: number;
  /** Detected CPU core count (fallback 4). */
  hardwareConcurrency: number;
  /** Detected device memory in GB (fallback 4). */
  deviceMemory: number;
}

interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
}

function detectIsMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);
}

function detectIsTouch(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    (navigator.maxTouchPoints ?? 0) > 0 ||
    window.matchMedia('(hover: none)').matches
  );
}

function detectSaveData(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as NavigatorWithConnection;
  return nav.connection?.saveData ?? false;
}

function detectEffectiveConnection(): string | null {
  if (typeof navigator === 'undefined') return null;
  const nav = navigator as NavigatorWithConnection;
  return nav.connection?.effectiveType ?? null;
}

function detectReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function detectDeviceCapability(): DeviceCapability {
  if (typeof window === 'undefined') {
    return {
      tier: 'high',
      isMobile: false,
      isTouch: false,
      isReducedMotion: false,
      saveData: false,
      effectiveConnectionType: null,
      pixelRatio: 1,
      hardwareConcurrency: 4,
      deviceMemory: 4,
    };
  }

  const nav = navigator as NavigatorWithDeviceMemory;
  const hardwareConcurrency = nav.hardwareConcurrency ?? 4;
  const deviceMemory = nav.deviceMemory ?? 4;
  const isMobile = detectIsMobile();
  const isTouch = detectIsTouch();
  const saveData = detectSaveData();
  const effectiveConnectionType = detectEffectiveConnection();
  const isReducedMotion = detectReducedMotion();
  const rawPixelRatio = window.devicePixelRatio || 1;
  // Cap DPR at 2 — anything above is diminishing returns for a huge GPU cost.
  const pixelRatio = Math.min(rawPixelRatio, 2);

  const slowConnection =
    effectiveConnectionType === 'slow-2g' ||
    effectiveConnectionType === '2g' ||
    effectiveConnectionType === '3g';

  // Tier heuristics — order matters: the first rule that matches wins.
  let tier: DeviceTier;

  if (
    isReducedMotion ||
    saveData ||
    slowConnection ||
    isMobile ||
    hardwareConcurrency <= 4 ||
    deviceMemory <= 2
  ) {
    tier = 'low';
  } else if (hardwareConcurrency <= 6 || deviceMemory <= 4 || rawPixelRatio >= 2.5) {
    tier = 'medium';
  } else {
    tier = 'high';
  }

  return {
    tier,
    isMobile,
    isTouch,
    isReducedMotion,
    saveData,
    effectiveConnectionType,
    pixelRatio,
    hardwareConcurrency,
    deviceMemory,
  };
}
