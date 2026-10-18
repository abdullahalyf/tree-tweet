'use client';

import { useEffect, type RefObject } from 'react';

// Content is visible before hydration and without IntersectionObserver. Only
// elements actually entering the viewport receive a short, one-shot animation.
export function useGuideMotion(rootRef: RefObject<HTMLDivElement | null>, paused: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dispose = () => {};

    const configure = () => {
      dispose();
      dispose = () => {};
      if (paused || preference.matches || !('IntersectionObserver' in window)) return;

      const animations = new Set<Animation>();
      const scene = root.querySelector<HTMLElement>('.rural-scene');
      let sceneVisible = false;
      let frame: number | null = null;
      const render = () => {
        frame = null;
        const available = document.documentElement.scrollHeight - window.innerHeight;
        root.style.setProperty('--reading-progress', String(available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0));
        if (!scene || !sceneVisible) return;
        const bounds = scene.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
        scene.style.setProperty('--scene-shift', `${(progress - .5) * (window.innerWidth < 640 ? 16 : 40)}px`);
      };
      const requestRender = () => {
        if (frame === null) frame = window.requestAnimationFrame(render);
      };
      const reveal = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal.unobserve(entry.target);
          // A keyboard/anchor destination should stay still while it gains focus.
          if (entry.target.contains(document.activeElement) || typeof entry.target.animate !== 'function') continue;
          const animation = entry.target.animate([
            { opacity: .65, transform: 'translateY(22px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: 620, easing: 'cubic-bezier(.22, 1, .36, 1)' });
          animations.add(animation);
          void animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
        }
      }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
      root.querySelectorAll('[data-scroll-reveal]').forEach(element => reveal.observe(element));

      const sceneObserver = new IntersectionObserver(entries => {
        sceneVisible = entries.some(entry => entry.isIntersecting);
        if (scene) scene.dataset.sceneActive = String(sceneVisible && !document.hidden);
        requestRender();
      });
      if (scene) sceneObserver.observe(scene);
      const visibilityChanged = () => {
        if (scene) scene.dataset.sceneActive = String(sceneVisible && !document.hidden);
        if (!document.hidden) requestRender();
      };
      window.addEventListener('scroll', requestRender, { passive: true });
      window.addEventListener('resize', requestRender, { passive: true });
      document.addEventListener('visibilitychange', visibilityChanged);
      requestRender();

      dispose = () => {
        reveal.disconnect();
        sceneObserver.disconnect();
        window.removeEventListener('scroll', requestRender);
        window.removeEventListener('resize', requestRender);
        document.removeEventListener('visibilitychange', visibilityChanged);
        if (frame !== null) window.cancelAnimationFrame(frame);
        animations.forEach(animation => animation.cancel());
        if (scene) {
          scene.dataset.sceneActive = 'false';
          scene.style.removeProperty('--scene-shift');
        }
        root.style.removeProperty('--reading-progress');
      };
    };

    configure();
    preference.addEventListener('change', configure);
    return () => {
      preference.removeEventListener('change', configure);
      dispose();
    };
  }, [rootRef, paused]);
}
