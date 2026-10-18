'use client';
import { useRef, useState, type FormEvent } from 'react';
import { DEMO_SCENARIOS } from '@/lib/demo/fixtures';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { QRScannerModal } from './QRScannerModal';

const sampleLabels: Record<string, [string, string]> = {
  A: ['রেকর্ডে ঝুঁকি মেলেনি', 'No risk detected'], B: ['রেকর্ডে ঝুঁকি মেলেনি', 'No risk detected'],
  C: ['নামে সামান্য অমিল', 'Name variation'], D: ['জমি বন্ধক আছে', 'Mortgage reported'],
  E: ['দ্বৈত বিক্রির আশঙ্কা', 'Possible double sale'], F: ['বিক্রেতা ও মালিক আলাদা', 'Seller differs from owner'],
  G: ['বেশি জমি বিক্রির চেষ্টা', 'Sale exceeds available area'], H: ['দলিলের তথ্য মিলছে না', 'Deed details do not match'],
};

interface SearchFormProps { onSearch: (dagNo: string, deedNo?: string) => void; isLoading: boolean; selectedDagNo?: string; selectedDeedNo?: string }
export function SearchForm({ onSearch, isLoading, selectedDagNo = '', selectedDeedNo = '' }: SearchFormProps) {
  const { t } = useLanguage();
  const [dag, setDag] = useState(selectedDagNo);
  const [deed, setDeed] = useState(selectedDeedNo);
  const [invalid, setInvalid] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const dagInput = useRef<HTMLInputElement>(null);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!dag.trim() && !deed.trim()) { setInvalid(true); dagInput.current?.focus(); return; }
    setInvalid(false);
    onSearch(dag.trim(), deed.trim() || undefined);
  };
  const select = (nextDag: string, nextDeed?: string) => {
    setDag(nextDag); setDeed(nextDeed ?? ''); setInvalid(false);
    onSearch(nextDag, nextDeed);
  };
  return <section className="search-workspace space-y-6">
    <QRScannerModal isOpen={qrOpen} onClose={() => setQrOpen(false)} onScanSuccess={select} />
    <div className="search-panel bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <form onSubmit={submit} className="space-y-4" aria-busy={isLoading}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold text-lg">{t('নমুনা রেকর্ড খুঁজুন', 'Find a sample record')}</h2>
          <button type="button" onClick={() => setQrOpen(true)} disabled={isLoading} className="rounded-xl border px-3 py-2 text-sm">{t('📷 QR কোড খুলুন', '📷 Open QR tools')}</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><label htmlFor="dagNoInput" className="block font-semibold text-sm">{t('নমুনা দাগের নম্বর', 'Sample plot number')}</label>
            <input ref={dagInput} aria-invalid={invalid} aria-describedby={invalid ? "search-hint search-error" : "search-hint"} id="dagNoInput" value={dag} onChange={e => { setDag(e.target.value); setInvalid(false); }} placeholder={t('যেমন: ০১০১ বা 0101', 'Example: 0101 or ০১০১')} disabled={isLoading} className="w-full rounded-xl border border-slate-300 p-3 text-base" />
          </div>
          <div className="space-y-2"><label htmlFor="deedNoInput" className="block font-semibold text-sm">{t('নমুনা দলিলের নম্বর (ঐচ্ছিক)', 'Sample deed number (optional)')}</label>
            <input aria-invalid={invalid} aria-describedby={invalid ? "search-hint search-error" : "search-hint"} id="deedNoInput" value={deed} onChange={e => { setDeed(e.target.value); setInvalid(false); }} placeholder="DEED-2024-0001" disabled={isLoading} className="w-full rounded-xl border border-slate-300 p-3 text-base" />
          </div>
        </div>
        <p id="search-hint" className="text-sm leading-relaxed text-slate-600">{t('শুধু বানানো নমুনার দাগ বা দলিল নম্বর দিন। বাংলা বা ইংরেজি সংখ্যা চলবে। শুরুর ০ বাদ দেবেন না। চাইলে নিচের আটটি নমুনা থেকে বেছে নিন।', 'Use only a made-up sample plot or deed number in Bangla or English digits. Keep any leading zeros. You can also choose one of the eight samples below.')}</p>
        {invalid && <p id="search-error" role="alert" className="rounded-xl bg-rose-50 p-3 text-rose-800">{t('নমুনার দাগ অথবা দলিল নম্বর লিখুন।', 'Enter a sample plot or deed number.')}</p>}
        <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-emerald-700 px-5 py-3 text-base font-bold text-white disabled:opacity-60">{isLoading ? t('নমুনা দেখা হচ্ছে…', 'Checking the sample…') : t('নমুনার অমিল দেখুন', 'Check the sample')}</button>
      </form>
      <details className="sample-records space-y-3 border-t pt-2">
        <summary className="min-h-12 cursor-pointer rounded-lg px-1 py-3 text-base font-bold">{t('নমুনা দিয়ে চেষ্টা করুন', 'Try sample records')}</summary>
        <p className="text-sm leading-relaxed text-slate-600">{t('এই আটটি নমুনা কাল্পনিক। আসল জমির তথ্য নয়।', 'These eight sample records are synthetic, not real land records.')}</p>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {DEMO_SCENARIOS.map(sc => <button type="button" key={sc.code} disabled={isLoading} aria-pressed={dag === sc.dagNo && deed === sc.deedNo} onClick={() => select(sc.dagNo, sc.deedNo)} className={`rounded-2xl border p-3 text-left space-y-1 ${dag === sc.dagNo && deed === sc.deedNo ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'}`}>
            <span className="block font-bold text-sm">{t('কেস', 'Case')} {sc.code} · {sc.dagNo}</span>
            <span className="block text-sm leading-relaxed text-slate-600">{t(...sampleLabels[sc.code])}</span>
          </button>)}
        </div>
      </details>
    </div>
  </section>;
}
