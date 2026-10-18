'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { BuyerHelp } from './BuyerHelp';
import { checks, guideTopicTitles, type CheckId, type GuideTopic, type PaperStatus } from './guideTopics';
import { usePaperPreparation } from './usePaperPreparation';
import { useGuideMotion } from './useGuideMotion';
import './buyer-portal.css';

function SupportingDocuments() {
  const { t } = useLanguage();
  return <details className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7">
      <summary className="min-h-11 cursor-pointer font-bold">{t('আরও কিছু কাগজ মিলিয়ে নিন', 'Check supporting documents')}</summary>
      <div className="pt-4 grid gap-5 sm:grid-cols-2">
        <section className="space-y-3"><h2 className="text-base font-bold">{t('ব্যাংকের ঋণ বা বন্ধক', 'Bank loans or mortgages')}</h2><p>{t('বন্ধকের তথ্য খুঁজুন। ঋণ বা বন্ধকমুক্তির কাগজ সংশ্লিষ্ট ব্যাংকে মিলিয়ে নিন। অনলাইনে কিছু না পাওয়া মানে ঋণ নেই নয়।', 'Look for mortgage information. Confirm loan or release papers with the lender. No online result does not establish that a property is debt-free.')}</p><a className="guide-official-link" href="https://mutation.land.gov.bd/search-mortgage-info" target="_blank" rel="noopener noreferrer">{t('সরকারি বন্ধক অনুসন্ধান ↗', 'Official mortgage search ↗')}<span className="text-xs font-normal">mutation.land.gov.bd</span></a></section>
        <section className="space-y-3"><h2 className="text-base font-bold">{t('ভূমি করের দাখিলা', 'Land tax receipts')}</h2><p>{t('হালনাগাদ দাখিলা ও হোল্ডিংয়ের তথ্য মিলিয়ে নিন। শুধু করের রসিদ দেখে মালিকানা নিশ্চিত করবেন না। সরকারি সাইটে নিজে লগইন করুন; TreeTweet-এ পাসওয়ার্ড বা OTP দেবেন না।', 'Compare current tax receipts and holding details. A tax receipt alone does not establish ownership. Sign in on the official site; do not give TreeTweet your password or OTP.')}</p><a className="guide-official-link" href="https://portal.ldtax.gov.bd/" target="_blank" rel="noopener noreferrer">{t('সরকারি ভূমি উন্নয়ন কর সেবা ↗', 'Official land development tax service ↗')}<span className="text-xs font-normal">portal.ldtax.gov.bd</span></a></section>
        <section className="space-y-3"><h2 className="text-base font-bold">{t('নকশা, সীমানা ও সরেজমিন', 'Maps, boundaries and site visit')}</h2><p>{t('একই মৌজা ও জরিপের ম্যাপ দেখুন। জমির সীমানা, বাস্তব অবস্থান, দখল ও যাতায়াতের পথ আলাদা করে মিলিয়ে নিন। প্রয়োজনে অভিজ্ঞ জরিপকারীর সাহায্য নিন; ম্যাপ একাই মালিকানা প্রমাণ নয়।', 'Use the map for the same mouza and survey. Independently check boundaries, physical location, possession and access. Use an experienced surveyor when needed; a map alone does not prove ownership.')}</p><a className="guide-official-link" href="https://dlrms.land.gov.bd/" target="_blank" rel="noopener noreferrer">{t('সরকারি মৌজা ম্যাপের সেবা ↗', 'Official mouza map service ↗')}<span className="text-xs font-normal">dlrms.land.gov.bd</span></a></section>
        <section className="space-y-3"><h2 className="text-base font-bold">{t('কাগজে QR থাকলেই আসল নয়', 'A QR code alone does not prove authenticity')}</h2><p>{t('সরকারি দাখিলা, খতিয়ান ও DCR-এর QR যাচাইয়ে সরকারি ভূমি (Bhumi) অ্যাপের নির্দেশনা অনুসরণ করুন। সন্দেহ হলে ১৬১২২-এ যোগাযোগ করুন। TreeTweet-এর QR টুল শুধু নমুনা রেকর্ড খোঁজে; সরকারি কাগজের সত্যতা যাচাই করে না।', 'Follow official Bhumi app guidance for government tax receipt, khatian and DCR QR checks. Contact 16122 if suspicious. TreeTweet’s QR tool only looks up sample records; it does not authenticate government documents.')}</p><a className="guide-official-link" href="https://bhumipedia.land.gov.bd/" target="_blank" rel="noopener noreferrer">{t('ভূমি মন্ত্রণালয়ের নির্দেশনা ↗', 'Ministry of Land guidance ↗')}<span className="text-xs font-normal">bhumipedia.land.gov.bd</span></a></section>
      </div>
    </details>;
}

function SourcesAndPrivacy() {
  const { t } = useLanguage();
  return <details className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7">
      <summary className="min-h-11 cursor-pointer font-bold">{t('তথ্যের উৎস, গোপনীয়তা ও সীমাবদ্ধতা', 'Sources, privacy and limitations')}</summary>
      <div className="pt-3 space-y-3">
        <p>{t('এই নির্দেশনা আমাদের সংক্ষিপ্ত সহায়িকা। সরকারি পোর্টালের হুবহু বক্তব্য বা আইনি মতামত নয়। সেবার ঠিকানা পর্যালোচনার তারিখ: ১৮ অক্টোবর ২০২৬; কোনো নির্দিষ্ট জমির রেকর্ড যাচাইয়ের তারিখ নয়।', 'This is our concise guidance, not a verbatim government statement or a legal opinion. Service directory reviewed: 18 October 2026; this is not the verification date of any plot record.')}</p>
        <p>{t('প্রস্তুতির পাঁচটি চিহ্ন এই ট্যাবের জন্য রাখা হয়। ভাষার পছন্দ ও ডেমো দলিল এই ব্রাউজারে সংরক্ষিত হতে পারে। হোস্টিং সেবা সাধারণ সংযোগের তথ্য ও ত্রুটির লগ প্রক্রিয়া করতে পারে। বাইরের সরকারি সাইটের নিজস্ব নিয়ম প্রযোজ্য।', 'The five preparation marks are kept for this browser tab. Language preferences and demo deeds may be stored in this browser. The hosting service may process ordinary connection data and error logs. External government sites apply their own policies.')}</p>
        <p>{t('ডেমো টুলে শুধু বানানো তথ্য দিন। কোনো আসল পরিচয়পত্র, ফোন নম্বর বা ব্যক্তিগত দলিল দেবেন না। ব্রাউজারের সাইট ডেটা মুছে স্থানীয় তথ্য সরাতে পারেন।', 'Use made-up information in demo tools. Do not provide real identity documents, phone numbers or private deeds. Clear this site’s browser data to remove local information.')}</p>
        <p>{t('কিছু সরকারি সাইট আমাদের স্বয়ংক্রিয় পরীক্ষায় খোলেনি। ঠিকানা সরকারি সূত্রে মিলিয়ে দেওয়া হয়েছে; সর্বক্ষণ চালু থাকার নিশ্চয়তা নেই।', 'Some official sites blocked or timed out in our automated checks. Addresses were cross-checked against official sources; continuous availability is not guaranteed.')}</p>
        <a href="https://bhumipedia.land.gov.bd/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{t('ভূমি মন্ত্রণালয়ের প্রকাশনা ও নির্দেশনা ↗', 'Ministry of Land publications and guidance ↗')}</a>
      </div>
    </details>;
}

export function GuideDetail({ topic, onTryDemo, motionPaused }: {
  topic: GuideTopic;
  onTryDemo: () => void;
  motionPaused: boolean;
}) {
  const { t, language } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  useGuideMotion(rootRef, motionPaused);
  const { papers, setPaper, clearPapers } = usePaperPreparation();
  const check = checks.find(item => item.id === topic);
  const index = checks.findIndex(item => item.id === topic);
  const count = checks.filter(item => papers[item.id] === 'collected').length;
  const mismatch = checks.some(item => papers[item.id] === 'mismatch');
  const title = guideTopicTitles[topic];
  const pick = (copy: readonly [string, string]) => t(copy[0], copy[1]);
  const number = (value: number) => value.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US');
  const marker = (id: CheckId) => {
    const item = checks.find(entry => entry.id === id)!;
    return <div className="space-y-3">
      <label htmlFor={`paper-${id}`} className="block text-sm font-semibold">{t('নিজের প্রস্তুতি চিহ্নিত করুন', 'Track your preparation')}</label>
      <select id={`paper-${id}`} aria-label={`${t('প্রস্তুতি', 'Preparation')}: ${pick(item.title)}`} value={papers[id] || 'missing'}
        onChange={event => setPaper(id, event.target.value as PaperStatus)}
        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base">
        <option value="missing">{t('এখনো কাগজ জোগাড় হয়নি', 'Papers not yet collected')}</option>
        <option value="collected">{t('কাগজ আছে, মিলিয়ে দেখব', 'Papers collected, ready to compare')}</option>
        <option value="mismatch">{t('অমিল আছে / সাহায্য দরকার', 'Difference found / need help')}</option>
      </select>
      {papers[id] === 'collected' && <p className="guide-mark-feedback" role="status">{t('কাগজ পাওয়ার চিহ্ন রাখা হয়েছে। এখন তথ্য মিলিয়ে দেখুন।', 'Marked as collected. Now compare the details.')}</p>}
      {papers[id] === 'mismatch' && <p className="guide-mark-feedback guide-mark-warning" role="status">{t('অমিল থাকলে টাকা দেওয়ার আগে সংশ্লিষ্ট অফিসে সাহায্য নিন।', 'If details differ, ask the relevant office for help before paying.')}</p>}
    </div>;
  };
  const storageNote = <p className="text-sm leading-7 text-slate-600">{t('এই ট্যাবে প্রস্তুতির চিহ্ন থাকে; ট্যাব বন্ধ করলে মুছে যায়। সংরক্ষণ বন্ধ থাকলে শুধু এই পাতা খোলা থাকা পর্যন্ত থাকবে। এটি আপনার নিজের চিহ্ন, জমি নিরাপদ হওয়ার সনদ নয়।', 'Preparation marks are kept for this tab and cleared when it closes. If storage is unavailable, they last only while this page remains open. These are your own marks, not a land clearance certificate.')}</p>;
  const nextId = check && index < checks.length - 1 ? checks[index + 1].id : 'preparation';

  return <div ref={rootRef} className="buyer-guide guide-content space-y-5">
    <nav aria-label={t('পাতার অবস্থান', 'Breadcrumb')} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">{t('হোম', 'Home')}</Link>
      <span aria-hidden="true">/</span><span aria-current="page">{pick(title)}</span>
    </nav>
    <header className="space-y-3">
      {check && <p className="guide-eyebrow">{t(`পাঁচটি বিষয়ের ${number(index + 1)} নম্বর ধাপ`, `Step ${index + 1} of five checks`)}</p>}
      <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950 leading-relaxed">{pick(title)}</h1>
      <p className="text-sm leading-7 text-slate-600">{t('সরকারি সেবার পথ ও কাগজ মিলিয়ে দেখার সহায়িকা। সরকারি রেকর্ড সরাসরি এখানে যাচাই করা হয় না।', 'A guide to official services and comparing papers. Government records are not directly verified here.')}</p>
    </header>

    {check && <section id={`check-${check.id}`} aria-label={pick(check.title)} data-paper-status={papers[check.id] || 'missing'}
      className="guide-check rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
      <div><h2 className="guide-instruction-label">{t('যা মিলিয়ে দেখবেন', 'What to compare')}</h2><p className="text-base leading-8 text-slate-700">{pick(check.body)}</p></div>
      <div><h2 className="guide-instruction-label">{t('যেখানে সাহায্য পাবেন', 'Where to get help')}</h2><p className="text-base leading-8 text-slate-600">{pick(check.office)}</p></div>
      <div className="flex flex-col items-start gap-3">{check.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="guide-official-link">
        <span>{t(link.bn, link.en)} <span aria-hidden="true">↗</span></span>
        <span className="text-xs font-normal text-slate-600">{new URL(link.href).hostname} · {t('নতুন ট্যাব', 'new tab')}</span>
      </a>)}</div>
      {marker(check.id)}
      {storageNote}
    </section>}

    {topic === 'papers' && <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4" aria-labelledby="papers-heading">
        <h2 id="papers-heading" className="text-lg font-bold">{t('আগে এই তথ্যগুলো হাতে রাখুন', 'Have these details ready')}</h2>
        <p className="text-base leading-8 text-slate-700">{t('জেলা → উপজেলা → মৌজা → জরিপের ধরন → খতিয়ান ও দাগ নম্বর। সঙ্গে দলিলের নম্বর, সাল ও সাব-রেজিস্ট্রি অফিসের নাম।', 'District → upazila → mouza → survey type → khatian and plot number. Also keep the deed number, year and sub-registry office name.')}</p>
        <p className="text-sm leading-7 text-slate-600">{t('এই পাতায় আসল নাম, পরিচয়পত্র বা দলিল আপলোড করতে হবে না। সব কাগজ না থাকলেও যে তথ্য আছে তা নিয়ে শুরু করুন।', 'You do not need to enter real names or upload identity documents or deeds here. Start with the information you have, even when some papers are missing.')}</p>
      </section>
      <SupportingDocuments />
    </>}

    {topic === 'preparation' && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5" aria-label={pick(title)}>
      <p role="status" className="font-semibold text-emerald-900 tabular-nums">{t(`কাগজ জোগাড়: ${number(count)}/৫`, `Papers collected: ${count}/5`)}</p>
      <div className="guide-preparation-track" aria-hidden="true"><span style={{ transform: `scaleX(${count / checks.length})` }} /></div>
      {mismatch && <p role="alert" className="text-sm font-semibold text-rose-800">{t('আপনি অমিল চিহ্নিত করেছেন। টাকা দেওয়ার আগে সংশ্লিষ্ট অফিসে মিলিয়ে নিন।', 'You marked a difference. Resolve it with the relevant office before paying.')}</p>}
      <p className="text-base leading-8">{t('কাগজ জোগাড় মানে যাচাই শেষ নয়। প্রতিটি কাগজের তথ্য ও বিক্রির অধিকার মিলিয়ে নিন।', 'Collecting papers does not finish the checks. Compare the information in each paper and the authority to sell.')}</p>
      <ol className="space-y-5">{checks.map(item => <li key={item.id} className="space-y-3 border-t border-slate-200 pt-4">
        <Link href={`/check/${item.id}`} className="inline-flex min-h-11 items-center font-bold text-emerald-900 underline underline-offset-4">{pick(item.title)} <span aria-hidden="true"> ↗</span></Link>
        {marker(item.id)}
      </li>)}</ol>
      {storageNote}
      <div className="flex flex-wrap gap-3 print:hidden">
        <button type="button" onClick={() => window.print()} className="min-h-11 rounded-xl border border-slate-300 px-4 py-2 font-semibold">{t('তালিকা প্রিন্ট করুন', 'Print checklist')}</button>
        <button type="button" onClick={clearPapers} className="min-h-11 rounded-xl border border-slate-300 px-4 py-2">{t('চিহ্ন মুছুন', 'Clear marks')}</button>
      </div>
    </section>}

    {topic === 'help' && <>
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6 space-y-4" aria-labelledby="help-heading">
        <h2 id="help-heading" className="text-lg font-bold text-amber-950">{t('বুঝতে সমস্যা হলে সাহায্য নিন', 'Get help when something is unclear')}</h2>
        <p className="text-sm leading-7 text-amber-950">{t('সরকারি সাইট না খুললে বা কাগজে অমিল থাকলে ভূমি অফিসে যোগাযোগ করুন। ভূমি সেবার তথ্যের জন্য ১৬১২২ নম্বরে ফোন করতে পারেন। কলের চার্জ প্রযোজ্য হতে পারে।', 'If a government site is unavailable or papers differ, contact the land office. You can call 16122 for land service information. Call charges may apply.')}</p>
        <a href="tel:16122" className="inline-flex min-h-11 items-center rounded-xl bg-amber-900 px-5 py-2 font-semibold text-white">{t('১৬১২২-এ ফোন করুন', 'Call 16122')}</a>
        <p className="text-sm leading-7 text-amber-950">{t('টাকা দেওয়ার আগে মূল কাগজ, জমির অবস্থান ও দখল মিলিয়ে নিন। প্রয়োজনে ভূমি বিষয়ে অভিজ্ঞ আইনজীবীর সহায়তা নিন।', 'Before paying, compare original papers, the land’s location and possession. Seek help from a lawyer experienced in land matters when needed.')}</p>
      </section>
      <BuyerHelp />
      <SourcesAndPrivacy />
      <div className="border-t border-slate-200 pt-5 print:hidden">
        <p className="text-sm text-slate-600 mb-3">{t('নমুনা দিয়ে বুঝে দেখতে চান? বানানো রেকর্ডে ঝুঁকি পরীক্ষার উদাহরণ আছে।', 'Want to explore an example? Try risk checks using made-up sample records.')}</p>
        <button type="button" onClick={onTryDemo} className="min-h-11 rounded-xl border border-emerald-300 bg-white px-4 py-2 font-semibold text-emerald-900">{t('নমুনা যাচাই দেখুন', 'Try the sample checker')}</button>
      </div>
    </>}

    <nav className="guide-step-navigation print:hidden" aria-label={t('পরের পাতায় যান', 'Continue to another page')}>
      {check && <Link href={`/check/${nextId}`} className="guide-next-link">{nextId === 'preparation' ? t('প্রস্তুতির তালিকা দেখুন', 'See your preparation checklist') : t(`পরের ধাপ: ${guideTopicTitles[nextId][0]}`, `Next: ${guideTopicTitles[nextId][1]}`)} <span aria-hidden="true">→</span></Link>}
      {topic === 'papers' && <Link href="/check/owner" className="guide-next-link">{t('প্রথম ধাপ: মালিকের পরিচয়', 'Step 1: Owner identity')} <span aria-hidden="true">→</span></Link>}
      {topic === 'preparation' && <Link href="/check/help" className="guide-next-link">{t('সাহায্য ও তথ্যের উৎস', 'Help and information sources')} <span aria-hidden="true">→</span></Link>}
      {topic === 'help' && <Link href="/check/papers" className="guide-next-link">{t('কাগজের তালিকা দেখুন', 'View the paper checklist')} <span aria-hidden="true">→</span></Link>}
      <Link href="/#guide-topics" className="guide-back-link">{t('সব বিষয় দেখুন', 'View all topics')}</Link>
    </nav>
    {topic !== 'help' && <Link href="/check/help" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 print:hidden">{t('বুঝতে সমস্যা হলে সাহায্য নিন', 'Get help when something is unclear')}</Link>}
  </div>;
}

