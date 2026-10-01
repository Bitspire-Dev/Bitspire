export function isUnoptimizedImage(src?: string | null): boolean {
  return (src?.endsWith('.svg') ?? false) || (src?.endsWith('.gif') ?? false);
}
