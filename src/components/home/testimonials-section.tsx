'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Star, Quote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  content: string;
  rating: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

const defaultTestimonials = [
  {
    name: 'John Kamga',
    company: 'Kamga Investments Ltd',
    content: 'Paraysco Consulting Inc. transformed our real estate investment strategy. Their expertise in property acquisition and management has been invaluable to our growth.',
    rating: 5,
  },
  {
    name: 'Dr. Amina Bello',
    company: 'Bello Holdings',
    content: 'The team at PCI delivered exceptional results on our infrastructure project. Their project management skills and attention to detail are unmatched in the region.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    company: 'Global Trade Partners',
    content: 'Working with Paraysco for our import-export needs has been seamless. Their knowledge of regulations and logistics is top-notch.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const t = useTranslations('testimonials');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    content: '',
    rating: 5,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (data && data.length > 0) {
        setTestimonials(data as Testimonial[]);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const supabase = createClient();
      await supabase.from('testimonials').insert({
        name: formData.name,
        company: formData.company || null,
        content: formData.content,
        rating: formData.rating,
        image_url: null,
        is_active: false, // Requires admin approval
      });
      
      setSubmitted(true);
      setFormData({ name: '', company: '', content: '', rating: 5 });
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      alert('Failed to submit testimonial. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials.map((d, i) => ({
    id: `default-${i}`,
    name: d.name,
    company: d.company,
    content: d.content,
    rating: d.rating,
    is_active: true,
    image_url: null,
    created_at: new Date().toISOString(),
  }));

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
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-primary-100 mb-6">
            {t('subtitle')}
          </p>
          <Button
            variant="secondary"
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-primary-600 hover:bg-gray-100"
          >
            {showForm ? 'Close Form' : 'Leave a Review'}
          </Button>
        </motion.div>

        {/* Review Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="max-w-xl mx-auto mb-12"
          >
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-600 fill-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">Your review has been submitted and will be visible after approval.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <Label>Rating *</Label>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= formData.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="content">Your Review *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Share your experience with Paraysco..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        )}

        {/* Testimonials Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {displayTestimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
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
                  {testimonial.company && (
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
