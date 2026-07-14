import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n';
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

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

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
