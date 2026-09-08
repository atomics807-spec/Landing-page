import type { Metadata } from 'next';

const siteName = 'Paraysco Consulting';
const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paraysco.com';

export function absoluteUrl(path: string) {
  return new URL(path, defaultUrl).toString().replace(/\/$/, '');
}

interface BuildMetadataArgs {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
}

export function buildMetadata({
  title,
  description,
  path,
  image = '/og-image.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = ['Paraysco Consulting'],
  keywords,
}: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(path);
  const images = [
    {
      url: image,
      width: 1200,
      height: 630,
      alt: title,
    },
  ];

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      url,
      siteName,
      title,
      description,
      images,
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
      ...(type === 'article' && authors ? { authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    ...(keywords?.length ? { keywords } : {}),
  };
}

export function buildHreflang(locale: string, path: string) {
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
  return {
    languages: {
      en: `${defaultUrl}/en${cleanPath}`,
      fr: `${defaultUrl}/fr${cleanPath}`,
      'x-default': `${defaultUrl}/${locale === 'en' ? 'en' : 'fr'}${cleanPath}`,
    },
  };
}