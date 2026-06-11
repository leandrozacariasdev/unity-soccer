'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function observeAll(observer: IntersectionObserver | null) {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    if (!el.classList.contains('in')) {
      observer?.observe(el);
    }
  });
}

export function RevealOnScroll() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in'));
      return;
    }
    if (window.innerWidth <= 768 && !window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in'));
      return;
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    observeAll(observerRef.current);

    const onPageShow = () => observeAll(observerRef.current);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [pathname]);

  return null;
}
