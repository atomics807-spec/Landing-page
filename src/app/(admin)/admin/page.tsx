'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  FileText,
  Users,
  MessageSquare,
  Mail,
  TrendingUp,
  Eye,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock data for dashboard
const stats = [
  {
    title: 'Total Properties',
    value: '24',
    change: '+12%',
    icon: Building2,
    color: 'bg-blue-500',
  },
  {
    title: 'Blog Posts',
    value: '18',
    change: '+5%',
    icon: FileText,
    color: 'bg-green-500',
  },
  {
    title: 'Team Members',
    value: '12',
    change: '0%',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    title: 'Contact Messages',
    value: '156',
    change: '+28%',
    icon: Mail,
    color: 'bg-orange-500',
  },
];

const recentActivity = [
  {
    id: 1,
    action: 'New property listed',
    item: 'Luxury Villa in Limbe',
    time: '2 hours ago',
    type: 'property',
  },
  {
    id: 2,
    action: 'Contact message received',
    item: 'From John Kamga',
    time: '4 hours ago',
    type: 'contact',
  },
  {
    id: 3,
    action: 'Blog post published',
    item: 'Investment Opportunities 2024',
    time: '1 day ago',
    type: 'blog',
  },
  {
    id: 4,
    action: 'New subscriber',
    item: 'amanda@example.com',
    time: '2 days ago',
    type: 'newsletter',
  },
];

const quickStats = [
  { label: 'Page Views', value: '12,453', icon: Eye },
  { label: 'Newsletter Subscribers', value: '1,234', icon: Users },
  { label: 'Properties Available', value: '18', icon: Building2 },
  { label: 'Average CTR', value: '3.2%', icon: TrendingUp },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here&apos;s what&apos;s happening with your website.
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        stat.change.startsWith('+')
                          ? 'text-green-600'
                          : stat.change.startsWith('-')
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
                >
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.item}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Website Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <stat.icon className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Add Property', href: '/admin/properties/add', icon: Building2 },
              { label: 'Create Blog Post', href: '/admin/blog/create', icon: FileText },
              { label: 'Add Team Member', href: '/admin/team/add', icon: Users },
              { label: 'View Contacts', href: '/admin/contacts', icon: Mail },
              { label: 'Manage FAQ', href: '/admin/faqs', icon: MessageSquare },
              { label: 'Site Settings', href: '/admin/settings', icon: Users },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-20 flex flex-col space-y-2"
                asChild
              >
                <a href={action.href}>
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs">{action.label}</span>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
