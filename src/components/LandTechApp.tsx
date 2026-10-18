'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, ActiveNavTab } from '@/components/ui/navbar';
import { WorkspaceIntro } from '@/components/ui/workspaceIntro';
import { AmbientParticles } from '@/components/ui/ambientParticles';
import { BuyerGuide } from '@/components/guide/BuyerGuide';
import { GuideDetail } from '@/components/guide/GuideDetail';
import { guideTopicTitles, type GuideTopic } from '@/components/guide/guideTopics';
import { useMotionPreference } from '@/components/guide/useMotionPreference';
import { SearchForm } from '@/components/search/SearchForm';
import { VerificationResultView } from '@/components/verification/VerificationResultView';
import { NoResultView } from '@/components/verification/NoResultView';
import { DemoRegistrationForm } from '@/components/registration/DemoRegistrationForm';
import { TamperDemonstrationView } from '@/components/tamper/TamperDemonstrationView';
import { LanguageProvider, useLanguage } from '@/lib/i18n/LanguageProvider';
import { executeLandVerification } from '@/lib/services/landService';
import { restoreSyntheticDeed } from '@/lib/demo/registry';
import { isSupabaseConfigured } from '@/lib/db/client';
import type { VerificationResult } from '@/lib/verification/types';
import type { CompletePlotData } from '@/lib/db/schema';
import { normalizeDagNo, normalizeDeedNo } from '@/lib/validation/normalize';

function VerificationWorkspace({ guideTopic }: { guideTopic?: GuideTopic }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('guide');
  const [motionPaused, setMotionPaused] = useMotionPreference();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentDagNo, setCurrentDagNo] = useState('');
  const [currentDeedNo, setCurrentDeedNo] = useState<string | undefined>();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [plotData, setPlotData] = useState<CompletePlotData | null>(null);
  const [dataSource, setDataSource] = useState<'demo' | 'supabase'>('demo');
  const [serviceError, setServiceError] = useState<'invalid' | 'unavailable' | null>(null);
  const searchSequence = useRef(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => { searchSequence.current++; }, []);

  const handleSearch = useCallback(async (dagInput: string, deedInput?: string) => {
    const sequence = ++searchSequence.current;
    const dagNo = normalizeDagNo(dagInput);
    const deedNo = deedInput ? normalizeDeedNo(deedInput) : undefined;
    setIsLoading(true);
    setServiceError(null);
    setHasSearched(true);
    setResult(null);
    setPlotData(null);
    setCurrentDagNo(dagInput);
    setCurrentDeedNo(deedInput);
    setActiveTab('search');

    try {
      // Browser-local demo receipts are never presented as live records. Preserve
      // the original hash on restore, so edited stored values still fail integrity.
      if (!isSupabaseConfigured()) {
        try {
          const raw = window.localStorage.getItem('landtech_registered_deeds');
          const cached: unknown = raw ? JSON.parse(raw) : [];
          if (Array.isArray(cached)) {
            for (const deed of cached.slice(-200)) await restoreSyntheticDeed(deed);
          }
        } catch {
          // Storage can be unavailable; fixtures and this session still work.
        }
      }
      // Preserve raw identifiers for validation; an invalid dag must not become
      // a different, deed-only query when normalization rejects its characters.
      const response = await executeLandVerification({ dagNo: dagInput, deedNo: deedInput });
      if (sequence !== searchSequence.current) return;
      if (!response.success) {
        setServiceError(response.errorCode === 'INVALID_INPUT' ? 'invalid' : 'unavailable');
      } else {
        setCurrentDagNo(dagNo);
        setCurrentDeedNo(deedNo);
        setDataSource(response.source);
        setPlotData(response.plotData);
        setResult(response.result);
      }
      if (response.success) {
        const url = new URL(window.location.href);
        url.searchParams.set('view', 'search');
        if (dagNo) url.searchParams.set('dag', dagNo); else url.searchParams.delete('dag');
        if (deedNo) url.searchParams.set('deed', deedNo); else url.searchParams.delete('deed');
        window.history.replaceState(null, '', url);
      }
    } catch (error) {
      console.error('[Search] Verification failed:', error);
      if (sequence === searchSequence.current) setServiceError('unavailable');
    } finally {
      if (sequence === searchSequence.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (guideTopic) return;
    const params = new URLSearchParams(window.location.search);
    const dag = params.get('dag');
    const deed = params.get('deed');
    const view = params.get('view');
    const timer = window.setTimeout(() => {
      if (view === 'register' || view === 'tamper' || view === 'search') setActiveTab(view);
    }, 0);
    if ((dag || deed) && (!view || view === 'search')) {
      window.clearTimeout(timer);
      const searchTimer = window.setTimeout(() => { void handleSearch(dag || '', deed || undefined); }, 0);
      return () => window.clearTimeout(searchTimer);
    }
    return () => window.clearTimeout(timer);
  }, [handleSearch, guideTopic]);

  useEffect(() => {
    if (hasSearched && !isLoading) {
      resultsRef.current?.focus({ preventScroll: true });
      resultsRef.current?.scrollIntoView({ block: 'start', behavior: motionPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }, [hasSearched, isLoading, motionPaused]);

  const changeTab = (tab: ActiveNavTab) => {
    if (guideTopic) {
      searchSequence.current++;
      router.push(tab === 'guide' ? '/' : `/?view=${tab}`);
      return;
    }
    if (tab !== 'search') {
      searchSequence.current++;
      setIsLoading(false);
    }
    setActiveTab(tab);
    const url = new URL(window.location.href);
    if (tab === 'guide') {
      url.searchParams.delete('view');
      url.searchParams.delete('dag');
      url.searchParams.delete('deed');
    } else url.searchParams.set('view', tab);
    window.history.replaceState(null, '', url);
    window.requestAnimationFrame(() => {
      const main = document.getElementById('main-content');
      main?.focus({ preventScroll: true });
      main?.scrollIntoView({ block: 'start', behavior: motionPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  };

  const handleReset = () => {
    searchSequence.current++;
    setIsLoading(false);
    setHasSearched(false);
    setResult(null);
    setPlotData(null);
    setCurrentDagNo('');
    setCurrentDeedNo(undefined);
    setServiceError(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('dag');
    url.searchParams.delete('deed');
    window.history.replaceState(null, '', url);
    // Both result views disappear on reset, and their focused button disappears
    // with them. Resolve the replacement form after React commits the reset.
    window.requestAnimationFrame(() => {
      const input = document.getElementById('dagNoInput');
      input?.focus({ preventScroll: true });
      input?.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans tree-workspace" data-motion={motionPaused ? 'paused' : 'active'}>
      <AmbientParticles />
      <a href="#main-content" className="skip-link">{t('মূল বিষয়বস্তুতে যান', 'Skip to main content')}</a>
      <Navbar activeTab={activeTab} onTabChange={changeTab} />
      <main id="main-content" tabIndex={-1} className={activeTab === 'guide' ? 'scroll-mt-48 flex-1 w-full' : 'scroll-mt-48 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8'}>
        {activeTab === 'guide' && (guideTopic
          ? <GuideDetail topic={guideTopic} onTryDemo={() => changeTab('search')} motionPaused={motionPaused} />
          : <BuyerGuide onTryDemo={() => changeTab('search')} motionPaused={motionPaused} onToggleMotion={() => setMotionPaused(previous => !previous)} />)}
        {activeTab === 'search' && (
          <div className="space-y-8 animate-fade-in">
            {!hasSearched && <WorkspaceIntro />}
            <SearchForm key={`${currentDagNo}:${currentDeedNo || ''}`} onSearch={handleSearch} isLoading={isLoading} selectedDagNo={currentDagNo} selectedDeedNo={currentDeedNo} />
            {isLoading && (
              <div role="status" className="py-12 flex flex-col items-center justify-center gap-3 text-slate-600">
                <div aria-hidden="true" className="h-10 w-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-sm font-semibold">{t('নমুনার তথ্য মিলিয়ে দেখা হচ্ছে…', 'Comparing the sample information…')}</p>
              </div>
            )}
            <div ref={resultsRef} id="results-view" tabIndex={-1} role="region" aria-label={t('অনুসন্ধানের ফলাফল', 'Search results')} aria-live="polite" className="scroll-mt-32" aria-busy={isLoading}>
              {serviceError && !isLoading && (
                <div role="alert" className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm space-y-3">
                  <p>{serviceError === 'invalid' ? t('নমুনার নম্বরটি ঠিক হয়নি। দাগ বা দলিলের নম্বর আবার লিখুন।', 'The sample number is not written correctly. Re-enter the plot or deed number.') : t('রেকর্ড যাচাই করা যায়নি। সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।', 'Records could not be checked. Check your connection and try again.')}</p>
                  {serviceError === 'invalid' ? <button type="button" onClick={() => document.getElementById('dagNoInput')?.focus()} className="px-4 py-2 rounded-xl border border-rose-300 bg-white font-semibold">{t('নম্বর ঠিক করুন', 'Correct the numbers')}</button> : <button type="button" onClick={() => void handleSearch(currentDagNo, currentDeedNo)} className="px-4 py-2 rounded-xl border border-rose-300 bg-white font-semibold">{t('পুনরায় চেষ্টা করুন', 'Try again')}</button>}
                </div>
              )}
              {!isLoading && hasSearched && result && plotData && <VerificationResultView result={result} plotData={plotData} source={dataSource} onReset={handleReset} />}
              {!isLoading && hasSearched && !result && !serviceError && <NoResultView searchedDagNo={currentDagNo} searchedDeedNo={currentDeedNo} onReset={handleReset} />}
            </div>
          </div>
        )}
        {activeTab === 'register' && <DemoRegistrationForm onVerifyDeed={(dag, deed) => { changeTab('search'); void handleSearch(dag, deed); }} />}
        {activeTab === 'tamper' && <TamperDemonstrationView />}
      </main>
      <footer className="mt-10 bg-[#12633e] text-[#fffef9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-9 grid gap-8 md:grid-cols-3">
          <section className="space-y-3" aria-labelledby="footer-project-title">
            <h2 id="footer-project-title" className="font-bold text-xl">TreeTweet</h2>
            <p className="text-sm leading-7">{t('জমি কেনার আগে কাগজ বুঝুন, সঠিক জায়গায় খোঁজ নিন। মালিক, নামজারি, মামলা, খাস ও অধিগ্রহণ—আপনার পাঁচটি প্রথম ধাপ।', 'Understand the papers and know where to ask before buying land. Start with ownership, mutation, cases, khas and acquisition.')}</p>
            <p className="text-sm leading-7">{t('স্বাধীন সহায়ক প্রকল্প। সরকারি ওয়েবসাইট নয়; সরকারি রেকর্ড সরাসরি আনা হয় না।', 'An independent guidance project. This is not a government website and does not retrieve government records.')}</p>
          </section>
          <section aria-labelledby="footer-sources-title">
            <h2 id="footer-sources-title" className="font-bold text-base mb-3">{t('সরকারি তথ্যের উৎস', 'Official information sources')}</h2>
            <ul className="space-y-1 text-sm">
              <li><a className="inline-flex min-h-11 items-center gap-3 underline underline-offset-4" href="https://www.land.gov.bd/" target="_blank" rel="noopener noreferrer">{t('ভূমি মন্ত্রণালয়', 'Ministry of Land')} <span aria-hidden="true">↗</span><span className="sr-only">{t('নতুন ট্যাব', 'new tab')}</span></a></li>
              <li><a className="inline-flex min-h-11 items-center gap-3 underline underline-offset-4" href="https://bhumipedia.land.gov.bd/" target="_blank" rel="noopener noreferrer">{t('প্রকাশনা ও নির্দেশনা', 'Publications and guidance')} <span aria-hidden="true">↗</span><span className="sr-only">{t('নতুন ট্যাব', 'new tab')}</span></a></li>
            </ul>
          </section>
          <section aria-labelledby="footer-help-title" className="space-y-3">
            <h2 id="footer-help-title" className="font-bold text-base">{t('ভূমিসেবার সাহায্য', 'Land service help')}</h2>
            <a href="tel:16122" className="inline-flex min-h-12 items-center gap-3 rounded-lg bg-white/10 px-5 py-2 text-2xl font-bold text-[#fff2bb]"><span aria-hidden="true">☎</span> {t('১৬১২২', '16122')}</a>
            <p className="text-sm leading-7">{t('সরকারি ভূমিসেবা হটলাইন। কলের চার্জ প্রযোজ্য হতে পারে।', 'Government land service hotline. Call charges may apply.')}</p>
          </section>
        </div>
        <div className="border-t border-white/20 px-4 py-5 text-center text-xs leading-6">
          <p>{t('নমুনা পরীক্ষার তথ্য কাল্পনিক। ডেমো নিবন্ধন এই ব্রাউজারে থাকে; এটি স্থায়ী সরকারি রেকর্ড নয়।', 'Sample checker records are synthetic. Demo receipts stay in this browser and are not permanent government records.')}</p>
        </div>
      </footer>
    </div>
  );
}

export default function LandTechApp({ guideTopic }: { guideTopic?: GuideTopic } = {}) {
  return <LanguageProvider pageTitle={guideTopic ? guideTopicTitles[guideTopic] : undefined}><VerificationWorkspace guideTopic={guideTopic} /></LanguageProvider>;
}
