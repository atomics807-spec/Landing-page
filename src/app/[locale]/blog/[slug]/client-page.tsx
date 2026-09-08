'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  author_name: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export default function BlogPostClientPage() {
  const params = useParams();
  const locale = useLocale();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params?.slug) {
      fetchPost(params.slug as string);
    }
  }, [params]);

  const fetchPost = async (id: string) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('newsletters')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
    setIsLoading(false);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post?.title || '')}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>
            <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
              <span className="flex items-center"><User className="h-4 w-4 mr-1" />{post.author_name || 'Paraysco Team'}</span>
              <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString()}</span>
              <span className="flex items-center"><Clock className="h-4 w-4 mr-1" />{calculateReadingTime(post.content)} min read</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-3xl mx-auto">
            {post.image_url && (
              <div className="rounded-xl mb-8 overflow-hidden">
                <img
                  src={post.image_url}
                  alt={post.title}
                  width={1200}
                  height={630}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-auto"
                />
              </div>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>
          </motion.article>

          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Share this article</span>
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10 p-2">
                    <button
                      onClick={shareOnFacebook}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                      Facebook
                    </button>
                    <button
                      onClick={shareOnTwitter}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <Twitter className="w-4 h-4 mr-2 text-sky-500" />
                      Twitter
                    </button>
                    <button
                      onClick={shareOnLinkedIn}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                      LinkedIn
                    </button>
                    <button
                      onClick={copyLink}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
