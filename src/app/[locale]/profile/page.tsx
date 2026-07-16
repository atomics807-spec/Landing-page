'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, LogOut, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateProfile, updatePassword, getUserProfile } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/client';

interface ProfileFormData {
  full_name: string;
  phone?: string;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('profile');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      full_name: '',
      phone: '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    const { user: userData } = await getUserProfile();
    
    if (!userData) {
      router.push(`/${locale}/login`);
      return;
    }

    setUser(userData);
    profileForm.reset({
      full_name: userData.full_name || userData.user_metadata?.full_name || '',
      phone: userData.phone || '',
    });
    setIsLoading(false);
  };

  const handleProfileUpdate = async (data: ProfileFormData) => {
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    const result = await updateProfile(data);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage(t('profileUpdated'));
      loadProfile();
    }

    setIsSaving(false);
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    if (data.new_password !== data.confirm_password) {
      setErrorMessage(t('passwordMatch') || 'Passwords do not match');
      return;
    }

    if (data.new_password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    setSuccessMessage('');
    setErrorMessage('');

    const result = await updatePassword(data.new_password);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage(t('passwordChanged'));
      passwordForm.reset();
    }

    setIsChangingPassword(false);
  };

  const handleLogout = async () => {
    setIsSaving(true);
    
    try {
      const supabase = createClient();
      
      // Clear all auth data from browser
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Full page reload to reset everything
      window.location.href = `/${locale}`;
    } catch (e) {
      console.error('Logout error:', e);
      
      // Force logout anyway
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      window.location.href = `/${locale}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
              <p className="text-gray-500 mt-1">{t('subtitle')}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-6">
            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('personalInfo')}
                </CardTitle>
                <CardDescription>{t('updatePersonal')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">{t('emailNote')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">{t('fullName')}</Label>
                    <Input
                      id="full_name"
                      {...profileForm.register('full_name')}
                      placeholder={t('fullName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...profileForm.register('phone')}
                      placeholder="+237 xxx xxx xxx"
                    />
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('saving')}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('saveChanges')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {t('changePassword')}
                </CardTitle>
                <CardDescription>{t('changePasswordDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new_password">{t('newPassword')}</Label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        type={showPassword ? 'text' : 'password'}
                        {...passwordForm.register('new_password')}
                        placeholder={t('newPassword')}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">{t('confirmPassword')}</Label>
                    <Input
                      id="confirm_password"
                      type={showPassword ? 'text' : 'password'}
                      {...passwordForm.register('confirm_password')}
                      placeholder={t('confirmPassword')}
                    />
                  </div>

                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('saving')}
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        {t('changePassword')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t('accountInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-gray-500">{t('accountId')}</span>
                  <span className="text-gray-900 dark:text-white font-mono text-sm">{user?.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-gray-500">{t('role')}</span>
                  <span className="text-gray-900 dark:text-white capitalize">{user?.role || 'user'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-gray-500">{t('emailVerified')}</span>
                  <span className={user?.email_confirmed_at ? 'text-green-600' : 'text-yellow-600'}>
                    {user?.email_confirmed_at ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">{t('memberSince')}</span>
                  <span className="text-gray-900 dark:text-white">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
