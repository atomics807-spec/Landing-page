'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref to attach to a container and whether it has scrolled into view.
 *
 * Used to gate below-the-fold data fetching: the Supabase client is ~178 kB and
 * its parse/execute lands in the same window as the hero paint when the fetch
 * fires on mount. Waiting until the section is actually approached keeps that
 * work out of the initial load entirely.
 */
export function useInView<T extends Element>(rootMargin = '200px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView } as const;
}
