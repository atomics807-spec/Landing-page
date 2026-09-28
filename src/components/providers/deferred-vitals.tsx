'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

/**
 * Vercel's analytics and speed-insights scripts are small but their execution
 * landed inside the hero's LCP window. They now mount only after the page has
 * loaded and the main thread is idle, which costs nothing measurable in
 * reporting while keeping the beacon work off the critical path.
 */
export function DeferredVitals() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleHandle: number | undefined;
    let timerHandle: number | undefined;

    const enable = () => {
      if (cancelled) return;
      if (typeof window.requestIdleCallback === 'function') {
        idleHandle = window.requestIdleCallback(() => {
          if (!cancelled) setIsReady(true);
        });
      } else {
        timerHandle = window.setTimeout(() => {
          if (!cancelled) setIsReady(true);
        }, 200);
      }
    };

    if (document.readyState === 'complete') {
      enable();
    } else {
      window.addEventListener('load', enable, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', enable);
      if (idleHandle !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleHandle);
      }
      if (timerHandle !== undefined) window.clearTimeout(timerHandle);
    };
  }, []);

  if (!isReady) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
