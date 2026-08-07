'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  Users, Building2, Factory, Hotel, Briefcase, Laptop, Heart, Trees, 
  ChevronDown, Check, Phone, Mail, ArrowRight, Shield, Award, Clock, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface CategorySection {
  title: string;
  icon: any;
  color: string;
  items: string[];
}

const categories: CategorySection[] = [
  {
    title: 'Domestic & Household Staff',
    icon: Building2,
    color: 'bg-blue-500',
    items: [
      'Housemaids',
      'Housekeepers',
      'Cleaners',
      'Nannies/Babysitters',
      'Gardeners',
      'Laundry Assistants',
      'Drivers',
      'Security Guards',
      'Cooks and Chefs',
      'Elderly Caregivers',
      'Personal Assistants'
    ]
  },
  {
    title: 'Construction & Engineering Personnel',
    icon: Building2,
    color: 'bg-orange-500',
    items: [
      'Masons',
      'Carpenters',
      'Electricians',
      'Plumbers',
      'Welders',
      'Painters',
      'Tilers',
      'Roofers',
      'Steel Fixers',
      'Bricklayers',
      'Scaffolders',
      'Machine Operators',
      'Heavy Equipment Operators',
      'Civil Engineering Technicians',
      'General Construction Labourers'
    ]
  },
  {
    title: 'Industrial & Factory Workers',
    icon: Factory,
    color: 'bg-purple-500',
    items: [
      'Warehouse Workers',
      'Forklift Operators',
      'Packers',
      'Machine Operators',
      'Production Staff',
      'Storekeepers',
      'Loaders & Off-loaders',
      'Logistics Assistants'
    ]
  },
  {
    title: 'Hospitality Personnel',
    icon: Hotel,
    color: 'bg-green-500',
    items: [
      'Receptionists',
      'Hotel Cleaners',
      'Waiters & Waitresses',
      'Bar Attendants',
      'Kitchen Assistants',
      'Professional Chefs',
      'Event Ushers'
    ]
  },
  {
    title: 'Office & Administrative Personnel',
    icon: Briefcase,
    color: 'bg-indigo-500',
    items: [
      'Secretaries',
      'Office Assistants',
      'Receptionists',
      'Data Entry Clerks',
      'Account Clerks',
      'Administrative Officers',
      'Customer Service Representatives'
    ]
  },
  {
    title: 'Technical Professionals',
    icon: Laptop,
    color: 'bg-cyan-500',
    items: [
      'IT Technicians',
      'Network Engineers',
      'Graphic Designers',
      'Digital Marketing Officers',
      'Electricians',
      'HVAC Technicians',
      'CCTV Installers'
    ]
  },
  {
    title: 'Healthcare Support Personnel',
    icon: Heart,
    color: 'bg-red-500',
    items: [
      'Caregivers',
      'Nursing Assistants',
      'Hospital Cleaners',
      'Ambulance Drivers',
      'Medical Receptionists'
    ]
  },
  {
    title: 'Agricultural Workers',
    icon: Trees,
    color: 'bg-emerald-500',
    items: [
      'Farm Supervisors',
      'Farm Labourers',
      'Poultry Workers',
      'Livestock Attendants',
      'Garden Workers'
    ]
  }
];

const processSteps = [
  {
    step: '1',
    title: 'Recruitment',
    description: 'PCI continuously recruits qualified candidates through public advertisements, online recruitment platforms, community referrals, vocational institutions, professional associations, local councils, and universities.',
    details: []
  },
  {
    step: '2',
    title: 'Registration',
    description: 'Every applicant completes a comprehensive registration process including National ID, passport photos, CV, certificates, police clearance, guarantor information, and medical fitness declaration.',
    details: []
  },
  {
    step: '3',
    title: 'Screening & Verification',
    description: 'PCI conducts thorough assessment including identity verification, qualification verification, reference checks, employment history review, background verification, skills assessment, interview, and character evaluation.',
    details: []
  },
  {
    step: '4',
    title: 'Database Registration',
    description: 'Successful applicants are entered into PCI\'s manpower database according to profession, skills, experience, location, availability, salary expectations, and language proficiency for rapid deployment.',
    details: []
  },
  {
    step: '5',
    title: 'Client Consultation',
    description: 'PCI meets with clients to determine job description, number of personnel required, qualifications, experience level, working hours, contract duration, salary range, and special requirements.',
    details: []
  },
  {
    step: '6',
    title: 'Candidate Matching',
    description: 'PCI identifies the most suitable candidates from its database and presents shortlisted applicants to the client.',
    details: []
  },
  {
    step: '7',
    title: 'Interview & Selection',
    description: 'Clients may accept PCI\'s recommendation, interview shortlisted candidates, or request replacements if necessary.',
    details: []
  },
  {
    step: '8',
    title: 'Contract Signing',
    description: 'PCI prepares all necessary documentation including Service Agreement, Outsourcing Agreement, Confidentiality Agreement, Code of Conduct, Job Description, and Employment Terms.',
    details: []
  },
  {
    step: '9',
    title: 'Deployment',
    description: 'Selected personnel are deployed to the client\'s location with orientation covering work ethics, professional conduct, health & safety, company policies, and reporting procedures.',
    details: []
  },
  {
    step: '10',
    title: 'Monitoring & Performance',
    description: 'PCI conducts continuous follow-up through routine inspections, client feedback, staff evaluations, performance reports, counselling and retraining where required, and immediate replacement when justified.',
    details: []
  }
];

const pciResponsibilities = [
  'Recruit qualified personnel',
  'Verify applicant credentials where possible',
  'Conduct interviews and screening',
  'Maintain an updated personnel database',
  'Provide suitable replacements when necessary, subject to contract terms',
  'Monitor staff performance',
  'Ensure professional conduct',
  'Maintain confidentiality',
  'Resolve disputes between clients and outsourced personnel'
];

const clientResponsibilities = [
  'Provide a safe working environment',
  'Respect labour laws and contractual obligations',
  'Pay agreed service charges promptly',
  'Treat personnel with dignity and fairness',
  'Report performance concerns promptly',
  'Provide necessary tools and equipment for assigned duties'
];

const staffResponsibilities = [
  'Demonstrate professionalism',
  'Observe confidentiality',
  'Respect employer property',
  'Maintain punctuality',
  'Follow lawful instructions',
  'Observe workplace safety',
  'Uphold PCI\'s Code of Conduct'
];

const qualityAssurance = [
  'Continuous recruitment',
  'Skills assessment',
  'Client satisfaction surveys',
  'Performance monitoring',
  'Ongoing training',
  'Ethical compliance',
  'Regular database updates'
];

const benefitsToClients = [
  'Faster recruitment',
  'Access to pre-screened personnel',
  'Reduced hiring costs',
  'Lower recruitment risks',
  'Flexible staffing solutions',
  'Professional HR support',
  'Time savings',
  'Improved productivity',
  'Reduced employee turnover',
  'Reliable replacement services'
];

export default function SourcingPage() {
  const locale = useLocale();
  const t = useTranslations('sourcing');
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const toggleCategory = (index: number) => {
    if (expandedCategories.includes(index)) {
      setExpandedCategories(expandedCategories.filter(i => i !== index));
    } else {
      setExpandedCategories([...expandedCategories, index]);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">Professional Staffing Solutions</Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Our Manpower Sourcing Services
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              PCI recruits, screens, trains and supplies personnel in various categories to meet your business needs across Africa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href={`/${locale}/contact`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Request Personnel
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#staffing-categories">
                  View Staffing Categories
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Staffing Categories */}
      <section id="staffing-categories" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Staffing Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We provide qualified personnel across multiple industries and sectors
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isExpanded = expandedCategories.includes(index);
              
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="h-full overflow-hidden">
                    <div 
                      className={`${category.color} p-4 cursor-pointer`}
                      onClick={() => toggleCategory(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-white">{category.title}</h3>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      {isExpanded ? (
                        <ul className="space-y-2">
                          {category.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {category.items.length} positions available
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sourcing & Outsourcing Process */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Our Sourcing & Outsourcing Process
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A systematic 10-step approach to finding the right personnel for your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-bl-full" />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsibilities Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* PCI Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-2 border-primary-200 dark:border-primary-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      PCI Responsibilities
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {pciResponsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Client Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Client Responsibilities
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {clientResponsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Staff Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full border-2 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Staff Responsibilities
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {staffResponsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quality Assurance & Benefits */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Quality Assurance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Quality Assurance
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    PCI maintains high standards through:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {qualityAssurance.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Check className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits to Clients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full bg-gradient-to-br from-primary-600 to-primary-700">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Benefits to Clients
                    </h3>
                  </div>
                  <p className="text-primary-100 mb-6">
                    Choosing PCI provides:
                  </p>
                  <ul className="space-y-3">
                    {benefitsToClients.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white">
                        <CheckCircle2 className="w-5 h-5 text-white/80" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Ready to Source Personnel?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Let PCI help you find the right staff for your business needs. Contact us today for a consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href={`/${locale}/contact`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/30" asChild>
                <Link href={`/${locale}/services`}>
                  View Consulting Services
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
