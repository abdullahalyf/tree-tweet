'use client';

import React, { useState } from 'react';
import { Card, CardBody } from '../ui/card';
import { DeedRecord, KhatianRecord } from '@/lib/db/schema';
import { createDeedPayload, verifyDeedIntegrity } from '@/lib/verification/hash';
import { DEMO_SCENARIOS } from '@/lib/demo/fixtures';
import { formatToBanglaDigits } from '@/lib/validation/normalize';

export function TamperDemonstrationView() {
  // Select baseline Case A deed as the safe sample
  const baseDeed = DEMO_SCENARIOS[0].deeds[0]; // Case A deed
  const baseKhatian = DEMO_SCENARIOS[0].khatian;

  // Disposable copy state
  const [disposableDeed, setDisposableDeed] = useState<DeedRecord>({ ...baseDeed });
  const [tamperedField, setTamperedField] = useState<string | null>(null);
  const [tamperOriginalValue, setTamperOriginalValue] = useState<string | null>(null);
  const [tamperNewValue, setTamperNewValue] = useState<string | null>(null);

  // Verification result for disposable deed
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    isValid: boolean;
    expectedHash: string;
    storedHash: string;
    canonicalPayload: string;
  }>({
    tested: false,
    isValid: true,
    expectedHash: baseDeed.hash,
    storedHash: baseDeed.hash,
    canonicalPayload: createDeedPayload(baseDeed),
  });

  // Simulated Mutation State
  const [simulatedKhatian, setSimulatedKhatian] = useState<KhatianRecord>({ ...baseKhatian, mutation_status: 'pending' });
  const [mutationApproved, setMutationApproved] = useState(false);
  const [mutationMemo, setMutationMemo] = useState<string | null>(null);

  // Alter Land Area in disposable copy
  const handleTamperArea = async () => {
    const originalArea = disposableDeed.area;
    const alteredArea = 8.5; // Fraudulent attempt to inflate area

    const copy: DeedRecord = {
      ...disposableDeed,
      area: alteredArea,
      // CRITICAL: We do NOT recalculate stored hash! The old hash remains stored.
    };

    const integrity = await verifyDeedIntegrity(copy);
    const payload = createDeedPayload(copy);

    setDisposableDeed(copy);
    setTamperedField('জমির পরিমাণ (Area)');
    setTamperOriginalValue(`${originalArea.toFixed(4)} শতক`);
    setTamperNewValue(`${alteredArea.toFixed(4)} শতক`);
    setVerificationResult({
      tested: true,
      isValid: integrity.isValid,
      expectedHash: integrity.expectedHash,
      storedHash: integrity.storedHash,
      canonicalPayload: payload,
    });
  };

  // Alter Buyer Name in disposable copy
  const handleTamperBuyer = async () => {
    const originalBuyer = disposableDeed.buyer;
    const alteredBuyer = 'কাল্পনিক অজ্ঞাত ব্যক্তি (ভুয়া ক্রেতা)';

    const copy: DeedRecord = {
      ...disposableDeed,
      buyer: alteredBuyer,
    };

    const integrity = await verifyDeedIntegrity(copy);
    const payload = createDeedPayload(copy);

    setDisposableDeed(copy);
    setTamperedField('ক্রেতার নাম (Buyer Name)');
    setTamperOriginalValue(originalBuyer);
    setTamperNewValue(alteredBuyer);
    setVerificationResult({
      tested: true,
      isValid: integrity.isValid,
      expectedHash: integrity.expectedHash,
      storedHash: integrity.storedHash,
      canonicalPayload: payload,
    });
  };

  // Alter Dag Number in disposable copy
  const handleTamperDag = async () => {
    const originalDag = disposableDeed.dag_no;
    const alteredDag = '0999';

    const copy: DeedRecord = {
      ...disposableDeed,
      dag_no: alteredDag,
    };

    const integrity = await verifyDeedIntegrity(copy);
    const payload = createDeedPayload(copy);

    setDisposableDeed(copy);
    setTamperedField('দাগ নম্বর (Dag No)');
    setTamperOriginalValue(originalDag);
    setTamperNewValue(alteredDag);
    setVerificationResult({
      tested: true,
      isValid: integrity.isValid,
      expectedHash: integrity.expectedHash,
      storedHash: integrity.storedHash,
      canonicalPayload: payload,
    });
  };

  // Discard disposable copy and restore baseline
  const handleResetDisposable = () => {
    const freshCopy: DeedRecord = { ...baseDeed };
    setDisposableDeed(freshCopy);
    setTamperedField(null);
    setTamperOriginalValue(null);
    setTamperNewValue(null);
    setVerificationResult({
      tested: false,
      isValid: true,
      expectedHash: baseDeed.hash,
      storedHash: baseDeed.hash,
      canonicalPayload: createDeedPayload(baseDeed),
    });
  };

  // Simulated Mutation Approval Workflow
  const handleSimulateMutationApproval = () => {
    const memo = `MUT-DEMO-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setSimulatedKhatian((prev) => ({
      ...prev,
      mutation_status: 'done',
    }));
    setMutationApproved(true);
    setMutationMemo(memo);
  };

  const handleResetMutation = () => {
    setSimulatedKhatian({ ...baseKhatian, mutation_status: 'pending' });
    setMutationApproved(false);
    setMutationMemo(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
          <span>🛡️</span>
          <span>ক্রিপ্টোগ্রাফিক সুরক্ষা ও প্রমাণিকরণ সিমুলেশন</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          দলিল টেম্পারিং ও নিরাপত্তা ডেমো
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          দেখুন কীভাবে দলিলের একটি মাত্র তথ্য বা বর্ণ পরিবর্তন করলে সংরক্ষিত{' '}
          <strong className="text-slate-900 font-mono">SHA-256</strong> ক্রিপ্টোগ্রাফিক হ্যাশের সাথে অমিল ঘটে এবং
          প্রযুক্তিগতভাবে তাত্ক্ষণিক ঝুঁকি চিহ্নিত হয়।
        </p>
      </div>

      {/* Safety Notice regarding Disposable Copies */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-sm">
        <span className="text-xl text-blue-600 shrink-0">ℹ️</span>
        <div className="space-y-0.5">
          <p className="font-bold text-blue-900">
            নিরাপদ পরীক্ষামূলক কপি (Disposable Demonstration Copy):
          </p>
          <p className="text-blue-800">
            এই প্রদর্শনীতে একটি সাময়িক ডিসপোজেবল কপি ব্যবহার করা হয়। মূল ৮টি সিন্থেটিক ডেটা বা ডাটাবেজ রেকর্ড অক্ষত
            ও অপরিবর্তিত থাকে।
          </p>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE TAMPERING LAB */}
      <Card className="border-slate-200 shadow-md overflow-hidden bg-white">
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              পরীক্ষাধীন দলিল রেকর্ড
            </span>
            <h3 className="text-lg font-bold">
              দলিল: <span className="font-mono text-emerald-400">{disposableDeed.deed_no}</span> (দাগ:{' '}
              <span className="font-mono text-emerald-400">{disposableDeed.dag_no}</span>)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDisposable}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              🔄 ডিসপোজ / রিসেট করুন
            </button>
          </div>
        </div>

        <CardBody className="p-6 sm:p-8 space-y-6">
          {/* Tamper Control Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              একটি তথ্য অননুমোদিতভাবে পরিবর্তন করে দেখুন (Simulation):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleTamperArea}
                className="p-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 text-rose-900 text-xs font-semibold text-left transition-all flex flex-col justify-between cursor-pointer"
              >
                <span className="font-bold">১. জমির পরিমাণ বিকৃতি</span>
                <span className="text-[11px] text-rose-700 font-mono mt-1">৫.০০ শতক → ৮.৫০ শতক</span>
              </button>

              <button
                type="button"
                onClick={handleTamperBuyer}
                className="p-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 text-rose-900 text-xs font-semibold text-left transition-all flex flex-col justify-between cursor-pointer"
              >
                <span className="font-bold">২. ক্রেতার নাম পরিবর্তন</span>
                <span className="text-[11px] text-rose-700 mt-1">রফিকুল → ভুয়া ক্রেতা</span>
              </button>

              <button
                type="button"
                onClick={handleTamperDag}
                className="p-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 text-rose-900 text-xs font-semibold text-left transition-all flex flex-col justify-between cursor-pointer"
              >
                <span className="font-bold">৩. দাগ নম্বর পরিবর্তন</span>
                <span className="text-[11px] text-rose-700 font-mono mt-1">০১০১ → ০৯৯৯</span>
              </button>
            </div>
          </div>

          {/* Current State of the Deed */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>দলিলের বর্তমান তথ্যাবলী (মেমরি কপি):</span>
              {tamperedField ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  ⚠️ বিকৃত রেকর্ড (Tampered)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ অপরিবর্তিত মূল রেকর্ড (Original)
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">বিক্রেতা</span>
                <span className="font-bold text-slate-800">{disposableDeed.seller}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">ক্রেতা</span>
                <span
                  className={`font-bold ${
                    tamperedField?.includes('ক্রেতা') ? 'text-rose-600 bg-rose-50 px-1 rounded' : 'text-slate-800'
                  }`}
                >
                  {disposableDeed.buyer}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">জমির পরিমাণ</span>
                <span
                  className={`font-mono font-bold ${
                    tamperedField?.includes('পরিমাণ') ? 'text-rose-600 bg-rose-50 px-1 rounded' : 'text-slate-800'
                  }`}
                >
                  {formatToBanglaDigits(disposableDeed.area.toFixed(4))} শতক
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">তারিখ</span>
                <span className="text-slate-700">{disposableDeed.date}</span>
              </div>
            </div>
          </div>

          {/* Tamper Comparison Banner */}
          {tamperedField && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <span>✕</span>
                <span>তথ্য বিকৃতি শনাক্ত: {tamperedField}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-rose-200">
                  <span className="text-slate-400 block text-[11px]">মূল আসল মান:</span>
                  <span className="font-bold text-slate-800">{tamperOriginalValue}</span>
                </div>
                <div className="p-2.5 bg-rose-100/50 rounded-xl border border-rose-300">
                  <span className="text-rose-700 block text-[11px]">অননুমোদিত পরিবর্তিত মান:</span>
                  <span className="font-bold text-rose-900">{tamperNewValue}</span>
                </div>
              </div>
            </div>
          )}

          {/* Cryptographic Hash Comparison & Explanation */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <span>🔐</span>
              <span>ক্রিপ্টোগ্রাফিক SHA-256 হ্যাশ অখণ্ডতা যাচাই:</span>
            </h4>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>সংরক্ষিত মূল হ্যাশ (Stored Reference Hash):</span>
                  <span className="text-[10px] text-slate-400">অপরিবর্তিত রেফারেন্স</span>
                </div>
                <div className="text-slate-800 break-all bg-white p-2 rounded border border-slate-200">
                  {verificationResult.storedHash}
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border space-y-1 ${
                  verificationResult.isValid
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50 border-rose-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-sans font-bold">
                  <span className={verificationResult.isValid ? 'text-emerald-900' : 'text-rose-900'}>
                    বর্তমান তথ্যের গণনাকৃত হ্যাশ (Recalculated SHA-256):
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      verificationResult.isValid
                        ? 'bg-emerald-200 text-emerald-950'
                        : 'bg-rose-200 text-rose-950'
                    }`}
                  >
                    {verificationResult.isValid ? '✓ মিল পাওয়া গেছে (Valid)' : '✕ অমিল (DEED_HASH_MISMATCH)'}
                  </span>
                </div>
                <div
                  className={`break-all p-2 rounded border font-bold ${
                    verificationResult.isValid
                      ? 'bg-white text-emerald-950 border-emerald-200'
                      : 'bg-white text-rose-950 border-rose-300'
                  }`}
                >
                  {verificationResult.expectedHash}
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>💡</span>
                <span>প্রযুক্তিগত ব্যাখ্যা ও নাগরিক শিক্ষা:</span>
              </div>
              <p>
                ক্রিপ্টোগ্রাফিক হ্যাশ ফাংশন (SHA-256) একমুখী এবং অত্যন্ত সংবেদনশীল (Avalanche Effect)। দলিলের ৭টি
                ক্যানোনিকাল ফিল্ডের যেকোনো একটি অক্ষর, কমা বা সংখ্যা পরিবর্তন করা হলে উৎপাদিত হ্যাশটি পুরোপুরি পাল্টে
                যায়।
              </p>
              <p className="text-slate-500 text-[11px]">
                ⚠️ <strong>আইনি সতর্কতা:</strong> হ্যাশ অমিল নির্দেশ করে যে সংরক্ষিত ডিজিটাল রেকর্ডের সাথে বর্তমান দলিলের
                তথ্যগত অখণ্ডতা মিলছে না; এটি স্বয়ংক্রিয়ভাবে আইনি জালিয়াতির চূড়ান্ত প্রমাণ নয়, তবে অতিরিক্ত অনুসন্ধান ও
                সতর্কতার দ্ব্যর্থহীন সংকেত।
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* SECTION 2: OPTIONAL FEATURE - SIMULATED MUTATION APPROVAL WORKFLOW */}
      <Card className="border-slate-200 shadow-md overflow-hidden bg-white">
        <div className="bg-teal-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider block">
              ঐচ্ছিক ফিচার (Simulated Workflow)
            </span>
            <h3 className="text-lg font-bold">
              সিমুলেটেড নামজারি (Mutation) প্রক্রিয়া
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded bg-teal-800 border border-teal-700 text-teal-100 font-medium">
              সফটওয়্যার সিমুলেশন
            </span>
          </div>
        </div>

        <CardBody className="p-6 sm:p-8 space-y-5">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ভূমি রেজিস্ট্রেশনের পর নামজারি (মিউটেশন) প্রক্রিয়া কীভাবে মালিকানা হালনাগাদ করে তা বিচারকদের দেখানোর জন্য
            এই সিমুলেশনটি তৈরি।
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-slate-400 block text-xs">বর্তমান নামজারি স্থিতি:</span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    simulatedKhatian.mutation_status === 'done'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {simulatedKhatian.mutation_status === 'done'
                    ? '✓ নামজারি সম্পন্ন (Done)'
                    : '⚠ নামজারি প্রক্রিয়াধীন (Pending)'}
                </span>
                {mutationMemo && (
                  <span className="font-mono text-xs text-slate-600 bg-white px-2 py-1 rounded border">
                    স্মারক: {mutationMemo}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!mutationApproved ? (
                <button
                  type="button"
                  onClick={handleSimulateMutationApproval}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🏛️</span>
                  <span>ডেমো নামজারি অনুমোদন</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetMutation}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  🔄 পুনরায় মুল অবস্থায় নিন
                </button>
              )}
            </div>
          </div>

          <p className="text-[11px] text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed">
            ⚠️ <strong>আইনি সতর্কবার্তা:</strong> এটি শুধুমাত্র একটি সফটওয়্যার সিমুলেশন। এটি কোনো সহকারী কমিশনার (ভূমি)
            বা সরকারি কার্যালয়ের সাথে সংযুক্ত নয় এবং কোনো সরকারি রেকর্ড অনুমোদন করে না।
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
