import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, MessageCircle } from 'lucide-react';
import type { Locale } from '@/i18n';

const WHATSAPP_NUMBER = '237676914581';
const WHATSAPP_MESSAGE = 'Hello! I would like to learn more about Paraysco Consulting Inc. services.';

interface HeroSectionProps {
  locale: Locale;
}

// Above-the-fold entrance is pure CSS so the hero paints with the first
// stylesheet instead of waiting on hydration or the animation library.
const fadeUp = 'animate-fade-up';
const fadeUpDelay = (delay: '100' | '200' | '300' | '400') =>
  `animate-fade-up animate-delay-${delay}`;

export async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations('hero');

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`text-center lg:text-left ${fadeUp}`}>
            <div className={fadeUpDelay('100')}>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500 mr-2 animate-pulse" />
                Building Sustainable Partnerships
              </span>
            </div>

            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white leading-tight mb-6 ${fadeUpDelay('200')}`}
            >
              {t('title')}
            </h1>

            <p
              className={`text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 ${fadeUpDelay('300')}`}
            >
              {t('subtitle')}
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start ${fadeUpDelay('400')}`}
            >
              <Button size="lg" asChild className="group">
                <a href={`/${locale}/contact`}>
                  {t('cta')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={`/${locale}/services`}>
                  <Play className="mr-2 h-5 w-5" />
                  {t('ctaSecondary')}
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-200 dark:border-gray-700 ${fadeUpDelay('400')}`}
            >
              <div>
                <p className="text-3xl font-bold text-primary-600">500+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Clients</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">150+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Projects</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">10+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Years</p>
              </div>
            </div>
          </div>

          {/* Hero Image — the mobile LCP element. Served from the app origin,
              preloaded at high priority, and never lazy-loaded. next/image emits
              a responsive srcset (AVIF/WebP) so phones fetch a phone-sized asset
              rather than the desktop one. */}
          <div className={`relative ${fadeUp}`}>
            <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800">
              <Image
                src="/hero-consulting.jpg"
                alt="Paraysco Consulting — professional advisory team"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Floating Cards */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 hidden lg:block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Trusted Partner</p>
                  <p className="text-sm text-gray-500">Verified Company</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 hidden lg:block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 text-xl">★</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">5.0 Rating</p>
                  <p className="text-sm text-gray-500">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button — below the fold. */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us
        </span>
      </a>
    </section>
  );
}
