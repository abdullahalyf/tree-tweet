'use client';

import React, { useState } from 'react';
import { VerificationResult } from '@/lib/verification/types';
import { CompletePlotData } from '@/lib/db/schema';
import { StatusBadge } from '../ui/badge';
import { Card, CardBody } from '../ui/card';
import { formatToBanglaDigits } from '@/lib/validation/normalize';

interface VerificationResultViewProps {
  result: VerificationResult;
  plotData?: CompletePlotData;
  source: 'demo' | 'supabase';
  onReset: () => void;
}

export function VerificationResultView({
  result,
  source,
  onReset,
}: VerificationResultViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'next-steps'>('overview');
  const { khatian, plotStatus, deeds, selectedDeed } = result;

  // Determine individual outcomes for the 7 deterministic checks
  const checkStatusMap = {
    hash: !result.issues.some((i) => i.code === 'DEED_HASH_MISMATCH'),
    doubleSale: !result.issues.some((i) => i.code === 'DOUBLE_SALE_DETECTED' || i.code === 'DEED_CANCELLED'),
    sellerMatch: !result.issues.some((i) => i.code === 'SELLER_OWNER_MISMATCH' || i.code === 'SELLER_NAME_VARIATION'),
    area: !result.issues.some((i) => i.code === 'EXCESSIVE_AREA_REQUESTED'),
    mutation: !result.issues.some((i) => i.code === 'MUTATION_NOT_DONE' || i.code === 'MUTATION_PENDING'),
    khas: !result.issues.some((i) => i.code === 'KHAS_LAND_PROHIBITED'),
    encumbrance: !result.issues.some((i) => i.code === 'PLOT_MORTGAGED' || i.code === 'PLOT_COURT_DISPUTE'),
  };

  const checksList = [
    {
      id: 'hash',
      titleBn: '১. দলিল ক্রিপ্টোগ্রাফিক হ্যাশ অখণ্ডতা (SHA-256)',
      pass: checkStatusMap.hash,
      warning: false,
      descBn: checkStatusMap.hash
        ? 'দলিলের ৭টি তথ্যের ডিজিটাল ফিঙ্গারপ্রিন্ট সংরক্ষিত হ্যাশের সাথে সম্পূর্ণ মিলেছে।'
        : 'দলিলের মূল তথ্য পরিবর্তন বা বিকৃতি (টেম্পারিং) শনাক্ত হয়েছে।',
    },
    {
      id: 'doubleSale',
      titleBn: '২. দ্বৈত বিক্রি বা পূর্ববর্তী সক্রিয় হস্তান্তর পরীক্ষা',
      pass: checkStatusMap.doubleSale,
      warning: false,
      descBn: checkStatusMap.doubleSale
        ? 'এই দাগে কোনো বিরোধপূর্ণ বা একাধিক সক্রিয় রেজিস্ট্রিকৃত হস্তান্তর দলিল নেই।'
        : 'উক্ত দাগের বিপরীতে একাধিক সক্রিয় হস্তান্তর দলিল বিদ্যমান (দ্বৈত বিক্রির ঝুঁকি)।',
    },
    {
      id: 'sellerMatch',
      titleBn: '৩. রেকর্ডীয় মালিক ও দলিলের বিক্রেতার মিল',
      pass: checkStatusMap.sellerMatch,
      warning: result.issues.some((i) => i.code === 'SELLER_NAME_VARIATION'),
      descBn: checkStatusMap.sellerMatch
        ? 'খতিয়ানের রেকর্ডীয় মালিক ও দলিলের বিক্রেতার নাম হুবহু মিলেছে।'
        : result.issues.some((i) => i.code === 'SELLER_NAME_VARIATION')
        ? 'নামে পদবী বা বানানের সামান্য পার্থক্য রয়েছে (হলফনামা বা এনআইডি যাচাই আবশ্যক)।'
        : 'রেকর্ডীয় মালিক এবং দলিলের বিক্রেতা সম্পূর্ণ ভিন্ন ব্যক্তি (অননুমোদিত বিক্রেতা)।',
    },
    {
      id: 'area',
      titleBn: '৪. অবশিষ্ট জমি ও বিক্রির প্রস্তাবিত পরিমাণের প্রাপ্যতা',
      pass: checkStatusMap.area,
      warning: false,
      descBn: checkStatusMap.area
        ? 'খতিয়ানের অবশিষ্ট জমিস্বত্ব বিক্রির প্রস্তাবিত পরিমাণের জন্য পর্যাপ্ত রয়েছে।'
        : 'খতিয়ানের অবশিষ্ট জমির চেয়ে বেশি জমি বিক্রির চুক্তি বা প্রস্তাব করা হয়েছে।',
    },
    {
      id: 'mutation',
      titleBn: '৫. নামজারি (মিউটেশন) পর্যালোচনা',
      pass: checkStatusMap.mutation,
      warning: result.issues.some((i) => i.code === 'MUTATION_NOT_DONE' || i.code === 'MUTATION_PENDING'),
      descBn: checkStatusMap.mutation
        ? 'জমির নামজারি ও জমাভাগ রেকর্ড হালনাগাদ সম্পন্ন অবস্থায় আছে।'
        : 'নামজারি সম্পন্ন হয়নি অথবা এখনও প্রক্রিয়াধীনে রয়েছে।',
    },
    {
      id: 'khas',
      titleBn: '৬. খাস বা সরকারি জমি পরীক্ষা',
      pass: checkStatusMap.khas,
      warning: false,
      descBn: checkStatusMap.khas
        ? 'জমিটি সাধারণ ব্যক্তি মালিকানাধীন (সরকারি খাস জমি নয়)।'
        : 'জমিটি সরকারের খাস খতিয়ানভুক্ত (ব্যক্তিপর্যায়ে হস্তান্তর আইনত দণ্ডনীয়)।',
    },
    {
      id: 'encumbrance',
      titleBn: '৭. ব্যাংক বন্ধক ও আদালতের মোকদ্দমা স্থিতি',
      pass: checkStatusMap.encumbrance,
      warning: result.issues.some((i) => i.code === 'PLOT_MORTGAGED'),
      descBn: checkStatusMap.encumbrance
        ? 'জমির উপর কোনো সক্রিয় ব্যাংক বন্ধক বা আদালতের মামলা রিপোর্ট নেই।'
        : result.issues.some((i) => i.code === 'PLOT_COURT_DISPUTE')
        ? 'জমির উপর বিজ্ঞ আদালতে দেওয়ানি মোকদ্দমা বা স্থগিতাদেশ বিদ্যমান।'
        : 'জমিটি ব্যাংক বা আর্থিক প্রতিষ্ঠানে বন্ধক রাখা হয়েছে।',
    },
  ];

  const overallStyles = {
    GREEN: {
      border: 'border-emerald-300 bg-emerald-50/60',
      headerBg: 'bg-emerald-800 text-white',
      accentColor: 'text-emerald-700',
    },
    YELLOW: {
      border: 'border-amber-300 bg-amber-50/60',
      headerBg: 'bg-amber-800 text-white',
      accentColor: 'text-amber-700',
    },
    RED: {
      border: 'border-rose-300 bg-rose-50/60',
      headerBg: 'bg-rose-900 text-white',
      accentColor: 'text-rose-700',
    },
  }[result.overallStatus];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">দাগ নম্বর:</span>
          <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-sm sm:text-base">
            {result.dagNo}
          </span>
          {khatian && (
            <span className="text-xs text-slate-600 font-medium">
              (মৌজা: {khatian.mouza})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Source Tag */}
          <span
            className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
              source === 'supabase'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {source === 'supabase' ? '🌐 সুপাবেজ ডাটাবেজ রেকর্ড' : '🧪 লোকাল ডেমো রেকর্ড (Demo Mode)'}
          </span>

          <button
            onClick={onReset}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            ← নতুন অনুসন্ধান
          </button>
        </div>
      </div>

      {/* Primary Traffic-Light Status Card */}
      <Card className={`border-2 ${overallStyles.border} overflow-hidden shadow-lg`}>
        <div className={`p-6 sm:p-8 ${overallStyles.headerBg} space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs tracking-wider uppercase font-semibold text-white/80 block">
                প্রাথমিক প্রযুক্তিগত মূল্যায়ন ফলাফল
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {result.overallStatus === 'GREEN' && 'প্রদত্ত রেকর্ডে নির্ধারিত পরীক্ষায় ঝুঁকি শনাক্ত হয়নি'}
                {result.overallStatus === 'YELLOW' && 'সতর্কতা — অতিরিক্ত যাচাই প্রয়োজন'}
                {result.overallStatus === 'RED' && 'গুরুতর ঝুঁকি শনাক্ত হয়েছে'}
              </h2>
            </div>

            <StatusBadge status={result.overallStatus} size="lg" fullLabel={false} />
          </div>

          <p className="text-sm sm:text-base text-white/95 leading-relaxed bg-black/15 p-4 rounded-xl border border-white/10 font-medium">
            {result.summaryBn}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200/80 bg-white px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            ৭টি চেকলিস্ট ও কারণ ({result.issues.length > 0 ? `${result.issues.length}টি বিষয়` : 'সব পাস'})
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'records'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            রেকর্ড বিবরণী (খতিয়ান ও দলিল)
          </button>
          <button
            onClick={() => setActiveTab('next-steps')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'next-steps'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            পরবর্তী করণীয় ও আইনি সুরক্ষা
          </button>
        </div>

        <CardBody className="p-6 space-y-6 bg-white">
          {/* TAB 1: 7 DETERMINISTIC CHECKS & REASONS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Specific Issues / Warnings Alert List */}
              {result.issues.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span>🚩</span>
                    <span>শনাক্তকৃত অসঙ্গতি ও ঝুঁকির কারণসমূহ:</span>
                  </h3>
                  <div className="space-y-2.5">
                    {result.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-sm ${
                          issue.severity === 'CRITICAL'
                            ? 'bg-rose-50 border-rose-200 text-rose-950'
                            : 'bg-amber-50 border-amber-200 text-amber-950'
                        }`}
                      >
                        <span
                          className={`inline-flex items-center justify-center h-6 w-6 rounded-full font-bold text-xs shrink-0 mt-0.5 ${
                            issue.severity === 'CRITICAL'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {issue.severity === 'CRITICAL' ? '✕' : '⚠'}
                        </span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base">
                              {issue.titleBn}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                                issue.severity === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                            >
                              {issue.severity === 'CRITICAL' ? 'গুরুতর ঝুঁকি' : 'সতর্কতা'}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                            {issue.descriptionBn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist Breakdown */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span>📋</span>
                  <span>৭টি নির্ধারিত পরীক্ষার বিস্তারিত ফলাফল:</span>
                </h3>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {checksList.map((check) => (
                    <div
                      key={check.id}
                      className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="font-bold text-xs sm:text-sm text-slate-800">
                          {check.titleBn}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {check.descBn}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {check.pass ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                            <span>✓</span>
                            <span>পাস (সঠিক)</span>
                          </span>
                        ) : check.warning ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                            <span>⚠</span>
                            <span>সতর্কতা</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                            <span>✕</span>
                            <span>ব্যর্থ (ঝুঁকি)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED RECORDS */}
          {activeTab === 'records' && (
            <div className="space-y-6">
              {/* Khatian Details */}
              {khatian ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center justify-between">
                    <span>রেকর্ডীয় খতিয়ান তথ্য (সরকারি রেজিস্ট্রি ডেটা)</span>
                    <span className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      দাগ: {khatian.dag_no}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-xs p-4 gap-y-4">
                    <div className="px-3 space-y-1">
                      <span className="text-slate-400 block font-medium">রেকর্ডীয় মালিকের নাম</span>
                      <span className="font-bold text-slate-800 text-sm">{khatian.owner_name}</span>
                    </div>
                    <div className="px-3 space-y-1">
                      <span className="text-slate-400 block font-medium">মৌজা ও এলাকা</span>
                      <span className="font-bold text-slate-800 text-sm">{khatian.mouza}</span>
                    </div>
                    <div className="px-3 space-y-1">
                      <span className="text-slate-400 block font-medium">জমির ধরন</span>
                      <span
                        className={`font-bold inline-block px-2 py-0.5 rounded text-xs ${
                          khatian.land_type === 'khas'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {khatian.land_type === 'khas' ? 'সরকারি খাস জমি (ক্রয় নিষিদ্ধ)' : 'সাধারণ ব্যক্তি মালিকানাধীন'}
                      </span>
                    </div>
                    <div className="px-3 space-y-1">
                      <span className="text-slate-400 block font-medium">মোট জমি</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {formatToBanglaDigits(khatian.total_area.toFixed(4))} শতক ({khatian.total_area} decimal)
                      </span>
                    </div>
                    <div className="px-3 space-y-1">
                      <span className="text-slate-400 block font-medium">অবশিষ্ট জমি</span>
                      <span className="font-bold text-emerald-800 text-sm font-mono">
                        {formatToBanglaDigits(khatian.remaining_area.toFixed(4))} শতক
                      </span>
                    </div>
                    <div className="px-3 space-y-1">
                      <span className="text-slate-400 block font-medium">নামজারি (মিউটেশন) অবস্থা</span>
                      <span
                        className={`font-bold inline-block px-2 py-0.5 rounded text-xs ${
                          khatian.mutation_status === 'done'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {khatian.mutation_status === 'done'
                          ? 'সম্পন্ন (Done)'
                          : khatian.mutation_status === 'pending'
                          ? 'প্রক্রিয়াধীন (Pending)'
                          : 'অসম্পূর্ণ (None)'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 text-rose-800 text-xs">
                  কোনো খতিয়ান রেকর্ড পাওয়া যায়নি।
                </div>
              )}

              {/* Plot Encumbrance Details */}
              {plotStatus && (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 font-bold text-slate-800 text-xs uppercase tracking-wider">
                    আইনি ও আর্থিক স্থিতি (Encumbrance Status)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 p-4 text-xs gap-y-3">
                    <div className="px-3 space-y-1">
                      <span className="text-slate-400 block font-medium">ব্যাংক বন্ধক (Mortgaged)</span>
                      <span
                        className={`font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 ${
                          plotStatus.mortgaged
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {plotStatus.mortgaged ? '⚠ জমি বন্ধকযুক্ত রয়েছে' : '✓ কোনো বন্ধক নেই'}
                      </span>
                    </div>
                    <div className="px-3 space-y-1">
                      <span className="text-slate-400 block font-medium">আদালতের মামলা বা মোকদ্দমা</span>
                      <span
                        className={`font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 ${
                          plotStatus.court_case
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {plotStatus.court_case ? '✕ আদালতে মামলা বিচারাধীন রয়েছে' : '✓ কোনো মোকদ্দমা নেই'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Deeds List */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>হস্তান্তর দলিলের ইতিহাস ({deeds.length}টি দলিল)</span>
                  <span className="text-[11px] text-slate-500 font-normal">সাব-রেজিস্ট্রি রেকর্ড</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {deeds.map((deed) => (
                    <div key={deed.id} className="p-4 space-y-2.5 text-xs hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                            {deed.deed_no}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              deed.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {deed.status === 'active' ? 'সক্রিয় (Active)' : 'বাতিল (Cancelled)'}
                          </span>
                          {selectedDeed?.deed_no === deed.deed_no && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              অনুসন্ধানকৃত দলিল
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 font-medium">রেজিস্ট্রির তারিখ: {deed.date}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                        <div>
                          <span className="text-slate-400 block text-[11px]">বিক্রেতা</span>
                          <span className="font-bold">{deed.seller}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">ক্রেতা</span>
                          <span className="font-bold">{deed.buyer}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">জমির পরিমাণ</span>
                          <span className="font-bold font-mono">{deed.area.toFixed(4)} শতক</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>ক্রিপ্টোগ্রাফিক SHA-256 হ্যাশ:</span>
                          <span className="font-mono text-[10px] text-slate-400 truncate max-w-xs">
                            পূর্ববর্তী: {deed.prev_hash || 'GENESIS'}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] break-all text-slate-800 bg-white p-1.5 rounded border border-slate-200">
                          {deed.hash}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NEXT STEPS & CITIZEN GUIDANCE */}
          {activeTab === 'next-steps' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-emerald-900 text-base flex items-center gap-2">
                  <span>🧭</span>
                  <span>জমি ক্রয়ের পূর্বে নাগরিকের পরবর্তী করণীয় ও অনুসন্ধানের ধাপ:</span>
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">
                  <li>
                    <strong>সহকারী কমিশনার (ভূমি) অফিস:</strong> সংশ্লিষ্ট উপজেলা বা সার্কেল এসি ল্যান্ড অফিসে গিয়ে মূল খতিয়ান, ১ নং খাস খতিয়ান এবং নামজারি পর্চা তল্লাশি দিন।
                  </li>
                  <li>
                    <strong>সাব-রেজিস্ট্রি অফিসে তল্লাশি (Search):</strong> বিগত ১২ বা ২৫ বছরের বালাম বই তল্লাশি করে নিশ্চিত হোন যে বিক্রেতা ইতিপূর্বে জমিটি অন্য কারও কাছে বিক্রি করেছেন কিনা।
                  </li>
                  <li>
                    <strong>এনআইডি ও নামজারি খতিয়ান যাচাই:</strong> বিক্রেতার জাতীয় পরিচয়পত্রের নাম ও খতিয়ানের নামের স্পেলিং নিখুঁতভাবে মেলান। পদবীর অমিল থাকলে ১ম শ্রেণির ম্যাজিস্ট্রেট বা নোটারি পাবলিকের হলফনামা দাবি করুন।
                  </li>
                  <li>
                    <strong>ব্যাংকের দায়মুক্তি সনদ (NOC):</strong> জমিতে কোনো বন্ধক থাকলে ব্যাংক কর্তৃক ইস্যুকৃত মূল দায়মুক্তি সনদপত্র ব্যতীত কোনো বায়নানামা করবেন না।
                  </li>
                  <li>
                    <strong>আদালতের মিসকেস বা মোকদ্দমা:</strong> দেওয়ানি আদালতে কোনো বাটোয়ারা বা স্বত্ব মামলা চলমান রয়েছে কিনা স্থানীয় আইনজীবীর মাধ্যমে খোঁজ নিন।
                  </li>
                </ol>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Mandatory Legal Disclaimer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3.5 shadow-sm">
        <span className="text-2xl text-amber-600 shrink-0 mt-0.5">⚠️</span>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
          {result.disclaimerBn}
        </p>
      </div>
    </div>
  );
}
