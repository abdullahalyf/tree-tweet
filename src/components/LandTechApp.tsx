'use client';

// Filter out third-party browser extension hydration mismatches (Bitdefender bis_skin_checked) and React 19 script warnings
if (typeof window !== 'undefined') {
  const origError = console.error;
  console.error = function (...args: unknown[]) {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const str = typeof arg === 'string' ? arg : (arg && typeof arg === 'object' && 'message' in arg ? String(arg.message) : '');
      if (
        str.includes('bis_skin_checked') ||
        str.includes('bis_register') ||
        str.includes('Encountered a script tag')
      ) {
        return;
      }
    }
    return origError.apply(console, args);
  };
}

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveNavTab } from '@/components/ui/navbar';
import { SearchForm } from '@/components/search/SearchForm';
import { VerificationResultView } from '@/components/verification/VerificationResultView';
import { NoResultView } from '@/components/verification/NoResultView';
import { DemoRegistrationForm } from '@/components/registration/DemoRegistrationForm';
import { TamperDemonstrationView } from '@/components/tamper/TamperDemonstrationView';
import { executeLandVerification } from '@/lib/services/landService';
import { VerificationResult } from '@/lib/verification/types';
import { CompletePlotData } from '@/lib/db/schema';
import { normalizeDagNo, normalizeDeedNo } from '@/lib/validation/normalize';

export default function LandTechApp() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlView = params.get('view');
      if (urlView === 'register') return 'register';
      if (urlView === 'tamper') return 'tamper';
    }
    return 'search';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentDagNo, setCurrentDagNo] = useState('');
  const [currentDeedNo, setCurrentDeedNo] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [plotData, setPlotData] = useState<CompletePlotData | null>(null);
  const [dataSource, setDataSource] = useState<'demo' | 'supabase'>('demo');
  const [serviceError, setServiceError] = useState<string | null>(null);

  const handleSearch = React.useCallback(async (dagInput: string, deedInput?: string) => {
    setIsLoading(true);
    setServiceError(null);
    setHasSearched(true);

    const normalizedDag = normalizeDagNo(dagInput);
    const normalizedDeed = deedInput ? normalizeDeedNo(deedInput) : undefined;

    setCurrentDagNo(normalizedDag || dagInput.trim());
    setCurrentDeedNo(normalizedDeed);

    try {
      let response = await executeLandVerification({
        dagNo: normalizedDag,
        deedNo: normalizedDeed,
      });

      // Resilient fallback: if server memory was restarted or isolated, restore from client's localStorage
      if (!response.plotData && typeof window !== 'undefined' && window.localStorage) {
        try {
          const raw = window.localStorage.getItem('landtech_registered_deeds');
          if (raw) {
            const arr = JSON.parse(raw);
            const cachedMatch = arr.find((d: { dag_no: string; deed_no: string }) => 
              (normalizedDeed && d.deed_no.toUpperCase() === normalizedDeed.toUpperCase()) ||
              (normalizedDag && d.dag_no === normalizedDag)
            );
            if (cachedMatch) {
              const { registerSyntheticDeedAction } = await import('@/lib/actions/registerDeed');
              await registerSyntheticDeedAction({
                deed_no: cachedMatch.deed_no,
                dag_no: cachedMatch.dag_no,
                seller: cachedMatch.seller,
                buyer: cachedMatch.buyer,
                area: cachedMatch.area,
                date: cachedMatch.date,
                prev_hash: cachedMatch.prev_hash,
              });
              response = await executeLandVerification({
                dagNo: normalizedDag,
                deedNo: normalizedDeed,
              });
            }
          }
        } catch (e) {
          console.warn('[CacheFallback] Error reading localStorage:', e);
        }
      }

      if (!response.success && response.error) {
        setServiceError(response.error);
        setResult(null);
        setPlotData(null);
      } else {
        setDataSource(response.source);
        setPlotData(response.plotData);
        setResult(response.result);
      }
    } catch (err) {
      console.error('[Search] Verification execution error:', err);
      setServiceError('যাচাইকরণ প্রক্রিয়ায় অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      setResult(null);
      setPlotData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check URL search params on client mount for QR code deep-links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlDag = params.get('dag');
    const urlDeed = params.get('deed');

    if (urlDag || urlDeed) {
      const timer = setTimeout(() => {
        handleSearch(urlDag || '', urlDeed || undefined);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [handleSearch]);

  const handleReset = () => {
    setHasSearched(false);
    setResult(null);
    setPlotData(null);
    setCurrentDagNo('');
    setCurrentDeedNo(undefined);
    setServiceError(null);
  };

  const handleVerifyFromRegistration = (dagNo: string, deedNo: string) => {
    setActiveTab('search');
    handleSearch(dagNo, deedNo);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" suppressHydrationWarning>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* VIEW 1: SEARCH & VERIFICATION */}
        {activeTab === 'search' && (
          <div className="space-y-8 animate-fade-in">
            <SearchForm
              onSearch={handleSearch}
              isLoading={isLoading}
              selectedDagNo={currentDagNo}
              selectedDeedNo={currentDeedNo}
            />

            {/* Loading Spinner Indicator */}
            {isLoading && (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-600 animate-fade-in">
                <div className="h-10 w-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-sm font-semibold text-slate-700">
                  রেকর্ড সংগ্রহ ও ৭টি আইনি পরীক্ষা যাচাই করা হচ্ছে...
                </p>
              </div>
            )}

            {/* Service Error Alert */}
            {serviceError && !isLoading && (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-medium flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl text-rose-600">⚠️</span>
                  <span>{serviceError}</span>
                </div>
                <button
                  onClick={() => setServiceError(null)}
                  className="text-xs px-3 py-1 bg-white hover:bg-rose-100 rounded-lg border border-rose-200 font-semibold transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            )}

            {/* Verification Result View (when record is found) */}
            {!isLoading && hasSearched && result && plotData && (
              <div id="results-view" className="scroll-mt-6">
                <VerificationResultView
                  result={result}
                  plotData={plotData}
                  source={dataSource}
                  onReset={handleReset}
                />
              </div>
            )}

            {/* No Result View (when Dag is unknown in demo/database) */}
            {!isLoading && hasSearched && !result && !serviceError && (
              <NoResultView
                searchedDagNo={currentDagNo}
                searchedDeedNo={currentDeedNo}
                onReset={handleReset}
              />
            )}
          </div>
        )}

        {/* VIEW 2: DEMO DEED REGISTRATION & QR GENERATOR */}
        {activeTab === 'register' && (
          <div className="animate-fade-in">
            <DemoRegistrationForm onVerifyDeed={handleVerifyFromRegistration} />
          </div>
        )}

        {/* VIEW 3: TAMPER DEMONSTRATION & SIMULATED MUTATION */}
        {activeTab === 'tamper' && (
          <div className="animate-fade-in">
            <TamperDemonstrationView />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            LandTech Innovation Hackathon 2026 • Problem P5: Check Before You Buy
          </p>
          <p className="text-slate-400">
            প্রদর্শিত সকল নাম, মৌজা, দাগ ও দলিল নম্বর কাল্পনিক এবং প্রযুক্তিগত মূল্যায়নের জন্য তৈরি।
          </p>
        </div>
      </footer>
    </div>
  );
}
