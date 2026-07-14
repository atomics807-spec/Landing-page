// scripts/create-admin.ts
// Run once: npx tsx scripts/create-admin.ts

import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const email = 'admin@paraysco.com';
const password = 'YourSecurePassword123!';

const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

async function createAdmin() {
  const { data, error } = await supabase
    .from('admin')
    .insert({
      email,
      password_hash: hashPassword(password),
      role: 'super_admin',
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating admin:', error.message);
    return;
  }

  console.log('Admin created successfully!');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

createAdmin();
