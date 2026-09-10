import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

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
        '/admin/',
        '/api/',
        '/auth/',
        '/en/login',
        '/fr/login',
        '/en/register',
        '/fr/register',
        '/en/forgot-password',
        '/fr/forgot-password',
        '/en/profile',
        '/fr/profile',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
