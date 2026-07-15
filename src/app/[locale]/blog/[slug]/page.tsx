'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Mock blog data - in production, this would come from a database
const getBlogPost = (slug: string) => {
  const posts: Record<string, {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    date: string;
    readingTime: number;
  }> = {
    '1': {
      id: '1',
      title: 'Investment Opportunities in Cameroon Real Estate 2024',
      excerpt: 'Explore the growing real estate market in Cameroon and discover profitable investment opportunities for foreign investors.',
      content: `Cameroon, often referred to as "Africa in miniature" due to its diverse climate and geography, presents a wealth of investment opportunities in the real estate sector. As one of the fastest-growing economies in Central Africa, the country has seen sustained demand for both residential and commercial properties.

## Market Overview

The Cameroonian real estate market has experienced significant growth over the past decade, driven by urbanization, a growing middle class, and increased foreign investment. Major cities like Douala, Yaoundé, and Limbe have seen particular development activity.

## Key Investment Areas

### Residential Properties
- Luxury apartments in urban centers
- Affordable housing developments
- Student accommodation near universities

### Commercial Real Estate
- Office spaces in business districts
- Retail centers and shopping malls
- Warehouse and logistics facilities

### Tourism-Related Development
- Beach resorts along the Atlantic coast
- Eco-tourism lodges in the interior
- Hotel and hospitality projects

## Legal Framework

Foreign investors should be aware of Cameroon's land tenure system, which distinguishes between land registered under the French system and land held under customary rights. Working with local legal experts is essential for navigating these complexities.

## Conclusion

The Cameroonian real estate market offers attractive opportunities for investors willing to understand local conditions and build reliable partnerships. With proper due diligence and local expertise, significant returns are achievable in this growing market.`,
      category: 'Insights',
      author: 'Paraysco Team',
      date: '2024-01-15',
      readingTime: 8,
    },
    '2': {
      id: '2',
      title: 'Understanding Business Regulations in Cameroon',
      excerpt: 'A comprehensive guide to navigating business regulations, licensing requirements, and legal frameworks for foreign businesses.',
      content: `Establishing a business in Cameroon requires careful navigation of the regulatory landscape. This guide provides an overview of the key requirements and procedures for foreign investors.

## Business Structures

### Subsidiary Company
A fully local company with separate legal personality from the parent. This is the most common structure for foreign investors.

### Branch Office
An extension of the foreign company, simpler to establish but with limited liability protections.

### Representative Office
Suitable for market research and promotion activities but cannot conduct commercial operations directly.

## Registration Procedures

1. **Trade Register Registration** - Register with the local commerce registry
2. **Tax Identification** - Obtain tax number from tax authorities
3. **Social Security Registration** - Register with CNPS for employee coverage
4. **Professional Card** - Required for certain regulated professions

## Key Regulatory Bodies

- Ministry of Commerce (MINCOMMERCE)
- Tax Authority (DGIF)
- Social Security Fund (CNPS)
- Investment Promotion Agency (API)

## Conclusion

While the regulatory process can be complex, proper planning and local expert guidance can streamline establishment and ensure compliance.`,
      category: 'Guide',
      author: 'Paraysco Team',
      date: '2024-01-10',
      readingTime: 12,
    },
    '3': {
      id: '3',
      title: 'Infrastructure Development Trends in Central Africa',
      excerpt: 'Analysis of current infrastructure projects and future development plans across the Central African region.',
      content: `Central Africa is experiencing a significant infrastructure renaissance, with major projects transforming connectivity and economic potential across the region.

## Transportation Infrastructure

### Road Networks
The Central African road network is being expanded and modernized, with key corridors linking major economic centers and facilitating regional trade.

### Ports and Maritime
Major port upgrades in Douala, Kribi, and other coastal cities are enhancing maritime logistics capacity.

### Aviation
Airport renovations and new terminal constructions are improving air connectivity within the region and internationally.

## Energy Projects

### Hydropower Development
With significant hydroelectric potential, several large-scale dam projects are underway to address energy deficits.

### Renewable Energy
Solar and wind projects are gaining momentum as costs decrease and international climate financing becomes available.

## Digital Infrastructure

Investment in fiber optic networks and mobile infrastructure is bridging the digital divide and enabling economic diversification.

## Looking Ahead

Continued infrastructure development will be crucial for Central Africa's economic integration and sustainable growth trajectory.`,
      category: 'News',
      author: 'Paraysco Team',
      date: '2024-01-05',
      readingTime: 6,
    },
  };

  return posts[slug] || null;
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = useLocale() as 'en' | 'fr';
  const t = useTranslations('blog');

  // For now, we'll use client-side params since this is a client component
  // In production, this would be properly typed from params
  const slug = '1'; // This would come from params in a server component

  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Article not found
          </h1>
          <Button asChild>
            <Link href={`/${locale}/blog`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <Link 
            href={`/${locale}/blog`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>
            <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {post.author}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(post.date).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readingTime} min read
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:font-heading prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300"
          >
            {/* Placeholder for featured image */}
            <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-xl mb-8 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-300 text-lg">Featured Image</span>
            </div>

            {/* Article content - render markdown-like content */}
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 mb-4">
                    {items.map((item, i) => (
                      <li key={i} className="text-gray-600 dark:text-gray-300">
                        {item.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-gray-600 dark:text-gray-300 mb-4">
                  {paragraph}
                </p>
              );
            })}
          </motion.article>

          {/* Share Section */}
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Share this article</span>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Related Articles Placeholder */}
          <div className="max-w-3xl mx-auto mt-12">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-gray-500">
                More articles coming soon
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-gray-500">
                More articles coming soon
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
