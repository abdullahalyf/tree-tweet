'use client';

import React, { useState } from 'react';
import { DEMO_SCENARIOS, DemoScenario } from '@/lib/demo/fixtures';
import { QRScannerModal } from './QRScannerModal';

interface SearchFormProps {
  onSearch: (dagNo: string, deedNo?: string) => void;
  isLoading: boolean;
  selectedDagNo?: string;
  selectedDeedNo?: string;
}

export function SearchForm({
  onSearch,
  isLoading,
  selectedDagNo = '',
  selectedDeedNo = '',
}: SearchFormProps) {
  const [dagInput, setDagInput] = useState(selectedDagNo);
  const [deedInput, setDeedInput] = useState(selectedDeedNo);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(Boolean(selectedDeedNo));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedDag = dagInput.trim();
    const trimmedDeed = deedInput.trim();

    if (!trimmedDag && !trimmedDeed) {
      setValidationError('অনুগ্রহ করে একটি দাগ নম্বর (যেমন: ০১০১ বা 0101) লিখুন।');
      return;
    }

    onSearch(trimmedDag, trimmedDeed || undefined);
  };

  const handleSelectScenario = (scenario: DemoScenario) => {
    setDagInput(scenario.dagNo);
    setDeedInput(scenario.deedNo);
    setValidationError(null);
    onSearch(scenario.dagNo, scenario.deedNo);
  };

  const handleQRScanSuccess = (scannedDag: string, scannedDeed?: string) => {
    setDagInput(scannedDag);
    if (scannedDeed) setDeedInput(scannedDeed);
    setValidationError(null);
    onSearch(scannedDag, scannedDeed);
  };

  return (
    <section className="space-y-6">
      <QRScannerModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onScanSuccess={handleQRScanSuccess}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
            <span>LandTech Innovation Hackathon 2026</span>
            <span>•</span>
            <span>Problem P5: Check Before You Buy</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            জমি কেনার আগে ঝুঁকি যাচাই করুন
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            সাধারণ জমি ক্রেতাদের প্রতারণা ও ঝুঁকি থেকে সুরক্ষিত রাখতে প্রাক-ক্রয় প্রাথমিক তথ্য
            যাচাইকরণ ব্যবস্থা। এই সিস্টেমটি উপলভ্য ডেমো রেকর্ড বিশ্লেষণ করে সম্ভাব্য আইনি ও তথ্যগত ঝুঁকি
            চিহ্নিত করে; এটি সরকারের কোনো অফিসিয়াল মালিকানা সনদ নয়।
          </p>
        </div>
      </div>

      {/* Main Search Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="dagNoInput"
                className="block text-sm font-bold text-slate-800"
              >
                জমির দাগ নম্বর লিখুন <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsQRModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
              >
                <span>📷 QR স্ক্যান করুন</span>
              </button>
            </div>

            <div className="relative">
              <input
                id="dagNoInput"
                type="text"
                value={dagInput}
                onChange={(e) => {
                  setDagInput(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="যেমন: ০১০১ বা 0101 (বাংলা বা ইংরেজি সংখ্যা লিখুন)"
                className="w-full text-base sm:text-lg px-4 sm:px-5 py-3.5 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 font-medium"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-slate-500">
              নোট: দাগ নম্বরের শুরুতে শূন্য থাকলে (যেমন <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">০১০১</code>) তা অক্ষুণ্ণ রাখা হবে।
            </p>
          </div>

          {/* Optional Deed Number Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>{showAdvanced ? '− দলিল নম্বর লুকান' : '+ দলিল নম্বর যুক্ত করুন (ঐচ্ছিক)'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-1.5 animate-fade-in">
                <label
                  htmlFor="deedNoInput"
                  className="block text-xs font-semibold text-slate-700"
                >
                  দলিল রেজিস্ট্রেশন নম্বর (ঐচ্ছিক)
                </label>
                <input
                  id="deedNoInput"
                  type="text"
                  value={deedInput}
                  onChange={(e) => setDeedInput(e.target.value)}
                  placeholder="যেমন: DEED-2024-0001"
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="text-rose-600 text-base">⚠️</span>
              <span>{validationError}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-base font-bold shadow-lg shadow-emerald-700/20 disabled:opacity-60 disabled:pointer-events-none transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>ঝুঁকি যাচাই করুন (Check Risks)</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 8 Demo Scenarios Quick-Select Matrix */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯</span>
              <span>দ্রুত ডেমো কেস বেছে নিন (হ্যাকথন বিচারক প্রদর্শনী):</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              ১ ক্লিকে টেস্ট লোড করুন
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {DEMO_SCENARIOS.map((sc) => {
              const badgeColors = {
                GREEN: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                YELLOW: 'bg-amber-50 text-amber-800 border-amber-200',
                RED: 'bg-rose-50 text-rose-800 border-rose-200',
              }[sc.expectedStatus];

              const icon = {
                GREEN: '✓',
                YELLOW: '⚠',
                RED: '✕',
              }[sc.expectedStatus];

              const isSelected = dagInput === sc.dagNo;

              return (
                <button
                  key={sc.code}
                  type="button"
                  onClick={() => handleSelectScenario(sc)}
                  className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/10 shadow-sm'
                      : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="font-bold text-xs text-slate-800">
                      কেস {sc.code} (দাগ: <span className="font-mono">{sc.dagNo}</span>)
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-0.5 ${badgeColors}`}
                    >
                      <span>{icon}</span>
                      <span>{sc.expectedStatus}</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {sc.taglineBn}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
