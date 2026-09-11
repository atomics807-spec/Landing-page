import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import { locales } from '@/i18n';

// App-only, non-indexable surfaces. Anything under these roots must never
// appear in search results (auth sessions, APIs, admin panel, uploads.
// Locale-scoped auth/profile routes are listed explicitly per language so every
// translated variant of the private surface is blocked too.

const privateRoots = ['/admin/', '/api/', '/auth/'];

const localePrivatePaths = locales.flatMap((locale) => [
  `/${locale}/login`,
  `/${locale}/register`,
  `/${locale}/forgot-password`,
  `/${locale}/profile`,
]);

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private/app-only paths. Locale-prefixed auth/profile routes are listed
      // explicitly so they're blocked under every language. `/_next/` must NOT
      // be disallowed - it is first-party app tooling, not an indexable surface.

      disallow: [
        ...privateRoots,
        ...localePrivatePaths,
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
