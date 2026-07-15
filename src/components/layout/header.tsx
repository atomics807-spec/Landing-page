'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Building2,
  Users,
  Briefcase,
  Home,
  FileText,
  Phone,
  Building,
  Cog,
  Construction,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n';
import { useTheme } from '@/components/providers/theme-provider';

const locales: Locale[] = ['en', 'fr'];

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('navigation');
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      label: 'Real Estate',
      href: `/${locale}/services`,
      description: 'Property management and investment advisory',
      icon: Building,
    },
    {
      label: 'Engineering',
      href: `/${locale}/services`,
      description: 'Infrastructure planning and technical studies',
      icon: Cog,
    },
    {
      label: 'Construction',
      href: `/${locale}/services`,
      description: 'Project management and supervision',
      icon: Construction,
    },
    {
      label: 'Investment Advisory',
      href: `/${locale}/services`,
      description: 'Financial modelling and business cases',
      icon: TrendingUp,
    },
  ];

  const navItems = [
    {
      label: t('home'),
      href: `/${locale}`,
      icon: Home,
    },
    {
      label: t('about'),
      href: `/${locale}/about`,
      icon: FileText,
    },
    {
      label: t('services'),
      href: `/${locale}/services`,
      icon: Briefcase,
      isDropdown: true,
    },
    {
      label: t('properties'),
      href: `/${locale}/properties`,
      icon: Building2,
    },
    {
      label: t('consultants'),
      href: `/${locale}/consultants`,
      icon: Users,
    },
    {
      label: 'Team',
      href: `/${locale}/team`,
      icon: Users,
    },
    {
      label: t('blog'),
      href: `/${locale}/blog`,
      icon: FileText,
    },
    {
      label: t('contact'),
      href: `/${locale}/contact`,
      icon: Phone,
    },
  ];

  const switchLocale = (newLocale: Locale) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale || ''}`;
    window.location.href = newPath;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-950/95">
      {/* Announcement Bar */}
      <div className="bg-primary-600 text-white py-2 text-center text-sm">
        <p>{t('announcement')}</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  PARAYSCO
                </span>
                <span className="text-primary-600 font-heading text-2xl font-bold">
                  PCI
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative" ref={item.isDropdown ? servicesDropdownRef : undefined}>
                {item.isDropdown ? (
                  <>
                    <button
                      onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                      onMouseEnter={() => setIsServicesDropdownOpen(true)}
                      className={cn(
                        'flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                        isServicesDropdownOpen
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800'
                      )}
                    >
                      <Briefcase className="w-4 h-4 mr-1" />
                      {item.label}
                      <ChevronDown className={cn(
                        'w-4 h-4 ml-1 transition-transform duration-200',
                        isServicesDropdownOpen && 'rotate-180'
                      )} />
                    </button>
                    
                    {/* Click-only dropdown - positioned to expand into hero section */}
                    <AnimatePresence>
                      {isServicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                          onClick={() => setIsServicesDropdownOpen(false)}
                        >
                          <div className="p-4 bg-gradient-to-br from-white to-primary-50 dark:from-gray-800 dark:to-primary-900/20">
                            <p className="text-xs font-semibold text-primary-600 uppercase mb-3">Our Services</p>
                            <div className="space-y-2">
                              {services.map((service) => (
                                <Link
                                  key={service.label}
                                  href={service.href}
                                  className="flex items-start space-x-3 p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 group"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-primary-100 group-hover:bg-primary-200 dark:bg-primary-900/50 dark:group-hover:bg-primary-800 flex items-center justify-center flex-shrink-0">
                                    <service.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300">
                                      {service.label}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                      {service.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <Link
                                href={item.href}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                              >
                                View All Services
                                <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800'
                    )}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300"
              >
                <Globe className="h-4 w-4" />
                <span className="uppercase">{locale}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-32 rounded-lg border bg-white shadow-lg dark:bg-gray-900"
                  >
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          switchLocale(loc);
                          setIsLangMenuOpen(false);
                        }}
                        className={cn(
                          'block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800',
                          locale === loc && 'text-primary-600 font-medium'
                        )}
                      >
                        {loc === 'en' ? 'English' : 'Français'}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 relative"
              aria-label="Toggle theme"
            >
              <Sun className={cn(
                "h-5 w-5 transition-all",
                theme === 'light' ? 'opacity-100' : 'opacity-0'
              )} />
              <Moon className={cn(
                "h-5 w-5 absolute inset-0 m-auto transition-all",
                theme === 'dark' ? 'opacity-100' : 'opacity-0'
              )} />
            </button>

            {/* Login Button */}
            <Button asChild className="hidden md:inline-flex">
              <Link href={`/${locale}/login`}>{t('login')}</Link>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-100 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300'
                    )}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.label}</span>
                  </Link>
                  {item.isDropdown && isMobileMenuOpen && (
                    <div className="ml-4 space-y-1">
                      {services.map((service) => (
                        <Link
                          key={service.label}
                          href={service.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400"
                        >
                          <service.icon className="w-4 h-4" />
                          <span>{service.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link href={`/${locale}/login`}>{t('login')}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
