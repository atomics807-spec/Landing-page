// scripts/create-admin.ts
// Run once: npx tsx scripts/create-admin.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const email = process.env.ADMIN_EMAIL || 'admin@paraysco.com';
const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

async function createAdmin() {
  // Create the auth user first (Supabase handles password hashing)
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Admin User' },
  });

  if (authError) {
    console.error('Error creating admin user:', authError.message);
    return;
  }

  const userId = authUser.user.id;

  // Upsert profile into users table
  await supabase.from('users').upsert(
    { id: userId, email, full_name: 'Admin User', role: 'admin', email_verified: true },
    { onConflict: 'id' }
  );

  // Grant admin permissions
  const { error: adminError } = await supabase
    .from('admins')
    .upsert(
      { user_id: userId, permissions: ['all'] },
      { onConflict: 'user_id' }
    );

  if (adminError) {
    console.error('Error granting admin role:', adminError.message);
    return;
  }

  console.log('Admin created successfully!');
  console.log(`Email: ${email}`);
  console.log('Set a strong ADMIN_PASSWORD via env when running this script.');
}

createAdmin();
