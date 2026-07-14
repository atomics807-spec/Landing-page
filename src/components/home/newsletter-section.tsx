'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';

export function NewsletterSection() {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      if (email && email.includes('@')) {
        setStatus('success');
        setMessage(t('success'));
        setEmail('');
      } else {
        setStatus('error');
        setMessage(t('error'));
      }
    }, 1000);
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
                  <span className="animate-spin mr-2">⏳</span>
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
