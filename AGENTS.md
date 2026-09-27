# Paraysco Consulting — Project Notes

## PWA System (added 2026-08)

The app is a production-installable PWA. Key files:

- `public/manifest.webmanifest` — Web App Manifest (name, short_name, scope `/`,
  start_url `/?source=pwa`, standalone display, theme_color `#0d9488`,
  192/512 any + maskable icons, app shortcuts). Linked via Metadata API
  `manifest` field in `src/app/layout.tsx`.
- `public/sw.js` — hand-written service worker (no PWA library). Strategies:
  precache offline fallback + icons at install; network-first for navigations
  with `/offline.html` fallback; stale-while-revalidate for same-origin static
  assets (`_next/static`, js/css/fonts/images); network-only for cross-origin
  (Supabase, Resend, analytics). Versioned via `SW_CACHE_VERSION`.
- `public/offline.html` — standalone offline fallback page.
- `src/components/providers/pwa-provider.tsx` — React context: registers
  `/sw.js`, captures `beforeinstallprompt`, detects standalone/installed via
  `display-mode: standalone` + iOS `navigator.standalone`, handles
  `appinstalled`. Exposes `usePWA()` (`canInstall`, `isInstalled`, `isReady`,
  `promptInstall`). Wrapped in root layout.
- `src/components/pwa/install-app-button.tsx` — install button. Auto-hides when
  installed or when prompt unavailable; shows "Installing…" then "Installed".
  Used in `src/components/layout/header.tsx` (desktop + mobile menu).
- `scripts/generate-pwa-icons.py` — regenerates all icons from `public/logo.png`
  (requires Pillow). Run: `python3 scripts/generate-pwa-icons.py`.

### Critical: next-intl middleware matcher

`src/middleware.ts` matcher MUST exclude `sw.js`, `manifest.webmanifest`,
`offline.html`, and `.js`/`.webmanifest`/`.html` extensions. Otherwise
next-intl redirects `/sw.js` → `/en/sw.js`, breaking SW root scope and
installability.

### next.config.js headers

Sets `Content-Type: application/javascript` + `Cache-Control: no-store` +
`Service-Worker-Allowed: /` on `/sw.js`; `application/manifest+json` on the
manifest; plus HSTS/X-Content-Type-Options/X-Frame-Options/Referrer-Policy
security headers on all routes.

### Build/verify

- `npx tsc --noEmit` — type-check (passes)
- `npx next build` then `npx next start` — production build
- Installability requires HTTPS in prod (localhost is a secure context for dev).
- Supabase env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  must be set or the homepage throws a client error (pre-existing, unrelated to
  PWA).

## Mobile performance (LCP) notes — 2026-09

Mobile LCP was 12.4s. Root causes fixed:

1. **Hero LCP image** (`src/components/home/hero-section.tsx`) was an external
   `i0.wp.com` JPEG loaded with `loading="lazy"`. Now `public/hero-consulting.jpg`
   served via `next/image` with `fill`, `priority`, `fetchPriority="high"`,
   `sizes="(max-width: 1024px) 100vw, 50vw"`, and no lazy loading. next/image
   emits its own responsive `<link rel="preload" as="image">` — do NOT also add a
   manual raw-URL preload or the browser downloads twice.
   `next.config.js` sets `images.formats: ['image/avif','image/webp']`; AVIF cuts
   the hero from ~125 KB to ~34 KB.
2. **ThemeProvider** wrapped all children in `visibility:hidden` until `mounted`
   (after hydration) — this delayed every page's first paint. Replaced with a
   tiny blocking `<head>` script in `src/app/layout.tsx` that applies
   `classList.toggle('dark', …)` before paint; the provider only reads that class.
3. **Above-the-fold animation** was Framer Motion (opacity:0 until JS ran) in the
   hero. Replaced with CSS classes `.animate-fade-up` / `.animate-delay-*` in
   `globals.css`. Header dropdown/mobile-menu animations converted to CSS
   transitions (grid-rows trick for the mobile menu); header + statistics no
   longer import framer-motion.
4. **Leaflet** (`src/components/ui/map.tsx`) was appended to `<head>` on mount
   for a below-the-fold map. Now loads via `IntersectionObserver` + idle callback.
5. `next.config.js` uses `experimental.optimizePackageImports` for
   `lucide-react` / `framer-motion`.

## Google Analytics

GA4 is loaded with `@next/third-parties/google` (`<GoogleAnalytics gaId="G-N03DYCXW2X" />`)
in `src/app/layout.tsx`. The earlier hand-rolled loader pointed at
`https://googletagmanager.com` (a 404 — must be
`https://www.googletagmanager.com/gtag/js?id=…`). Measurement ID: `G-N03DYCXW2X`.

## Known build gotcha

`src/app/api/contact/route.ts` used to `new Resend(process.env.RESEND_API_KEY)`
at module scope, which throws during `next build` page-data collection when the
key is unset. It now builds the client lazily and returns 503 if unconfigured.
`npm ci` fails on this repo (lockfile out of sync); use `npm install`.
