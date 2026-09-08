import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { absoluteUrl, buildHreflang } from '@/lib/seo';

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.terms' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: absoluteUrl(`/${locale}/terms`),
      ...buildHreflang(locale, '/terms'),
    },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('terms');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">{t('title')}</h1>
        <p className="text-gray-500 mb-8">{t('lastUpdated')}</p>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('section1.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('section1.content')}</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('section2.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('section2.content')}</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('section3.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('section3.content')}</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('section4.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('section4.content')}</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('section5.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('section5.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('section6.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('section6.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('section7.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('section7.content')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
