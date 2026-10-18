'use client';

import Link from 'next/link';
import { useRef, type MouseEvent } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useGuideMotion } from './useGuideMotion';
import { BuyerHero } from './BuyerHero';
import { BuyerPortal } from './BuyerPortal';

export function BuyerGuide({ motionPaused, onToggleMotion }: {
  onTryDemo: () => void;
  motionPaused: boolean;
  onToggleMotion: () => void;
}) {
  const { t, language } = useLanguage();
  const guideRef = useRef<HTMLDivElement>(null);
  useGuideMotion(guideRef, motionPaused);
  const number = (value: number) => value.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US');
  const goToSection = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(event.currentTarget.href, window.location.href);
    if (destination.pathname !== window.location.pathname || destination.search !== window.location.search || !destination.hash) return;
    const target = document.getElementById(destination.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start', behavior: motionPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return <div ref={guideRef} className="buyer-guide">
    <BuyerHero motionPaused={motionPaused} onToggleMotion={onToggleMotion} onNavigate={goToSection} />
    <div className="guide-content space-y-6">
      <section id="guide-how" tabIndex={-1} className="guide-how guide-destination" data-scroll-reveal aria-labelledby="guide-how-title">
        <h2 id="guide-how-title">{t('যেভাবে ব্যবহার করবেন', 'How to use this guide')}</h2>
        <ol>{[
          { title: t('কাগজ হাতে নিন', 'Gather your papers'), body: t('বিক্রেতার কাছে কোন কাগজ চাইবেন, তালিকা দেখুন।', 'See which papers to ask the seller for.'), href: '/check/papers' },
          { title: t('পাঁচটি বিষয় দেখুন', 'Explore the five checks'), body: t('একটি বিষয় বেছে আলাদা পাতায় ধাপগুলো দেখুন।', 'Choose a topic to read its steps on a separate page.'), href: '#guide-topics' },
          { title: t('নিজের প্রস্তুতি চিহ্ন দিন', 'Mark your preparation'), body: t('কাগজ পেয়েছেন, নাকি অমিল আছে—বেছে রাখুন।', 'Mark whether you have the papers or found a difference.'), href: '/check/preparation' },
        ].map((step, index) => <li key={step.href}><span className="guide-how-number" aria-hidden="true">{number(index + 1)}</span><div>
          <h3><Link href={step.href} onClick={goToSection} className="inline-flex min-h-11 items-center underline underline-offset-4">{step.title}</Link></h3><p>{step.body}</p>
        </div></li>)}</ol>
      </section>
      <BuyerPortal onNavigate={goToSection} />
    </div>
  </div>;
}
