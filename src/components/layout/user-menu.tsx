'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { User, LogOut, Settings, LayoutDashboard, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// The Supabase browser client is loaded on demand. It is imported dynamically
// rather than at module scope because this component sits in the header on
// every route, so a static import dragged `@supabase/supabase-js` (~179 KB)
// into the initial JS for the home page and every other page.
const getSupabase = () => import('@/lib/supabase/client').then((m) => m.createClient());

/**
 * Cheap synchronous hint that an auth session might exist, read from the
 * Supabase session cookie (`sb-<ref>-auth-token`) that `createBrowserClient`
 * writes. A false positive just means we show the spinner and load the client;
 * a false negative is not possible for a real logged-in session.
 *
 * This lets the vast majority of visits — logged-out readers — skip the
 * ~179 KB Supabase client entirely instead of only deferring it.
 */
function hasAuthCookieHint(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split(';')
    .some((c) => /^\s*sb-.*-auth-token/.test(c));
}

export function UserMenu({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(hasAuthCookieHint);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    const supabase = await getSupabase();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (authUser) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser.id)
        .single();
      setUser({
        ...authUser,
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
        email: authUser.email,
        role: profile?.role || authUser.user_metadata?.role || 'user',
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // No session cookie means there is nothing to resolve: render the "Login"
    // button without ever fetching the Supabase client.
    if (!hasAuthCookieHint()) return;

    // With a session present the auth check pulls in the ~179 KB Supabase
    // client. Firing it on mount put that parse/execute inside the home page's
    // LCP window, so it now waits until the visitor interacts or the menu opens,
    // with a post-LCP timeout as the fallback.
    let cancelled = false;
    let started = false;
    let unsubscribe: (() => void) | undefined;

    const start = () => {
      if (started || cancelled) return;
      started = true;
      teardownListeners();

      loadUser();

      getSupabase().then((supabase) => {
        if (cancelled) return;
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'SIGNED_OUT') {
            setUser(null);
          }

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            loadUser();
          }
        });
        unsubscribe = () => subscription.unsubscribe();
      });
    };

    const events = ['scroll', 'click', 'keydown', 'touchstart', 'pointerdown'] as const;
    const onInteract = () => start();
    for (const e of events) {
      window.addEventListener(e, onInteract, { once: true, passive: true });
    }
    const timer = window.setTimeout(start, 6000);

    function teardownListeners() {
      for (const e of events) window.removeEventListener(e, onInteract);
      window.clearTimeout(timer);
    }

    return () => {
      cancelled = true;
      teardownListeners();
      unsubscribe?.();
    };
  }, [loadUser]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const supabase = await getSupabase();

      // Clear all auth data from browser
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      setUser(null);
      
      // Redirect to home page
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
      <div className="flex items-center justify-center w-10 h-10">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button asChild size="sm" className="h-9 px-3 sm:h-10 sm:px-4">
        <Link href={`/${locale}/login`}>Login</Link>
      </Button>
    );
  }

  const userName = user.full_name || user.user_metadata?.full_name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
          {userInitial}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
          {userName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-dropdown"
          >
              {/* User Info */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
                    {userInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {userName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link
                  href={`/${locale}/profile`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">My Profile</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-200">Dashboard</span>
                  </Link>
                )}

                <Link
                  href={`/${locale}/profile#settings`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">Settings</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
          </div>
        </>
      )}
    </div>
  );
}
