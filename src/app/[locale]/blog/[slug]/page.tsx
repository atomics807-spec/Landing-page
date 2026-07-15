'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
      excerpt: 'Explore the growing real estate market in Cameroon.',
      content: 'Cameroon presents wealth of investment opportunities in real estate.',
      category: 'Insights',
      author: 'Paraysco Team',
      date: '2024-01-15',
      readingTime: 8,
    },
    '2': {
      id: '2',
      title: 'Understanding Business Regulations in Cameroon',
      excerpt: 'A guide to navigating business regulations.',
      content: 'Establishing a business in Cameroon requires careful navigation.',
      category: 'Guide',
      author: 'Paraysco Team',
      date: '2024-01-10',
      readingTime: 12,
    },
    '3': {
      id: '3',
      title: 'Infrastructure Development Trends in Central Africa',
      excerpt: 'Analysis of infrastructure projects across Central Africa.',
      content: 'Central Africa is experiencing infrastructure development.',
      category: 'News',
      author: 'Paraysco Team',
      date: '2024-01-05',
      readingTime: 6,
    },
    '4': {
      id: '4',
      title: 'Sustainable Construction Practices in Africa',
      excerpt: 'How sustainable building is reshaping construction.',
      content: 'Sustainability is reshaping African construction.',
      category: 'Updates',
      author: 'Paraysco Team',
      date: '2024-01-03',
      readingTime: 5,
    },
    '5': {
      id: '5',
      title: 'Navigating Property Investment in Nigeria',
      excerpt: 'Insights for the Nigerian real estate market.',
      content: 'Nigeria real estate market is highly dynamic.',
      category: 'Insights',
      author: 'Paraysco Team',
      date: '2023-12-28',
      readingTime: 7,
    },
    '6': {
      id: '6',
      title: 'Project Finance Structures for African Development',
      excerpt: 'Understanding financing models for infrastructure.',
      content: 'Financing infrastructure requires innovative approaches.',
      category: 'Guide',
      author: 'Paraysco Team',
      date: '2023-12-20',
      readingTime: 10,
    },
  };
  return posts[slug] || null;
};

export default function BlogPostPage() {
  const params = useParams();
  const locale = useLocale();
  const [post, setPost] = useState<ReturnType<typeof getBlogPost>>(null);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    if (params?.slug) {
      setSlug(params.slug as string);
      setPost(getBlogPost(params.slug as string));
    }
  }, [params]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article not found</h1>
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
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <Link href={`/${locale}/blog`} className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>
            <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
              <span className="flex items-center"><User className="h-4 w-4 mr-1" />{post.author}</span>
              <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{new Date(post.date).toLocaleDateString()}</span>
              <span className="flex items-center"><Clock className="h-4 w-4 mr-1" />{post.readingTime} min read</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-3xl mx-auto">
            <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-xl mb-8 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-300 text-lg">Featured Image</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{post.content}</p>
          </motion.article>

          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Share this article</span>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
