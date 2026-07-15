'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface CookieConsentProps {
  locale: string;
}

export function CookieConsent({ locale }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('cookies');
  const tNav = useTranslations('navigation');

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookieConsent');
    if (!hasAccepted) {
      // Show after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <Cookie className="w-6 h-6 text-primary-600" />
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
            <Button
              variant="outline"
              onClick={handleDecline}
              className="w-full md:w-auto"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              className="w-full md:w-auto"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
