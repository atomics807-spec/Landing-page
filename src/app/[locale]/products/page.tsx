import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { absoluteUrl, buildHreflang, getSiteUrl } from '@/lib/seo';
import ProductsClientPage from './client-page';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string | null;
  category: string | null;
  stock: number | null;
  image_url: string | null;
  images: string[] | null;
}

const baseUrl = getSiteUrl();

async function getProducts(): Promise<ProductRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('id, name, description, price, currency, category, stock, image_url, images')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return (data ?? []) as ProductRow[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.products' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: absoluteUrl(`/${locale}/products`),
      ...buildHreflang(locale, '/products'),
    },
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getProducts();
  const productSchema = products.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Paraysco Consulting Products',
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.name,
            description: product.description || undefined,
            category: product.category || undefined,
            image: product.images?.[0] || product.image_url || undefined,
            offers: {
              '@type': 'Offer',
              price: Number(product.price),
              priceCurrency: product.currency || 'USD',
              availability: (product.stock ?? 0) > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              url: absoluteUrl(`/${locale}/products`),
            },
          },
        })),
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ProductsClientPage />
    </>
  );
}
