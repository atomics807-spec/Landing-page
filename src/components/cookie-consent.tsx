'use client';

import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface CookieConsentProps {
  locale: string;
}

export function CookieConsent({ locale }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('cookies');

  useEffect(() => {
    if (localStorage.getItem('cookieConsent')) return;

    let cancelled = false;
    let idleHandle: number | undefined;
    let timerHandle: ReturnType<typeof setTimeout> | undefined;

    // Never mount during the initial load. This is a fixed, full-width overlay
    // whose text became the mobile LCP element; waiting until the page has
    // loaded and the main thread is idle keeps it out of the critical path.
    const show = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleHandle = window.requestIdleCallback(() => {
          if (!cancelled) setIsVisible(true);
        });
      } else {
        timerHandle = setTimeout(() => {
          if (!cancelled) setIsVisible(true);
        }, 200);
      }
    };

    if (document.readyState === 'complete') {
      show();
    } else {
      window.addEventListener('load', show, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', show);
      if (idleHandle !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleHandle);
      }
      if (timerHandle !== undefined) clearTimeout(timerHandle);
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  // Entrance is a small CSS animation (see globals.css) — no animation runtime.
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pci-cookie-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <Cookie className="w-6 h-6 text-primary-600" aria-hidden="true" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {t('title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We use cookies to improve your experience. By continuing to browse, you agree to our{' '}
              <Link href={`/${locale}/cookies`} className="text-primary-600 hover:underline">
                Cookie Policy
              </Link>{' '}
              and{' '}
              <Link href={`/${locale}/terms`} className="text-primary-600 hover:underline">
                Terms of Service
              </Link>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={handleDecline} className="w-full md:w-auto">
              Decline
            </Button>
            <Button onClick={handleAccept} className="w-full md:w-auto">
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
