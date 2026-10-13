import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/ui/reveal';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n';
import { subsidiaries, getSubsidiaryPath } from '@/lib/subsidiaries';

interface SubcompaniesSectionProps {
  locale: Locale;
}

export async function SubcompaniesSection({ locale }: SubcompaniesSectionProps) {
  const t = await getTranslations('subcompanies');
  const tCommon = await getTranslations('common');

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50" id="subcompanies">
      <div className="container mx-auto px-4">
        <Reveal variant="up" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subsidiaries.map((company) => {
            const name = t(`${company.key}.name`);
            const href = getSubsidiaryPath(locale, company.slug);

            return (
              <Reveal key={company.key} variant="up" className="h-full">
                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group h-full flex flex-col">
                  {/* Logo panel — the supplied logos sit on a light background, so
                      they rest on a tinted plate rather than the brand gradient. */}
                  <div className={`relative h-44 ${company.brand.accentSoftBg}`}>
                    <Image
                      src={company.logo}
                      alt={`${name} logo`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                      {t(`${company.key}.description`)}
                    </p>

                    <div className="space-y-3 mb-6 flex-1">
                      {(t.raw(`${company.key}.services`) as string[]).slice(0, 3).map((service, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {service}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      className="w-full group-hover:bg-primary-50 group-hover:border-primary-600"
                    >
                      <Link href={href}>
                        {tCommon('learnMore')}
                        <span className="sr-only"> about {name}</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
