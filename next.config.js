const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15.2+ streams metadata into the body for non-bot user agents and
  // lets React hoist it client-side; only listed bots get it in <head>. That
  // makes tooling which reads the raw HTML (Lighthouse's SEO audit included)
  // report a missing description even though crawlers receive one. Disabling
  // streaming keeps the tags in <head> for every client. Metadata generation
  // here only reads already-loaded translations, so the added TTFB is small.
  htmlLimitedBots: /./,
  experimental: {
    // Tree-shake the icon and animation libraries so above-the-fold hydration
    // only ships the symbols actually referenced.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // One stylesheet per route instead of per-chunk, so styles are not injected
    // in waves that re-trigger style/layout during the LCP window.
    //
    // Note: `experimental.inlineCss` was tried and reverted. It grew the HTML
    // from ~154 kB to ~364 kB, which costs more under mobile throttling than the
    // saved stylesheet round trip.
    cssChunking: 'strict',
  },
  images: {
    // AVIF first for the smallest payloads, WebP as the fallback for browsers
    // that don't decode AVIF yet.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        // Service worker must not be cached so updates reach clients quickly,
        // and must be served with a JS mime type (Next serves /public as-is).
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        // Manifest served with the correct mime type and short cache.
        source: '/manifest.webmanifest',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        // Offline fallback should always be revalidated (never stale).
        source: '/offline.html',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        // Hero image is content-hashed by name changes only, so cache it long.
        source: '/hero-consulting.jpg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Apply to all routes: core security headers.
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
