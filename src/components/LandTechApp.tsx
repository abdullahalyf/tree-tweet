'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navbar, ActiveNavTab } from '@/components/ui/navbar';
import { WorkspaceIntro } from '@/components/ui/workspaceIntro';
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

function VerificationWorkspace() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveNavTab>(() => {
    const view = new URLSearchParams(window.location.search).get('view');
    return view === 'register' || view === 'tamper' ? view : 'search';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentDagNo, setCurrentDagNo] = useState('');
  const [currentDeedNo, setCurrentDeedNo] = useState<string | undefined>();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [plotData, setPlotData] = useState<CompletePlotData | null>(null);
  const [dataSource, setDataSource] = useState<'demo' | 'supabase'>('demo');
  const [serviceError, setServiceError] = useState(false);
  const searchSequence = useRef(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (dagInput: string, deedInput?: string) => {
    const sequence = ++searchSequence.current;
    const dagNo = normalizeDagNo(dagInput);
    const deedNo = deedInput ? normalizeDeedNo(deedInput) : undefined;
    setIsLoading(true);
    setServiceError(false);
    setHasSearched(true);
    setResult(null);
    setPlotData(null);
    setCurrentDagNo(dagNo || dagInput.trim());
    setCurrentDeedNo(deedNo);

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
      const response = await executeLandVerification({ dagNo, deedNo });
      if (sequence !== searchSequence.current) return;
      if (!response.success) {
        setServiceError(true);
      } else {
        setDataSource(response.source);
        setPlotData(response.plotData);
        setResult(response.result);
      }
      const url = new URL(window.location.href);
      url.searchParams.delete('view');
      if (dagNo) url.searchParams.set('dag', dagNo); else url.searchParams.delete('dag');
      if (deedNo) url.searchParams.set('deed', deedNo); else url.searchParams.delete('deed');
      window.history.replaceState(null, '', url);
    } catch (error) {
      console.error('[Search] Verification failed:', error);
      if (sequence === searchSequence.current) setServiceError(true);
    } finally {
      if (sequence === searchSequence.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dag = params.get('dag');
    const deed = params.get('deed');
    if ((dag || deed) && !params.get('view')) {
      const timer = window.setTimeout(() => { void handleSearch(dag || '', deed || undefined); }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [handleSearch]);

  useEffect(() => {
    if (hasSearched && !isLoading) {
      resultsRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }, [hasSearched, isLoading]);

  const changeTab = (tab: ActiveNavTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    if (tab === 'search') url.searchParams.delete('view'); else url.searchParams.set('view', tab);
    window.history.replaceState(null, '', url);
  };

  const handleReset = () => {
    searchSequence.current++;
    setIsLoading(false);
    setHasSearched(false);
    setResult(null);
    setPlotData(null);
    setCurrentDagNo('');
    setCurrentDeedNo(undefined);
    setServiceError(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('dag');
    url.searchParams.delete('deed');
    window.history.replaceState(null, '', url);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans tree-workspace">
      <a href="#main-content" className="skip-link">{t('মূল বিষয়বস্তুতে যান', 'Skip to main content')}</a>
      <Navbar activeTab={activeTab} onTabChange={changeTab} />
      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {activeTab === 'search' && (
          <div className="space-y-8 animate-fade-in">
            {!hasSearched && <WorkspaceIntro />}
            <SearchForm key={`${currentDagNo}:${currentDeedNo || ''}`} onSearch={handleSearch} isLoading={isLoading} selectedDagNo={currentDagNo} selectedDeedNo={currentDeedNo} />
            {isLoading && (
              <div role="status" className="py-12 flex flex-col items-center justify-center gap-3 text-slate-600">
                <div aria-hidden="true" className="h-10 w-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-sm font-semibold">{t('রেকর্ড সংগ্রহ ও ঝুঁকির পরীক্ষাগুলো চালানো হচ্ছে…', 'Retrieving records and running risk checks…')}</p>
              </div>
            )}
            <div ref={resultsRef} id="results-view" className="scroll-mt-32" aria-busy={isLoading}>
              {serviceError && !isLoading && (
                <div role="alert" className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm space-y-3">
                  <p>{t('রেকর্ড যাচাই করা যায়নি। সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।', 'Records could not be checked. Check your connection and try again.')}</p>
                  <button type="button" onClick={() => void handleSearch(currentDagNo, currentDeedNo)} className="px-4 py-2 rounded-xl border border-rose-300 bg-white font-semibold">{t('পুনরায় চেষ্টা করুন', 'Try again')}</button>
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
      <footer className="border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">TreeTweet · {t('ভূমির তথ্য, পরিষ্কার সিদ্ধান্ত', 'Land records. Clearer decisions.')}</p>
          <p>{t('প্রদর্শিত নমুনা তথ্য কাল্পনিক। এই প্রাথমিক মূল্যায়ন সরকারি মালিকানা সনদ নয়।', 'Sample data is synthetic. This preliminary assessment is not an official ownership certificate.')}</p>
          <p>{t('ডেমো নিবন্ধন এই ব্রাউজারে সংরক্ষিত হয়; এটি স্থায়ী সরকারি বা ক্লাউড রেকর্ড নয়।', 'Demo receipts are saved in this browser; they are not permanent government or cloud records.')}</p>
        </div>
      </footer>
    </div>
  );
}

export default function LandTechApp() {
  return <LanguageProvider><VerificationWorkspace /></LanguageProvider>;
}
