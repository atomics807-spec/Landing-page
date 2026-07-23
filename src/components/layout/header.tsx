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
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n';
import { useTheme } from '@/components/providers/theme-provider';
import { UserMenu } from '@/components/layout/user-menu';

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
  const [isPropertiesDropdownOpen, setIsPropertiesDropdownOpen] = useState(false);
  const propertiesDropdownRef = useRef<HTMLDivElement>(null);

  const propertiesMenu = [
    {
      label: 'Properties',
      href: `/${locale}/properties`,
      description: 'View our available properties',
      icon: Building2,
    },
    {
      label: 'Products',
      href: `/${locale}/products`,
      description: 'View our available products',
      icon: Package,
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
    },
    {
      label: t('properties'),
      href: `/${locale}/properties`,
      icon: Building2,
      isDropdown: true,
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
      if (propertiesDropdownRef.current && !propertiesDropdownRef.current.contains(event.target as Node)) {
        setIsPropertiesDropdownOpen(false);
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

      {/* Main Header - Full Width */}
      <div className="w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section - Logo & Brand */}
            <Link 
              href={`/${locale}`} 
              className="flex items-center gap-3 flex-shrink-0"
            >
              <img 
                src="https://i.postimg.cc/yYmF58bc/Whats-App-Image-2026-06-21-at-12-00-37-(1).jpg" 
                alt="Paraysco Logo" 
                className="h-10 w-10 object-contain rounded-lg"
              />
              <span className="font-heading text-lg font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap">
                PARAYSCO CONSULTING
              </span>
            </Link>

            {/* Center Section - Desktop Navigation */}
            <nav className="hidden xl:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center gap-0.5">
                {navItems.map((item) => (
                  <div key={item.label} className="relative" ref={item.isDropdown ? propertiesDropdownRef : undefined}>
                    {item.isDropdown ? (
                      <>
                        <button
                          onClick={() => setIsPropertiesDropdownOpen(!isPropertiesDropdownOpen)}
                          onMouseEnter={() => setIsPropertiesDropdownOpen(true)}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px]',
                            isPropertiesDropdownOpen
                              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800'
                          )}
                        >
                          {item.label}
                          <ChevronDown className={cn(
                            'w-4 h-4 transition-transform duration-200',
                            isPropertiesDropdownOpen && 'rotate-180'
                          )} />
                        </button>
                        
                        <AnimatePresence>
                          {isPropertiesDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                              onClick={() => setIsPropertiesDropdownOpen(false)}
                            >
                              <div className="p-2 space-y-1">
                                {propertiesMenu.map((item) => (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors group"
                                  >
                                    <div className="w-10 h-10 rounded-lg bg-primary-100 group-hover:bg-primary-200 dark:bg-primary-900/50 dark:group-hover:bg-primary-800 flex items-center justify-center flex-shrink-0">
                                      <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300">
                                        {item.label}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.description}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px]',
                          pathname === item.href
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800'
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-1">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 min-h-[44px]"
                  aria-label="Switch language"
                >
                  <Globe className="h-4 w-4" />
                  <span className="uppercase hidden sm:inline">{locale}</span>
                </button>
                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-36 rounded-lg border bg-white shadow-lg dark:bg-gray-900"
                    >
                      {locales.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            switchLocale(loc);
                            setIsLangMenuOpen(false);
                          }}
                          className={cn(
                            'block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 first:rounded-t-lg last:rounded-b-lg',
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
                className="p-2.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle theme"
              >
                <Sun className={cn("h-5 w-5", theme === 'light' ? 'opacity-100' : 'opacity-0 absolute')} />
                <Moon className={cn("h-5 w-5", theme === 'dark' ? 'opacity-100' : 'opacity-0 absolute')} />
              </button>

              {/* User Menu / Login */}
              <UserMenu locale={locale} />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
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
            className="xl:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.isDropdown ? (
                    <div className="space-y-1">
                      <Link
                        href={`/${locale}/properties`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors min-h-[48px]',
                          pathname.includes('/properties')
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300'
                        )}
                      >
                        <Building2 className="h-5 w-5" />
                        <span>Properties</span>
                      </Link>
                      <Link
                        href={`/${locale}/products`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 pl-10 pr-4 py-3 text-sm font-medium rounded-lg transition-colors min-h-[48px]',
                          pathname.includes('/products')
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                            : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400'
                        )}
                      >
                        <Package className="h-5 w-5" />
                        <span>Products</span>
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors min-h-[48px]',
                        pathname === item.href
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300'
                      )}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <UserMenu locale={locale} />
                <Link href={`/${locale}/login`} className="mt-2 block">
                  <Button variant="outline" className="w-full">{t('login')}</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
