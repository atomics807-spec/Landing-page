'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building, Cog, Construction, Truck, TrendingUp, Users, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CTASection } from '@/components/home/cta-section';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/i18n';

interface Service {
  id: string;
  name: string;
  name_en: string;
  name_fr: string;
  description: string;
  description_en: string;
  description_fr: string;
  icon: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

const iconMap: Record<string, any> = {
  Building,
  Cog,
  Construction,
  Truck,
  TrendingUp,
  Users,
  realEstate: Building,
  engineering: Cog,
  construction: Construction,
  procurement: Truck,
  investment: TrendingUp,
  consultancy: Users,
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  teal: 'bg-teal-500',
  primary: 'bg-primary-500',
};

export default function ServicesPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations('services');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    setServices(data || []);
    setIsLoading(false);
  };

  const getServiceName = (service: Service) => {
    if (locale === 'fr' && service.name_fr) return service.name_fr;
    if (locale === 'en' && service.name_en) return service.name_en;
    return service.name;
  };

  const getServiceDescription = (service: Service) => {
    if (locale === 'fr' && service.description_fr) return service.description_fr;
    if (locale === 'en' && service.description_en) return service.description_en;
    return service.description;
  };

  const getServiceIcon = (iconName: string) => {
    return iconMap[iconName] || Building;
  };

  const getServiceColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500', 'bg-teal-500'];
    return colors[index % colors.length];
  };

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
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">Services coming soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = getServiceIcon(service.icon || '');
                const color = getServiceColor(index);

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-8">
                        <div className={`w-16 h-16 rounded-xl ${color} flex items-center justify-center mb-6`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                          {getServiceName(service)}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          {getServiceDescription(service) || t('subtitle')}
                        </p>
                        <Button variant="outline" className="w-full group" asChild>
                          <Link href={`/${locale}/contact`}>
                            Contact Us
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
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

      <CTASection locale={locale} />
    </div>
  );
}
