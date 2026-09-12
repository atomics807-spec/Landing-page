import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { Header, Footer } from '@/components/layout';
import { cn } from '@/lib/utils';
import { CookieConsent } from '@/components/cookie-consent';
import { getSiteUrl } from '@/lib/seo';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const baseUrl = getSiteUrl();

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'Paraysco Consulting Inc.',
  legalName: 'Paraysco Consulting Inc.',
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  telephone: '+237 676 914 581',
  email: 'info@parayscoconsulting.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bota Middle Farms',
    addressLocality: 'Limbe',
    addressRegion: 'South West Region',
    addressCountry: 'CM',
  },
  availableLanguage: ['en', 'fr'],
  knowsAbout: [
    'Real Estate & Property Management',
    'Engineering & Infrastructure',
    'Construction Project Management',
    'Procurement & Supply Chain',
    'Investment Advisory',
    'Business Consultancy',
  ],
};

const consultingServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ConsultingService',
  '@id': `${baseUrl}/#consulting-service`,
  name: 'Paraysco Consulting Services',
  provider: { '@id': `${baseUrl}/#organization` },
  serviceType: [
    'Real Estate & Property Management',
    'Engineering & Infrastructure',
    'Construction Project Management',
    'Procurement & Supply Chain',
    'Investment Advisory',
    'Business Consultancy',
  ],
  areaServed: { '@type': 'Country', name: 'Cameroon' },
  availableLanguage: ['en', 'fr'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bota Middle Farms',
    addressLocality: 'Limbe',
    addressRegion: 'South West Region',
    addressCountry: 'CM',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+237 676 914 581',
    email: 'info@parayscoconsulting.com',
    contactType: 'customer service',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <div className={cn('min-h-screen flex flex-col')}>
      <NextIntlClientProvider messages={messages}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(consultingServiceSchema) }}
        />
        <Header locale={locale as Locale} />
        <main className="flex-1 pt-28">{children}</main>
        <Footer locale={locale as Locale} />
        <CookieConsent locale={locale} />
      </NextIntlClientProvider>
    </div>
  );
}
