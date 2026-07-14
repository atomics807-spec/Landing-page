'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Locale } from '@/i18n';

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
    { label: tServices('realEstate.title'), href: `/${locale}/services/real-estate` },
    { label: tServices('engineering.title'), href: `/${locale}/services/engineering` },
    { label: tServices('construction.title'), href: `/${locale}/services/construction` },
    { label: tServices('procurement.title'), href: `/${locale}/services/procurement` },
    { label: tServices('investment.title'), href: `/${locale}/services/investment` },
    { label: tServices('consultancy.title'), href: `/${locale}/services/consultancy` },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
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
      value: 'paraysco@gmail.com',
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <span className="font-heading text-xl font-bold text-white">
                  PARAYSCO
                </span>
                <span className="text-primary-400 font-heading text-xl font-bold">
                  {' '}
                  PCI
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
