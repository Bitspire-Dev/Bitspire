import { describe, it, expect } from 'vitest';
import { extractContentSlug, slugify } from './string';

describe('extractContentSlug', () => {
  it('removes the .md extension', () => {
    expect(extractContentSlug('hello.md')).toBe('hello');
  });

  it('leaves filenames without .md untouched', () => {
    expect(extractContentSlug('hello')).toBe('hello');
    expect(extractContentSlug('hello.txt')).toBe('hello.txt');
  });
});

describe('slugify', () => {
  it('converts text to a URL-safe slug', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('Zażółć gęślą jaźń')).toBe('zazolc-gesla-jazn');
  });
});
