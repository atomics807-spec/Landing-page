'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Mail, Linkedin, Twitter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const teamMembers = [
  {
    id: '1',
    name: 'Mr. Mola Scott',
    role: 'Founder & Chief Executive Officer',
    image: null,
    bio: 'Visionary leader with over 15 years of experience in consulting and investment advisory across Africa.',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '2',
    name: 'Dr. Emmanuel Ndeh',
    role: 'Senior Partner, Real Estate',
    image: null,
    bio: 'Expert in property valuation and investment analysis with extensive experience in the Cameroonian market.',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '3',
    name: 'Advocate Fru Neba',
    role: 'Legal Director',
    image: null,
    bio: 'Seasoned legal professional specializing in corporate law and property transactions.',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '4',
    name: 'Dr. Fointama Ysidonie',
    role: 'Investment Analyst',
    image: null,
    bio: 'Financial expert with deep knowledge in market research and risk assessment for strategic investments.',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '5',
    name: 'Mr. Wirba A. Nfor',
    role: 'Operations Director',
    image: null,
    bio: 'Project management specialist with 20+ years overseeing construction and infrastructure projects.',
    linkedin: '#',
    twitter: '#',
  },
  {
    id: '6',
    name: 'Ms. Atabong Cindy',
    role: 'Marketing & Communications Lead',
    image: null,
    bio: 'Strategic communications expert driving brand awareness and stakeholder engagement.',
    linkedin: '#',
    twitter: '#',
  },
];

export default function TeamPage() {
  const t = useTranslations('team');
  const locale = useLocale();

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="aspect-square bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                      {member.bio}
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button variant="outline" size="sm" asChild>
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-4 h-4" />
                        </a>
                      </Button>
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Join Our Team
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            We are always looking for talented professionals to join our growing team. 
            Check out our career opportunities.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href={`/${locale}/careers`}>
              View Careers
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
