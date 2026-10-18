'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export type ActiveNavTab = 'search' | 'register' | 'tamper';
interface NavbarProps {
  activeTab?: ActiveNavTab;
  onTabChange?: (tab: ActiveNavTab) => void;
}

export function Navbar({ activeTab = 'search', onTabChange }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const tabs: { id: ActiveNavTab; bn: string; en: string; number: string }[] = [
    { id: 'search', bn: 'জমি যাচাই', en: 'Verify land', number: '01' },
    { id: 'register', bn: 'ডেমো নিবন্ধন', en: 'Demo registration', number: '02' },
    { id: 'tamper', bn: 'পরিবর্তন পরীক্ষা', en: 'Tamper lab', number: '03' },
  ];
  return (
    <header className="workspace-header">
      <div className="workspace-topbar">
        <div className="workspace-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none"><path d="M16 26V15m0 5L9 16m7 1 7-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M7 14C7 7 16 5 25 5c0 10-4 16-11 16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M6 27h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
          <div><p className="brand-name">TreeTweet<span className="brand-dot">.</span></p><p className="brand-subtitle">{t('জমির ঝুঁকি মূল্যায়ন', 'Land risk assessment')}</p></div>
        </div>
        <div className="language-switch" role="group" aria-label={t('ভাষা নির্বাচন', 'Choose language')}>
          <button type="button" lang="bn" aria-pressed={language === 'bn'} onClick={() => setLanguage('bn')}>বাংলা</button>
          <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button>
        </div>
      </div>
      <div className="workspace-nav-row">
        {onTabChange && <nav className="workspace-nav" aria-label={t('মূল নেভিগেশন', 'Main navigation')}>
          {tabs.map(tab => <button key={tab.id} type="button" aria-current={activeTab === tab.id ? 'page' : undefined} onClick={() => onTabChange(tab.id)}><span className="nav-number" aria-hidden="true">{tab.number}</span><span>{t(tab.bn, tab.en)}</span></button>)}
        </nav>}
        <span className="prototype-label"><span aria-hidden="true" />{t('কাল্পনিক ডেটা · প্রোটোটাইপ', 'Synthetic data · Prototype')}</span>
      </div>
    </header>
  );
}
