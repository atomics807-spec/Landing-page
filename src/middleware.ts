import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
 
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});
 
export const config = {
  // Exclude: Next internals, static image/font assets, favicon, API routes,
  // admin panel, and PWA files (service worker, manifest, offline page) that
  // must be served from the root scope without locale redirection.
  matcher: [
    '/((?!_next|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js|css|woff2?|ttf|otf|webmanifest|html)$|api|admin|static|sw\\.js|offline\\.html|manifest\\.webmanifest).*)',
  ],
};
