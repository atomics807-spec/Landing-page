import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { absoluteUrl, buildHreflang } from '@/lib/seo';
import PropertiesClientPage from './client-page';

interface PropertiesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PropertiesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.properties' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: absoluteUrl(`/${locale}/properties`),
      ...buildHreflang(locale, '/properties'),
    },
  };
}

export default async function PropertiesPage({ params }: PropertiesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PropertiesClientPage />;
}
