'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye, Target, Shield, Sparkles } from 'lucide-react';
import type { Locale } from '@/i18n';

interface AboutSectionProps {
  locale: Locale;
}

export function AboutSection({ locale }: AboutSectionProps) {
  const t = useTranslations('about');

  const values = [
    { key: 'integrity', icon: Shield },
    { key: 'excellence', icon: Sparkles },
    { key: 'accountability', icon: Target },
    { key: 'innovation', icon: Eye },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://cdn.nishtyainfotech.com/content/learnings/data/blog/banner/68b98b1fd04231.13423553.webp" 
                alt="Paraysco Consulting" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl font-heading font-bold">
                  Paraysco Consulting Inc.
                </h3>
                <p className="text-primary-200 mt-1">Since 2012</p>
              </div>
            </div>

            {/* Experience Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-primary-600 text-white rounded-xl shadow-xl p-6 hidden lg:block"
            >
              <p className="text-4xl font-bold">10+</p>
              <p className="text-primary-100">Years of Excellence</p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="text-primary-600 font-medium mb-2">
                {t('subtitle')}
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                {t('title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {t('description')}
              </p>
            </div>

            {/* Vision & Mission */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('vision.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {t('vision.content')}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="w-12 h-12 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-secondary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('mission.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {t('mission.content')}
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('values.title')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {values.map((value) => (
                  <div
                    key={value.key}
                    className="flex items-center space-x-3"
                  >
                    <value.icon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {t(`values.items.${value.key}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button asChild className="group">
              <Link href={`/${locale}/about`}>
                {t('title')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
