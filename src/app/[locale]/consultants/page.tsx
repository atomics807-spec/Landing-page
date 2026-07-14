'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Mail, Phone, MapPin, Linkedin, Award, Users, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockConsultants = [
  {
    id: '1',
    name: 'Dr. Emmanuel Ndeh',
    role: 'Senior Real Estate Advisor',
    email: 'e.ndeh@paraysco.com',
    location: 'Limbe, Cameroon',
    specialties: ['Real Estate Valuation', 'Property Management', 'Investment Analysis'],
    experience: 15,
    clients: 200,
  },
  {
    id: '2',
    name: 'Advocate Fru Neba',
    role: 'Legal Consultant',
    email: 'f.neba@paraysco.com',
    location: 'Yaounde, Cameroon',
    specialties: ['Corporate Law', 'Property Law', 'Contract Review'],
    experience: 12,
    clients: 150,
  },
  {
    id: '3',
    name: 'Dr. Fointama Ysidonie',
    role: 'Investment Analyst',
    email: 'f.ysidonie@paraysco.com',
    location: 'Douala, Cameroon',
    specialties: ['Financial Analysis', 'Market Research', 'Risk Assessment'],
    experience: 8,
    clients: 100,
  },
  {
    id: '4',
    name: 'Mr. Wirba A. Nfor',
    role: 'Project Management Lead',
    email: 'w.nfor@paraysco.com',
    location: 'Buea, Cameroon',
    specialties: ['Project Planning', 'Construction Management', 'Quality Control'],
    experience: 20,
    clients: 180,
  },
];

export default function ConsultantsPage() {
  const t = useTranslations('consultants');
  const locale = useLocale();

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockConsultants.map((consultant, index) => (
              <motion.div
                key={consultant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {consultant.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                      {consultant.name}
                    </h3>
                    <p className="text-primary-600 font-medium mb-4">{consultant.role}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-secondary-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {consultant.experience}+ years
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-secondary-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {consultant.clients}+ clients
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {consultant.specialties.map((specialty: string) => (
                          <span
                            key={specialty}
                            className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {consultant.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        {consultant.email}
                      </div>
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
        </div>
      </section>
    </div>
  );
}
