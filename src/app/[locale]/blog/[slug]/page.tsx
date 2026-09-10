import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { absoluteUrl, buildHreflang, getSiteUrl } from '@/lib/seo';
import BlogPostClientPage from './client-page';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const baseUrl = getSiteUrl();

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('newsletters')
    .select('*')
    .eq('id', slug)
    .eq('is_published', true)
    .single();
  return data;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const post = await getPost(slug);
 if (!post) return {};

  const title = post.title;
 const description = post.excerpt || post.content?.slice(0, 160) || '';
  const postImage = post.cover_image || post.image_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: absoluteUrl(`/${locale}/blog/${slug}`),
      images: postImage ? [{ url: postImage }] : undefined,
      publishedTime: post.published_at || undefined,
      authors: post.author_name ? [post.author_name] : undefined,
    },
    alternates: {
      canonical: absoluteUrl(`/${locale}/blog/${slug}`),
      ...buildHreflang(locale, `/blog/${slug}`),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params; setRequestLocale(locale);

  const post = await getPost(slug);
 if (!post) notFound();

  const schemaImage = post.cover_image || post.image_url;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.content?.slice(0, 160) || '',
    image: schemaImage || undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.published_at || post.created_at,
    author: {
      '@type': 'Person',
      name: post.author_name || 'Paraysco Consulting',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Paraysco Consulting',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: absoluteUrl(`/${locale}/blog/${slug}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlogPostClientPage />
    </>
  );
}