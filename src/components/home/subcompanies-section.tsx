import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/ui/reveal';
import Link from 'next/link';
import { ArrowRight, Truck, Ship, ShoppingBag, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n';

interface SubcompaniesSectionProps {
  locale: Locale;
}

const iconMap = {
  parayscoExpress: Truck,
  elohimAzar: Ship,
  houseOfPat: ShoppingBag,
};

export async function SubcompaniesSection({ locale }: SubcompaniesSectionProps) {
  const t = await getTranslations('subcompanies');

  const subcompanies = [
    {
      key: 'parayscoExpress',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      features: ['Food Delivery', 'Package Delivery', 'Errand Services'],
    },
    {
      key: 'elohimAzar',
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      features: ['Passenger Transport', 'Charter Services', 'Emergency Marine'],
    },
    {
      key: 'houseOfPat',
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
      features: ['Luxury Lace Fabrics', 'Bridal Collection', 'Styling Advice'],
    },
  ];

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
          {subcompanies.map((company, index) => {
            const Icon = iconMap[company.key as keyof typeof iconMap];

            return (
              <Reveal variant="up">
                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group h-full flex flex-col">
                  {/* Header */}
                  <div className={`${company.color} p-8 text-white`}>
                    <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {t(`${company.key}.name`)}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {t(`${company.key}.description`)}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="space-y-3 mb-6 flex-1">
                      {(t.raw(`${company.key}.services`) as string[]).map((service, i) => (
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
                      <Link href={`/${locale}/contact`}>
                        Learn More
                        <span className="sr-only"> about {t(`${company.key}.name`)}</span>
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
