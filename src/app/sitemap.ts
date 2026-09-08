import { MetadataRoute } from 'next';
import { locales } from '@/i18n';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paraysco.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/services',
    '/properties',
    '/products',
    '/blog',
    '/sourcing',
    '/consultants',
    '/team',
    '/careers',
    '/contact',
    '/terms',
    '/privacy',
    '/cookies',
  ];

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
    })),
  );
}