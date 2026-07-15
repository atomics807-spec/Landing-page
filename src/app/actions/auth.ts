'use server';

import { createClient } from '@/lib/supabase/server';

export async function registerUser(formData: {
  email: string;
  password: string;
  full_name: string;
}) {
  const supabase = await createClient();

  // Create auth user with Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // Create user profile in the users table using admin client
  if (authData.user) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(
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
  }

  return { success: true };
}

export async function loginUser(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (authError) {
    console.error('Login error:', authError);
    return { error: authError.message };
  }

  // Check if email is confirmed
  if (authData.user && !authData.user.email_confirmed_at) {
    return { error: 'Please confirm your email address before logging in. Check your inbox for the confirmation link.' };
  }

  // Check if user is an admin
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
      // If admins table doesn't exist or error, continue as regular user
      return { 
        success: true, 
        isAdmin: false,
        user: authData.user 
      };
    }
  }

  return { success: true };
}
