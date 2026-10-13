import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  Users,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { RevealObserver } from '@/components/ui/reveal-observer';
import { absoluteUrl, buildHreflang, getSiteUrl } from '@/lib/seo';
import { subsidiaries, getSubsidiary, getSubsidiaryPath } from '@/lib/subsidiaries';
import type { Locale } from '@/i18n';

interface SubsidiaryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const baseUrl = getSiteUrl();

const highlightIcons = [ShieldCheck, Clock, MapPin, Users, Star, Sparkles];

export function generateStaticParams() {
  return subsidiaries.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({ params }: SubsidiaryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const company = getSubsidiary(slug);
  if (!company) return {};

  const t = await getTranslations({ locale, namespace: 'meta.subsidiaries' });
  const title = t(`${company.key}.title`);
  const description = t(`${company.key}.description`);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/${locale}/subsidiaries/${slug}`),
      ...buildHreflang(locale, `/subsidiaries/${slug}`),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: absoluteUrl(`/${locale}/subsidiaries/${slug}`),
      images: [{ url: company.logo }],
    },
  };
}

interface ServiceItem {
  title: string;
  description: string;
}

export default async function SubsidiaryPage({ params }: SubsidiaryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const company = getSubsidiary(slug);
  if (!company) notFound();

  const t = await getTranslations('subsidiaries');
  const tSub = await getTranslations('subcompanies');

  const name = tSub(`${company.key}.name`);
  const tagline = t(`${company.key}.tagline`);
  const heroSubtitle = t(`${company.key}.heroSubtitle`);
  const about = t.raw(`${company.key}.about`) as string[];
  const services = t.raw(`${company.key}.services`) as ServiceItem[];
  const highlights = t.raw(`${company.key}.highlights`) as ServiceItem[];

  const others = subsidiaries.filter((c) => c.slug !== company.slug);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#${company.slug}`,
    name,
    slogan: tagline,
    description: heroSubtitle,
    url: absoluteUrl(`/${locale}/subsidiaries/${company.slug}`),
    logo: `${baseUrl}${company.logo}`,
    parentOrganization: { '@id': `${baseUrl}/#organization` },
    areaServed: [
      { '@type': 'Country', name: 'Cameroon' },
      { '@type': 'Country', name: 'Nigeria' },
    ],
    knowsAbout: services.map((s) => s.title),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <RevealObserver />

      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${company.brand.gradient}`}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <Link
            href={`/${locale}#subcompanies`}
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToGroup')}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className={`inline-block text-xs font-semibold uppercase tracking-wider mb-4 px-3 py-1 rounded-full border ${company.brand.accentBorder} ${company.brand.accentText}`}
              >
                {t('eyebrow')}
              </span>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
                {name}
              </h1>
              <p className={`text-lg font-medium mb-4 ${company.brand.accentText}`}>{tagline}</p>
              <p className="text-lg text-white/80 mb-8 max-w-xl">{heroSubtitle}</p>

              <Button size="lg" className="bg-white text-gray-900 hover:bg-white/90 group" asChild>
                <Link href={`/${locale}/contact`}>
                  {t('cta.contact')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Logo plate */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <div className="relative h-48">
                  <Image
                    src={company.logo}
                    alt={`${name} logo`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 400px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <Reveal variant="up" className="lg:col-span-1">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                {t('aboutTitle')}
              </h2>
              <div
                className="h-1 w-20 rounded-full"
                style={{ backgroundColor: company.brand.accent }}
              />
            </Reveal>
            <Reveal variant="up" className="lg:col-span-2 space-y-5">
              {about.map((paragraph, i) => (
                <p key={i} className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <Reveal variant="up" className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('servicesTitle')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t('servicesSubtitle')}</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, i) => (
              <Reveal key={i} variant="up" delay={i * 60} className="h-full">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow h-full border border-gray-100 dark:border-gray-800">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${company.brand.accent}1a` }}
                  >
                    <CheckCircle className="w-6 h-6" style={{ color: company.brand.accent }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Reveal variant="up" className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('whyTitle')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t('whySubtitle')}</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {highlights.map((item, i) => {
              const Icon = highlightIcons[i % highlightIcons.length];
              return (
                <Reveal key={i} variant="up" delay={i * 60} className="h-full">
                  <div className="text-center p-6 h-full">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${company.brand.accent}1a` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: company.brand.accent }} />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other companies */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <Reveal variant="up" className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('otherCompanies')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t('otherSubtitle')}</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {others.map((other) => {
              const otherName = tSub(`${other.key}.name`);
              return (
                <Reveal key={other.key} variant="up" className="h-full">
                  <Link
                    href={getSubsidiaryPath(locale as Locale, other.slug)}
                    className="block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group h-full"
                  >
                    <div className={`relative h-40 ${other.brand.accentSoftBg}`}>
                      <Image
                        src={other.logo}
                        alt={`${otherName} logo`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        {otherName}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {tSub(`${other.key}.description`)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Reveal
            variant="up"
            className={`bg-gradient-to-br ${company.brand.gradient} rounded-3xl p-8 md:p-16 text-center relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-lg text-white/80 mb-8">{t('cta.subtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-white/90 group" asChild>
                  <Link href={`/${locale}/contact`}>
                    {t('cta.contact')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/60 hover:bg-white/10"
                  asChild
                >
                  <Link href={`/${locale}#subcompanies`}>{t('cta.exploreGroup')}</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
