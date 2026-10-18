'use client';

import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function WorkspaceIntro() {
  const { t } = useLanguage();
  return (
    <section className="workspace-intro" aria-labelledby="workspace-title">
      <div>
        <p className="workspace-eyebrow"><span aria-hidden="true">↳</span> {t('কেনার আগে, রেকর্ড মিলিয়ে দেখুন', 'Before you buy, check the records')}</p>
        <h1 id="workspace-title">{t('জমির তথ্য। ঝুঁকির স্পষ্ট চিত্র।', 'Land records. A clearer view of risk.')}</h1>
        <p className="workspace-description">{t('দাগ বা দলিল নম্বর দিয়ে শুরু করুন, অথবা নিচের ৮টি কাল্পনিক কেস পরীক্ষা করুন।', 'Start with a plot or deed number, or explore the 8 synthetic cases below.')}</p>
      </div>
      <div className="workspace-boundary"><span className="boundary-icon" aria-hidden="true">i</span><p>{t('প্রাথমিক ঝুঁকি মূল্যায়ন। সরকারি যাচাই বা মালিকানার নিশ্চয়তা নয়।', 'Preliminary risk assessment. No government verification or ownership guarantee.')}</p></div>
    </section>
  );
}
