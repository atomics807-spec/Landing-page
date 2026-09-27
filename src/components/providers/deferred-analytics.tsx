'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

/**
 * Analytics is mounted only after the window `load` event. That keeps the
 * gtag bundle out of the initial document (no <link rel="preload">, no
 * third-party main-thread work) so it cannot compete with the hero image for
 * the LCP. Analytics still records the session, just a moment later.
 */
export function DeferredAnalytics({ gaId }: { gaId: string }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsReady(true);
      return;
    }

    const onLoad = () => setIsReady(true);
    window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, []);

  if (!isReady) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
