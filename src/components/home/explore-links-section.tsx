import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import type { Locale } from '@/i18n';

interface ExploreLinksSectionProps {
  locale: Locale;
}

/**
 * Crawlable site directory.
 *
 * Every public route is reachable from the home page through a real
 * `<a href>` rendered on the server, so crawlers discover the full site in one
 * hop from the highest-authority page without executing JavaScript. Anchor text
 * is descriptive (never "click here"), and each link also carries a short
 * description so the relationship between pages is explicit. Routes are listed
 * here in one place; add new public pages to `routes` so they stay linked.
 */
export async function ExploreLinksSection({ locale }: ExploreLinksSectionProps) {
  const t = await getTranslations('common.internalLinks');

  const routes = [
    { key: 'about', href: `/${locale}/about` },
    { key: 'services', href: `/${locale}/services` },
    { key: 'properties', href: `/${locale}/properties` },
    { key: 'products', href: `/${locale}/products` },
    { key: 'sourcing', href: `/${locale}/sourcing` },
    { key: 'consultants', href: `/${locale}/consultants` },
    { key: 'team', href: `/${locale}/team` },
    { key: 'gallery', href: `/${locale}/gallery` },
    { key: 'blog', href: `/${locale}/blog` },
    { key: 'careers', href: `/${locale}/careers` },
    { key: 'contact', href: `/${locale}/contact` },
    { key: 'privacy', href: `/${locale}/privacy` },
    { key: 'terms', href: `/${locale}/terms` },
    { key: 'cookies', href: `/${locale}/cookies` },
  ];

  return (
    <section
      aria-labelledby="explore-heading"
      className="py-20 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-200/70 dark:border-gray-800"
    >
      <div className="container mx-auto px-4">
        <Reveal variant="up" className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
            {t('eyebrow')}
          </p>
          <h2
            id="explore-heading"
            className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4"
          >
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('subtitle')}</p>
        </Reveal>

        <nav aria-label={t('title')}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {routes.map((route) => (
              <li key={route.key}>
                <Link
                  href={route.href}
                  className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-primary-400 hover:bg-primary-50/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-primary-500 dark:hover:bg-gray-800"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {t(`items.${route.key}.title`)}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 flex-shrink-0 text-primary-600 transition-transform group-hover:translate-x-1 dark:text-primary-400"
                    />
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {t(`items.${route.key}.description`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('description')}
        </p>
      </div>
    </section>
  );
}
