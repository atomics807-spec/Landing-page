'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { InteractiveMap } from '@/components/ui/map';
import { contactFormSchema, type ContactFormData } from '@/lib/utils';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Loader2, Building2, Briefcase, Lock, ShieldCheck } from 'lucide-react';
import { getUserProfile } from '@/app/actions/auth';

function ContactForm() {
  const locale = useLocale();
  const t = useTranslations('contact');
  const tFoot = useTranslations('footer');
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [propertyInquiry, setPropertyInquiry] = useState<{ id: string; title: string } | null>(null);
  const [jobInquiry, setJobInquiry] = useState<{ id: string; title: string } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  useEffect(() => {
    const subject = searchParams.get('subject');
    const property = searchParams.get('property');
    const position = searchParams.get('position');
    
    if (subject) setValue('subject', subject);
    if (property) setPropertyInquiry({ id: property, title: subject || 'Property Inquiry' });
    if (position) setJobInquiry({ id: position, title: subject || 'Job Application' });
  }, [searchParams, setValue]);

  useEffect(() => {
    const checkAuth = async () => {
      const { user: userData } = await getUserProfile();
      setUser(userData);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Get user's location from IP
      let userLocation = 'Unknown';
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const geoRes = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          userLocation = `${geoData.city || ''}, ${geoData.country_name || ''}`.replace(/^, |, $/, '');
        }
      } catch (e) {
        // Use default if geolocation fails
      }

      // Save to database
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
          property_id: propertyInquiry?.id || null,
          status: 'unread',
          user_location: userLocation,
        });

      if (dbError) {
        console.error('Database error:', dbError);
      }

      // Send email notification to admin via API route
      const emailRes = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          propertyTitle: propertyInquiry?.title,
          userLocation: userLocation,
        }),
      });

      if (!emailRes.ok) {
        console.error('Email notification failed');
      }

      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t('info.address'),
      value: 'Bota Middle Farms, Limbe, South West Region, Cameroon',
    },
    {
      icon: Phone,
      label: t('info.phone'),
      value: '+237 676 914 581',
      whatsapp: true,
    },
    {
      icon: Mail,
      label: t('info.email'),
      value: 'info@parayscoconsulting.com',
    },
    {
      icon: Clock,
      label: t('info.hours'),
      value: 'Monday - Friday: 8:00 AM - 5:00 PM',
    },
  ];

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

      {/* Login Required Gate */}
      {!isLoading && !user && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Login Required
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You need to be logged in to contact us. Please create an account or sign in to continue.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href={`/${locale}/register`}>Create Account</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/${locale}/login`}>Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {user && (
        <>
          {/* Department Direct Email Blocks */}
          <section className="py-12 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200/60 dark:border-gray-800">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Corporate Mailbox Card */}
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950/40 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tFoot('generalInquiries')}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        For commercial project pricing, engineering consulting contracts, brand partnerships, and investment assessments.
                      </p>
                    </div>
                    <a 
                      href="mailto:info@parayscoconsulting.com?subject=Corporate%20Inquiry"
                      className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline pt-2 w-fit"
                    >
                      info@parayscoconsulting.com &rarr;
                    </a>
                  </CardContent>
                </Card>

                {/* Operations/Help Desk Mailbox Card */}
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950/40 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tFoot('clientSupport')}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        For active clients seeking property records pipeline management updates, logistics assistance, or operational support.
                      </p>
                    </div>
                    <a 
                      href="mailto:support@parayscoconsulting.com?subject=Support%20Request"
                      className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline pt-2 w-fit"
                    >
                      support@parayscoconsulting.com &rarr;
                    </a>
                  </CardContent>
                </Card>

              </div>
            </div>
          </section>

          {/* Core Layout Grid */}
          <section id="contact-form" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-16">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Card>
                    <CardContent className="p-8">
                      {submitted ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Send className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Message Sent!
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Thank you for contacting us. We&apos;ll get back to you shortly.
                          </p>
                          <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
                        </div>
                      ) : (
                        <>
                          {propertyInquiry && (
                            <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                              <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
                                <Building2 className="w-5 h-5" />
                                <span className="font-medium">Property Inquiry</span>
                              </div>
                              <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                                You are inquiring about: {propertyInquiry.title}
                              </p>
                            </div>
                          )}
                          {jobInquiry && (
                            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                <Briefcase className="w-5 h-5" />
                                <span className="font-medium">Job Application</span>
                              </div>
                              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                Applying for: {jobInquiry.title}
                              </p>
                            </div>
                          )}
                          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="name">{t('form.name')}</Label>
                                <Input
                                  id="name"
                                  placeholder="John Doe"
                                  {...register('name')}
                                  error={typeof errors.name?.message === 'string' ? errors.name.message : undefined}
                                />
                                {errors.name && typeof errors.name.message === 'string' && (
                                  <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">{t('form.email')}</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="john@example.com"
                                  {...register('email')}
                                  error={typeof errors.email?.message === 'string' ? errors.email.message : undefined}
                                />
                                {errors.email && typeof errors.email.message === 'string' && (
                                  <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="phone">{t('form.phone')}</Label>
                                <Input
                                  id="phone"
                                  type="tel"
                                  placeholder="+237 xxx xxx xxx"
                                  {...register('phone')}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="subject">{t('form.subject')}</Label>
                                <Input
                                  id="subject"
                                  placeholder="Project Inquiry"
                                  {...register('subject')}
                                  error={typeof errors.subject?.message === 'string' ? errors.subject.message : undefined}
                                />
                                {errors.subject && typeof errors.subject.message === 'string' && (
                                  <p className="text-sm text-red-500">{errors.subject.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="message">{t('form.message')}</Label>
                              <Textarea
                                id="message"
                                placeholder="Tell us about your project..."
                                rows={6}
                                {...register('message')}
                                error={typeof errors.message?.message === 'string' ? errors.message.message : undefined}
                              />
                              {errors.message && typeof errors.message.message === 'string' && (
                                <p className="text-sm text-red-500">{errors.message.message}</p>
                              )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  {t('form.sending')}
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  {t('form.submit')}
                                </>
                              )}
                            </Button>
                          </form>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    {contactInfo.map((info) => (
                      <div key={info.label} className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{info.label}</p>
                          <p className="text-gray-600 dark:text-gray-300">{info.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button size="lg" className="w-full bg-green-500 hover:bg-green-600" asChild>
                    <a href="https://wa.me/237676914581" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Chat on WhatsApp
                    </a>
                  </Button>

                  <Card>
                    <CardContent className="p-0 overflow-hidden rounded-xl">
                      <div className="aspect-video">
                        <InteractiveMap className="w-full h-full" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default function ContactClientPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>}>
      <ContactForm />
    </Suspense>
  );
}
