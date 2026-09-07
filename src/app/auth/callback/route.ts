import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const fallbackLocale = origin.includes('/fr/') ? 'fr' : 'en';
  // Only allow same-origin relative redirects (blocks open-redirect via //evil.com or absolute URLs)
  const nextPath = next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\')
    ? next
    : `/${fallbackLocale}/profile`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Update email_verified in users table
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const supabaseAdmin = await createAdminClient();

        await supabaseAdmin
          .from('users')
          .update({ email_verified: true })
          .eq('id', user.id);
      }

      return NextResponse.redirect(`${origin}${nextPath}`);
    }
  }

  // Return to login page with error
  return NextResponse.redirect(`${origin}/${fallbackLocale}/login?error=verification_failed`);
}
