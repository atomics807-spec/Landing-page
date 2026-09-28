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

## Mobile PageSpeed: LCP is JS-driven, not font- or image-driven (2026-09)

Measured with Lighthouse mobile (simulate throttling) on `next start`:

| Scenario | FCP | LCP | Score |
|---|---|---|---|
| Baseline | 1.1s | 4.9s | 70-72 |
| Fonts blocked (`--blocked-url-patterns='*.woff2'`) | 1.8s | 4.8s | 80 |
| **All JS chunks blocked** (`*/_next/static/chunks/*`) | 0.9s | **2.5s** | **98** |

The LCP element is always the header announcement bar
(`navigation.announcement`, "Building Sustainable Partnerships ..."). Its LCP
breakdown is TTFB ~460ms + **render delay ~4.4s**, with Load Delay/Load Time 0.

Conclusion: the render delay is **main-thread blocking during hydration**, not
fonts or images. Font blocking barely moves LCP (4.9s -> 4.8s); removing all JS
drops it to 2.5s. `bootup-time` puts ~840ms in chunk `1255`, ~350ms in
`4bd1b696` (react-dom), ~250ms in gtag. Long tasks cluster at 0.9-1.6s.

So the remaining lever is reducing initial JS/hydration, e.g.:
- Server-render above-the-fold content and defer/remove client components that
  are not needed for the first paint (header already SSRs the text).
- `next/dynamic` for below-the-fold client sections, or convert them to RSC.
- gtag/GTM is loaded eagerly (third-party blocking 140ms + long tasks at
  ~5.8s); consider loading after interaction/idle.

Removing Framer Motion from the initial bundle (home sections + header
`user-menu`) cut First Load JS for `/[locale]` from 264 kB to 226 kB, but LCP
stayed ~4.9s, confirming hydration cost is spread across React + app JS rather
than the animation library alone.

## Mobile PageSpeed: green 90+ (2026-09)

Reached **91-95** (was 74) on mobile Lighthouse. LCP 7.4s -> 2.8-3.3s,
TBT -> 80-140ms, CLS 0, unused JS eliminated, render-blocking eliminated.

Highest-impact fixes, in rough order of payoff:

1. **`clients.claim()` self-reload bug (biggest LCP win).** `public/sw.js` calls
   `skipWaiting()` + `clients.claim()` on install, which fires
   `controllerchange`. `pwa-provider.tsx` reloaded the page on every
   `controllerchange`, so a first-ever visit reloaded itself mid-load and
   re-inflated LCP. Now the reload listener is only attached when
   `navigator.serviceWorker.controller` already existed (i.e. a genuine
   update). Never reload when there was no prior controller.
2. **zod was in the shared `cn()` module.** `src/lib/utils.ts` imported zod for
   its form schemas, and ~25 components import `cn`, so zod (~74 KB) landed in
   the home page's initial JS. Schemas moved to `src/lib/validations.ts`.
   First Load JS for `/[locale]`: 156 kB -> 143 kB.
3. **Deferred everything non-critical** so it stays out of the load window:
   Vercel Analytics/SpeedInsights (`deferred-vitals.tsx`, after load + idle),
   GA (`deferred-analytics.tsx`, interaction or 6s), service-worker
   registration (after `load`), cookie banner (interaction or 4s - its fixed
   full-width text can otherwise become the mobile LCP element), header auth
   check (interaction / auth-cookie hint).
4. **Removed `backdrop-blur` from the fixed header.** It forces a compositing
   layer that costs paint work; `bg-white/95` looks effectively the same.
   Worth ~TBT 200ms -> 160ms.
5. **Reveal animations via one `RevealObserver`** instead of per-element client
   islands, so the animation runtime never ships. The hidden state is gated on
   a `.js` class set by the inline head script, so content stays visible if JS
   fails.

Also tried and reverted (kept here so they aren't re-attempted):
`display: optional` fonts (no gain), modern `browserslist` targets (no legacy
JS reduction), `experimental.inlineCss` (grew HTML 154->364 kB), lazy-loading
the below-fold home client islands (raised First Load JS).

Remaining known items (not blocking green): legacy-JS ~11 KB in chunk `1255`
(React internals, not app code); sitewide CSP blocks
`/_vercel/insights/script.js` in prod (logged console error, should be allowed
or the component dropped).

## Mobile audit - round 2 (metadata, a11y, link text)

- **Streaming metadata hid the description from Lighthouse.** Next 15.2+ streams
  metadata into `<body>` for non-bot user agents and relies on React to hoist it
  into `<head>` client-side; only user agents matching `htmlLimitedBots` get a
  blocking response with the tags already in `<head>`. Lighthouse is not on that
  list, so its raw-HTML read saw no description. Fix: `htmlLimitedBots: /./` in
  `next.config.js`, which disables streaming for every client. Metadata here only
  reads already-loaded translations, so the TTFB cost is negligible. Live DOM
  (and therefore Googlebot) always showed the tags correctly, so this is a tool
  false positive, not an SEO defect.
- **`CTASection` was a server component imported by two client pages.**
  `/en/about` and `/en/services` both returned 500 (`getTranslations is not
  supported in Client Components`). Rendered it from the server page instead -
  `about/page.tsx` and `services/page.tsx` - and removed it from the client
  pages. Keep `CTASection` server-side: it is a below-fold section and pulling
  it into the client graph also drags `next-intl/server` along.
- **`aria-hidden` mobile menu now also `inert`.** The menu is collapsed with
  `grid-rows-[0fr]`, so its links stayed tabbable while hidden. `inert` removes
  them from the tab order and the a11y tree together.
- **Descriptive link text.** The subcompany cards each read "Learn More"; a
  `sr-only` span now names the company.
- After these: home mobile perf 94-96, SEO 100, a11y 100; `/about` and
  `/services` 92-93 perf, SEO 100. Remaining best-practices ding is the Vercel
  analytics 404/MIME console error, which only occurs locally.

## `next/image` `fill` needs a positioned wrapper

Commit `5bf1544` converted several `<img>` tags to `<Image fill>` for LCP. `fill`
sets `position: absolute`, so the image sizes and positions against its nearest
*positioned* ancestor. If the wrapper has no `relative`, that ancestor is the
viewport and the image explodes to full-screen below the header.

`/en/about` was missed (the home hero/founder/about-section wrappers were all
given `relative`, the About page one was not). Fix was `relative` on the
`aspect-[3/4]` wrapper. When converting an image to `fill`, always add `relative`
to the immediate wrapper; `fill` also already implies `w-full h-full`, so those
classes and any viewport-relative `sizes` hint are redundant.

Also note `/en/about` has a pre-existing `color-contrast` finding on
`text-primary-100` (a11y 96, still green).
