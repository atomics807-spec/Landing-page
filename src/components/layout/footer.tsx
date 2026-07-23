'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Locale } from '@/i18n';

// Custom TikTok Icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const tNav = useTranslations('navigation');
  const tServices = useTranslations('services');

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: tNav('home'), href: `/${locale}` },
    { label: tNav('about'), href: `/${locale}/about` },
    { label: tNav('services'), href: `/${locale}/services` },
    { label: tNav('properties'), href: `/${locale}/properties` },
    { label: tNav('blog'), href: `/${locale}/blog`    },
    { label: tNav('contact'), href: `/${locale}/contact` },
  ];

  const services = [
    { label: tServices('realEstate.title'), href: `/${locale}/services#real-estate` },
    { label: tServices('engineering.title'), href: `/${locale}/services#engineering` },
    { label: tServices('construction.title'), href: `/${locale}/services#construction` },
    { label: tServices('procurement.title'), href: `/${locale}/services#procurement` },
    { label: tServices('investment.title'), href: `/${locale}/services#investment` },
    { label: tServices('consultancy.title'), href: `/${locale}/services#consultancy` },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1B3A4oumdE/', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/parayscoconsultinginc?igsh=NTc3cGg3YWd5emk0', label: 'Instagram' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@parayscoconsultin?_r=1&_t=ZS-98GqbjxWyzF', label: 'TikTok' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/mola-scott-607760250', label: 'LinkedIn' },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      label: t('address'),
      value: 'Bota Middle Farms, Limbe, South West Region, Cameroon',
    },
    {
      icon: Phone,
      label: t('phone'),
      value: '+237 676 914 581',
    },
    {
      icon: Mail,
      label: t('email'),
      value: 'parayscoconsulting@gmail.com',
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://i.postimg.cc/yYmF58bc/Whats-App-Image-2026-06-21-at-12-00-37-(1).jpg" 
                alt="Paraysco Logo" 
                className="h-12 w-12 object-contain rounded-lg"
              />
              <div>
                <span className="font-heading text-lg font-semibold text-white">
                  PARAYSCO INC
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">{t('description')}</p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t('services')}</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t('connect')}</h3>
            <ul className="space-y-4">
              {contactInfo.map((info) => (
                <li key={info.label} className="flex items-start space-x-3">
                  <info.icon className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">{info.label}</p>
                    <p className="text-sm text-white">{info.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400">
            © {currentYear} Paraysco Consulting Inc. {t('copyright')}
          </p>
          <div className="flex space-x-6">
            <Link
              href={`/${locale}/privacy`}
              className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
            >
              {t('terms')}
            </Link>
            <Link
              href={`/${locale}/cookies`}
              className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
            >
              {t('cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
