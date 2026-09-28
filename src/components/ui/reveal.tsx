import type { ReactNode } from 'react';

type RevealVariant = 'up' | 'left' | 'right' | 'scale';

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  /** Transition delay in milliseconds. */
  delay?: number;
}

/**
 * Server-rendered scroll-reveal wrapper.
 *
 * It only emits the `.reveal` class and the transition delay; a single
 * `RevealObserver` mounted once in the home page adds `is-visible` when each
 * element scrolls into view. Keeping this free of hooks means the sections using
 * it stay server components, and one observer replaces what used to be a client
 * island per wrapper (17 on the home page).
 *
 * The CSS transition is defined in globals.css and honours reduced motion, so
 * content is never hidden from users who cannot animate it.
 */
export function Reveal({ children, className = '', variant = 'up', delay = 0 }: RevealProps) {
  return (
    <div
      className={`reveal reveal-${variant} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
