import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, Users, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { absoluteUrl, buildHreflang } from '@/lib/seo';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

interface CareersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CareersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.careers' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: absoluteUrl(`/${locale}/careers`),
      ...buildHreflang(locale, '/careers'),
    },
  };
}

export default async function CareersPage({ params }: CareersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('careers');

  // Mock data - in production, fetch from Supabase
  const careers: Career[] = [
    {
      id: '1',
      title: 'Senior Real Estate Consultant',
      department: 'Real Estate',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      description: 'We are looking for an experienced real estate consultant to join our team and provide expert advice to clients.',
      requirements: [
        '5+ years of experience in real estate',
        'Strong communication skills',
        'Bachelor\'s degree in Business or related field',
        'Experience with property valuation'
      ]
    },
    {
      id: '2',
      title: 'Civil Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our engineering team to work on infrastructure projects across Africa.',
      requirements: [
        '4+ years of civil engineering experience',
        'Professional engineering license',
        'Experience with infrastructure projects',
        'Strong technical skills'
      ]
    },
    {
      id: '3',
      title: 'Project Manager',
      department: 'Construction',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      description: 'Lead construction projects from planning to completion.',
      requirements: [
        'PMP certification preferred',
        '7+ years of project management experience',
        'Experience with construction projects',
        'Excellent leadership skills'
      ]
    },
    {
      id: '4',
      title: 'Investment Analyst',
      department: 'Finance',
      location: 'Remote',
      type: 'Full-time',
      description: 'Analyze investment opportunities and prepare financial models.',
      requirements: [
        'CFA certification preferred',
        '3+ years in investment banking or consulting',
        'Strong financial modeling skills',
        'MBA from a recognized institution'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-primary-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>20+ Team Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <span>4 Open Positions</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>3 Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Careers List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {careers.map((career) => (
              <div key={career.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{career.title}</h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {career.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {career.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {career.type}
                      </span>
                    </div>
                  </div>
                  <Link href={`/${locale}/contact?subject=Application for ${career.title}&position=${career.id}`}>
                    <Button className="md:w-auto">
                      <Send className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{career.description}</p>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements:</h3>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {career.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Application Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Don't See Your Position?</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            We're always looking for talented individuals to join our team. Send us your CV and we'll keep it on file for future opportunities.
          </p>
          <Link href={`/${locale}/contact?subject=Open Application - General Inquiry`}>
            <Button size="lg">
              <Send className="w-5 h-5 mr-2" />
              Send Open Application
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
