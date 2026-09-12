import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { absoluteUrl, buildHreflang, getSiteUrl } from '@/lib/seo';
import BlogClientPage from './client-page';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

interface BlogPostRow {
  id: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  image_url: string | null;
  category: string | null;
  published_at: string | null;
  author_name: string | null;
}

const baseUrl = getSiteUrl();

async function getPosts(): Promise<BlogPostRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('newsletters')
      .select('id, title, excerpt, cover_image, image_url, category, published_at, author_name')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    return (data ?? []) as BlogPostRow[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.blog' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: absoluteUrl(`/${locale}/blog`),
      ...buildHreflang(locale, '/blog'),
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getPosts();
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Paraysco Consulting Blog',
    description: 'Insights on real estate, engineering, construction, procurement, investment, and business consultancy in Africa',
    url: absoluteUrl(`/${locale}/blog`),
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || undefined,
      image: post.cover_image || post.image_url || undefined,
      datePublished: post.published_at || undefined,
      author: {
        '@type': 'Person',
        name: post.author_name || 'Paraysco Consulting',
      },
      url: absoluteUrl(`/${locale}/blog/${post.id}`),
      mainEntityOfPage: absoluteUrl(`/${locale}/blog/${post.id}`),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <BlogClientPage />
    </>
  );
}
