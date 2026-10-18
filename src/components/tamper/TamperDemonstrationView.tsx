'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Card, CardBody } from '../ui/card';
import { DeedRecord, KhatianRecord } from '@/lib/db/schema';
import { createDeedPayload, verifyDeedIntegrity } from '@/lib/verification/hash';
import { DEMO_SCENARIOS } from '@/lib/demo/fixtures';


export function TamperDemonstrationView() {
  const { t, language } = useLanguage();
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

  const fieldName = tamperedField?.includes('ক্রেতা') ? t('ক্রেতার নাম', 'Buyer name') : tamperedField?.includes('পরিমাণ') ? t('জমির পরিমাণ', 'Land area') : t('দাগ নম্বর', 'Plot number');
  const displayValue = (value: string | null) => language === 'en' ? value?.replace('শতক', 'decimal') : value;
  return <div className="mx-auto max-w-4xl space-y-6">
    <div className="space-y-2"><h2 className="text-2xl font-bold">{t('দলিল টেম্পারিং ও নিরাপত্তা ডেমো', 'Deed tampering and integrity lab')}</h2><p className="text-sm text-slate-600">{t('দলিলের তথ্য বদলালে সংরক্ষিত SHA-256 হ্যাশের সাথে কীভাবে অমিল হয় দেখুন।', 'See how changing deed data causes a mismatch with its stored SHA-256 fingerprint.')}</p></div>
    <p className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">{t('শুধু একটি অস্থায়ী কপি পরিবর্তন হয়। মূল আটটি কাল্পনিক নমুনা ও ডাটাবেজের রেকর্ড অপরিবর্তিত থাকে।', 'Only a disposable copy changes. The eight original synthetic samples and database records remain unchanged.')}</p>
    <Card><CardBody className="p-5 sm:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold">{t('পরীক্ষাধীন দলিল', 'Deed under test')}</h3><p className="font-mono text-sm">{disposableDeed.deed_no} · {disposableDeed.dag_no}</p></div><button onClick={handleResetDisposable} className="rounded-xl border px-4 py-2 text-sm">{t('মূল কপি ফিরিয়ে আনুন', 'Reset disposable copy')}</button></div>
      <div className="grid gap-3 sm:grid-cols-3"><button onClick={handleTamperArea} className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-left text-sm font-semibold">{t('১. জমির পরিমাণ বদলান', '1. Change area')}<span className="mt-1 block text-xs font-normal">{t('৫.০০ → ৮.৫০ শতক', '5.00 → 8.50 decimal')}</span></button><button onClick={handleTamperBuyer} className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-left text-sm font-semibold">{t('২. ক্রেতার নাম বদলান', '2. Change buyer')}<span className="mt-1 block text-xs font-normal">{t('কাল্পনিক ভিন্ন ক্রেতা', 'A different synthetic buyer')}</span></button><button onClick={handleTamperDag} className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-left text-sm font-semibold">{t('৩. দাগ নম্বর বদলান', '3. Change plot number')}<span className="mt-1 block text-xs font-normal">0101 → 0999</span></button></div>
      <div className="rounded-xl border bg-slate-50 p-4 space-y-3"><h4 className="font-bold text-sm">{tamperedField ? t('পরিবর্তিত অস্থায়ী রেকর্ড', 'Modified disposable record') : t('অপরিবর্তিত অস্থায়ী রেকর্ড', 'Unmodified disposable record')}</h4><dl className="grid gap-3 text-sm sm:grid-cols-2">{[[t('বিক্রেতা', 'Seller'),disposableDeed.seller],[t('ক্রেতা', 'Buyer'),disposableDeed.buyer],[t('জমি (শতক)', 'Area (decimal)'),disposableDeed.area.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', {minimumFractionDigits:4})],[t('তারিখ', 'Date'),disposableDeed.date]].map(([label,value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="font-semibold break-words">{value}</dd></div>)}</dl></div>
      {tamperedField && <div role="status" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm space-y-2"><h4 className="font-bold">{t('তথ্য পরিবর্তন শনাক্ত', 'Data change detected')}: {fieldName}</h4><p>{t('মূল মান', 'Original')}: {displayValue(tamperOriginalValue)}</p><p>{t('পরিবর্তিত মান', 'Modified')}: {displayValue(tamperNewValue)}</p></div>}
      <div className="space-y-2"><h4 className="text-sm font-bold">{t('সংরক্ষিত মূল হ্যাশ', 'Stored reference hash')}</h4><code className="block break-all rounded-xl border bg-slate-50 p-3 text-xs">{verificationResult.storedHash}</code></div>
      <div className="space-y-2"><h4 className="text-sm font-bold">{t('বর্তমান তথ্যের গণনাকৃত হ্যাশ', 'Calculated fingerprint of current data')}</h4><p className={`text-sm font-semibold ${verificationResult.isValid ? 'text-emerald-800' : 'text-rose-800'}`}>{!verificationResult.tested ? t('মূল রেফারেন্স — এখনও পরিবর্তন পরীক্ষা হয়নি', 'Original reference — no change tested yet') : verificationResult.isValid ? t('হ্যাশ মিলে গেছে', 'Fingerprint matches') : t('অমিল — DEED_HASH_MISMATCH', 'Mismatch — DEED_HASH_MISMATCH')}</p><code className="block break-all rounded-xl border bg-slate-50 p-3 text-xs">{verificationResult.expectedHash}</code></div>
      <details className="rounded-xl border p-3"><summary className="text-sm font-semibold cursor-pointer">{t('ক্যানোনিকাল তথ্য দেখুন', 'View canonical input')}</summary><code className="mt-3 block break-all text-xs">{verificationResult.canonicalPayload}</code></details>
      <p className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed">{t('SHA-256 একটি একমুখী ফিঙ্গারপ্রিন্ট। ক্যানোনিকাল তথ্যের সামান্য পরিবর্তনও হ্যাশকে সম্পূর্ণ বদলে দেয়। হ্যাশ অমিল ডিজিটাল তথ্যের পার্থক্য বোঝায়; এটি আইনি জালিয়াতির চূড়ান্ত প্রমাণ নয়।', 'SHA-256 produces a one-way fingerprint. A small change in canonical input changes the fingerprint. A mismatch indicates different digital data; it is not conclusive legal proof of fraud.')}</p>
    </CardBody></Card>
    <Card><CardBody className="p-5 sm:p-7 space-y-4"><h3 className="text-lg font-bold">{t('নামজারির সফটওয়্যার সিমুলেশন', 'Software simulation of mutation')}</h3><p className="text-sm text-slate-600">{t('ডেমো অনুমোদন দিয়ে অস্থায়ী নামজারি অবস্থা বদলান। এটি সরকারি সেবা নয়।', 'Change a temporary mutation status with a demo approval. This is not a government service.')}</p><p role="status" className="font-semibold text-sm">{simulatedKhatian.mutation_status === 'done' ? t('নামজারি সম্পন্ন (সিমুলেশন)', 'Mutation complete (simulation)') : t('নামজারি প্রক্রিয়াধীন (সিমুলেশন)', 'Mutation pending (simulation)')}</p>{mutationMemo && <p className="text-xs break-all">{t('ডেমো স্মারক', 'Demo reference')}: {mutationMemo}</p>}{!mutationApproved ? <button onClick={handleSimulateMutationApproval} className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white">{t('ডেমো নামজারি অনুমোদন', 'Simulate mutation approval')}</button> : <button onClick={handleResetMutation} className="rounded-xl border px-4 py-3 text-sm">{t('নামজারি সিমুলেশন রিসেট', 'Reset mutation simulation')}</button>}<p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-950">{t('কোনো সরকারি অফিসের সাথে সংযোগ নেই। এটি সরকারি রেকর্ড বদলায় না এবং মালিকানা অনুমোদন করে না।', 'No government office is connected. This does not change official records or approve ownership.')}</p></CardBody></Card>
  </div>;
}
