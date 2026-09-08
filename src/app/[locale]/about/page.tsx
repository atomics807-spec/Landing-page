import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { absoluteUrl, buildHreflang } from '@/lib/seo';
import AboutClientPage from './client-page';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.about' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: absoluteUrl(`/${locale}/about`),
      ...buildHreflang(locale, '/about'),
    },
  };
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Work with Paraysco Consulting',
  description: 'A step-by-step guide on how to engage with Paraysco Consulting for your professional consulting needs in real estate, engineering, construction, and business consultancy.',
  totalTime: 'P1D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '100',
  },
  supply: [
    { '@type': 'HowToSupply', name: 'Project requirements documentation' },
    { '@type': 'HowToSupply', name: 'Budget information' },
    { '@type': 'HowToSupply', name: 'Timeline expectations' },
  ],
  tool: [
    { '@type': 'HowToTool', name: 'Contact form on website' },
    { '@type': 'HowToTool', name: 'Email: parayscoconsulting@gmail.com' },
    { '@type': 'HowToTool', name: 'Phone: +237 676 914 581' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Initial Consultation',
      text: 'Submit an inquiry through our contact form or email us directly. Describe your project needsand requirements.',
    },
    {
      '@type': 'HowToStep',
      name: 'Discovery Meeting',
      text: 'Schedule a discovery call or meeting with our team to discuss your project in detailand understand your goals.',
    },
    {
      '@type': 'HowToStep',
      name: 'Proposal Development',
      text: 'Our team will prepare a customized proposal outlining our approach, timeline, and investment requirements.',
    },
    {
      '@type': 'HowToStep',
      name: 'Contract and Kickoff',
      text: 'Review and sign the contract, then we begin work on your project with regular updatesand communication.',
    },
    {
      '@type': 'HowToStep',
      name: 'Project Execution',
      text: 'We deliver our services with regular check-ins, progress reports, and ongoing support throughout the engagement.',
    },
  ],
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <AboutClientPage />
    </>
  );
}