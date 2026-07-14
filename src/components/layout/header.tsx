'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu';
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
      children: [
        {
          label: 'Real Estate',
          href: `/${locale}/services/real-estate`,
          description: 'Property management and investment advisory',
        },
        {
          label: 'Engineering',
          href: `/${locale}/services/engineering`,
          description: 'Infrastructure planning and technical studies',
        },
        {
          label: 'Construction',
          href: `/${locale}/services/construction`,
          description: 'Project management and supervision',
        },
        {
          label: 'Investment Advisory',
          href: `/${locale}/services/investment`,
          description: 'Financial modelling and business cases',
        },
      ],
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-950/95">
      {/* Announcement Bar */}
      <div className="bg-primary-600 text-white py-2 text-center text-sm">
        <p>{t('announcement')}</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                PARAYSCO
              </span>
              <span className="text-primary-600 font-heading text-xl font-bold">
                {' '}
                PCI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger className="text-sm font-medium">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {child.label}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                  {child.description}
                                </p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          'text-sm font-medium transition-colors hover:text-primary-600',
                          pathname === item.href
                            ? 'text-primary-600'
                            : 'text-gray-600 dark:text-gray-300'
                        )}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

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
                  {item.children && (
                    <div className="ml-8 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:text-gray-400"
                        >
                          {child.label}
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
