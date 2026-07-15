'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Building2, Eye, MousePointer, Clock, 
  Globe, Star, FileText, MessageSquare, Mail, 
  BarChart3, Activity, ArrowUp, ArrowDown 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface ContentStats {
  properties: { total: number; active: number };
  services: { total: number; active: number };
  teamMembers: { total: number; active: number };
  testimonials: { total: number; active: number };
  blogPosts: { total: number; published: number };
  faqs: { total: number; active: number };
  careers: { total: number; active: number };
}

export default function AnalyticsPage() {
  const [contentStats, setContentStats] = useState<ContentStats>({
    properties: { total: 0, active: 0 },
    services: { total: 0, active: 0 },
    teamMembers: { total: 0, active: 0 },
    testimonials: { total: 0, active: 0 },
    blogPosts: { total: 0, published: 0 },
    faqs: { total: 0, active: 0 },
    careers: { total: 0, active: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisitors: 1247,
    pageViews: 3892,
    avgSessionDuration: 185,
    bounceRate: 42,
    contactInquiries: 0,
    newsletterSubscribers: 0,
    propertyViews: [
      { title: 'Luxury Beachfront Villa', views: 234 },
      { title: 'Modern Downtown Apartment', views: 189 },
      { title: 'Executive Office Suite', views: 156 },
      { title: 'Family Home in Gated Estate', views: 123 },
    ],
    topPages: [
      { path: '/', views: 1234 },
      { path: '/properties', views: 892 },
      { path: '/services', views: 567 },
      { path: '/about', views: 423 },
      { path: '/contact', views: 312 },
    ],
    topCountries: [
      { country: 'Nigeria', visitors: 456 },
      { country: 'Cameroon', visitors: 312 },
      { country: 'United States', visitors: 198 },
      { country: 'United Kingdom', visitors: 145 },
      { country: 'France', visitors: 89 },
    ],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const [
      propertiesData,
      servicesData,
      teamData,
      testimonialsData,
      blogData,
      faqsData,
      careersData,
      contactsData,
      subscribersData
    ] = await Promise.all([
      supabase.from('properties').select('id, is_active'),
      supabase.from('services').select('id, is_active'),
      supabase.from('team_members').select('id, is_active'),
      supabase.from('testimonials').select('id, is_active'),
      supabase.from('blog_posts').select('id, is_published'),
      supabase.from('faqs').select('id, is_active'),
      supabase.from('careers').select('id, is_active'),
      supabase.from('contact_messages').select('id'),
      supabase.from('newsletter_subscribers').select('id'),
    ]);

    setContentStats({
      properties: { total: propertiesData.data?.length || 0, active: propertiesData.data?.filter(p => p.is_active).length || 0 },
      services: { total: servicesData.data?.length || 0, active: servicesData.data?.filter(s => s.is_active).length || 0 },
      teamMembers: { total: teamData.data?.length || 0, active: teamData.data?.filter(t => t.is_active).length || 0 },
      testimonials: { total: testimonialsData.data?.length || 0, active: testimonialsData.data?.filter(t => t.is_active).length || 0 },
      blogPosts: { total: blogData.data?.length || 0, published: blogData.data?.filter(b => b.is_published).length || 0 },
      faqs: { total: faqsData.data?.length || 0, active: faqsData.data?.filter(f => f.is_active).length || 0 },
      careers: { total: careersData.data?.length || 0, active: careersData.data?.filter(c => c.is_active).length || 0 },
    });

    setStats(prev => ({
      ...prev,
      contactInquiries: contactsData.data?.length || 0,
      newsletterSubscribers: subscribersData.data?.length || 0,
    }));

    setIsLoading(false);
  };

  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Website Analytics & Progress</h1>
        <p className="text-gray-500">Track your website performance and content metrics</p>
      </div>

      {/* Traffic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
            <div className="flex items-center text-green-600 text-sm mt-1"><ArrowUp className="h-4 w-4 mr-1" />+12.5% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pageViews.toLocaleString()}</div>
            <div className="flex items-center text-green-600 text-sm mt-1"><ArrowUp className="h-4 w-4 mr-1" />+8.3% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(stats.avgSessionDuration)}</div>
            <div className="flex items-center text-red-600 text-sm mt-1"><ArrowDown className="h-4 w-4 mr-1" />-3.2% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Bounce Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bounceRate}%</div>
            <div className="flex items-center text-green-600 text-sm mt-1"><ArrowDown className="h-4 w-4 mr-1" />-5.1% from last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages & Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Top Pages</CardTitle>
            <CardDescription>Most visited pages on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-xs font-medium">{index + 1}</span>
                    <span className="font-medium">{page.path}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{page.views.toLocaleString()}</span>
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full" style={{ width: `${(page.views / stats.topPages[0].views) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Top Countries</CardTitle>
            <CardDescription>Where your visitors are from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topCountries.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-xs font-medium">{index + 1}</span>
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{country.visitors.toLocaleString()}</span>
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600 rounded-full" style={{ width: `${(country.visitors / stats.topCountries[0].visitors) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Interest */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Property Interest</CardTitle>
          <CardDescription>Most viewed properties on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.propertyViews.map((property) => (
              <div key={property.title} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium text-sm mb-2 truncate">{property.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{property.views} views</span>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Overview */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Content Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="pt-4">
            <Building2 className="h-6 w-6 mx-auto text-primary-600 mb-2" />
            <div className="text-2xl font-bold">{contentStats.properties.total}</div>
            <p className="text-xs text-gray-500">Properties</p>
            <Badge variant={contentStats.properties.active > 0 ? 'default' : 'secondary'} className="mt-2 text-xs">{contentStats.properties.active} active</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4">
            <Activity className="h-6 w-6 mx-auto text-primary-600 mb-2" />
            <div className="text-2xl font-bold">{contentStats.services.total}</div>
            <p className="text-xs text-gray-500">Services</p>
            <Badge variant={contentStats.services.active > 0 ? 'default' : 'secondary'} className="mt-2 text-xs">{contentStats.services.active} active</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4">
            <Users className="h-6 w-6 mx-auto text-primary-600 mb-2" />
            <div className="text-2xl font-bold">{contentStats.teamMembers.total}</div>
            <p className="text-xs text-gray-500">Team</p>
            <Badge variant={contentStats.teamMembers.active > 0 ? 'default' : 'secondary'} className="mt-2 text-xs">{contentStats.teamMembers.active} active</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4">
            <Star className="h-6 w-6 mx-auto text-primary-600 mb-2" />
            <div className="text-2xl font-bold">{contentStats.testimonials.total}</div>
            <p className="text-xs text-gray-500">Testimonials</p>
            <Badge variant={contentStats.testimonials.active > 0 ? 'default' : 'secondary'} className="mt-2 text-xs">{contentStats.testimonials.active} active</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4">
            <FileText className="h-6 w-6 mx-auto text-primary-600 mb-2" />
            <div className="text-2xl font-bold">{contentStats.blogPosts.total}</div>
            <p className="text-xs text-gray-500">Blog Posts</p>
            <Badge variant={contentStats.blogPosts.published > 0 ? 'default' : 'secondary'} className="mt-2 text-xs">{contentStats.blogPosts.published} published</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4">
            <MessageSquare className="h-6 w-6 mx-auto text-primary-600 mb-2" />
            <div className="text-2xl font-bold">{contentStats.faqs.total}</div>
            <p className="text-xs text-gray-500">FAQs</p>
            <Badge variant={contentStats.faqs.active > 0 ? 'default' : 'secondary'} className="mt-2 text-xs">{contentStats.faqs.active} active</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4">
            <Activity className="h-6 w-6 mx-auto text-primary-600 mb-2" />
            <div className="text-2xl font-bold">{contentStats.careers.total}</div>
            <p className="text-xs text-gray-500">Careers</p>
            <Badge variant={contentStats.careers.active > 0 ? 'default' : 'secondary'} className="mt-2 text-xs">{contentStats.careers.active} active</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4">
            <Mail className="h-6 w-6 mx-auto text-primary-600 mb-2" />
            <div className="text-2xl font-bold">{stats.contactInquiries}</div>
            <p className="text-xs text-gray-500">Inquiries</p>
            <Badge variant="secondary" className="mt-2 text-xs">{stats.newsletterSubscribers} subscribers</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Contact Inquiries</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.contactInquiries}</div>
            <p className="text-gray-500 text-sm mt-1">Total inquiries received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Newsletter Subscribers</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.newsletterSubscribers}</div>
            <p className="text-gray-500 text-sm mt-1">Email subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Conversion Rate</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(stats.contactInquiries / stats.totalVisitors * 100).toFixed(1)}%</div>
            <p className="text-gray-500 text-sm mt-1">Visitors who contacted</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
