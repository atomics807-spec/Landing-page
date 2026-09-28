'use client';

import { useEffect } from 'react';

/**
 * Single IntersectionObserver for every `.reveal` element on the page.
 *
 * Previously each `Reveal` wrapper was its own client component with its own
 * observer, which hydrated a separate island per section. Pairing that with the
 * server-rendered `Reveal` wrapper drops the home page from ~17 islands to one.
 */
export function RevealObserver() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (targets.length === 0) return;

    if (typeof IntersectionObserver === 'undefined') {
      for (const el of targets) el.classList.add('is-visible');
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

    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return null;
}
