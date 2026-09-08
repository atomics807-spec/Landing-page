'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Loader2, X, ZoomIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  sort_order: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  Flyer: 'Flyer',
  Event: 'Event',
  Project: 'Project',
  Company: 'Company',
  Other: 'Other',
};

export default function GalleryClientPage() {
  const t = useTranslations('gallery');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    setItems(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];
  const visibleItems = activeCategory === 'All' ? items : items.filter((i) => i.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightboxIndex((lightboxIndex + 1) % visibleItems.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((lightboxIndex - 1 + visibleItems.length) % visibleItems.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, visibleItems.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

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

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-full transition-colors min-h-[44px]',
                    activeCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700'
                  )}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>
          )}

          {visibleItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">{t('noImages')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {visibleItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => openLightbox(index)}
                  className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow text-left"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      width={800}
                      height={450}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-4 w-full">
                      <p className="text-white font-semibold">{item.title}</p>
                      {item.description && <p className="text-white/80 text-sm line-clamp-2">{item.description}</p>}
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="text-white h-5 w-5" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && visibleItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={t('lightboxClose')}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={visibleItems[lightboxIndex].image_url}
                alt={visibleItems[lightboxIndex].title}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <p className="text-white font-semibold text-lg">{visibleItems[lightboxIndex].title}</p>
                {visibleItems[lightboxIndex].description && (
                  <p className="text-white/70 mt-1">{visibleItems[lightboxIndex].description}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}