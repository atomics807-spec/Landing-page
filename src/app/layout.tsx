import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
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
    'Paraysco Consulting Inc. provides innovative consultancy solutions that bridge the gap between ideas and implementation, investment and opportunity, and ambition and sustainable growth.',
  keywords: [
    'consulting',
    'real estate',
    'investment advisory',
    'project management',
    'Cameroon',
    'business consultancy',
    'engineering',
    'construction',
  ],
  authors: [{ name: 'Paraysco Consulting Inc.' }],
  creator: 'Paraysco Consulting Inc.',
  publisher: 'Paraysco Consulting Inc.',
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
      'Paraysco Consulting Inc. provides innovative consultancy solutions for sustainable growth.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Paraysco Consulting Inc.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paraysco Consulting Inc.',
    description:
      'Professional Solutions, Sustainable Growth. Innovative consultancy solutions for governments, institutions, and businesses.',
    images: ['/og-image.png'],
    creator: '@paraysco',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
              logo: '/logo.png',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+237-676-914-581',
                email: 'paraysco@gmail.com',
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
      </body>
    </html>
  );
}
