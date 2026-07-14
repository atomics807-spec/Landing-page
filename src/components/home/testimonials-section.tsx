'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'John Kamga',
    company: 'Kamga Investments Ltd',
    content:
      'Paraysco Consulting Inc. transformed our real estate investment strategy. Their expertise in property acquisition and management has been invaluable to our growth.',
    rating: 5,
  },
  {
    name: 'Dr. Amina Bello',
    company: 'Bello Holdings',
    content:
      'The team at PCI delivered exceptional results on our infrastructure project. Their project management skills and attention to detail are unmatched in the region.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    company: 'Global Trade Partners',
    content:
      'Working with Paraysco for our import-export needs has been seamless. Their knowledge of regulations and logistics is top-notch.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const t = useTranslations('testimonials');

  return (
    <section className="py-20 bg-primary-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-primary-100">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-xl relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary-100" />

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>

              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
