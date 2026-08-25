import { describe, it, expect } from 'vitest';
import { hexToRgb } from './color';

describe('hexToRgb', () => {
  it('converts a 6-digit hex colour to normalised RGB', () => {
    expect(hexToRgb('#0037ff', [0, 0, 0])).toEqual([0, 55 / 255, 1]);
  });

  it('converts black and white', () => {
    expect(hexToRgb('#000000', [1, 1, 1])).toEqual([0, 0, 0]);
    expect(hexToRgb('#ffffff', [0, 0, 0])).toEqual([1, 1, 1]);
  });

  it('returns the fallback for invalid input', () => {
    expect(hexToRgb('not-a-colour', [0.5, 0.5, 0.5])).toEqual([0.5, 0.5, 0.5]);
    expect(hexToRgb('#abc', [0.5, 0.5, 0.5])).toEqual([0.5, 0.5, 0.5]);
  });
});
