'use client';

import { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/components/providers/pwa-provider';
import { cn } from '@/lib/utils';

interface InstallAppButtonProps {
  /** Visual style of the button. */
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  /** Render nothing when install is unavailable (default true). */
  hideWhenUnavailable?: boolean;
  children?: React.ReactNode;
}

/**
 * Install-app button.
 *
 * - Uses the captured beforeinstallprompt event to trigger the native install
 *   dialog (Chrome/Edge/Android).
 * - Automatically hidden when the app is already installed (standalone) or
 *   when the prompt is not available (iOS Safari, Firefox, etc.).
 * - On browsers without beforeinstallprompt (e.g. iOS), the button can be
 *   hidden entirely (hideWhenUnavailable, default) so no dead control shows.
 */
export function InstallAppButton({
  variant = 'default',
  size = 'default',
  className,
  hideWhenUnavailable = true,
  children,
}: InstallAppButtonProps) {
  const { canInstall, isInstalled, isReady, promptInstall } = usePWA();
  const [status, setStatus] = useState<'idle' | 'prompting' | 'installed'>('idle');

  // Hide while we're still determining support.
  if (!isReady) return null;

  // Already installed (running standalone) -> show nothing.
  if (isInstalled) return null;

  // Not installable right now.
  if (!canInstall) {
    return hideWhenUnavailable ? null : (
      <Button variant={variant} size={size} className={cn('opacity-60', className)} disabled>
        {children ?? (
          <>
            <Download className="mr-2 h-4 w-4" />
            Install App
          </>
        )}
      </Button>
    );
  }

  const handleClick = async () => {
    setStatus('prompting');
    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      setStatus('installed');
    } else {
      setStatus('idle');
    }
  };

  if (status === 'installed') {
    return (
      <Button variant="outline" size={size} className={className} disabled>
        <Check className="mr-2 h-4 w-4" />
        Installed
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={status === 'prompting'}
      aria-label="Install Paraysco Consulting app"
    >
      {status === 'prompting' ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Installing…
        </>
      ) : (
        children ?? (
          <>
            <Download className="mr-2 h-4 w-4" />
            Install App
          </>
        )
      )}
    </Button>
  );
}

export default InstallAppButton;
