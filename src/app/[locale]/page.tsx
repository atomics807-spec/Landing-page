import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n';
import { absoluteUrl, buildHreflang } from '@/lib/seo';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      ...buildHreflang(locale, '/'),
    },
  };
}
import {
  HeroSection,
  StatisticsSection,
  AboutSection,
  ServicesSection,
  FounderSection,
  SubcompaniesSection,
  TestimonialsSection,
  CTASection,
  FAQSection,
  NewsletterSection,
} from '@/components/home';

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection locale={locale as Locale} />
      <StatisticsSection />
      <AboutSection locale={locale as Locale} />
      <ServicesSection locale={locale as Locale} />
      <FounderSection locale={locale as Locale} />
      <SubcompaniesSection locale={locale as Locale} />
      <TestimonialsSection />
      <FAQSection />
      <CTASection locale={locale as Locale} />
      <NewsletterSection />
    </>
  );
}
