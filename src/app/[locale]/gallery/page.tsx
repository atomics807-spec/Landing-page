import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { absoluteUrl, buildHreflang } from '@/lib/seo';
import GalleryClientPage from './client-page';

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
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
  return <GalleryClientPage />;
}