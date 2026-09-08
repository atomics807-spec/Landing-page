import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { absoluteUrl, buildHreflang } from '@/lib/seo';
import SourcingClientPage from './client-page';

interface SourcingPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SourcingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.sourcing' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: absoluteUrl(`/${locale}/sourcing`),
      ...buildHreflang(locale, '/sourcing'),
    },
  };
}

export default async function SourcingPage({ params }: SourcingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SourcingClientPage />;
}
