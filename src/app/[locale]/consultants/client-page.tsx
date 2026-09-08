'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Award, Users, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

interface Consultant {
  id: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  image_url: string;
  email: string;
  phone: string;
  linkedin_url: string;
  is_active: boolean;
}

export default function ConsultantsClientPage() {
  const t = useTranslations('consultants');
  const locale = useLocale();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('consultants')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    setConsultants(data || []);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
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

      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
            </div>
          ) : consultants.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                Our team is growing! Meet our consultants soon.
              </p>
              <p className="text-gray-400 dark:text-gray-500">
                New consultants are being added regularly. Please check back later or contact us directly.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {consultants.map((consultant, index) => (
                <motion.div
                  key={consultant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      {consultant.image_url ? (
                        <img 
                          src={consultant.image_url} 
                          alt={consultant.name} 
                          className="w-full h-full object-cover"
                          width={800}
                          height={600}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <span className="text-4xl font-bold text-white">
                            {consultant.name.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                        {consultant.name}
                      </h3>
                      <p className="text-primary-600 font-medium mb-4">{consultant.title}</p>

                      {consultant.specialization && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                              {consultant.specialization}
                            </span>
                          </div>
                        </div>
                      )}

                      {consultant.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {consultant.bio}
                        </p>
                      )}

                      <div className="space-y-2 border-t pt-4">
                        {consultant.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            {consultant.email}
                          </div>
                        )}
                        {consultant.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4" />
                            {consultant.phone}
                          </div>
                        )}
                        {consultant.linkedin_url && (
                          <div className="flex items-center gap-2 text-sm">
                            <Linkedin className="w-4 h-4 text-blue-600" />
                            <a href={consultant.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                      </div>

                      <Button className="w-full mt-4" asChild>
                        <a href={`/${locale}/contact`}>
                          <Briefcase className="w-4 h-4 mr-2" />
                          {t('contact')}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
