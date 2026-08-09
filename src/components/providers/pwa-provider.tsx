'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * BeforeInstallPromptEvent is not part of the TS DOM lib yet, so declare a
 * minimal structural type. We never construct it — only consume what the
 * browser dispatches.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

export interface PWAInstallState {
  /** A beforeinstallprompt event has been captured and install is available. */
  canInstall: boolean;
  /** The app is running standalone (installed) or the prompt is unavailable. */
  isInstalled: boolean;
  /** Registering the SW / checking support has finished. */
  isReady: boolean;
  /** Show the browser install prompt. Resolves with the user's choice. */
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
}

const PWAContext = createContext<PWAInstallState>({
  canInstall: false,
  isInstalled: false,
  isReady: false,
  promptInstall: async () => 'unavailable',
});

function detectInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  const standalone = window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const minimalUi = window.matchMedia('(display-mode: minimal-ui)').matches;
  return standalone || iosStandalone || minimalUi;
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  // Using a ref so the value is readable inside event listeners without
  // re-binding them on every render.
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Register the service worker once on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) {
      setIsReady(true);
      return;
    }

    let cancelled = false;
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        // Keep the SW fresh: if a new one takes over, reload once so the page
        // runs against the latest assets.
        if (reg.waiting) {
          reg.waiting.postMessage('SKIP_WAITING');
        }
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!cancelled) window.location.reload();
        });
      } catch (err) {
        // SW registration failure is non-fatal; site still works online-only.
        console.warn('[PWA] Service worker registration failed:', err);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    };

    register();
    return () => {
      cancelled = true;
    };
  }, []);

  // Initial installed-state detection + react to display-mode changes.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsInstalled(detectInstalled());

    const mql = window.matchMedia('(display-mode: standalone)');
    const onChange = () => setIsInstalled(detectInstalled());
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);

  // Capture the install prompt.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar on mobile; we show our own button.
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      // Only offer install when not already installed.
      if (!detectInstalled()) setCanInstall(true);
    };

    const onAppInstalled = () => {
      deferredPromptRef.current = null;
      setCanInstall(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<
    'accepted' | 'dismissed' | 'unavailable'
  > => {
    const deferred = deferredPromptRef.current;
    if (!deferred) return 'unavailable';
    await deferred.prompt();
    const choice = await deferred.userChoice;
    deferredPromptRef.current = null;
    setCanInstall(false);
    return choice.outcome;
  }, []);

  const value = useMemo<PWAInstallState>(
    () => ({ canInstall, isInstalled, isReady, promptInstall }),
    [canInstall, isInstalled, isReady, promptInstall]
  );

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
}

export function usePWA() {
  return useContext(PWAContext);
}
