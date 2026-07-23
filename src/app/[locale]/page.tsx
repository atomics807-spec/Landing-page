import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
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

  // Fetch FAQs for structured data
  let faqSchema = null;
  try {
    const supabase = await createClient();
    const { data: faqs } = await supabase
      .from('faqs')
      .select('question, answer')
      .eq('is_active', true)
      .limit(10);
    
    if (faqs && faqs.length > 0) {
      faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };
    }
  } catch (e) {
    console.error('Error fetching FAQs for schema:', e);
  }

  return (
    <>
      {/* FAQ Structured Data for SEO/AEO/GEO */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Paraysco Consulting',
            description: 'Professional consulting services in real estate, engineering, construction, and business consultancy across Africa.',
            url: 'https://paraysco.com',
            logo: 'https://i.postimg.cc/yYmF58bc/Whats-App-Image-2026-06-21-at-12-00-37-(1).jpg',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+237-676-914-581',
              contactType: 'customer service',
              availableLanguage: ['English', 'French'],
            },
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Bota Middle Farms',
              addressLocality: 'Limbe',
              addressRegion: 'South West Region',
              addressCountry: 'CM',
            },
          }),
        }}
      />

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
