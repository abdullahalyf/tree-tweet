'use client';

import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function WorkspaceIntro() {
  const { t } = useLanguage();
  return (
    <section className="workspace-intro" aria-labelledby="workspace-title">
      <div>
        <h1 id="workspace-title">{t('নমুনা দিয়ে জমির তথ্যের অমিল বুঝুন', 'Explore land-record differences with samples')}</h1>
        <p className="workspace-description">{t('আটটি নমুনা থেকে বেছে নিন, অথবা আপনার বানানো নমুনার নম্বর দিন। আসল জমির তথ্য দেবেন না।', 'Choose one of the eight samples or enter a number from your own made-up example. Do not enter real land information.')}</p>
      </div>
      <div className="workspace-boundary"><span className="boundary-icon" aria-hidden="true">i</span><p>{t('এসব বানানো নমুনা তথ্য। সরকারি সংযোগ নেই; মালিকানার প্রমাণ নয়।', 'These records are made-up samples. No government connection; no proof of ownership.')}</p></div>
    </section>
  );
}
