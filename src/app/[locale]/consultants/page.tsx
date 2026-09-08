import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { absoluteUrl, buildHreflang } from '@/lib/seo';
import ConsultantsClientPage from './client-page';

interface ConsultantsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ConsultantsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.consultants' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: absoluteUrl(`/${locale}/consultants`),
      ...buildHreflang(locale, '/consultants'),
    },
  };
}

export default async function ConsultantsPage({ params }: ConsultantsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ConsultantsClientPage />;
}
