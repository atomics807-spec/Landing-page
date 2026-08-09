/**
 * Paraysco Consulting — Production Service Worker
 *
 * Strategy:
 *  - Precache: the offline fallback + core icon assets at install time.
 *  - Navigation (HTML document) requests: network-first, falling back to
 *    cache, then to /offline.html when the network is unavailable.
 *  - Static assets (same-origin _next/static, scripts, styles, fonts, images):
 *    stale-while-revalidate so the UI loads instantly offline and updates in
 *    the background.
 *  - Cross-origin (Supabase, image hosts, analytics): network-only, never
 *    cached (dynamic/auth data + third-party privacy).
 *
 * Versioned via SW_CACHE_VERSION. Bump to force a cache refresh.
 */

const SW_CACHE_VERSION = 'v1';
const PRECACHE = `paraysco-precache-${SW_CACHE_VERSION}`;
const RUNTIME_STATIC = `paraysco-static-${SW_CACHE_VERSION}`;
const RUNTIME_PAGES = `paraysco-pages-${SW_CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/maskable-192.png',
  '/maskable-512.png',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/manifest.webmanifest',
];

const OFFLINE_URL = '/offline.html';

// Same-origin static asset extensions.
const STATIC_ASSET_RE = /\/_next\/static\/|\/_next\/image\/|\/static\/|\.(?:js|css|woff2?|ttf|otf|png|jpg|jpeg|gif|webp|avif|svg|ico)$/i;

// Origins we never cache (auth/dynamic data + third-party tracking/CDN privacy).
const NO_CACHE_HOSTS = ['api.resend.com', 'images.unsplash.com', 'i.postimg.cc', 'va.vercel-services.com', 'vercel.live'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      // addAll is atomic-ish: if one fails we still want install to succeed
      // for the rest, so use individual puts and ignore failures.
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'reload' });
            if (res && res.ok) await cache.put(url, res);
          } catch (_) {
            /* network unavailable at install time — skip */
          }
        })
      );
      // Activate immediately so the SW controls the page on first install.
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => ![PRECACHE, RUNTIME_STATIC, RUNTIME_PAGES].includes(key))
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
      // Notify clients that a new SW took control (lets UI prompt for reload).
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.postMessage({ type: 'SW_ACTIVATED', version: SW_CACHE_VERSION }));
    })()
  );
});

self.addEventListener('message', (event) => {
  // Allow the page to trigger an immediate update + activation.
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

/**
 * Stale-while-revalidate for cacheable same-origin static assets.
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_STATIC);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      // Only cache valid, basic (same-origin) responses.
      if (response && response.ok && response.type === 'basic') {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

/**
 * Network-first for HTML navigations; offline fallback to cached page then
 * /offline.html.
 */
async function networkFirstNavigation(request) {
  const cache = await caches.open(RUNTIME_PAGES);
  try {
    const response = await fetch(request);
    if (response && response.ok && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    const cached = await cache.match(request);
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    return offline || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET; ignore POST/PUT/DELETE etc. and non-http(s).
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  const url = new URL(request.url);

  // Never cache cross-origin dynamic/auth/third-party requests.
  if (url.origin !== self.location.origin) {
    if (NO_CACHE_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`))) {
      return; // let the browser handle it (network-only)
    }
    // Other cross-origin GETs (e.g. fonts): let browser cache normally.
    return;
  }

  // HTML document navigations -> network-first with offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // Same-origin static assets -> stale-while-revalidate.
  if (STATIC_ASSET_RE.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Same-origin non-static GET (e.g. API routes): don't cache — pass through.
  // (Caching API responses would serve stale auth/dynamic data.)
});
