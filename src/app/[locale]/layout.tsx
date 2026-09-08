import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { Header, Footer } from '@/components/layout';
import { cn } from '@/lib/utils';
import { CookieConsent } from '@/components/cookie-consent';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <div className={cn('min-h-screen flex flex-col')}>
      <NextIntlClientProvider messages={messages}>
        <Header locale={locale as Locale} />
        <main className="flex-1 pt-28">{children}</main>
        <Footer locale={locale as Locale} />
        <CookieConsent locale={locale} />
      </NextIntlClientProvider>
    </div>
  );
}
