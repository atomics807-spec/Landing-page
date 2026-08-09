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
