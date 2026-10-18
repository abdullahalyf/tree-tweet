'use client';
import { useState } from 'react';
import type { VerificationResult } from '@/lib/verification/types';
import type { CompletePlotData } from '@/lib/db/schema';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { localizeIssue } from '@/lib/i18n/issues';
import { getFlagState, getCheckState, hasCompletePlotStatus } from '@/lib/i18n/presentation';
import { readMutationHistory } from '@/lib/i18n/buyerChecklist';
import { Card, CardBody } from '../ui/card';
import { BuyerChecklist } from './BuyerChecklist';

interface VerificationResultViewProps { result: VerificationResult; plotData?: CompletePlotData; source: 'demo' | 'supabase'; onReset: () => void }
export function VerificationResultView({ result, source, onReset }: VerificationResultViewProps) {
  const { t, language } = useLanguage();
  const [tab, setTab] = useState<'overview' | 'records' | 'next-steps'>('overview');
  const { khatian, selectedDeed, deeds, plotStatus } = result;
  const history = readMutationHistory((khatian as { mutation_history?: unknown } | null)?.mutation_history);
  const hasSyntheticHistory = source === 'demo' || history.some(entry => entry.reference.startsWith('DEMO-'));
  const acquisition = (plotStatus as { acquisition_status?: unknown } | null)?.acquisition_status;
  const has = (codes: string[]) => result.issues.some(issue => codes.includes(issue.code));
  const incomplete = has(['RECORD_DATA_INCOMPLETE', 'RECORD_PLOT_MISMATCH']);
  const summary = result.overallStatus === 'GREEN' ? t('দেওয়া তথ্যে সমস্যা ধরা পড়েনি', 'No problem detected in the supplied information') : result.overallStatus === 'YELLOW' ? t('আরও তথ্য যাচাই করা দরকার', 'More information needs checking') : t('টাকা দেওয়ার আগে থামুন ও যাচাই করুন', 'Pause and check before paying');
  const colors = result.overallStatus === 'RED' ? 'bg-rose-900' : result.overallStatus === 'YELLOW' ? 'bg-amber-800' : 'bg-emerald-800';
  const number = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', { maximumFractionDigits: 4 }) : t('তথ্য ঠিক নেই', 'Information invalid');
  const mutationCopy = (value: unknown) => value === 'done' ? t('নামজারি সম্পন্ন', 'Mutation complete') : value === 'pending' ? t('নামজারির কাজ চলছে', 'Mutation pending') : value === 'none' ? t('নামজারি হয়নি', 'Mutation not completed') : t('তথ্য জানা নেই', 'Unknown');
  const flagCopy = (value: unknown) => getFlagState(value) === 'reported' ? t('দেওয়া তথ্যে আছে', 'Reported in supplied information') : getFlagState(value) === 'not-reported' ? t('দেওয়া তথ্যে নেই', 'Not reported in supplied information') : t('তথ্য পাওয়া যায়নি', 'Information missing');
  const acquisitionCopy = acquisition === 'not_reported' ? t('দেওয়া তথ্যে নোটিশের খবর নেই', 'No notice reported in supplied information') : acquisition === 'notice' ? t('অধিগ্রহণের নোটিশের তথ্য আছে', 'Acquisition notice reported') : acquisition === 'acquired' ? t('অধিগ্রহণ করা হয়েছে বলে তথ্য আছে', 'Land reported as acquired') : t('তথ্য পাওয়া যায়নি — অফিসে খোঁজ নিন', 'Information missing — check with the office');
  const checkCopy = (available: boolean, issue: boolean) => {
    const state = getCheckState(available, issue);
    return state === 'clear' ? t('দেওয়া তথ্যে সমস্যা মেলেনি', 'No issue in supplied information') : state === 'review' ? t('আরও যাচাই দরকার', 'Needs review') : state === 'review-incomplete' ? t('যাচাই দরকার, তথ্যও কম', 'Needs review; information also missing') : t('তথ্য পাওয়া যায়নি', 'Information missing');
  };
  const secondaryChecks = [
    { name: t('বন্ধক ও মামলা', 'Mortgage and court evidence'), available: hasCompletePlotStatus(plotStatus) && !has(['PLOT_STATUS_UNAVAILABLE']) && !incomplete, review: has(['PLOT_MORTGAGED', 'PLOT_COURT_DISPUTE']) || plotStatus?.mortgaged === true || plotStatus?.court_case === true },
    { name: t('বিক্রির জমির পরিমাণ', 'Proposed sale area'), available: !!khatian && !!selectedDeed && !has(['INVALID_AREA']) && !incomplete, review: has(['EXCESSIVE_AREA_REQUESTED']) },
    { name: t('আগের বিক্রির ইতিহাস', 'Earlier transfer history'), available: deeds.length > 0 && deeds.every(deed => ['active', 'cancelled'].includes(deed.status)) && !incomplete, review: has(['DOUBLE_SALE_DETECTED', 'DEED_CANCELLED']) },
    { name: t('ডিজিটাল তথ্যের অখণ্ডতা', 'Digital record integrity'), available: !!selectedDeed && !incomplete, review: has(['DEED_HASH_MISMATCH']) },
  ];
  const dateCopy = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) ? new Date(`${value}T00:00:00Z`).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : value;
  return <div className="space-y-5">
    <div className="flex flex-wrap justify-between items-center gap-3 rounded-2xl border bg-white p-4"><p className="text-base">{t('দাগ', 'Plot')}: <b className="font-mono">{result.dagNo}</b>{selectedDeed && <span className="mt-1 block break-all text-sm">{t('দলিল', 'Deed')}: {selectedDeed.deed_no}</span>}</p><button onClick={onReset} className="rounded-xl border px-4 py-3 text-base">{t('← নতুন অনুসন্ধান', '← New search')}</button></div>
    <Card className="overflow-hidden">
      <div className={`${colors} p-5 sm:p-7 text-white space-y-3`}>
        <p className="text-sm text-white/90">{t('আপনার দেওয়া তথ্যের ফল', 'Result from your supplied information')}</p>
        <h2 className="text-2xl font-bold leading-snug">{summary}</h2>
        <p className="text-base leading-relaxed">{result.overallStatus === 'RED' ? t('কাগজে সমস্যা বা জরুরি তথ্যের ঘাটতি আছে। মূল কাগজ ও সংশ্লিষ্ট অফিসে না মিলিয়ে টাকা দেবেন না।', 'There is a problem or essential information is missing. Do not pay before checking original papers with the relevant offices.') : t('এই ফল মালিকানার নিশ্চয়তা নয়। টাকা দেওয়ার আগে মূল কাগজ ও অফিসের তথ্য আলাদা করে মিলিয়ে দেখুন।', 'This result does not guarantee ownership. Before paying, independently compare original papers and office records.')}</p>
        <p className="text-sm text-white/90">{source === 'demo' ? t('শেখার জন্য কাল্পনিক নমুনা — আসল জমির তথ্য নয়', 'Synthetic learning sample — not real land information') : t('অ্যাপের ডাটাবেজের অযাচাইকৃত তথ্য — সরকারি সংযোগ নয়', 'Unverified app database records — no government connection')}</p>
      </div>
      <nav className="flex flex-wrap gap-1 border-b px-3 py-2" aria-label={t('ফলাফলের বিভাগ', 'Result sections')}>{([['overview', t('ফলাফল', 'Result')], ['records', t('কাগজের তথ্য', 'Record details')], ['next-steps', t('এখন কী করবেন', 'What to do next')]] as const).map(([id, label]) => <button key={id} onClick={() => setTab(id)} aria-pressed={tab === id} className={`rounded-lg px-3 py-3 text-base font-semibold ${tab === id ? 'bg-emerald-100 text-emerald-950' : 'text-slate-600'}`}>{label}</button>)}</nav>
      <CardBody className="p-4 sm:p-6 space-y-6">
        {tab === 'overview' && <>
          {result.issues.length > 0 && <section className="space-y-3" aria-labelledby="issues-title"><h3 id="issues-title" className="text-lg font-bold">{t('কী পাওয়া গেছে, কী করবেন', 'What we found and what to do')}</h3>{result.issues.map((issue, index) => {
            const copy = localizeIssue(issue, language);
            return <article key={`${issue.code}-${index}`} className={`rounded-2xl border p-4 space-y-3 ${issue.severity === 'CRITICAL' ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}>
              <h4 className="text-lg font-bold leading-snug">{copy.title}</h4><p className="text-base leading-relaxed">{copy.description}</p><p className="text-base leading-relaxed"><strong>{t('এখন করণীয়: ', 'Next step: ')}</strong>{copy.action}</p>
            </article>;
          })}</section>}
          <BuyerChecklist evidence={result} />
        </>}
        {tab === 'records' && <>
          <section className="space-y-3"><h3 className="text-lg font-bold">{t('খতিয়ানের তথ্য', 'Khatian details')}</h3>{khatian ? <dl className="grid gap-4 rounded-xl bg-slate-50 p-4 text-base sm:grid-cols-2">{[[t('রেকর্ডের মালিক', 'Recorded owner'), khatian.owner_name], [t('মৌজা', 'Mouza'), khatian.mouza], [t('মোট জমি (শতক)', 'Total area (decimal)'), number(khatian.total_area)], [t('অবশিষ্ট জমি (শতক)', 'Remaining area (decimal)'), number(khatian.remaining_area)], [t('জমির ধরন', 'Land category'), khatian.land_type === 'khas' ? t('সরকারি খাস', 'Government khas') : khatian.land_type === 'normal' ? t('সাধারণ জমি', 'Normal land') : t('তথ্য জানা নেই', 'Unknown')], [t('এখনকার নামজারি', 'Current mutation'), mutationCopy(khatian.mutation_status)]].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-600">{label}</dt><dd className="mt-1 font-semibold break-words">{value}</dd></div>)}</dl> : <p className="text-base">{t('খতিয়ানের তথ্য পাওয়া যায়নি।', 'Khatian information is missing.')}</p>}</section>
          <section className="space-y-3"><h3 className="text-lg font-bold">{t('কখন নামজারির রেকর্ড বদলেছে', 'When the mutation record changed')}</h3>{hasSyntheticHistory && <p className="rounded-xl bg-blue-50 p-3 text-sm leading-relaxed">{t('এখানে শেখার জন্য বানানো নামজারির তারিখ ও ইতিহাস আছে। ডেমো হিসেবে চিহ্নিত তথ্য অফিসের আসল রেকর্ড নয়।', 'This history includes invented dates and events for learning. Entries marked as demo are not official mutation records.')}</p>}{history.length > 0 ? <ol className="space-y-3 border-l-2 border-emerald-200 pl-4">{history.map((entry, index) => <li key={`${entry.reference}-${index}`} className="rounded-xl border p-4 space-y-2"><p className="text-base font-bold"><time dateTime={entry.date}>{dateCopy(entry.date)}</time></p><p className="text-base">{mutationCopy(entry.status)}</p><p className="break-words text-sm text-slate-600">{t('কাগজের নম্বর', 'Document reference')}: {entry.reference}</p></li>)}</ol> : <p className="rounded-xl bg-amber-50 p-4 text-base">{t('আগের নামজারির তথ্য নেই বা ঠিক নেই। ভূমি অফিসে মূল কাগজ দেখুন।', 'Earlier mutation information is missing or invalid. Check the original papers at the land office.')}</p>}</section>
          <section className="space-y-3"><h3 className="text-lg font-bold">{t('মামলা, বন্ধক ও অধিগ্রহণ', 'Court disputes, mortgages and acquisition')}</h3><dl className="space-y-4 rounded-xl border p-4 text-base">{[[t('জমি নিয়ে মামলা', 'Court disputes'), flagCopy(plotStatus?.court_case)], [t('বন্ধক', 'Mortgage'), flagCopy(plotStatus?.mortgaged)], [t('সরকারি অধিগ্রহণ', 'Government acquisition'), acquisitionCopy]].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-600">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}</dl></section>
          <section className="space-y-3"><h3 className="text-lg font-bold">{t('বিক্রির দলিল', 'Transfer deeds')} ({number(deeds.length)})</h3>{deeds.length === 0 && <p className="text-base">{t('দলিলের তথ্য পাওয়া যায়নি।', 'Deed information is missing.')}</p>}{deeds.map(deed => <article key={deed.id} className="rounded-xl border p-4 space-y-3"><h4 className="font-bold break-all text-base">{deed.deed_no}</h4><p className="text-base">{deed.status === 'active' ? t('চলমান দলিল', 'Active deed') : deed.status === 'cancelled' ? t('বাতিল দলিল', 'Cancelled deed') : t('দলিলের অবস্থা জানা নেই', 'Deed status unknown')}{selectedDeed?.deed_no === deed.deed_no && <> · {t('আপনার বেছে নেওয়া দলিল', 'Your selected deed')}</>}</p><dl className="grid gap-4 text-base sm:grid-cols-2">{[[t('বিক্রেতা', 'Seller'), deed.seller], [t('ক্রেতা', 'Buyer'), deed.buyer], [t('জমি (শতক)', 'Area (decimal)'), number(deed.area)], [t('তারিখ', 'Date'), dateCopy(deed.date)], [t('দাগ', 'Plot'), deed.dag_no]].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-600">{label}</dt><dd className="mt-1 font-semibold break-words">{value}</dd></div>)}</dl></article>)}</section>
        </>}
        {tab === 'next-steps' && <section className="space-y-4"><h3 className="text-lg font-bold">{t('টাকা দেওয়ার আগে', 'Before paying')}</h3><ol className="list-decimal pl-5 space-y-4 text-base leading-relaxed"><li>{t('বিক্রেতার পরিচয়পত্র, মূল দলিল ও খতিয়ান একসাথে মিলিয়ে দেখুন।', 'Compare the seller’s identity documents, original deed and khatian together.')}</li><li>{t('ভূমি অফিসে মালিকের নাম, নামজারির ইতিহাস ও খাস জমির অবস্থা দেখুন।', 'Check the recorded owner, mutation history and khas land status at the land office.')}</li><li>{t('সাব-রেজিস্ট্রি অফিসে আগে কাকে জমি বিক্রি হয়েছে, খোঁজ নিন।', 'Ask the sub-registry office about earlier transfers.')}</li><li>{t('মামলা ও বন্ধকের বর্তমান অবস্থা সংশ্লিষ্ট অফিসে যাচাই করুন।', 'Check current court disputes and mortgages with the relevant offices.')}</li><li>{t('জেলা প্রশাসকের ভূমি অধিগ্রহণ শাখায় সরকারি নোটিশ আছে কি না দেখুন।', 'Ask the district administration land acquisition office about government notices.')}</li><li>{t('কোনো কাগজ না মিললে বা তথ্য না পেলে আগে সমাধান করুন। প্রয়োজনে আইনজীবীর সাহায্য নিন।', 'Resolve missing or conflicting information first. Get a lawyer’s help when needed.')}</li></ol></section>}
        <details className="rounded-2xl border border-slate-200 p-4 space-y-4">
          <summary className="cursor-pointer text-base font-bold">{t('বিস্তারিত তথ্য দেখুন', 'View technical details')}</summary>
          <p className="text-sm leading-relaxed text-slate-600">{t('এখানে সফটওয়্যারের পরীক্ষার বিবরণ আছে। এগুলো সরকারি বা আইনি প্রমাণ নয়।', 'This section contains software check details. These are not government or legal proof.')}</p>
          <dl className="space-y-3 text-sm">{secondaryChecks.map(check => <div key={check.name} className="rounded-xl bg-slate-50 p-3"><dt className="font-bold">{check.name}</dt><dd className="mt-1">{checkCopy(check.available, check.review)}</dd></div>)}</dl>
          <p className="text-sm break-words">{result.summaryBn}</p>
          {result.issues.map((issue, index) => <div key={`${issue.code}-technical-${index}`} className="rounded-xl border p-3 space-y-2 text-sm"><code className="block break-all">{issue.code}</code><p>{issue.titleBn}</p><p className="break-words">{issue.descriptionBn}</p></div>)}
          <h3 className="font-bold text-sm">{t('সংরক্ষিত ডিজিটাল ফিঙ্গারপ্রিন্ট (SHA-256)', 'Stored digital fingerprints (SHA-256)')}</h3>
          {deeds.map(deed => <div key={deed.id} className="rounded-xl bg-slate-50 p-3 space-y-2"><p className="font-bold text-sm break-all">{deed.deed_no}</p><p className="text-sm">{t('সংরক্ষিত হ্যাশ', 'Stored hash')}</p><code className="block break-all text-xs">{deed.hash}</code><p className="text-sm">{t('পূর্ববর্তী হ্যাশ', 'Previous hash')}</p><code className="block break-all text-xs">{deed.prev_hash || 'GENESIS'}</code></div>)}
        </details>
      </CardBody>
    </Card>
    <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-base leading-relaxed text-amber-950">{t('এটি সরকারি সনদ বা মালিকানার নিশ্চয়তা নয়। বাস্তব জমি কেনার আগে মূল কাগজ, অফিসের তথ্য ও যোগ্য পেশাদারের পরামর্শ নিন।', 'This is not an official certificate or a guarantee of ownership. Before buying real land, check original papers and office records and seek qualified professional advice.')}</p>
  </div>;
}
