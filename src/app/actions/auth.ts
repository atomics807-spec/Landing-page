'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/email';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

export async function registerUser(formData: {
  email: string;
  password: string;
  full_name: string;
}) {
  try {
    const supabase = await createClient();

    // Sign up without sending the default Supabase email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: {
          full_name: formData.full_name,
        },
      },
    });

    if (authError) {
      return { error: authError.message };
    }

    if (authData.user) {
      // Create user profile in users table
      const supabaseAdmin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.full_name,
          role: 'user',
          email_verified: false,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { error: 'Failed to create user profile' };
      }

      // Send verification email via Resend
      if (authData.session?.access_token) {
        // For email confirmation, we use Supabase's built-in confirmation process
        // The user will receive an email from Supabase OR we can send custom
        console.log('User registered, confirmation email sent via Supabase');
      }
    }

    return { 
      success: true, 
      message: 'Registration successful! Please check your email to verify your account.' 
    };
  } catch (e: any) {
    console.error('Registration error:', e);
    return { error: 'Connection failed. Please check your internet and try again.' };
  }
}

export async function loginUser(formData: { email: string; password: string }) {
  try {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      console.error('Login error:', authError);
      return { error: authError.message };
    }

    if (authData.user && !authData.user.email_confirmed_at) {
      return { error: 'Please confirm your email address before logging in. Check your inbox for the confirmation link.' };
    }

    if (authData.user) {
      try {
        const { data: adminData } = await supabase
          .from('admins')
          .select('id')
          .eq('user_id', authData.user.id)
          .single();

        return { 
          success: true, 
          isAdmin: !!adminData,
          user: authData.user 
        };
      } catch (e) {
        return { 
          success: true, 
          isAdmin: false,
          user: authData.user 
        };
      }
    }

    return { success: true };
  } catch (e: any) {
    console.error('Login error:', e);
    return { error: 'Unable to connect to server. Please check your internet connection and try again.' };
  }
}

export async function logoutUser() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      return { error: error.message };
    }
    
    revalidatePath('/');
    return { success: true };
  } catch (e: any) {
    console.error('Logout exception:', e);
    return { error: e.message || 'Logout failed' };
  }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updateProfile(formData: { full_name: string; phone?: string }) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('users')
    .update({
      full_name: formData.full_name,
      phone: formData.phone,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  // Also update auth metadata
  await supabase.auth.updateUser({
    data: { full_name: formData.full_name }
  });

  return { success: true };
}

export async function getUserProfile() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { user: null };
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return { 
    user: {
      ...user,
      ...profile,
    } 
  };
}
