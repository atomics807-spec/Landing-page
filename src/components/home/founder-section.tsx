import Image from 'next/image';
import { Reveal } from '@/components/ui/reveal';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Quote, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n';

interface FounderSectionProps {
  locale: Locale;
}

export async function FounderSection({ locale }: FounderSectionProps) {
  const t = await getTranslations('founder');

  return (
    <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <Reveal variant="up" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <Reveal variant="left" className="relative">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/founder.jpg"
                alt={t('name')}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-heading font-bold">
                  {t('name')}
                </h3>
                <p className="text-primary-200 mt-1">{t('role')}</p>
              </div>
            </div>

            <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl hidden lg:flex">
              <Quote className="w-8 h-8 text-white" />
            </div>
          </Reveal>

          <Reveal variant="right" className="space-y-8">
            <div>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light italic">
                &quot;{t('message')}&quot;
              </p>
            </div>

            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white italic">
                    {t('signature')}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">{t('role')}</p>
                </div>
                <Button asChild variant="outline" className="group">
                  <Link href={`/${locale}/about#founder`}>
                    {t('cta')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
