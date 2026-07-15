'use client';

import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

export default function LanguageProvider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
