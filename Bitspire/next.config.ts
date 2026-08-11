import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enforce TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Performance optimizations
  reactStrictMode: true,
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Image optimization - tuned for mobile performance
  images: {
    formats: ['image/avif', 'image/webp'],
    // Quality settings: AVIF for modern browsers, WebP for fallback
    qualities: [65, 70, 72, 75, 78, 80, 85],
    // Device sizes: optimized for responsive images (breakpoints matching Tailwind)
    // Mobile (320-480), Tablet (640-768), Desktop (1024-1920), Ultra-wide (2048+)
    deviceSizes: [
      320,  // Small mobile (iPhone SE)
      375,  // Standard mobile
      480,  // Mobile landscape
      640,  // Mobile landscape / small tablet
      768,  // Tablet (Tailwind md)
      1024, // Tablet landscape / small desktop
      1280, // Desktop
      1536, // Large desktop
      1920, // Full HD
      2560, // 2K
    ],
    // Image sizes for specific component widths
    imageSizes: [
      16, 32, 48, 64, 96, 128, 
      200,  // Feature icons
      256, 384, 512, // Card sizes
      640,  // Standard content width
      768,
      1024,
    ],
    // Cache optimized images for 7 days (604800 seconds)
    minimumCacheTTL: 604800,
    dangerouslyAllowSVG: false,
    contentDispositionType: 'inline',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.tina.io',
        pathname: '/**',
      },
    ],
  },
  
  // Experimental features (kept minimal to reduce internal worker usage)
  experimental: {
    scrollRestoration: true,
  },
  
  // Force single React instance to prevent version mismatch errors
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime.js': 'react/jsx-runtime',
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
    };
    
    // Optimize bundle size and prevent esbuild memory issues
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
      };
    }
    
    // Prevent large file parsing issues
    config.module = config.module || {};
    config.module.parser = {
      ...config.module.parser,
      javascript: {
        ...config.module.parser?.javascript,
        exportsPresence: 'error',
        importExportsPresence: 'error',
      },
    };
    
    return config;
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
};

export default withNextIntl(nextConfig);
