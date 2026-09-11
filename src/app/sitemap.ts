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

interface CollectionMeta {
  path: string;
  updatedAt?: string;
}

interface DynamicEntry {
  path: string;
  updatedAt?: string;
}

async function fetchDynamicContent() {
  const blog: DynamicEntry[] = [];
  const properties: DynamicEntry[] = [];
  const products: CollectionMeta[] = [];
  const teams: CollectionMeta[] = [];
  const consultants: CollectionMeta[] = [];
  const gallery: CollectionMeta[] = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      });

      // Scope every query to the rows the public pages actually render: published
      // blog posts and active listings for the collection pages. updated_at is
      // the data-freshness signal (ISO timestamptz from Postgres).

      const [postsResult, propertiesResult, productsResult, teamsResult, consultantsResult, galleryResult] = await Promise.all([
        supabase.from('newsletters').select('id, updated_at').eq('is_published', true),
        supabase.from('properties').select('id, updated_at').eq('is_active', true),
        supabase.from('products').select('updated_at').eq('is_active', true).order('updated_at', { ascending: false }).limit(1),
        supabase.from('team_members').select('updated_at').eq('is_active', true).order('updated_at', { ascending: false }).limit(1),
        supabase.from('consultants').select('updated_at').eq('is_active', true).order('updated_at', { ascending: false }).limit(1),
        supabase.from('gallery_images').select('updated_at').eq('is_active', true).order('updated_at', { ascending: false }).limit(1),
      ]);

      for (const post of postsResult.data ?? []) {
        if (post.id) blog.push({ path: `/blog/${post.id}`, updatedAt: post.updated_at });
      }
      for (const property of propertiesResult.data ?? []) {
        if (property.id) properties.push({ path: `/properties/${property.id}`, updatedAt: property.updated_at });
      }

      const productsLatest = productsResult.data?.[0]?.updated_at;
      const teamsLatest = teamsResult.data?.[0]?.updated_at;
      const consultantsLatest = consultantsResult.data?.[0]?.updated_at;
      const galleryLatest = galleryResult.data?.[0]?.updated_at;

      if (productsLatest) products.push({ path: '/products', updatedAt: productsLatest });
      if (teamsLatest) teams.push({ path: '/team', updatedAt: teamsLatest });
      if (consultantsLatest) consultants.push({ path: '/consultants', updatedAt: consultantsLatest });
      if (galleryLatest) gallery.push({ path: '/gallery', updatedAt: galleryLatest });
    } catch (error) {
      // Never fail the sitemap because of a transient data-layer issue;
      console.error('Failed to fetch dynamic routes for sitemap:', error);
    }
  }

  return { blog, properties, products, teams, consultants, gallery };
}

/**
 * English ↔ French reciprocal hreflang mapping for a sitemap entry. Every entry
 * under one locale declares both translations (and x-default) so crawlers
 * treat the pairs as equivalent.
 */
function localeAlternates(baseUrl: string, path: string): MetadataRoute.Sitemap[number]['alternates'] {
  return {
    languages: {
      en: `${baseUrl}/en${path}`,
      fr: `${baseUrl}/fr${path}`,
      'x-default': `${baseUrl}/en${path}`,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const dynamic = await fetchDynamicContent();

  const entries: MetadataRoute.Sitemap = [];

  // Static pages, always indexable under every locale with reciprocal hreflang.

  for (const route of staticRoutes) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        alternates: localeAlternates(baseUrl, route),
      });
    }
  }

  // Dynamic collection listing pages (freshness = newest record in the set).

  const collections: CollectionMeta[] = [
    ...dynamic.products,
    ...dynamic.teams,
    ...dynamic.consultants,
    ...dynamic.gallery,
  ];

  for (const collection of collections) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${collection.path}`,
        lastModified: collection.updatedAt ? new Date(collection.updatedAt) : undefined,
        alternates: localeAlternates(baseUrl, collection.path),
      });
    }
  }

  // Blog posts and property detail pages, rendered under both locales as
  // alternates of each other.

  for (const entry of [...dynamic.blog, ...dynamic.properties]) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${entry.path}`,
        lastModified: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
        alternates: localeAlternates(baseUrl, entry.path),
      });
    }
  }

  return entries;
}
