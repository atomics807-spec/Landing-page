'use client';

import { useEffect, useRef } from 'react';
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
 * Scroll-reveal wrapper backed by IntersectionObserver + a CSS transition.
 *
 * Replaces Framer Motion's `whileInView` for the below-the-fold home sections.
 * Those sections are always in the initial JS graph, so importing Framer Motion
 * for them pulled ~112 KB of animation runtime into the first load and delayed
 * hydration past the LCP. This adds no dependency at all.
 */
export function Reveal({ children, className = '', variant = 'up', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
