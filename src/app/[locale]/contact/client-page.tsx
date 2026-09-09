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
        const geoRes = await fetch('https://ipapi.co', { signal: controller.signal });
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
                      href="mailto:info@://parayscoconsulting.com"
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
                      href="mailto:support@://parayscoconsulting.com"

                    className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline pt-2 w-fit">support@parayscoconsulting.com →{/* Core Layout Grid: Form, Text Data, Map Panel */}</>)});}export default function ContactClientPage() {return (<Suspense fallback={}>);}
