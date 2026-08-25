export type RgbTuple = [number, number, number];

export function hexToRgb(hex: string, fallback: RgbTuple): RgbTuple {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return [...fallback] as RgbTuple;

  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ] as RgbTuple;
}

export function getCssColor(name: string, fallback: RgbTuple | string): RgbTuple {
  if (typeof document === 'undefined') {
    return Array.isArray(fallback) ? ([...fallback] as RgbTuple) : hexToRgb(fallback, [0, 0, 0]);
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value ? hexToRgb(value, [0, 0, 0]) : hexToRgb(fallback as string, [0, 0, 0]);
}
