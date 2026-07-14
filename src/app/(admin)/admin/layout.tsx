'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Briefcase,
  Users,
  UserCircle,
  Building,
  MessageSquare,
  Mail,
  Settings,
  Image,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Properties',
    href: '/admin/properties',
    icon: Building2,
  },
  {
    label: 'Blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    label: 'Services',
    href: '/admin/services',
    icon: Briefcase,
  },
  {
    label: 'Team',
    href: '/admin/team',
    icon: Users,
  },
  {
    label: 'Consultants',
    href: '/admin/consultants',
    icon: UserCircle,
  },
  {
    label: 'Subcompanies',
    href: '/admin/subcompanies',
    icon: Building,
  },
  {
    label: 'Testimonials',
    href: '/admin/testimonials',
    icon: MessageSquare,
  },
  {
    label: 'FAQs',
    href: '/admin/faqs',
    icon: MessageSquare,
  },
  {
    label: 'Careers',
    href: '/admin/careers',
    icon: Briefcase,
  },
  {
    label: 'Contact Messages',
    href: '/admin/contacts',
    icon: Mail,
  },
  {
    label: 'Newsletter',
    href: '/admin/newsletter',
    icon: Mail,
  },
  {
    label: 'Media Library',
    href: '/admin/media',
    icon: Image,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    label: 'Audit Logs',
    href: '/admin/audit',
    icon: Shield,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-heading font-bold text-gray-900 dark:text-white">
                Admin Panel
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-primary-600">
              <Home className="h-5 w-5" />
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Collapse Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          isCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
