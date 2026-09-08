import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { absoluteUrl, buildHreflang } from '@/lib/seo';
import PropertyDetailClientPage from './client-page';

interface PropertyDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://parayscoconsulting.com';

async function getProperty(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;

  const property = await getProperty(id);
 if (!property) return {};

  const title = property.title;
 const description = property.description?.slice(0, 160) || `${property.title} in ${property.location}`;

  return {
    title: `${title} | Paraysco Consulting`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: absoluteUrl(`/${locale}/properties/${id}`),
      images: property.images?.[0] ? [{ url: property.images[0] }] : undefined,
      locale: `${locale}_CM`,
    },
    alternates: {
      canonical: absoluteUrl(`/${locale}/properties/${id}`),
      ...buildHreflang(locale, `/properties/${id}`),
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { locale, id } = await params; setRequestLocale(locale);

  const property = await getProperty(id);
 if (!property) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description?.slice(0, 300) || property.title,
    image: property.images?.[0] ? property.images : undefined,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency || 'USD',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/${locale}/properties/${id}`),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PropertyDetailClientPage locale={locale} id={id} />
    </>
  );
}