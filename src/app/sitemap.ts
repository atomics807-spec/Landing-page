import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getSiteUrl } from '@/lib/seo';
import { locales } from '@/i18n';

/**
 * Sitemap queries Supabase for indexable dynamic content, so it must not be
 * prerendered at build time (the DB isn't available then). It degrades to the
 * static localized routes if the data fetch fails.
 */
export const dynamic = 'force-dynamic';

// Static, always-indexable localized routes.

const staticRoutes = [
  '',
  '/about',
  '/services',
  '/properties',
  '/products',
  '/blog',
  '/sourcing',
  '/consultants',
  '/team',
  '/gallery',
  '/careers',
  '/contact',
  '/terms',
  '/privacy',
  '/cookies',
];

async function getDynamicSlugs() {
  const blogSlugs: string[] = [];
  const propertyIds: string[] = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      });

      // Only published posts are visible on the public blog; neither column on
      // properties gates public rendering, so include all public property ids.

      const [posts, properties] = await Promise.all([
        supabase.from('newsletters').select('id').eq('is_published', true),
        supabase.from('properties').select('id'),
      ]);

      for (const post of posts.data ?? []) {
        if (post.id) blogSlugs.push(post.id);
      }
      for (const property of properties.data ?? []) {
        if (property.id) propertyIds.push(property.id);
      }
    } catch (error) {
      // Never fail the sitemap because of a transient data-layer issue;
      console.error('Failed to fetch dynamic routes for sitemap:', error);
    }
  }

  return { blogSlugs, propertyIds };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const { blogSlugs, propertyIds } = await getDynamicSlugs();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Static pages
    for (const route of staticRoutes) {
      entries.push({ url: `${baseUrl}/${locale}${route}` });
    }

    // Published blog posts
    for (const slug of blogSlugs) {
      entries.push({ url: `${baseUrl}/${locale}/blog/${slug}` });
    }

    // Public property listings
    for (const id of propertyIds) {
      entries.push({ url: `${baseUrl}/${locale}/properties/${id}` });
    }
  }

  return entries;
}