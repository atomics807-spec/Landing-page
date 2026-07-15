'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Building, Cog, Construction, Truck, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n';

interface ServicesSectionProps {
  locale: Locale;
}

const iconMap = {
  realEstate: Building,
  engineering: Cog,
  construction: Construction,
  procurement: Truck,
  investment: TrendingUp,
  consultancy: Users,
};

export function ServicesSection({ locale }: ServicesSectionProps) {
  const t = useTranslations('services');

  const services = [
    { key: 'realEstate', color: 'bg-blue-500' },
    { key: 'engineering', color: 'bg-purple-500' },
    { key: 'construction', color: 'bg-orange-500' },
    { key: 'procurement', color: 'bg-green-500' },
    { key: 'investment', color: 'bg-red-500' },
    { key: 'consultancy', color: 'bg-teal-500' },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.key as keyof typeof iconMap];

            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/${locale}/services`} className="group">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                    <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 transition-colors">
                      {t(`${service.key}.title`)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {t(`${service.key}.description`)}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(t.raw(`${service.key}.features`) as string[]).slice(0, 3).map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" variant="outline" className="group">
            <Link href={`/${locale}/services`}>
              View All Services
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
