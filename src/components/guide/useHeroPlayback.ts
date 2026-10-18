'use client';

import { useEffect, type RefObject } from 'react';

// The first slide is usable without JavaScript. Automatic rotation and the
// scene's camera motion share the same visibility and user-preference gate.
export function useHeroPlayback(
  rootRef: RefObject<HTMLElement | null>,
  paused: boolean,
  onAdvance: () => void,
): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.heroActive = 'false';
    if (paused || !('IntersectionObserver' in window)) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let timer: number | null = null;

    const synchronize = () => {
      const active = visible && !document.hidden && !preference.matches;
      root.dataset.heroActive = String(active);
      if (active && timer === null) {
        timer = window.setInterval(onAdvance, 7000);
      } else if (!active && timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.target === root && entry.isIntersecting);
      synchronize();
    });
    observer.observe(root);
    preference.addEventListener('change', synchronize);
    document.addEventListener('visibilitychange', synchronize);

    return () => {
      observer.disconnect();
      preference.removeEventListener('change', synchronize);
      document.removeEventListener('visibilitychange', synchronize);
      if (timer !== null) window.clearInterval(timer);
      root.dataset.heroActive = 'false';
    };
  }, [rootRef, paused, onAdvance]);
}
