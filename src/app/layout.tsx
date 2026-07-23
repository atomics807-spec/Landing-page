import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://paraysco.com'),
  title: {
    default: 'Paraysco Consulting Inc. | Professional Solutions, Sustainable Growth',
    template: '%s | Paraysco Consulting Inc.',
  },
  description:
    'Paraysco Consulting Inc. provides innovative consultancy solutions that bridge the gap between ideas and implementation, investment and opportunity, and ambition and sustainable growth. Expert services in real estate, engineering, construction, and business consultancy across Africa.',
  keywords: [
    'consulting firm Cameroon',
    'real estate advisory Africa',
    'investment advisory',
    'project management',
    'business consultancy',
    'engineering services',
    'construction management',
    'procurement services',
    'Limbe Cameroon',
    'Lagos Nigeria',
    'Abuja Nigeria',
    'Paraysco',
    'sustainable development Africa',
  ],
  authors: [{ name: 'Paraysco Consulting Inc.', url: 'https://paraysco.com' }],
  creator: 'Paraysco Consulting Inc.',
  publisher: 'Paraysco Consulting Inc.',
  category: 'Business Consulting',
  classification: 'Professional Services',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR'],
    siteName: 'Paraysco Consulting Inc.',
    title: 'Paraysco Consulting Inc. | Professional Solutions, Sustainable Growth',
    description:
      'Expert multidisciplinary consulting firm providing integrated solutions in real estate, engineering, construction, and business consultancy across Africa.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Paraysco Consulting Inc. - Professional Solutions for Sustainable Growth',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'Paraysco Consulting Inc. Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paraysco Consulting Inc. | Professional Solutions, Sustainable Growth',
    description:
      'Expert multidisciplinary consulting firm providing integrated solutions across Africa. Real estate, engineering, construction, and business consultancy.',
    images: ['/og-image.png'],
    creator: '@paraysco',
    site: '@paraysco',
  },
  facebook: {
    appId: 'your-facebook-app-id',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://paraysco.com',
    languages: {
      'en': 'https://paraysco.com/en',
      'fr': 'https://paraysco.com/fr',
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://i.postimg.cc/yYmF58bc/Whats-App-Image-2026-06-21-at-12-00-37-(1).jpg" sizes="any" />
        <link rel="apple-touch-icon" href="https://i.postimg.cc/yYmF58bc/Whats-App-Image-2026-06-21-at-12-00-37-(1).jpg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d9488" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Paraysco" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Paraysco Consulting Inc.',
              description:
                'Multidisciplinary professional consulting firm providing integrated solutions across real estate, engineering, construction, and business consultancy.',
              url: process.env.NEXT_PUBLIC_APP_URL || 'https://paraysco.com',
              logo: 'https://i.postimg.cc/yYmF58bc/Whats-App-Image-2026-06-21-at-12-00-37-(1).jpg',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+237-676-914-581',
                email: 'parayscoconsulting@gmail.com',
                contactType: 'customer service',
                availableLanguage: ['English', 'French'],
              },
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Bota Middle Farms, Limbe',
                addressLocality: 'Limbe',
                addressRegion: 'South West Region',
                addressCountry: 'CM',
              },
              sameAs: [
                'https://facebook.com/paraysco',
                'https://twitter.com/paraysco',
                'https://linkedin.com/company/paraysco',
                'https://instagram.com/paraysco',
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
