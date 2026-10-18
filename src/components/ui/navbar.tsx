'use client';

import React, { useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export type ActiveNavTab = 'guide' | 'search' | 'register' | 'tamper';
interface NavbarProps {
  activeTab?: ActiveNavTab;
  onTabChange?: (tab: ActiveNavTab) => void;
}

export function Navbar({ activeTab = 'guide', onTabChange }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const tools = useRef<HTMLDetailsElement>(null);
  const toolSummary = useRef<HTMLElement>(null);
  const tabs: { id: ActiveNavTab; bn: string; en: string }[] = [
    { id: 'search', bn: 'নমুনা রেকর্ড যাচাই', en: 'Check sample records' },
    { id: 'register', bn: 'নমুনা দলিল তৈরি', en: 'Create a sample deed' },
    { id: 'tamper', bn: 'তথ্য বদলালে কী হয় দেখুন', en: 'See what happens when data changes' },
  ];
  const selectTab = (tab: ActiveNavTab) => {
    if (tools.current) tools.current.open = false;
    onTabChange?.(tab);
    toolSummary.current?.focus();
  };
  return (
    <header className="workspace-header">
      <div className="workspace-topbar">
        <div className="workspace-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none"><path d="M16 26V15m0 5L9 16m7 1 7-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M7 14C7 7 16 5 25 5c0 10-4 16-11 16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M6 27h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
          <div><p className="brand-name">TreeTweet<span className="brand-dot">.</span></p><p className="brand-subtitle">{t('জমির তথ্য মিলিয়ে দেখুন', 'Check land records')}</p></div>
        </div>
        <div className="language-switch" role="group" aria-label={t('ভাষা নির্বাচন', 'Choose language')}>
          <button type="button" lang="bn" aria-pressed={language === 'bn'} onClick={() => setLanguage('bn')}>বাংলা</button>
          <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button>
        </div>
      </div>
      <div className="workspace-nav-row">
        {onTabChange && <nav className="workspace-nav" aria-label={t('মূল নেভিগেশন', 'Main navigation')}>
          <button className="primary-workspace-action" type="button" aria-current={activeTab === 'guide' ? 'page' : undefined} onClick={() => { if (tools.current) tools.current.open = false; onTabChange('guide'); }}>{t('জমি কেনার আগে যাচাই', 'Check before you buy')}</button>
          <details ref={tools} className="demo-tools" onKeyDown={event => { if (event.key === 'Escape' && tools.current?.open) { tools.current.open = false; toolSummary.current?.focus(); } }}>
            <summary ref={toolSummary} className={activeTab !== 'guide' ? 'demo-tools-active' : undefined}><span>{t('ডেমো টুল', 'Demo tools')}{activeTab !== 'guide' && <span className="tool-current-label">{activeTab === 'register' ? t('নমুনা দলিল', 'Sample deed') : activeTab === 'search' ? t('নমুনা যাচাই', 'Sample checker') : t('তথ্য বদল পরীক্ষা', 'Data change test')}</span>}</span><span aria-hidden="true">⌄</span></summary>
            <div className="demo-tools-panel" role="group" aria-label={t('নমুনা নিয়ে পরীক্ষা করুন', 'Explore the sample tools')}>
              <p>{t('শুধু নমুনা তথ্য নিয়ে পরীক্ষা', 'For trying sample records only')}</p>
              {tabs.map(tab => <button key={tab.id} type="button" aria-current={activeTab === tab.id ? 'page' : undefined} onClick={() => selectTab(tab.id)}>{t(tab.bn, tab.en)}{activeTab === tab.id && <span className="tool-current-label">{t('এখন খোলা', 'Open now')}</span>}</button>)}
            </div>
          </details>
        </nav>}
        <span className="prototype-label"><span aria-hidden="true" />{activeTab === 'guide' ? t('সরকারি সেবায় যাওয়ার পথ', 'Guide to government services') : t('নমুনা তথ্য', 'Sample records')}</span>
      </div>
    </header>
  );
}
