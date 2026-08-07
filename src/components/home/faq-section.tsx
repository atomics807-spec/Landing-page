'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-900 dark:text-white pr-8">
          {question}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-primary-600 flex-shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pb-6 text-gray-600 dark:text-gray-300">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DbFaq {
  id: string;
  question: string;
  question_en: string;
  question_fr: string;
  answer: string;
  answer_en: string;
  answer_fr: string;
  category: string;
  is_active: boolean;
  sort_order: number;
}

const defaultFaqs = [
  {
    id: 'default-1',
    question: 'What services does Paraysco Consulting Inc. offer?',
    question_en: 'What services does Paraysco Consulting Inc. offer?',
    question_fr: 'Quels services Paraysco Consulting Inc. offre-t-il ?',
    answer: 'We offer a comprehensive range of services including Real Estate & Property Management, Engineering & Infrastructure, Construction Project Management, Procurement & Supply Chain, Investment Advisory, and Business Consultancy. Our multidisciplinary approach ensures integrated solutions for all your business needs.',
    answer_en: 'We offer a comprehensive range of services including Real Estate & Property Management, Engineering & Infrastructure, Construction Project Management, Procurement & Supply Chain, Investment Advisory, and Business Consultancy. Our multidisciplinary approach ensures integrated solutions for all your business needs.',
    answer_fr: 'Nous offrons une gamme complète de services incluant la gestion immobilière, le conseil en ingénierie, la gestion de projets de construction, les achats, le conseil en investissement et le conseil en affaires.',
    category: '',
    is_active: true,
    sort_order: 0,
  },
  {
    id: 'default-2',
    question: 'How can I get started with PCI?',
    question_en: 'How can I get started with PCI?',
    question_fr: 'Comment puis-je commencer avec PCI ?',
    answer: 'Getting started is easy! Simply contact us through our website or reach out directly via phone or email. Our team will schedule an initial consultation to understand your needs and recommend the best approach for your project or business requirements.',
    answer_en: 'Getting started is easy! Simply contact us through our website or reach out directly via phone or email. Our team will schedule an initial consultation to understand your needs and recommend the best approach for your project or business requirements.',
    answer_fr: 'Commencer est facile ! Contactez-nous via notre site web ou directement par téléphone ou e-mail.',
    category: '',
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'default-3',
    question: 'Do you work with international clients?',
    question_en: 'Do you work with international clients?',
    question_fr: 'Travaillez-vous avec des clients internationaux ?',
    answer: 'Absolutely! We have partnerships with global consulting firms and serve clients worldwide. Our team has experience working with international development organizations, foreign investors, and multinational corporations.',
    answer_en: 'Absolutely! We have partnerships with global consulting firms and serve clients worldwide. Our team has experience working with international development organizations, foreign investors, and multinational corporations.',
    answer_fr: 'Absolument ! Nous avons des partenariats avec des cabinets de conseil mondiaux et servons des clients du monde entier.',
    category: '',
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'default-4',
    question: 'What makes Paraysco different from other consulting firms?',
    question_en: 'What makes Paraysco different from other consulting firms?',
    question_fr: 'Qu\'est-ce qui différencie Paraysco des autres cabinets de conseil ?',
    answer: 'Our integrated multidisciplinary approach sets us apart. Instead of fragmented services, we provide comprehensive solutions under one roof. Combined with our deep local expertise in Cameroon and our commitment to sustainable development, we deliver lasting value to our clients.',
    answer_en: 'Our integrated multidisciplinary approach sets us apart. Instead of fragmented services, we provide comprehensive solutions under one roof. Combined with our deep local expertise in Cameroon and our commitment to sustainable development, we deliver lasting value to our clients.',
    answer_fr: 'Notre approche multidisciplinaire intégrée nous distingue. Nous fournissons des solutions complètes sous un même toit.',
    category: '',
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'default-5',
    question: 'How do you ensure project success?',
    question_en: 'How do you ensure project success?',
    question_fr: 'Comment assurez-vous la réussite des projets ?',
    answer: 'We follow a rigorous project management methodology with clear milestones, regular reporting, and quality assurance checkpoints. Our team of experienced professionals maintains transparent communication throughout every engagement, ensuring alignment with your goals and objectives.',
    answer_en: 'We follow a rigorous project management methodology with clear milestones, regular reporting, and quality assurance checkpoints. Our team of experienced professionals maintains transparent communication throughout every engagement, ensuring alignment with your goals and objectives.',
    answer_fr: 'Nous suivons une méthodologie rigoureuse de gestion de projet avec des jalons clairs et un contrôle qualité.',
    category: '',
    is_active: true,
    sort_order: 4,
  },
];

export function FAQSection() {
  const t = useTranslations('faqs');
  const [faqs, setFaqs] = useState<DbFaq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (data && data.length > 0) {
        setFaqs(data as DbFaq[]);
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    }
    setIsLoading(false);
  };

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
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
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-10">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              displayFaqs.map((faq, index) => (
                <FAQItem
                  key={faq.id}
                  question={faq.question_en || faq.question}
                  answer={faq.answer_en || faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
