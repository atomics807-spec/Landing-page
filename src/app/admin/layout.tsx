'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Home, LayoutDashboard, Building2, FileText, 
  Briefcase, Users as UsersIcon, Mail, Settings,
  Image, MessageSquare, HelpCircle, Briefcase as CareerIcon,
  Star, Users, Cog, Clock, Menu, X, Sun, Moon, Globe, ChevronDown,
  BarChart3, Package, Images
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from '@/components/providers/theme-provider';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/profile', label: 'Profile', icon: UsersIcon },
  { href: '/admin/users', label: 'Users', icon: UsersIcon },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/subcompanies', label: 'Subcompanies', icon: Building2 },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/consultants', label: 'Consultants', icon: Briefcase },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/careers', label: 'Careers', icon: CareerIcon },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/contact-messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/media-library', label: 'Media', icon: Image },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
  { href: '/admin/settings', label: 'Settings', icon: Cog },
  { href: '/admin/audit-logs', label: 'Logs', icon: Clock },
];

const locales = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      router.push(`/${currentLocale}/login`);
      return;
    }

    const { data: adminData } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', authUser.id)
      .single();

    if (!adminData) {
      router.push(`/${currentLocale}`);
      return;
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    setUser(profile || { id: authUser.id, email: authUser.email || '', full_name: '', role: 'admin' });
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      window.location.href = `/${currentLocale}/login`;
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = `/${currentLocale}/login`;
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const switchLanguage = (locale: string) => {
    const currentPath = pathname;
    const newPath = currentPath.replace(/\/(en|fr)/, `/${locale}`);
    router.push(newPath);
    setIsLangMenuOpen(false);
  };

  // Get current locale from pathname
  const currentLocale = pathname.includes('/fr/') ? 'fr' : 'en';
  const currentLang = locales.find(l => l.code === currentLocale) || locales[0];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href={`/${currentLocale}`} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" key="moon" />
                ) : (
                  <Sun className="w-5 h-5" key="sun" />
                )}
              </AnimatePresence>
            </button>
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-1"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsLangMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
                      {locales.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => switchLanguage(lang.code)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                            currentLocale === lang.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : ''
                          }`}
                        >
                          <span className="mr-2">{lang.flag}</span>
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link href={`/${currentLocale}`}>
              <Button variant="ghost" size="sm" className="text-xs">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-50 hidden lg:block">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/${currentLocale}`} className="flex items-center gap-3">
              <img 
                src="https://i.postimg.cc/yYmF58bc/Whats-App-Image-2026-06-21-at-12-00-37-(1).jpg" 
                alt="Paraysco Logo" 
                className="w-10 h-10 object-contain rounded-lg"
              />
              <span className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </span>
            </Link>
            <Badge variant="secondary">{user?.email}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" key="moon" />
                ) : (
                  <Sun className="w-5 h-5" key="sun" />
                )}
              </AnimatePresence>
            </button>
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-1"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsLangMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
                      {locales.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => switchLanguage(lang.code)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                            currentLocale === lang.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : ''
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-medium">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link href={`/${currentLocale}`}>
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />View Site
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar - Overlay */}
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={closeSidebar}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-xl z-50 lg:hidden overflow-y-auto">
            <div className="pt-16 p-4">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b dark:border-gray-700">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="font-bold text-lg">Admin Menu</span>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={closeSidebar}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </>
      )}

      {/* Desktop Sidebar - Fixed on left */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto z-30">
        <div className="p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content - Full width on all screens */}
      <main className="pt-16 lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
