'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Mail, Linkedin, Twitter, Loader2, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  linkedin_url: string;
  twitter_url: string;
  is_active: boolean;
}

export default function TeamClientPage() {
  const t = useTranslations('team');
  const locale = useLocale();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    setMembers(data || []);
    setIsLoading(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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

      {/* Team Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          {members.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('noMembers')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="aspect-square bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      {member.image_url ? (
                        <img 
                          src={member.image_url} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          width={800}
                          height={600}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <span className="text-5xl font-bold text-white">
                            {getInitials(member.name)}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-primary-600 font-medium mb-4">{member.position}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                        {member.bio}
                      </p>
                      <div className="flex justify-center gap-3">
                        {member.linkedin_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {member.twitter_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.twitter_url} target="_blank" rel="noopener noreferrer">
                              <Twitter className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/${locale}/contact`}>
                            <Mail className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            {t('ctaText')}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href={`/${locale}/careers`}>
              {t('viewCareers')}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
