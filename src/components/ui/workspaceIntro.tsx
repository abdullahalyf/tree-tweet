'use client';

import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function WorkspaceIntro() {
  const { t } = useLanguage();
  return (
    <section className="workspace-intro" aria-labelledby="workspace-title">
      <div>
        <h1 id="workspace-title">{t('জমি কিনবেন? আগে তথ্য মিলিয়ে নিন', 'Buying land? Check the records first')}</h1>
        <p className="workspace-description">{t('দাগ বা দলিল নম্বর দিন। চাইলে নমুনা দিয়ে চেষ্টা করুন।', 'Enter a plot or deed number, or try a sample.')}</p>
      </div>
      <div className="workspace-boundary"><span className="boundary-icon" aria-hidden="true">i</span><p>{t('এসব বানানো নমুনা তথ্য। সরকারি সংযোগ নেই; মালিকানার প্রমাণ নয়।', 'These records are made-up samples. No government connection; no proof of ownership.')}</p></div>
    </section>
  );
}
