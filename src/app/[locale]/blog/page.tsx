'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Mock blog data - in production, fetch from Supabase
const mockPosts = [
  {
    slug: '1',
    title: 'Investment Opportunities in Cameroon Real Estate 2024',
    excerpt: 'Explore the growing real estate market in Cameroon and discover profitable investment opportunities for foreign investors.',
    category: 'Insights',
    author: 'Paraysco Team',
    date: '2024-01-15',
    readingTime: 8,
    image: '/placeholder.jpg',
  },
  {
    slug: '2',
    title: 'Understanding Business Regulations in Cameroon',
    excerpt: 'A comprehensive guide to navigating business regulations, licensing requirements, and legal frameworks for foreign businesses.',
    category: 'Guide',
    author: 'Paraysco Team',
    date: '2024-01-10',
    readingTime: 12,
    image: '/placeholder.jpg',
  },
  {
    slug: '3',
    title: 'Infrastructure Development Trends in Central Africa',
    excerpt: 'Analysis of current infrastructure projects and future development plans across the Central African region.',
    category: 'News',
    author: 'Paraysco Team',
    date: '2024-01-05',
    readingTime: 6,
    image: '/placeholder.jpg',
  },
  {
    slug: '4',
    title: 'Sustainable Construction Practices in Africa',
    excerpt: 'How sustainable building practices are reshaping the construction industry across the African continent.',
    category: 'Updates',
    author: 'Paraysco Team',
    date: '2024-01-03',
    readingTime: 5,
    image: '/placeholder.jpg',
  },
  {
    slug: '5',
    title: 'Navigating Property Investment in Nigeria',
    excerpt: 'Key insights for investors looking to enter the Nigerian real estate market in 2024.',
    category: 'Insights',
    author: 'Paraysco Team',
    date: '2023-12-28',
    readingTime: 7,
    image: '/placeholder.jpg',
  },
  {
    slug: '6',
    title: 'Project Finance Structures for African Development',
    excerpt: 'Understanding different financing models available for infrastructure projects in Africa.',
    category: 'Guide',
    author: 'Paraysco Team',
    date: '2023-12-20',
    readingTime: 10,
    image: '/placeholder.jpg',
  },
];

const categories = ['All', 'Insights', 'Guide', 'News', 'Updates'];
const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const locale = useLocale();
  const t = useTranslations('blog');
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts by category and search
  const filteredPosts = mockPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category === 'All' ? t('categories.all') : category}
                </Button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          {paginatedPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/${locale}/blog/${post.slug}`}>
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                      <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-300">
                            Article Image
                          </span>
                        </div>
                        <Badge className="absolute top-4 left-4" variant="secondary">
                          {post.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readingTime} {t('readTime')}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <User className="h-4 w-4 mr-1" />
                            {post.author}
                          </div>
                          <span className="flex items-center text-primary-600 text-sm font-medium group">
                            Read More
                            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No articles found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Results info */}
          {filteredPosts.length > 0 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Showing {startIndex + 1}-{Math.min(startIndex + POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} articles
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
