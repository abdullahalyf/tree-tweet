'use client';

import React, { useState } from 'react';
import { Card, CardBody } from '../ui/card';
import { DeedRecord } from '@/lib/db/schema';
import { registerSyntheticDeedAction } from '@/lib/actions/registerDeed';
import { normalizeDagNo, parseBanglaNumber, formatToBanglaDigits } from '@/lib/validation/normalize';

interface DemoRegistrationFormProps {
  onVerifyDeed: (dagNo: string, deedNo: string) => void;
}

export function DemoRegistrationForm({ onVerifyDeed }: DemoRegistrationFormProps) {
  const [deedNo, setDeedNo] = useState('');
  const [dagNo, setDagNo] = useState('');
  const [seller, setSeller] = useState('');
  const [buyer, setBuyer] = useState('');
  const [area, setArea] = useState('');
  const [date, setDate] = useState('2026-03-15');
  const [prevHash, setPrevHash] = useState('GENESIS-0000-0000-0000-000000000001');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredDeed, setRegisteredDeed] = useState<DeedRecord | null>(null);
  const [canonicalPayload, setCanonicalPayload] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Quick-fill sample synthetic deed for judges
  const handleQuickFill = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setDeedNo(`DEED-2026-${randomSuffix}`);
    setDagNo(`0909`);
    setSeller('কাল্পনিক খন্দকার মোস্তফা');
    setBuyer('কাল্পনিক রেজওয়ান হক');
    setArea('৭.৫০');
    setDate('2026-03-20');
    setPrevHash('GENESIS-0000-0000-0000-000000000001');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const normDag = normalizeDagNo(dagNo);
    const cleanDeedNo = deedNo.trim().toUpperCase();
    const cleanSeller = seller.trim();
    const cleanBuyer = buyer.trim();
    const numArea = parseBanglaNumber(area);

    if (!cleanDeedNo) {
      setErrorMessage('দলিল নম্বর লিখুন (উদাঃ DEED-2026-9001)।');
      return;
    }
    if (!normDag) {
      setErrorMessage('দাগ নম্বর লিখুন (উদাঃ ০৯০৯ বা 0909)।');
      return;
    }
    if (!cleanSeller) {
      setErrorMessage('বিক্রেতার নাম লিখুন।');
      return;
    }
    if (!cleanBuyer) {
      setErrorMessage('ক্রেতার নাম লিখুন।');
      return;
    }
    if (numArea === null || isNaN(numArea) || numArea <= 0) {
      setErrorMessage('জমির পরিমাণ একটি বৈধ ধনাত্মক সংখ্যা হতে হবে (উদাঃ ৫.৫০)।');
      return;
    }
    if (!date) {
      setErrorMessage('দলিল সম্পাদনের তারিখ নির্বাচন করুন।');
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerSyntheticDeedAction({
        deed_no: cleanDeedNo,
        dag_no: normDag,
        seller: cleanSeller,
        buyer: cleanBuyer,
        area: numArea,
        date,
        prev_hash: prevHash.trim(),
      });

      if (!response.success || !response.deed) {
        setErrorMessage(response.error || 'দলিল নিবন্ধনে ত্রুটি ঘটেছে।');
      } else {
        setRegisteredDeed(response.deed);
        setCanonicalPayload(response.canonicalPayload || null);
        setQrDataUrl(response.qrDataUrl || null);

        // Safe client persistence across server restarts / browser sessions
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const raw = window.localStorage.getItem('landtech_registered_deeds');
            const arr = raw ? JSON.parse(raw) : [];
            const filtered = arr.filter((d: { deed_no: string }) => d.deed_no !== response.deed!.deed_no);
            filtered.push(response.deed);
            window.localStorage.setItem('landtech_registered_deeds', JSON.stringify(filtered));
          } catch (e) {
            console.warn('[LocalStorage] Custom deed cache error:', e);
          }
        }
      }
    } catch (err) {
      console.error('[Registration] Submit error:', err);
      setErrorMessage('সার্ভারের সাথে যোগাযোগে অপ্রত্যাশিত ত্রুটি ঘটেছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRegisteredDeed(null);
    setCanonicalPayload(null);
    setQrDataUrl(null);
    setErrorMessage(null);
    handleQuickFill();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Title & Official Hackathon Prototype Notice */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <span>📝</span>
          <span>প্রটোটাইপ দলিল নিবন্ধক (Synthetic Registration)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ডেমো দলিল নিবন্ধন
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          নতুন কাল্পনিক দলিলের তথ্য যুক্ত করুন। সিস্টেমটি স্বয়ংক্রিয়ভাবে সার্ভার-সাইড{' '}
          <strong className="text-emerald-800 font-mono">SHA-256</strong> ক্রিপ্টোগ্রাফিক হ্যাশ তৈরি করবে এবং
          যাচাইকরণ লিংক সম্বলিত QR কোড তৈরি করবে।
        </p>
      </div>

      {/* Mandatory Statutory Demonstration Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-sm text-amber-950 text-xs sm:text-sm leading-relaxed">
        <span className="text-xl text-amber-600 shrink-0">⚠️</span>
        <div className="space-y-1">
          <p className="font-bold text-amber-900">
            সরকারি স্বীকৃতি সম্পর্কিত সতর্কবার্তা:
          </p>
          <p className="text-amber-800">
            এটি শুধুমাত্র হ্যাকাথন প্রটোটাইপের ক্রিপ্টোগ্রাফিক অখণ্ডতা প্রদর্শনের জন্য তৈরি কাল্পনিক ডেমো ব্যবস্থা।
            এই সিস্টেমে দলিল তৈরি বা নিবন্ধন করা কোনো সরকারি সাব-রেজিস্ট্রি রেজিস্ট্রেশন বা নামজারি (Mutation) অনুমোদন
            নয়। কোনো আসল এনআইডি, মোবাইল বা ব্যক্তিগত রেকর্ড প্রদান করবেন না।
          </p>
        </div>
      </div>

      {!registeredDeed ? (
        /* REGISTRATION FORM */
        <Card className="border-slate-200 shadow-md overflow-hidden bg-white">
          <CardBody className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <span>📄</span>
                <span>দলিলের তথ্যাবলী পূরণ করুন</span>
              </h3>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
              >
                ✨ দ্রুত নমুনা তথ্য পূরণ করুন (Judge Preset)
              </button>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-medium flex items-center gap-2 animate-fade-in">
                <span>✕</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Deed Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    দলিল নম্বর (Deed No) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={deedNo}
                    onChange={(e) => setDeedNo(e.target.value)}
                    placeholder="উদাঃ DEED-2026-9001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 uppercase"
                    required
                  />
                  <p className="text-[11px] text-slate-400">অনন্য শনাক্তকারী দলিল নম্বর</p>
                </div>

                {/* Dag Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    দাগ নম্বর (Dag No) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={dagNo}
                    onChange={(e) => setDagNo(e.target.value)}
                    placeholder="উদাঃ ০৯০৯ বা 0909"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    required
                  />
                  <p className="text-[11px] text-slate-400">বাংলা বা ইংরেজি সংখ্যা (শূন্যসহ)</p>
                </div>

                {/* Seller Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    বিক্রেতার নাম (Seller Name) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                    placeholder="উদাঃ কাল্পনিক কামাল উদ্দিন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    required
                  />
                  <p className="text-[11px] text-slate-400">কাল্পনিক নাম প্রদান করুন</p>
                </div>

                {/* Buyer Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    ক্রেতার নাম (Buyer Name) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={buyer}
                    onChange={(e) => setBuyer(e.target.value)}
                    placeholder="উদাঃ কাল্পনিক শফিকুর রহমান"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    required
                  />
                  <p className="text-[11px] text-slate-400">প্রস্তাবিত ক্রেতার নাম</p>
                </div>

                {/* Land Area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    জমির পরিমাণ শতকে (Area in Decimal) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="উদাঃ ৫.৫০ বা 5.50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    required
                  />
                  <p className="text-[11px] text-slate-400">শতক (Decimal) এককে সংখ্যা</p>
                </div>

                {/* Registration Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    রেজিস্ট্রেশনের তারিখ (Date) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    required
                  />
                  <p className="text-[11px] text-slate-400">YYYY-MM-DD ফরম্যাট</p>
                </div>
              </div>

              {/* Previous Hash */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 block">
                  পূর্ববর্তী দলিলের হ্যাশ (Previous Deed Hash)
                </label>
                <input
                  type="text"
                  value={prevHash}
                  onChange={(e) => setPrevHash(e.target.value)}
                  placeholder="GENESIS-0000-0000-0000-000000000001"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                <p className="text-[11px] text-slate-400">
                  ঐচ্ছিক। প্রথম হস্তান্তরের ক্ষেত্রে জেনেসিস ভ্যালু ব্যবহৃত হবে।
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>সার্ভারে হ্যাশ তৈরি ও নিবন্ধন হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>🔐</span>
                      <span>সার্ভার হ্যাশ তৈরি ও ডেমো দলিল নিবন্ধন করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : (
        /* REGISTRATION SUCCESS VIEW WITH HASH & QR CODE */
        <Card className="border-emerald-300 bg-emerald-50/30 shadow-xl overflow-hidden animate-fade-in">
          <div className="bg-emerald-800 text-white p-6 sm:p-7 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-wider uppercase font-semibold text-emerald-200">
                সফল ডেমো নিবন্ধন
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-700 border border-emerald-500 text-white">
                ✓ হ্যাশ যাচাইকৃত
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              দলিলটি সফলভাবে নিবন্ধিত ও হ্যাশ কোডিং সম্পন্ন হয়েছে
            </h3>
            <p className="text-xs text-emerald-100">
              নিচে সার্ভার-সাইড জেনারেটেড SHA-256 ফিঙ্গারপ্রিন্ট এবং ডেমো যাচাইকরণ QR কোড দেখুন।
            </p>
          </div>

          <CardBody className="p-6 sm:p-8 space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column: Deed Details & Hash */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-2">
                  📋 দলিলের মূল রেকর্ডীয় তথ্য
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">দলিল নম্বর</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {registeredDeed.deed_no}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">দাগ নম্বর</span>
                    <span className="font-mono font-bold text-emerald-800 text-sm">
                      {registeredDeed.dag_no}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">বিক্রেতা</span>
                    <span className="font-bold text-slate-800">{registeredDeed.seller}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">ক্রেতা</span>
                    <span className="font-bold text-slate-800">{registeredDeed.buyer}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">জমির পরিমাণ</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {formatToBanglaDigits(registeredDeed.area.toFixed(4))} শতক
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">তারিখ</span>
                    <span className="font-medium text-slate-700">{registeredDeed.date}</span>
                  </div>
                </div>

                {/* Canonical Serialization Payload */}
                {canonicalPayload && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                      ক্যানোনিকাল পে-লোড স্ট্রিং (Canonical Serialization):
                    </span>
                    <code className="block font-mono text-[11px] text-slate-700 break-all bg-white p-2 rounded border border-slate-200">
                      {canonicalPayload}
                    </code>
                  </div>
                )}

                {/* Server-Side Computed SHA-256 Hash */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
                    <span>🔐 ক্রিপ্টোগ্রাফিক SHA-256 হ্যাশ (সার্ভার গণনাকৃত):</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded font-mono">
                      64 HEX CHARACTERS
                    </span>
                  </div>
                  <code className="block font-mono text-xs text-emerald-950 break-all bg-white p-2 rounded border border-emerald-200 font-bold">
                    {registeredDeed.hash}
                  </code>
                </div>
              </div>

              {/* Right Column: QR Code & Actions */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  যাচাইকরণ QR কোড
                </span>

                {qrDataUrl ? (
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt={`QR code for deed ${registeredDeed.deed_no}`}
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-slate-200 rounded-2xl text-slate-400">
                    QR কোড লোড হচ্ছে...
                  </div>
                )}

                <div className="space-y-1 max-w-xs">
                  <p className="text-xs text-slate-600 font-medium">
                    এই QR কোডটি স্ক্যান করলে সরাসরি এই সিস্টেমের উক্ত দলিলের রেকর্ড ও ৭টি পরীক্ষা প্রদর্শিত হবে।
                  </p>
                  <p className="text-[10px] text-amber-700 leading-tight">
                    ⚠️ এটি শুধুমাত্র ডেমো অ্যাপ্লিকেশনের রেকর্ড রেফারেন্স; কোনো সরকারি মালিকানা স্বত্ব নয়।
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {qrDataUrl && (
                    <a
                      href={qrDataUrl}
                      download={`qr-${registeredDeed.deed_no}.png`}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      💾 QR ডাউনলোড
                    </a>
                  )}

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    🖨️ প্রিন্ট করুন
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Verification Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                + আরেকটি ডেমো দলিল নিবন্ধন করুন
              </button>

              <button
                type="button"
                onClick={() => onVerifyDeed(registeredDeed.dag_no, registeredDeed.deed_no)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔍</span>
                <span>এই দলিলটি অবিলম্বে যাচাই করুন →</span>
              </button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
