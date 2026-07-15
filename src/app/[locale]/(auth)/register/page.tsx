'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { registerFormSchema } from '@/lib/utils';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { registerUser } from '@/app/actions/auth';

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth.register');
  const tErrors = useTranslations('auth.errors');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
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
    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });

      if (result.error) {
        if (result.error.includes('already registered') || result.error.includes('already exists')) {
          setError(tErrors('emailExists'));
        } else if (result.error.includes('weak password')) {
          setError(tErrors('weakPassword'));
        } else {
          setError(tErrors('networkError'));
        }
        return;
      }

      // Redirect to login page after successful registration
      router.push(`/${locale}/login?registered=true`);
    } catch (err) {
      console.error('Registration error:', err);
      setError(tErrors('unknownError'));
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
              <span className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                PARAYSCO PCI
              </span>
            </Link>
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('subtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
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
              <Controller
                name="privacy_policy"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="privacy_policy"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label
                htmlFor="privacy_policy"
                className="text-sm text-gray-600 dark:text-gray-300 leading-tight"
              >
                {t('privacy')}{' '}
                <Link
                  href={`/${locale}/privacy`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.privacy_policy && (
              <p className="text-sm text-red-500">{errors.privacy_policy.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                t('submit')
              )}
            </Button>
          </form>

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
