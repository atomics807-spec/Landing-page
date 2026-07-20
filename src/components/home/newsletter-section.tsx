'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function NewsletterSection() {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const supabase = createClient();
      
      // Check if already subscribed
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id, is_active')
        .eq('email', email)
        .single();

      if (existing) {
        if (!existing.is_active) {
          // Reactivate subscription
          await supabase
            .from('newsletter_subscribers')
            .update({ is_active: true, subscribed_at: new Date().toISOString() })
            .eq('id', existing.id);
        }
        setStatus('success');
        setMessage(t('success'));
        setEmail('');
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert({
            email,
            is_active: true,
            subscribed_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Newsletter subscription error:', error);
          setStatus('error');
          setMessage(t('error'));
        } else {
          setStatus('success');
          setMessage(t('success'));
          setEmail('');
        }
      }
    } catch (err) {
      console.error('Newsletter error:', err);
      setStatus('error');
      setMessage(t('error'));
    }
  };

  return (
    <section className="py-20 bg-gray-900 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            {t('subtitle')}
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center space-x-2 text-green-400"
            >
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg">{message}</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t('placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                required
              />
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {status === 'loading' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t('button')}
              </Button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-4 text-red-400">{message}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
