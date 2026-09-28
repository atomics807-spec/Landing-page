'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

/**
 * Analytics is mounted only after the visitor interacts with the page, or after
 * a 6s timeout for sessions without interaction. gtag itself costs ~1s of
 * main-thread time on mobile, and its long tasks were landing inside the LCP
 * window. Interaction keeps it out of the critical path without depending on
 * requestIdleCallback, which fires far too early to help here.
 */
export function DeferredAnalytics({ gaId }: { gaId: string }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (cancelled || armed) return;
      armed = true;
      cleanup();
      setIsReady(true);
    };

    let armed = false;
    const events = ['scroll', 'click', 'keydown', 'touchstart', 'pointerdown'] as const;

    const onInteract = () => enable();
    const cleanup = () => {
      for (const e of events) window.removeEventListener(e, onInteract);
      window.clearTimeout(timer);
    };

    for (const e of events) {
      window.addEventListener(e, onInteract, { once: true, passive: true });
    }

    // Fallback for sessions where the visitor never interacts: load once the
    // page is well past the LCP window.
    const timer = window.setTimeout(enable, 6000);

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  if (!isReady) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
