'use client';

import type { MouseEventHandler } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import './buyer-portal.css';

const services = [
  { id: 'owner', bn: 'মালিক ও জমির পরিচয়', en: 'Owner and plot identity', bodyBn: 'বিক্রেতার পরিচয়, দলিল ও খতিয়ান—কীভাবে মিলিয়ে দেখবেন জানুন।', bodyEn: 'Learn how to compare the seller’s identity, deed and khatian.' },
  { id: 'mutation', bn: 'নামজারির ইতিহাস', en: 'Mutation history', bodyBn: 'এখনকার ও আগের নামজারির কাগজে কী মিলাবেন, দেখে নিন।', bodyEn: 'See what to compare in current and earlier mutation papers.' },
  { id: 'case', bn: 'মামলা ও নিষেধাজ্ঞা', en: 'Cases and court orders', bodyBn: 'মামলার খোঁজ কোথায় নেবেন, আর না পেলে কী করবেন জানুন।', bodyEn: 'Find where to ask about cases and what to do if a search finds nothing.' },
  { id: 'khas', bn: 'খাস জমির অবস্থা', en: 'Khas land status', bodyBn: 'জমি সরকারি খাস কি না, কোন অফিসে নিশ্চিত হবেন জানুন।', bodyEn: 'Learn which office can confirm whether the land is government khas.' },
  { id: 'acquisition', bn: 'অধিগ্রহণের অবস্থা', en: 'Acquisition status', bodyBn: 'সরকারি প্রকল্পের নোটিশ আছে কি না, কীভাবে খোঁজ নেবেন দেখুন।', bodyEn: 'See how to ask whether acquisition notices apply to the plot.' },
] as const;

type ServiceId = typeof services[number]['id'];

function ServiceIllustration({ kind }: { kind: ServiceId }) {
  return <svg className="buyer-portal-illustration" viewBox="0 0 320 126" fill="none" aria-hidden="true" focusable="false">
    <path fill="#e7f0e8" d="M0 0h320v126H0z" />
    <circle cx="270" cy="27" r="14" fill="#e9c770" />
    <path d="M0 91c50-25 92-17 153 0s111-7 167-18v53H0Z" fill="#b9d3b1" />
    <path d="M0 110c81-33 164-15 320-14v30H0Z" fill="#82ad7b" />
    <path d="m8 123 84-30m-37 33 71-30m25 30 41-26m37 26 21-26m-240 3 15 9m16-15 16 8m173-8 6 14m28-17 2 17" stroke="#d8e6b7" strokeWidth="2" />
    {kind === 'owner' && <>
      <path d="m54 65 40-31 40 31" stroke="#176443" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M64 64h60v41H64z" fill="#f9f7e9" stroke="#176443" strokeWidth="3" />
      <path d="M86 79h17v26H86z" fill="#bbcead" />
      <rect x="158" y="20" width="91" height="90" rx="5" fill="#fffef8" stroke="#176443" strokeWidth="3" />
      <circle cx="184" cy="47" r="9" fill="#b4cfb1" />
      <path d="M171 70q1-14 13-14t13 14m15-28h23m-23 12h17m-54 31h60m-60 12h43" stroke="#176443" strokeWidth="3" strokeLinecap="round" />
    </>}
    {kind === 'mutation' && <>
      <rect x="78" y="29" width="77" height="79" rx="4" fill="#d5dfca" stroke="#176443" strokeWidth="3" />
      <rect x="114" y="15" width="85" height="90" rx="4" fill="#fffef8" stroke="#176443" strokeWidth="3" />
      <path d="M130 36h51m-51 14h51m-51 14h28m-28 16h20" stroke="#176443" strokeWidth="3" strokeLinecap="round" />
      <circle cx="205" cy="83" r="26" fill="#176443" />
      <path d="M213 70a15 15 0 1 0 4 22m-4-22h-10m10 0v10" stroke="#fffef8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>}
    {kind === 'case' && <>
      <path d="M159 28v68m-37 4h74m-58-9h42m-65-45 89-14m-72 12-17 34h34Zm56-9-17 34h34Z" stroke="#176443" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="159" cy="26" r="7" fill="#176443" />
      <path d="M99 79q16 18 32 0m41-9q16 18 32 0" fill="#fffef8" stroke="#176443" strokeWidth="3" />
      <path d="M54 104V83h20v21m168 0V71h18v33" stroke="#6e965f" strokeWidth="3" />
    </>}
    {kind === 'khas' && <>
      <path d="m67 44 54-15 56 16 66-18v69l-66 17-56-16-54 14Z" fill="#fffef8" stroke="#176443" strokeWidth="3" strokeLinejoin="round" />
      <path d="M121 29v68m56-52v68M79 60l28-8m-28 22 28-8m28-15 28 8m-28 13 28 8m29-20 34-9m-34 30 34-9" stroke="#91b28b" strokeWidth="3" />
      <path d="M211 18v38m0-37h29l-6 10 6 10h-29" stroke="#176443" strokeWidth="3" strokeLinejoin="round" />
    </>}
    {kind === 'acquisition' && <>
      <path d="M72 22h87v88H72z" fill="#fffef8" stroke="#176443" strokeWidth="3" />
      <path d="M88 41h55M88 56h55M88 71h31M88 86h22" stroke="#176443" strokeWidth="3" strokeLinecap="round" />
      <path d="m179 108 25-67h23l25 67" fill="#e8d6a4" stroke="#176443" strokeWidth="3" strokeLinejoin="round" />
      <path d="M215 50v8m0 11v9m0 12v11" stroke="#fffef8" strokeWidth="3" strokeLinecap="round" />
      <circle cx="160" cy="83" r="20" fill="#176443" />
      <path d="M160 73v12m0 7v1" stroke="#fffef8" strokeWidth="4" strokeLinecap="round" />
    </>}
  </svg>;
}

export function BuyerPortal({ onNavigate }: { onNavigate: MouseEventHandler<HTMLAnchorElement> }) {
  const { t, language } = useLanguage();
  return <section id="guide-topics" tabIndex={-1} className="buyer-portal guide-destination" aria-labelledby="buyer-portal-title" data-scroll-reveal>
    <div className="buyer-portal-heading">
      <span className="buyer-portal-kicker">{t('আপনার প্রথম পাঁচটি কাজ', 'Your first five checks')}</span>
      <h2 id="buyer-portal-title">{t('জমি কেনার আগে যা দেখবেন', 'What to check before buying land')}</h2>
      <p>{t('একটি বিষয় বেছে নিন। কী কাগজ লাগবে আর কোথায় খোঁজ নেবেন, ধাপে ধাপে দেখুন।', 'Choose a topic. Follow the steps to learn which papers you need and where to ask.')}</p>
    </div>
    <div className="buyer-portal-layout">
      <nav className="buyer-portal-cards" aria-label={t('জমি কেনার পাঁচটি বিষয়', 'Five land buying topics')}>
        {services.map((service, index) => <a key={service.id} href={`#check-${service.id}`} onClick={onNavigate} className="buyer-portal-card">
          <ServiceIllustration kind={service.id} />
          <div className="buyer-portal-card-copy">
            <span className="buyer-portal-card-number">{t('ধাপ', 'Step')} {(index + 1).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}</span>
            <h3>{t(service.bn, service.en)}</h3>
            <p>{t(service.bodyBn, service.bodyEn)}</p>
            <span className="buyer-portal-card-action">{t('কীভাবে দেখবেন', 'See the steps')} <span aria-hidden="true">→</span></span>
          </div>
        </a>)}
      </nav>
      <aside className="buyer-portal-sidebar" aria-label={t('সরকারি সেবা ও সাহায্য', 'Official services and help')}>
        <section className="buyer-portal-panel buyer-portal-preparation" aria-labelledby="buyer-portal-prep-title">
          <span className="buyer-portal-panel-mark" aria-hidden="true">✓</span>
          <h3 id="buyer-portal-prep-title">{t('প্রথমবার এসেছেন?', 'First time here?')}</h3>
          <p>{t('দলিল, খতিয়ান ও জমির ঠিকানা হাতে রাখুন। আসল কাগজ এখানে আপলোড করতে হবে না।', 'Keep the deed, khatian and plot location ready. You do not need to upload private documents here.')}</p>
          <a href="#guide-papers" onClick={onNavigate} className="buyer-portal-prep-link">{t('কাগজের তালিকা দেখুন', 'View the paper checklist')} <span aria-hidden="true">→</span></a>
        </section>
        <section className="buyer-portal-panel" aria-labelledby="buyer-portal-official-title">
          <h3 id="buyer-portal-official-title">{t('সরকারি সেবায় যান', 'Visit official services')}</h3>
          <p className="buyer-portal-small">{t('লিংকগুলো বাইরের সরকারি সাইট খুলবে।', 'These links open external government websites.')}</p>
          <ul className="buyer-portal-official-links">
            <li><a href="https://dlrms.land.gov.bd/" target="_blank" rel="noopener noreferrer">{t('খতিয়ান ও ম্যাপ', 'Khatian and maps')} <span aria-hidden="true">↗</span><span className="sr-only">{t(' — নতুন ট্যাব', ' — new tab')}</span></a></li>
            <li><a href="https://mutation.land.gov.bd/" target="_blank" rel="noopener noreferrer">{t('নামজারি সেবা', 'Mutation service')} <span aria-hidden="true">↗</span><span className="sr-only">{t(' — নতুন ট্যাব', ' — new tab')}</span></a></li>
            <li><a href="https://case.gov.bd/" target="_blank" rel="noopener noreferrer">{t('ভূমি রাজস্ব মামলা', 'Land revenue cases')} <span aria-hidden="true">↗</span><span className="sr-only">{t(' — নতুন ট্যাব', ' — new tab')}</span></a></li>
          </ul>
        </section>
        <section className="buyer-portal-panel buyer-portal-help" aria-labelledby="buyer-portal-help-title">
          <h3 id="buyer-portal-help-title">{t('ভূমিসেবার সাহায্য দরকার?', 'Need help with land services?')}</h3>
          <a href="tel:16122" className="buyer-portal-phone"><span aria-hidden="true">☎</span> {t('১৬১২২', '16122')}</a>
          <p>{t('সরকারি ভূমিসেবা হটলাইন। ফোনের চার্জ প্রযোজ্য হতে পারে।', 'Government land service hotline. Call charges may apply.')}</p>
        </section>
      </aside>
    </div>
  </section>;
}
