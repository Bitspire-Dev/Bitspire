import { readFile } from 'fs/promises';
import path from 'path';
import { ImageResponse } from 'next/og';

const TAGLINES: Record<string, string> = {
  pl: 'Nowoczesne rozwiązania webowe',
  en: 'Modern web solutions',
};

const BRAND_DARK = '#0c0c0b';
const BRAND_PRIMARY = '#0037ff';

export interface OgImageOptions {
  width?: number;
  height?: number;
}

export async function renderOgImage(locale: string, options: OgImageOptions = {}) {
  const { width = 1200, height = 630 } = options;
  const tagline = TAGLINES[locale] ?? TAGLINES.pl;

  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Inter', 'InterVariable.woff2');
  let fontData: Buffer | undefined;
  try {
    fontData = await readFile(fontPath);
  } catch {
    // Fallback to built-in sans-serif if the local font cannot be loaded.
  }

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_PRIMARY} 100%)`,
        color: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 64,
        fontFamily: fontData ? 'Inter, sans-serif' : 'sans-serif',
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 700 }}>Bitspire</div>
      <div style={{ fontSize: 40, marginTop: 24, opacity: 0.9 }}>{tagline}</div>
    </div>,
    {
      width,
      height,
      fonts: fontData
        ? [
            {
              name: 'Inter',
              data: fontData,
              style: 'normal',
              weight: 400,
            },
          ]
        : undefined,
    }
  );
}
