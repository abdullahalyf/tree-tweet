'use client';
import { useState, type FormEvent } from 'react';
import { DEMO_SCENARIOS } from '@/lib/demo/fixtures';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { scenarioEnglish } from '@/lib/i18n/issues';
import { QRScannerModal } from './QRScannerModal';

interface SearchFormProps { onSearch: (dagNo: string, deedNo?: string) => void; isLoading: boolean; selectedDagNo?: string; selectedDeedNo?: string }
export function SearchForm({ onSearch, isLoading, selectedDagNo = '', selectedDeedNo = '' }: SearchFormProps) {
  const { t } = useLanguage();
  const [dag, setDag] = useState(selectedDagNo);
  const [deed, setDeed] = useState(selectedDeedNo);
  const [invalid, setInvalid] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!dag.trim() && !deed.trim()) { setInvalid(true); return; }
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
          <h2 className="font-bold text-lg">{t('দাগ বা দলিল অনুসন্ধান', 'Search a plot or deed')}</h2>
          <button type="button" onClick={() => setQrOpen(true)} disabled={isLoading} className="rounded-xl border px-3 py-2 text-sm">{t('📷 QR কোড খুলুন', '📷 Open QR tools')}</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><label htmlFor="dagNoInput" className="block font-semibold text-sm">{t('দাগ নম্বর', 'Plot (dag) number')}</label>
            <input id="dagNoInput" value={dag} onChange={e => { setDag(e.target.value); setInvalid(false); }} placeholder={t('যেমন: ০১০১ বা 0101', 'Example: 0101 or ০১০১')} disabled={isLoading} className="w-full rounded-xl border border-slate-300 p-3" />
          </div>
          <div className="space-y-2"><label htmlFor="deedNoInput" className="block font-semibold text-sm">{t('দলিল নম্বর (ঐচ্ছিক)', 'Deed number (optional)')}</label>
            <input id="deedNoInput" value={deed} onChange={e => { setDeed(e.target.value); setInvalid(false); }} placeholder="DEED-2024-0001" disabled={isLoading} className="w-full rounded-xl border border-slate-300 p-3" />
          </div>
        </div>
        <p className="text-xs text-slate-600">{t('বাংলা বা ইংরেজি সংখ্যা লিখুন। শুরুর শূন্য অক্ষুণ্ণ থাকবে। শুধু দলিল নম্বর দিয়েও অনুসন্ধান করা যায়।', 'Use Bangla or English digits. Leading zeros are preserved. You can also search by deed number alone.')}</p>
        {invalid && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-rose-800">{t('একটি দাগ অথবা দলিল নম্বর লিখুন।', 'Enter a plot or deed number.')}</p>}
        <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white disabled:opacity-60">{isLoading ? t('যাচাই করা হচ্ছে…', 'Checking records…') : t('ঝুঁকি যাচাই করুন', 'Check risks')}</button>
      </form>
      <div className="space-y-3 border-t pt-5">
        <h3 className="font-bold text-sm">{t('আটটি কাল্পনিক নমুনা পরীক্ষা করুন', 'Explore eight synthetic sample cases')}</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_SCENARIOS.map(sc => <button type="button" key={sc.code} disabled={isLoading} aria-pressed={dag === sc.dagNo && deed === sc.deedNo} onClick={() => select(sc.dagNo, sc.deedNo)} className={`rounded-2xl border p-3 text-left space-y-2 ${dag === sc.dagNo && deed === sc.deedNo ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'}`}>
            <span className="block font-bold text-sm">{t('কেস', 'Case')} {sc.code} · {sc.dagNo}</span>
            <span className="block text-xs text-slate-600">{t(sc.taglineBn, scenarioEnglish[sc.code])}</span>
          </button>)}
        </div>
      </div>
    </div>
  </section>;
}
