'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Card, CardBody } from '../ui/card';
import { DeedRecord } from '@/lib/db/schema';
import { findDeedByDeedNo, restoreSyntheticDeed } from '@/lib/demo/registry';
import { registerSyntheticDeedAction } from '@/lib/actions/registerDeed';
import { normalizeDagNo, normalizeDeedNo, parseBanglaNumber } from '@/lib/validation/normalize';

interface DemoRegistrationFormProps {
  onVerifyDeed: (dagNo: string, deedNo: string) => void;
}

export function DemoRegistrationForm({ onVerifyDeed }: DemoRegistrationFormProps) {
  const { t, language } = useLanguage();
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
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);

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
    const cleanDeedNo = normalizeDeedNo(deedNo);
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
      // Identifiers belong to this browser, not a shared anonymous server registry.
      try {
        const raw = window.localStorage.getItem('landtech_registered_deeds');
        const cached: unknown = raw ? JSON.parse(raw) : [];
        if (Array.isArray(cached)) {
          for (const deed of cached.slice(-200)) await restoreSyntheticDeed(deed);
        }
      } catch { /* The in-memory demo still works without browser storage. */ }
      if (findDeedByDeedNo(cleanDeedNo)) {
        setErrorMessage('DUPLICATE_DEED');
        return;
      }
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
        setErrorMessage('errorCode' in response && typeof response.errorCode === 'string' ? response.errorCode : 'REGISTRATION_FAILED');
      } else {
        if (!await restoreSyntheticDeed(response.deed)) {
          setErrorMessage('REGISTRY_FULL');
          return;
        }
        setRegisteredDeed(response.deed);
        setCanonicalPayload(response.canonicalPayload || null);
        setQrDataUrl(response.qrDataUrl || null);
        setVerificationUrl(response.verificationUrl || null);

        // Safe client persistence across server restarts / browser sessions
        if (typeof window !== 'undefined') {
          try {
            const raw = window.localStorage.getItem('landtech_registered_deeds');
            const parsed: unknown = raw ? JSON.parse(raw) : [];
            const arr: unknown[] = Array.isArray(parsed) ? parsed : [];
            const filtered = arr.filter(d => d && typeof d === 'object' && 'deed_no' in d && d.deed_no !== response.deed!.deed_no).slice(-199);
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
    setVerificationUrl(null);
    setErrorMessage(null);
    handleQuickFill();
  };

  const errorCopy: Record<string, string> = {
    'দলিল নম্বর লিখুন (উদাঃ DEED-2026-9001)।': 'Enter a deed number (example: DEED-2026-9001).',
    'দাগ নম্বর লিখুন (উদাঃ ০৯০৯ বা 0909)।': 'Enter a plot number (example: 0909).',
    'বিক্রেতার নাম লিখুন।': 'Enter a synthetic seller name.',
    'ক্রেতার নাম লিখুন।': 'Enter a synthetic buyer name.',
    'জমির পরিমাণ একটি বৈধ ধনাত্মক সংখ্যা হতে হবে (উদাঃ ৫.৫০)।': 'Enter a valid positive area (example: 5.50).',
    'দলিল সম্পাদনের তারিখ নির্বাচন করুন।': 'Choose the deed date.',
    'সার্ভারের সাথে যোগাযোগে অপ্রত্যাশিত ত্রুটি ঘটেছে।': 'Could not contact the server. Try again.',
  };
  const errorText = !errorMessage ? '' : errorMessage === 'DUPLICATE_DEED' ? t('এই দলিল নম্বর ইতিমধ্যে রয়েছে। অন্য নম্বর দিন।', 'This deed number already exists. Choose another number.') : errorMessage === 'VALIDATION_ERROR' ? t('তথ্য গ্রহণ করা যায়নি। নম্বর, নাম, জমি ও তারিখ পুনরায় মিলিয়ে দেখুন।', 'The supplied details were rejected. Check identifiers, names, area and date.') : errorMessage === 'REGISTRY_FULL' ? t('ডেমো রেজিস্ট্রির ধারণক্ষমতা পূর্ণ। নতুন দলিল যোগ করা যাচ্ছে না।', 'The demo registry is full. No new deed can be added.') : errorMessage === 'LIVE_MODE_DISABLED' ? t('সরাসরি ডাটাবেজে নিবন্ধন এই ডেমোতে বন্ধ আছে।', 'Live database registration is disabled in this demo.') : errorCopy[errorMessage] ? t(errorMessage, errorCopy[errorMessage]) : t('ডেমো নিবন্ধন সম্পন্ন হয়নি। তথ্য পরীক্ষা করে আবার চেষ্টা করুন।', 'Demo registration failed. Check the details and try again.');
  const fieldClass = 'w-full rounded-xl border border-slate-300 p-3 text-sm';
  return <div className="mx-auto max-w-4xl space-y-5">
    <div className="space-y-2"><h2 className="text-2xl font-bold">{t('ডেমো দলিল নিবন্ধন', 'Register a synthetic deed')}</h2><p className="text-sm text-slate-600">{t('কাল্পনিক দলিল থেকে SHA-256 ফিঙ্গারপ্রিন্ট ও রেকর্ড খোঁজার QR কোড তৈরি করুন।', 'Create a SHA-256 fingerprint and record lookup QR code from a synthetic deed.')}</p></div>
    <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">{t('শুধু কাল্পনিক তথ্য ব্যবহার করুন। এটি সরকারি রেজিস্ট্রেশন বা নামজারি নয় এবং মালিকানা প্রমাণ করে না। আসল ব্যক্তিগত তথ্য দেবেন না।', 'Use synthetic information only. This is not government registration or mutation and does not prove ownership. Do not enter real personal information.')}</p>
    {!registeredDeed ? <Card><CardBody className="p-5 sm:p-7 space-y-5">
      <button type="button" onClick={handleQuickFill} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold">{t('নমুনা তথ্য পূরণ করুন', 'Fill sample details')}</button>
      {errorMessage && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{errorText}</p>}
      <form onSubmit={handleSubmit} aria-busy={isLoading} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><label htmlFor="reg-deed" className="block text-sm font-semibold">{t('দলিল নম্বর', 'Deed number')} *</label><input id="reg-deed" value={deedNo} onChange={e => setDeedNo(e.target.value)} required placeholder="DEED-2026-9001" className={fieldClass} /></div>
          <div className="space-y-2"><label htmlFor="reg-dag" className="block text-sm font-semibold">{t('দাগ নম্বর', 'Plot number')} *</label><input id="reg-dag" value={dagNo} onChange={e => setDagNo(e.target.value)} required placeholder={t('০৯০৯ বা 0909', '0909 or ০৯০৯')} className={fieldClass} /></div>
          <div className="space-y-2"><label htmlFor="reg-seller" className="block text-sm font-semibold">{t('কাল্পনিক বিক্রেতার নাম', 'Synthetic seller name')} *</label><input id="reg-seller" value={seller} onChange={e => setSeller(e.target.value)} required className={fieldClass} /></div>
          <div className="space-y-2"><label htmlFor="reg-buyer" className="block text-sm font-semibold">{t('কাল্পনিক ক্রেতার নাম', 'Synthetic buyer name')} *</label><input id="reg-buyer" value={buyer} onChange={e => setBuyer(e.target.value)} required className={fieldClass} /></div>
          <div className="space-y-2"><label htmlFor="reg-area" className="block text-sm font-semibold">{t('জমির পরিমাণ (শতক)', 'Area (decimal)')} *</label><input id="reg-area" value={area} onChange={e => setArea(e.target.value)} required inputMode="decimal" placeholder={t('৭.৫০ বা 7.50', '7.50 or ৭.৫০')} className={fieldClass} /></div>
          <div className="space-y-2"><label htmlFor="reg-date" className="block text-sm font-semibold">{t('দলিলের তারিখ', 'Deed date')} *</label><input id="reg-date" type="date" value={date} onChange={e => setDate(e.target.value)} required className={fieldClass} /></div>
        </div>
        <div className="space-y-2"><label htmlFor="reg-prev" className="block text-sm font-semibold">{t('পূর্ববর্তী দলিলের হ্যাশ', 'Previous deed hash')}</label><input id="reg-prev" value={prevHash} onChange={e => setPrevHash(e.target.value)} className={fieldClass} /><p className="text-xs text-slate-500">{t('প্রথম হস্তান্তরের ক্ষেত্রে জেনেসিস মান ব্যবহার করুন।', 'Use a genesis value for the first transfer.')}</p></div>
        <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white disabled:opacity-60">{isLoading ? t('হ্যাশ তৈরি ও নিবন্ধন হচ্ছে…', 'Creating fingerprint and registering…') : t('ডেমো দলিল নিবন্ধন করুন', 'Register synthetic deed')}</button>
      </form>
    </CardBody></Card> : <Card><CardBody className="p-5 sm:p-7 space-y-5">
      <h3 className="text-xl font-bold text-emerald-900">{t('ডেমো নিবন্ধন সম্পন্ন', 'Synthetic registration complete')}</h3>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">{[[t('দলিল নম্বর', 'Deed number'),registeredDeed.deed_no],[t('দাগ', 'Plot'),registeredDeed.dag_no],[t('বিক্রেতা', 'Seller'),registeredDeed.seller],[t('ক্রেতা', 'Buyer'),registeredDeed.buyer],[t('জমির পরিমাণ (শতক)', 'Area (decimal)'),registeredDeed.area.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')],[t('তারিখ', 'Date'),registeredDeed.date]].map(([label,value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="font-bold break-words">{value}</dd></div>)}</dl>
      <div className="space-y-2"><h4 className="text-sm font-bold">{t('সংরক্ষিত SHA-256 ফিঙ্গারপ্রিন্ট', 'Stored SHA-256 fingerprint')}</h4><code className="block break-all rounded-xl bg-slate-50 p-3 text-xs">{registeredDeed.hash}</code></div>
      {canonicalPayload && <details className="rounded-xl border p-3"><summary className="cursor-pointer text-sm font-semibold">{t('হ্যাশ তৈরির ক্যানোনিকাল তথ্য', 'Canonical fingerprint input')}</summary><code className="mt-3 block break-all text-xs">{canonicalPayload}</code></details>}
      {qrDataUrl && <div className="space-y-2"><h4 className="text-sm font-bold">{t('ডেমো রেকর্ডের QR কোড', 'Demo record QR code')}</h4>{/* Generated data URL from the registration action. */}{/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrDataUrl} width={220} height={220} alt={t('নিবন্ধিত ডেমো দলিলের অনুসন্ধান QR কোড', 'Lookup QR code for the registered synthetic deed')} /><a href={qrDataUrl} download={`${registeredDeed.deed_no}.png`} className="inline-block rounded-xl border px-4 py-2 text-sm">{t('QR কোড ডাউনলোড করুন', 'Download QR code')}</a></div>}
      {verificationUrl && <div className="space-y-2"><h4 className="text-sm font-bold">{t('এই ব্রাউজারে রেকর্ডটি খোলার লিংক', 'Record link for this browser')}</h4><a href={verificationUrl} className="block break-all rounded-xl border p-3 text-sm text-emerald-800 underline">{verificationUrl}</a></div>}
      <p className="text-sm text-slate-600">{t('এই ডেমো রেকর্ড এই ব্রাউজারেই রাখা হয়। অন্য ফোনে QR খুললে রেকর্ড নাও পাওয়া যেতে পারে। ফিঙ্গারপ্রিন্ট আইনি মালিকানার প্রমাণ নয়।', 'This demo receipt is saved in this browser. The QR may not find it on another phone. The fingerprint does not prove legal ownership.')}</p>
      <div className="flex flex-wrap gap-3"><button type="button" onClick={() => window.print()} className="rounded-xl border px-4 py-3 text-sm">{t('দলিল ও QR রসিদ প্রিন্ট করুন', 'Print deed and QR receipt')}</button><button onClick={() => onVerifyDeed(registeredDeed.dag_no, registeredDeed.deed_no)} className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white">{t('এই দলিল যাচাই করুন', 'Check this deed')}</button><button onClick={handleReset} className="rounded-xl border px-4 py-3 text-sm">{t('আরেকটি দলিল তৈরি করুন', 'Create another deed')}</button></div>
    </CardBody></Card>}
  </div>;
}
