import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { absoluteUrl, buildHreflang, getSiteUrl } from '@/lib/seo';
import GalleryClientPage from './client-page';

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

interface GalleryRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
}

const baseUrl = getSiteUrl();

async function getGalleryItems(): Promise<GalleryRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('gallery_images')
      .select('id, title, description, category, image_url')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    return (data ?? []) as GalleryRow[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.gallery' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: absoluteUrl(`/${locale}/gallery`),
      ...buildHreflang(locale, '/gallery'),
    },
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const items = await getGalleryItems();
  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Paraysco Consulting Gallery',
    description: 'Real estate, engineering, construction, and consulting project gallery',
    image: items.map((item) => ({
      '@type': 'ImageObject',
      name: item.title,
      description: item.description || undefined,
      contentUrl: item.image_url,
      representativeOfPage: `${baseUrl}/${locale}/gallery`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <GalleryClientPage />
    </>
  );
}