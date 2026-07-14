import { setRequestLocale, getTranslations } from 'next-intl/server';
import { CTASection } from '@/components/home/cta-section';
import { AboutContent } from './about-content';
import type { Locale } from '@/i18n';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');

  return (
    <div className="min-h-screen">
      <AboutContent t={t} locale={locale as Locale} />
      <CTASection locale={locale as Locale} />
    </div>
  );
}
