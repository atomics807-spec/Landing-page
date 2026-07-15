'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LogOut, Home, LayoutDashboard, Building2, FileText, 
  Briefcase, Users as UsersIcon, Mail, Settings,
  Image, MessageSquare, HelpCircle, Briefcase as CareerIcon,
  Star, Users, Cog, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: UsersIcon },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/subcompanies', label: 'Subcompanies', icon: Building2 },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/consultants', label: 'Consultants', icon: Briefcase },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/careers', label: 'Careers', icon: CareerIcon },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/contact-messages', label: 'Contact Messages', icon: MessageSquare },
  { href: '/admin/media-library', label: 'Media Library', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Cog },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: Clock },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      router.push('/en/login');
      return;
    }

    const { data: adminData } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', authUser.id)
      .single();

    if (!adminData) {
      router.push('/en');
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
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/en/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/en" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="font-heading text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                Admin Panel
              </span>
            </Link>
            <Badge variant="secondary" className="hidden md:inline-flex">{user?.email}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/en">
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

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`bg-white dark:bg-gray-800 shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300 z-40 ${
          isSidebarOpen ? 'w-64' : 'w-0 lg:w-64'
        }`}>
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
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-6">
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
    </div>
  );
}
