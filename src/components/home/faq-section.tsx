'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const faqs = [
  {
    question: 'What services does Paraysco Consulting Inc. offer?',
    answer:
      'We offer a comprehensive range of services including Real Estate & Property Management, Engineering & Infrastructure, Construction Project Management, Procurement & Supply Chain, Investment Advisory, and Business Consultancy. Our multidisciplinary approach ensures integrated solutions for all your business needs.',
  },
  {
    question: 'How can I get started with PCI?',
    answer:
      'Getting started is easy! Simply contact us through our website or reach out directly via phone or email. Our team will schedule an initial consultation to understand your needs and recommend the best approach for your project or business requirements.',
  },
  {
    question: 'Do you work with international clients?',
    answer:
      'Absolutely! We have partnerships with global consulting firms and serve clients worldwide. Our team has experience working with international development organizations, foreign investors, and multinational corporations.',
  },
  {
    question: 'What makes Paraysco different from other consulting firms?',
    answer:
      'Our integrated multidisciplinary approach sets us apart. Instead of fragmented services, we provide comprehensive solutions under one roof. Combined with our deep local expertise in Cameroon and our commitment to sustainable development, we deliver lasting value to our clients.',
  },
  {
    question: 'How do you ensure project success?',
    answer:
      'We follow a rigorous project management methodology with clear milestones, regular reporting, and quality assurance checkpoints. Our team of experienced professionals maintains transparent communication throughout every engagement, ensuring alignment with your goals and objectives.',
  },
];

export function FAQSection() {
  const t = useTranslations('faqs');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
