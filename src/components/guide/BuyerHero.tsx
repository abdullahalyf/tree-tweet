'use client';

import Image from 'next/image';
import { useCallback, useRef, useState, type MouseEventHandler } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useHeroPlayback } from './useHeroPlayback';
import './buyer-hero.css';

const slides = [
  {
    image: '/images/aerial-rice-fields.webp', position: 'center 54%',
    title: ['আপনার জমি, আপনার ভবিষ্যৎ', 'Your land, your future'],
    body: ['মালিকের পরিচয় থেকে সরকারি নোটিশ—জমি কেনার আগে পাঁচটি বিষয় মিলিয়ে দেখুন।', 'From the seller’s identity to government notices, explore five checks before buying land.'],
    action: ['পাঁচটি বিষয় দেখি', 'Explore the five checks'], href: '#guide-topics',
  },
  {
    image: '/images/village-rice-fields.webp', position: 'center 58%',
    title: ['কাগজ বুঝে নিন, তারপর এগোন', 'Understand the papers before you proceed'],
    body: ['দলিল, খতিয়ান আর নামজারির কাগজ হাতে রাখুন। কী মিলাবেন, ধাপে ধাপে দেখুন।', 'Gather the deed, khatian and mutation papers. Follow the steps to learn what to compare.'],
    action: ['প্রয়োজনীয় কাগজ দেখি', 'See the papers to gather'], href: '#guide-papers',
  },
  {
    image: '/images/aerial-rice-fields.webp', position: '76% 70%',
    title: ['সঠিক সেবায় পৌঁছান সহজে', 'Find the right official service'],
    body: ['মামলা, খাস জমি বা অধিগ্রহণ নিয়ে প্রশ্ন? কোন সেবা ও অফিসে খোঁজ নেবেন, জেনে নিন।', 'Questions about cases, khas land or acquisition? Find which service and office to ask.'],
    action: ['মামলা ও নোটিশের ধাপ দেখি', 'Explore cases and notices'], href: '#check-case',
  },
] as const;

export function BuyerHero({ motionPaused, onToggleMotion, onNavigate }: {
  motionPaused: boolean;
  onToggleMotion: () => void;
  onNavigate: MouseEventHandler<HTMLAnchorElement>;
}) {
  const { t, language } = useLanguage();
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const advance = useCallback(() => setActive(previous => (previous + 1) % slides.length), []);
  useHeroPlayback(rootRef, motionPaused || !autoPlaying || hovered || focusWithin, advance);
  const choose = (index: number) => {
    setActive((index + slides.length) % slides.length);
    setAutoPlaying(false);
  };
  const number = (value: number) => value.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US');
  const current = slides[active];

  return <section ref={rootRef} id="guide-start" tabIndex={-1}
    className="buyer-hero guide-destination" aria-labelledby="buyer-guide-title"
    aria-roledescription={t('ছবির স্লাইডার', 'carousel')} data-motion-paused={motionPaused}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocusWithin(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false); }}>
    <div className="buyer-hero-scenery" aria-hidden="true">
      {slides.map((slide, index) => <div key={index} className="buyer-hero-photo-layer" data-active={active === index}>
        <div className="buyer-hero-camera">
          <Image src={slide.image} alt="" fill sizes="100vw" preload={index === 0}
            className="buyer-hero-photo" style={{ objectPosition: slide.position }} />
        </div>
      </div>)}
      <svg className="buyer-hero-map-lines" viewBox="0 0 1200 600" preserveAspectRatio="none" fill="none">
        <path d="M0 440 240 260 435 380 710 140 970 235 1200 55M120 600 240 260 150 0M435 380 550 600M710 140 675 0M970 235 1040 600" />
      </svg>
    </div>
    <div className="buyer-hero-main">
    <div className="buyer-hero-content">
      <p className="buyer-hero-eyebrow"><span aria-hidden="true" />{t('জমি কেনার আগে · পাঁচটি বিষয়', 'Before you buy · five checks')}</p>
      <h1 id="buyer-guide-title">{t('জমি কেনার আগে,\nজেনে নিন ভালো করে।', 'Before buying land,\nknow what to check.')}</h1>
      <div className="buyer-hero-copy-stack" aria-live="off">
        {slides.map((slide, index) => <div key={index} className="buyer-hero-slide-copy" aria-hidden={active !== index} data-active={active === index}>
          <h2>{t(slide.title[0], slide.title[1])}</h2>
          <p>{t(slide.body[0], slide.body[1])}</p>
        </div>)}
      </div>
      <a className="buyer-hero-start" href={current.href} onClick={onNavigate}>
        {t(current.action[0], current.action[1])}<span aria-hidden="true">→</span>
      </a>
      <p className="buyer-hero-boundary">{t('TreeTweet একটি স্বাধীন সহায়িকা। সরকারি রেকর্ড এখানে যাচাই করা হয় না।', 'TreeTweet is an independent guide. Government records are not verified here.')}</p>
    </div>
    <figure className="buyer-hero-village-frame">
      <div className="buyer-hero-village-image">
        <div className="buyer-hero-village-camera">
          <Image src="/images/village-rice-fields.webp" fill sizes="(max-width: 1023px) 100vw, 40vw"
            alt={t('সবুজ ধানখেত, গ্রামের পথ ও গাছের প্রতীকী দৃশ্য', 'Illustrative scene of green rice fields, a village path and trees')}
            className="buyer-hero-village-photo" />
        </div>
      </div>
      <figcaption>{t('গ্রামের জমি, পরিবারের ভবিষ্যৎ', 'Village land, a family’s future')}<span>{t('প্রতীকী দৃশ্য', 'Illustrative scene')}</span></figcaption>
    </figure>
    </div>
    <div className="buyer-hero-bottom">
      <div className="buyer-hero-controls" role="group" aria-label={t('ছবি বদলানোর নিয়ন্ত্রণ', 'Slideshow controls')}>
        <button type="button" className="buyer-hero-arrow" onClick={() => choose(active - 1)} aria-label={t('আগের ছবি', 'Previous slide')}><span aria-hidden="true">‹</span></button>
        <div className="buyer-hero-dots">{slides.map((slide, index) => <button key={index} type="button"
          onClick={() => choose(index)} aria-pressed={active === index}
          aria-label={t(`ছবি ${number(index + 1)}: ${slide.title[0]}`, `Slide ${index + 1}: ${slide.title[1]}`)}><span /></button>)}</div>
        <button type="button" className="buyer-hero-arrow" onClick={() => choose(active + 1)} aria-label={t('পরের ছবি', 'Next slide')}><span aria-hidden="true">›</span></button>
        <span className="buyer-hero-counter" aria-hidden="true">{number(active + 1)} / {number(slides.length)}</span>
      </div>
      <div className="buyer-hero-playback">
        <button type="button" onClick={() => setAutoPlaying(previous => !previous)} aria-pressed={!autoPlaying}>
          {autoPlaying ? t('ছবি বদলানো বন্ধ করুন', 'Pause slideshow') : t('ছবি নিজে থেকে বদলাক', 'Resume slideshow')}
        </button>
        <button type="button" onClick={onToggleMotion} aria-pressed={motionPaused}>
          <span aria-hidden="true">{motionPaused ? '▶' : 'Ⅱ'}</span>{motionPaused ? t('নড়াচড়া চালু করুন', 'Turn animations on') : t('নড়াচড়া বন্ধ করুন', 'Turn animations off')}
        </button>
      </div>
    </div>
    <p className="buyer-hero-image-note">{t('প্রতীকী ছবি · নির্দিষ্ট কোনো জমির ছবি নয়', 'Illustrative imagery · not a particular plot')}</p>
  </section>;
}
