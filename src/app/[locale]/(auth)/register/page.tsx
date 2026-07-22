'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { registerFormSchema } from '@/lib/utils';
import { Eye, EyeOff, Loader2, Mail, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const locale = useLocale();
  const t = useTranslations('auth.register');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
      privacy_policy: false,
    },
  });

  const onSubmit = async (data: {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
    privacy_policy: boolean;
  }) => {
    setError('');
    setIsLoading(true);
    
    try {
      // Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setError('Server configuration error. Please contact the administrator.');
        setIsLoading(false);
        return;
      }
      
      const supabase = createClient();
      console.log('Starting registration for:', data.email);
      console.log('Supabase URL:', supabaseUrl);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
        },
      });

      console.log('Supabase response:', { authData, authError });
      console.log('Auth error message:', authError?.message);
      console.log('Auth error type:', typeof authError);

      setIsLoading(false);

      if (authError) {
        // Handle error properly
        const errorMsg = authError.message || String(authError) || 'Registration failed';
        console.error('Registration error:', errorMsg);
        setError(errorMsg);
        return;
      }

      // Show email verification message
      setRegistered(true);
      setRegisteredEmail(data.email);
    } catch (err: unknown) {
      setIsLoading(false);
      console.error('Registration error:', err);
      console.error('Error type:', typeof err);
      console.error('Error string:', String(err));
      
      // Handle different error formats safely
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err) {
        if (typeof err === 'string') {
          errorMessage = err;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        } else {
          try {
            const errStr = JSON.stringify(err);
            if (errStr && errStr !== '{}') {
              errorMessage = errStr;
            }
          } catch {
            // Ignore JSON stringify errors
          }
        }
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href={`/${locale}`} className="inline-flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
                PARAYSCO INC
              </span>
            </Link>
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('subtitle')}</p>
          </div>

          {/* Form */}
          {registered ? (
            /* Email Verification Success Message */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Check Your Email!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We've sent a verification link to:
                </p>
                <p className="font-semibold text-primary-600 dark:text-primary-400">
                  {registeredEmail}
                </p>
              </div>

              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="text-left">
                      <p className="font-medium text-blue-800 dark:text-blue-200">
                        Please verify your email
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                        Click the link in the email we sent you. The link will expire in 24 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive the email? Check your spam folder or
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRegistered(false);
                    setRegisteredEmail('');
                  }}
                  className="w-full"
                >
                  Register a Different Email
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Already verified?{' '}
                  <Link
                    href={`/${locale}/login`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </motion.div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 p-4 rounded-lg text-sm font-medium">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="full_name">{t('fullName')}</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="John Doe"
                  {...register('full_name')}
                  error={errors.full_name?.message}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    error={errors.password?.message}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">{t('confirmPassword')}</Label>
                <Input
                  id="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirm_password')}
                  error={errors.confirm_password?.message}
                />
                {errors.confirm_password && (
                  <p className="text-sm text-red-500">{errors.confirm_password.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <Controller
                    name="privacy_policy"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="privacy_policy"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 border-2 border-gray-400 dark:border-gray-500"
                      />
                    )}
                  />
                </div>
                <label
                  htmlFor="privacy_policy"
                  className="text-sm text-gray-600 dark:text-gray-300 leading-tight cursor-pointer"
                >
                  {t('privacy')}{' '}
                  <Link
                    href={`/${locale}/privacy`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.privacy_policy && (
                <p className="text-sm text-red-500">{errors.privacy_policy.message}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  t('submit')
                )}
              </Button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('hasAccount')}{' '}
              <Link
                href={`/${locale}/login`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
