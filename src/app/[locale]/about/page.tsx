import { setRequestLocale, getTranslations } from 'next-intl/server';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Target, Eye, Users, Globe, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CTASection } from '@/components/home/cta-section';
import type { Locale } from '@/i18n';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');

  const values = [
    { key: 'integrity', icon: Shield },
    { key: 'excellence', icon: Sparkles },
    { key: 'accountability', icon: Target },
    { key: 'innovation', icon: Eye },
    { key: 'collaboration', icon: Users },
    { key: 'sustainability', icon: Globe },
  ];

  const achievements = [
    { icon: Award, value: '500+', label: 'Clients Served' },
    { icon: TrendingUp, value: '150+', label: 'Projects Completed' },
    { icon: Globe, value: '15+', label: 'Global Partners' },
    { icon: Users, value: '50+', label: 'Team Members' },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-primary-600 font-medium mb-2">{t('subtitle')}</p>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-6">{t('title')}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('description')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 border-0">
              <CardContent className="p-8">
                <Eye className="w-12 h-12 text-primary-600 mb-6" />
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">{t('vision.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('vision.content')}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-900/10 border-0">
              <CardContent className="p-8">
                <Target className="w-12 h-12 text-secondary-600 mb-6" />
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">{t('mission.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('mission.content')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">{t('values.title')}</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div key={value.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-primary-600" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{t(`values.items.${value.key}`)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((item, index) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center">
                <item.icon className="w-10 h-10 text-primary-200 mx-auto mb-4" />
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">{item.value}</p>
                <p className="text-primary-100">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="founder" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="order-2 lg:order-1">
              <p className="text-primary-600 font-medium mb-2">{t('founder.title')}</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">{t('founder.name')}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{t('founder.role')}</p>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">&quot;{t('founder.message')}&quot;</p>
              <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white italic">{t('founder.signature')}</p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                    <span className="text-5xl font-bold">MS</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold">{t('founder.name')}</h3>
                  <p className="text-primary-200 mt-2">{t('founder.role')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection locale={locale as Locale} />
    </div>
  );
}
