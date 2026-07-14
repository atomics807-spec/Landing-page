import { setRequestLocale } from 'next-intl/server';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Building, Cog, Construction, Truck, TrendingUp, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CTASection } from '@/components/home/cta-section';
import type { Locale } from '@/i18n';

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

const iconMap = {
  realEstate: Building,
  engineering: Cog,
  construction: Construction,
  procurement: Truck,
  investment: TrendingUp,
  consultancy: Users,
};

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.key as keyof typeof iconMap];
              const features = t.raw(`${service.key}.features`) as string[];

              return (
                <motion.div
                  key={service.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-xl ${service.color} flex items-center justify-center mb-6`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {t(`${service.key}.title`)}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {t(`${service.key}.description`)}
                      </p>
                      <ul className="space-y-3 mb-6">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" className="w-full group">
                        <Link href={`/${locale}/services/${service.key}`} className="flex items-center">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Our Working Process
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A systematic approach to delivering excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', description: 'We discuss your needs and requirements in detail' },
              { step: '02', title: 'Analysis', description: 'Our team analyzes and develops a strategic plan' },
              { step: '03', title: 'Implementation', description: 'We execute the plan with regular updates' },
              { step: '04', title: 'Delivery', description: 'Final delivery with comprehensive support' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-primary-100 dark:text-primary-900/30 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection locale={locale as Locale} />
    </div>
  );
}
