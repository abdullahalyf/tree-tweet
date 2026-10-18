'use client';

import { useState, type MouseEvent } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const checks = [
  {
    id: 'owner', title: ['মালিক ও জমির পরিচয়', 'Owner and plot identity'],
    body: ['বিক্রেতার কাছ থেকে দলিল, খতিয়ান ও পরিচয়পত্র দেখুন। জেলা, উপজেলা, মৌজা, জরিপ, খতিয়ান ও দাগ মিলিয়ে রেকর্ড খুঁজুন। শুধু দাগ নম্বর দিয়ে সারা দেশের জমি চেনা যায় না।', 'Ask the seller for the deed, khatian and identity document. Match district, upazila, mouza, survey, khatian and plot. A plot number alone is not unique across Bangladesh.'],
    office: ['দলিলের নকল ও হস্তান্তরের ধারাবাহিকতা সংশ্লিষ্ট সাব-রেজিস্ট্রি অফিসে মিলিয়ে নিন। খতিয়ান একাই চূড়ান্ত মালিকানার নিশ্চয়তা নয়।', 'Check certified deed copies and the transfer chain at the relevant sub-registry office. A khatian alone does not establish a clear title.'],
    links: [{ bn: 'খতিয়ান ও ম্যাপের সরকারি সেবা', en: 'Official khatian and map service', href: 'https://dlrms.land.gov.bd/' }],
  },
  {
    id: 'mutation', title: ['নামজারির কাগজ ও ইতিহাস', 'Mutation papers and history'],
    body: ['বিক্রেতার নামজারি খতিয়ান, আদেশ, আবেদন বা মামলা নম্বর এবং আগের নামজারির কাগজ চান। দলিলের দাগ ও জমির পরিমাণের সঙ্গে মিলিয়ে নিন।', 'Ask for the seller’s mutation khatian, order, application or case number, and earlier mutation papers. Compare the plots and area with the deed.'],
    office: ['অসম্পূর্ণ ইতিহাস বা অমিল থাকলে সহকারী কমিশনার (ভূমি) অফিসে মূল নথি যাচাই করুন। অনলাইনে পুরো ইতিহাস নাও থাকতে পারে।', 'For gaps or differences, check the original file at the Assistant Commissioner (Land) office. The complete history may not be online.'],
    links: [{ bn: 'সরকারি নামজারি সেবা', en: 'Official mutation service', href: 'https://mutation.land.gov.bd/' }],
  },
  {
    id: 'case', title: ['মামলা বা নিষেধাজ্ঞা', 'Cases or court orders'],
    body: ['বিক্রেতার কাছে মামলা নম্বর ও আদালতের নাম জানতে চান। জানা মামলা সরকারি কার্যতালিকায় দেখুন; ভূমি রাজস্ব মামলার তথ্যও আলাদা করে মিলিয়ে নিন।', 'Ask the seller for known case numbers and court names. Look up known cases in the official cause list, and check land revenue cases separately.'],
    office: ['অনুসন্ধানে কিছু না পাওয়া মানে মামলা নেই নয়। সংশ্লিষ্ট আদালত, ভূমি অফিস ও আইনজীবীর সাহায্যে আদেশ ও জমির পরিচয় মিলিয়ে নিন।', 'No search result does not mean no case exists. Match orders and plot identity with the relevant court, land office and a lawyer.'],
    links: [{ bn: 'আদালতের সরকারি কার্যতালিকা', en: 'Official court cause list', href: 'https://causelist.judiciary.gov.bd/' }, { bn: 'ভূমি রাজস্ব মামলা সেবা', en: 'Land revenue case service', href: 'https://case.gov.bd/' }],
  },
  {
    id: 'khas', title: ['সরকারি খাস জমি কি না', 'Government khas land status'],
    body: ['সর্বশেষ রেকর্ড ও জমির শ্রেণি দেখুন। সরকারি খাস জমি কি না তা নিয়ে সন্দেহ হলে বিক্রেতার কথার ওপর নির্ভর করবেন না।', 'Check the latest record and land classification. If government khas ownership is uncertain, do not rely on the seller’s statement alone.'],
    office: ['ইউনিয়ন ভূমি অফিস ও সহকারী কমিশনার (ভূমি) অফিসে সংশ্লিষ্ট খাস রেজিস্টার ও রেকর্ড মিলিয়ে দেখুন। লিখিত তথ্য পাওয়ার উপায় জিজ্ঞেস করুন। এই অ্যাপে সরাসরি খাস রেজিস্টার নেই।', 'Ask the Union Land Office and Assistant Commissioner (Land) office to check the relevant khas register and records, and how to obtain written information. This app cannot query that register.'],
    links: [{ bn: 'ভূমি মন্ত্রণালয়ের সেবার প্রবেশপথ', en: 'Ministry of Land service portal', href: 'https://www.land.gov.bd/' }],
  },
  {
    id: 'acquisition', title: ['অধিগ্রহণের নোটিশ বা মামলা', 'Acquisition notices or cases'],
    body: ['কোনো সরকারি প্রকল্পের অধিগ্রহণের নোটিশ, এলএ মামলা বা জমির তফসিল আছে কি না খোঁজ নিন। মৌজা ও দাগ ধরে নথি মিলিয়ে দেখুন।', 'Ask whether an acquisition notice, LA case or land schedule applies to a public project. Match the documents using mouza and plot details.'],
    office: ['জেলা প্রশাসকের কার্যালয়ের ভূমি অধিগ্রহণ (এলএ) শাখায় নোটিশ ও বর্তমান অবস্থা নিশ্চিত করুন। নিচের সেবা সব জমির জন্য উন্মুক্ত অনুসন্ধান নয়।', 'Confirm notices and current status with the Deputy Commissioner’s Land Acquisition (LA) section. The service below is not an open search covering every plot.'],
    links: [{ bn: 'সরকারি অধিগ্রহণ ব্যবস্থাপনা সেবা', en: 'Official acquisition management service', href: 'https://larms.land.gov.bd/' }],
  },
] as const;

type PaperStatus = 'missing' | 'collected' | 'mismatch';

const topics = [
  ['মালিকের পরিচয়', 'Owner identity', 'বিক্রেতা ও জমির কাগজ মিলিয়ে নিন', 'Compare the seller and land papers'],
  ['নামজারির ইতিহাস', 'Mutation history', 'এখনকার ও আগের নামজারি দেখুন', 'Check current and earlier mutation papers'],
  ['মামলার খোঁজ', 'Court cases', 'মামলা বা নিষেধাজ্ঞার খোঁজ নিন', 'Look for cases or court orders'],
  ['খাস জমির খোঁজ', 'Khas land', 'জমি সরকারি খাস কি না জানুন', 'Ask whether the land is government khas'],
  ['অধিগ্রহণের খোঁজ', 'Acquisition', 'সরকারি নোটিশ আছে কি না দেখুন', 'Check for acquisition notices'],
] as const;

export function BuyerGuide({ onTryDemo, motionPaused, onToggleMotion }: {
  onTryDemo: () => void;
  motionPaused: boolean;
  onToggleMotion: () => void;
}) {
  const { t, language } = useLanguage();
  const [papers, setPapers] = useState<Record<string, PaperStatus>>({});
  const count = Object.values(papers).filter(value => value === 'collected').length;
  const mismatch = Object.values(papers).includes('mismatch');
  const pick = (value: readonly [string, string]) => t(value[0], value[1]);
  const number = (value: number) => value.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US');
  const goToSection = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(event.currentTarget.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start', behavior: motionPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return <div className="space-y-6 buyer-guide">
    <section id="guide-start" tabIndex={-1} className="guide-welcome guide-destination" aria-labelledby="buyer-guide-title">
      <div className="guide-welcome-copy">
        <p className="guide-eyebrow"><span aria-hidden="true">✦</span> {t('জমি কেনার আগে · আপনার সহায়িকা', 'Your guide · before buying land')}</p>
        <h1 id="buyer-guide-title">{t('জমি কিনবেন?\nশুরু করুন এখান থেকে।', 'Buying land?\nStart right here.')}</h1>
        <p className="guide-lead">{t('কোন কাগজ লাগবে, কোথায় খোঁজ নেবেন আর অমিল পেলে কী করবেন—সহজ পাঁচটি ধাপে জানুন।', 'Learn which papers to collect, where to check them and what to do if they differ, in five simple steps.')}</p>
        <div className="guide-welcome-actions print:hidden">
          <a href="#guide-papers" onClick={goToSection} className="guide-start-button">{t('শুরু করি', 'Let’s begin')} <span aria-hidden="true">→</span></a>
          <button type="button" onClick={onToggleMotion} aria-pressed={motionPaused} className="guide-motion-toggle">{motionPaused ? t('অ্যানিমেশন চালু করুন', 'Turn animations on') : t('অ্যানিমেশন বন্ধ করুন', 'Turn animations off')}</button>
        </div>
        <p className="guide-intro-boundary">{t('আসল কাগজ আপলোড লাগে না। এখানে সরকারি রেকর্ড এনে যাচাই করা হয় না।', 'No private document uploads. We do not retrieve or verify government records here.')}</p>
      </div>
      <div className="guide-how" aria-labelledby="guide-how-title">
        <h2 id="guide-how-title">{t('যেভাবে ব্যবহার করবেন', 'How to use this guide')}</h2>
        <ol>
          {[
            [t('কাগজ হাতে নিন', 'Gather your papers'), t('নিচের তালিকা দেখে বিক্রেতার কাছে কাগজ চান।', 'Use the checklist below to ask the seller for papers.')],
            [t('পাঁচটি বিষয় দেখুন', 'Explore the five checks'), t('যা মিলাবেন ও যে অফিসে যাবেন, তা প্রতিটি ধাপে আছে।', 'Each step shows what to compare and which office to ask.')],
            [t('নিজের প্রস্তুতি চিহ্ন দিন', 'Mark your preparation'), t('কাগজ পেয়েছেন, নাকি অমিল আছে—বেছে রাখুন।', 'Mark whether you have the papers or found a difference.')],
          ].map(([title, body], index) => <li key={index}><span className="guide-how-number" aria-hidden="true">{number(index + 1)}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}
        </ol>
      </div>
    </section>
    <nav id="guide-topics" tabIndex={-1} aria-labelledby="guide-topics-title" className="guide-topics guide-destination print:hidden">
      <div className="guide-section-heading"><h2 id="guide-topics-title">{t('কোন বিষয়টি দেখতে চান?', 'What would you like to check?')}</h2><p>{t('বিষয়ে চাপ দিন, সেই ধাপে চলে যান।', 'Choose a topic to go straight to that step.')}</p></div>
      <div className="guide-topic-grid">
        {checks.map((check, index) => <a key={check.id} href={`#check-${check.id}`} onClick={goToSection} className="guide-topic-link" style={{ animationDelay: `${index * 55}ms` }}>
          <span className="guide-topic-number" aria-hidden="true">{number(index + 1)}</span>
          <span><strong>{t(topics[index][0], topics[index][1])}</strong><small>{t(topics[index][2], topics[index][3])}</small></span>
          <span className="guide-topic-arrow" aria-hidden="true">↗</span>
        </a>)}
      </div>
    </nav>
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 space-y-2">
      <p className="font-bold">{t('সরকারি সেবার পথ দেখাই; সরকারি রেকর্ড এখানে আনা হয় না।', 'We guide you to official services; we do not retrieve government records here.')}</p>
      <p>{t('TreeTweet একটি স্বাধীন সহায়ক প্রকল্প, সরকারি ওয়েবসাইট নয়। বোতাম চাপলে বাইরের সরকারি সাইট খুলবে; সেখানে নিবন্ধন বা আবেদন লাগতে পারে।', 'TreeTweet is an independent guidance project, not a government website. Buttons open external official sites, which may require registration or an application.')}</p>
    </div>
    <section id="guide-papers" tabIndex={-1} className="guide-destination rounded-2xl bg-white border border-slate-200 p-5 space-y-3" aria-labelledby="papers-heading">
      <h2 id="papers-heading" className="text-lg font-bold">{t('আগে এই তথ্যগুলো হাতে রাখুন', 'Have these details ready')}</h2>
      <p className="text-sm leading-7 text-slate-700">{t('জেলা → উপজেলা → মৌজা → জরিপের ধরন → খতিয়ান ও দাগ নম্বর। সঙ্গে দলিলের নম্বর, সাল ও সাব-রেজিস্ট্রি অফিসের নাম।', 'District → upazila → mouza → survey type → khatian and plot number. Also keep the deed number, year and sub-registry office name.')}</p>
      <p className="text-sm text-slate-600">{t('এই পাতায় আসল নাম, পরিচয়পত্র বা দলিল আপলোড করতে হবে না।', 'You do not need to enter real names or upload identity documents or deeds on this page.')}</p>
      <a href="#check-owner" onClick={goToSection} className="guide-start-button print:hidden">{t('প্রথম ধাপ: মালিকের পরিচয়', 'Step 1: Owner identity')} <span aria-hidden="true">→</span></a>
    </section>
    <div id="buyer-checks" className="scroll-mt-36 grid gap-4 md:grid-cols-2">
      {checks.map((check, index) => <section key={check.id} id={`check-${check.id}`} tabIndex={-1} data-paper-status={papers[check.id] || 'missing'} aria-labelledby={`guide-${check.id}`} className="guide-check guide-destination rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-900">{(index + 1).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}</span><h2 id={`guide-${check.id}`} className="text-lg font-bold text-emerald-950">{pick(check.title)}</h2></div>
        <div><h3 className="guide-instruction-label">{t('যা মিলিয়ে দেখবেন', 'What to compare')}</h3><p className="text-sm leading-7 text-slate-700">{pick(check.body)}</p></div>
        <div><h3 className="guide-instruction-label">{t('যেখানে সাহায্য পাবেন', 'Where to get help')}</h3><p className="text-sm leading-7 text-slate-600">{pick(check.office)}</p></div>
        <div className="flex flex-col items-start gap-2">{check.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="guide-official-link"><span>{t(link.bn, link.en)} <span aria-hidden="true">↗</span></span><span className="text-xs font-normal text-slate-600">{new URL(link.href).hostname} · {t('নতুন ট্যাব', 'new tab')}</span></a>)}</div>
        <label htmlFor={`paper-${check.id}`} className="block text-sm font-semibold">{t('নিজের প্রস্তুতি চিহ্নিত করুন', 'Track your preparation')}</label>
        <select id={`paper-${check.id}`} aria-label={`${t('প্রস্তুতি', 'Preparation')}: ${pick(check.title)}`} value={papers[check.id] || 'missing'} onChange={event => setPapers(previous => ({ ...previous, [check.id]: event.target.value as PaperStatus }))} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base">
          <option value="missing">{t('এখনো কাগজ জোগাড় হয়নি', 'Papers not yet collected')}</option>
          <option value="collected">{t('কাগজ আছে, মিলিয়ে দেখব', 'Papers collected, ready to compare')}</option>
          <option value="mismatch">{t('অমিল আছে / সাহায্য দরকার', 'Difference found / need help')}</option>
        </select>
        {papers[check.id] === 'collected' && <p className="guide-mark-feedback" role="status"><span aria-hidden="true">✓</span> {t('কাগজ পাওয়ার চিহ্ন রাখা হয়েছে। এখন তথ্য মিলিয়ে দেখুন।', 'Marked as collected. Now compare the details.')}</p>}
        {papers[check.id] === 'mismatch' && <p className="guide-mark-feedback guide-mark-warning" role="status">{t('অমিল থাকলে টাকা দেওয়ার আগে সংশ্লিষ্ট অফিসে সাহায্য নিন।', 'If details differ, ask the relevant office for help before paying.')}</p>}
        <div className="guide-step-navigation print:hidden">
          <a href={index < checks.length - 1 ? `#check-${checks[index + 1].id}` : '#preparation'} onClick={goToSection} className="guide-next-link">{index < checks.length - 1 ? t(`পরের ধাপ: ${topics[index + 1][0]}`, `Next: ${topics[index + 1][1]}`) : t('প্রস্তুতির তালিকা দেখুন', 'See your preparation checklist')} <span aria-hidden="true">→</span></a>
          <a href="#guide-topics" onClick={goToSection} className="guide-back-link">{t('সব বিষয় ↑', 'All topics ↑')}</a>
        </div>
      </section>)}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6 space-y-4" aria-labelledby="help-heading">
        <h2 id="help-heading" className="text-lg font-bold text-amber-950">{t('বুঝতে সমস্যা হলে সাহায্য নিন', 'Get help when something is unclear')}</h2>
        <p className="text-sm leading-7 text-amber-950">{t('সরকারি সাইট না খুললে বা কাগজে অমিল থাকলে ভূমি অফিসে যোগাযোগ করুন। ভূমি সেবার তথ্যের জন্য ১৬১২২ নম্বরে ফোন করতে পারেন। কলের চার্জ প্রযোজ্য হতে পারে।', 'If a government site is unavailable or papers differ, contact the land office. You can call 16122 for land service information. Call charges may apply.')}</p>
        <a href="tel:16122" className="inline-flex min-h-11 items-center rounded-xl bg-amber-900 px-5 py-2 font-semibold text-white">{t('১৬১২২-এ ফোন করুন', 'Call 16122')}</a>
        <p className="text-sm leading-7 text-amber-950">{t('টাকা দেওয়ার আগে মূল কাগজ, জমির অবস্থান ও দখল মিলিয়ে নিন। প্রয়োজনে ভূমি বিষয়ে অভিজ্ঞ আইনজীবীর সহায়তা নিন।', 'Before paying, compare original papers, the land’s location and possession. Seek help from a lawyer experienced in land matters when needed.')}</p>
      </section>
    </div>
    <section id="preparation" tabIndex={-1} className="guide-destination rounded-2xl bg-white border border-slate-200 p-5 space-y-3" aria-labelledby="preparation-heading">
      <h2 id="preparation-heading" className="text-lg font-bold">{t('আপনার প্রস্তুতির তালিকা', 'Your preparation checklist')}</h2>
      <p role="status" className="font-semibold text-emerald-900 tabular-nums">{t(`কাগজ জোগাড়: ${count.toLocaleString('bn-BD')}/৫`, `Papers collected: ${count}/5`)}</p>
      <div className="guide-preparation-track" aria-hidden="true"><span style={{ transform: `scaleX(${count / checks.length})` }} /></div>
      {mismatch && <p role="alert" className="text-sm font-semibold text-rose-800">{t('আপনি অমিল চিহ্নিত করেছেন। টাকা দেওয়ার আগে সংশ্লিষ্ট অফিসে মিলিয়ে নিন।', 'You marked a difference. Resolve it with the relevant office before paying.')}</p>}
      <p className="text-sm text-slate-600">{t('কাগজ জোগাড় মানে যাচাই শেষ নয়। এটি আপনার নিজের দেওয়া চিহ্ন, জমি নিরাপদ হওয়ার সনদ নয়। পাতা রিলোড করলে চিহ্ন মুছে যাবে।', 'Collecting papers does not mean verification is complete. These are your own marks, not a land clearance certificate. Reloading clears the marks.')}</p>
      <div className="flex flex-wrap gap-3 print:hidden"><button type="button" onClick={() => window.print()} className="min-h-11 rounded-xl border border-slate-300 px-4 py-2 font-semibold">{t('তালিকা প্রিন্ট করুন', 'Print checklist')}</button><button type="button" onClick={() => setPapers({})} className="min-h-11 rounded-xl border border-slate-300 px-4 py-2">{t('চিহ্ন মুছুন', 'Clear marks')}</button></div>
    </section>
    <details className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7">
      <summary className="min-h-11 cursor-pointer font-bold">{t('আরও কিছু কাগজ মিলিয়ে নিন', 'Check supporting documents')}</summary>
      <div className="pt-4 grid gap-5 sm:grid-cols-2">
        <section className="space-y-3"><h2 className="text-base font-bold">{t('ব্যাংকের ঋণ বা বন্ধক', 'Bank loans or mortgages')}</h2><p>{t('বন্ধকের তথ্য খুঁজুন। ঋণ বা বন্ধকমুক্তির কাগজ সংশ্লিষ্ট ব্যাংকে মিলিয়ে নিন। অনলাইনে কিছু না পাওয়া মানে ঋণ নেই নয়।', 'Look for mortgage information. Confirm loan or release papers with the lender. No online result does not establish that a property is debt-free.')}</p><a className="guide-official-link" href="https://mutation.land.gov.bd/search-mortgage-info" target="_blank" rel="noopener noreferrer">{t('সরকারি বন্ধক অনুসন্ধান ↗', 'Official mortgage search ↗')}<span className="text-xs font-normal">mutation.land.gov.bd</span></a></section>
        <section className="space-y-3"><h2 className="text-base font-bold">{t('ভূমি করের দাখিলা', 'Land tax receipts')}</h2><p>{t('হালনাগাদ দাখিলা ও হোল্ডিংয়ের তথ্য মিলিয়ে নিন। শুধু করের রসিদ দেখে মালিকানা নিশ্চিত করবেন না। সরকারি সাইটে নিজে লগইন করুন; TreeTweet-এ পাসওয়ার্ড বা OTP দেবেন না।', 'Compare current tax receipts and holding details. A tax receipt alone does not establish ownership. Sign in on the official site; do not give TreeTweet your password or OTP.')}</p><a className="guide-official-link" href="https://portal.ldtax.gov.bd/" target="_blank" rel="noopener noreferrer">{t('সরকারি ভূমি উন্নয়ন কর সেবা ↗', 'Official land development tax service ↗')}<span className="text-xs font-normal">portal.ldtax.gov.bd</span></a></section>
        <section className="space-y-3"><h2 className="text-base font-bold">{t('নকশা, সীমানা ও সরেজমিন', 'Maps, boundaries and site visit')}</h2><p>{t('একই মৌজা ও জরিপের ম্যাপ দেখুন। জমির সীমানা, বাস্তব অবস্থান, দখল ও যাতায়াতের পথ আলাদা করে মিলিয়ে নিন। প্রয়োজনে অভিজ্ঞ জরিপকারীর সাহায্য নিন; ম্যাপ একাই মালিকানা প্রমাণ নয়।', 'Use the map for the same mouza and survey. Independently check boundaries, physical location, possession and access. Use an experienced surveyor when needed; a map alone does not prove ownership.')}</p><a className="guide-official-link" href="https://dlrms.land.gov.bd/" target="_blank" rel="noopener noreferrer">{t('সরকারি মৌজা ম্যাপের সেবা ↗', 'Official mouza map service ↗')}<span className="text-xs font-normal">dlrms.land.gov.bd</span></a></section>
        <section className="space-y-3"><h2 className="text-base font-bold">{t('কাগজে QR থাকলেই আসল নয়', 'A QR code alone does not prove authenticity')}</h2><p>{t('সরকারি দাখিলা, খতিয়ান ও DCR-এর QR যাচাইয়ে সরকারি ভূমি (Bhumi) অ্যাপের নির্দেশনা অনুসরণ করুন। সন্দেহ হলে ১৬১২২-এ যোগাযোগ করুন। TreeTweet-এর QR টুল শুধু নমুনা রেকর্ড খোঁজে; সরকারি কাগজের সত্যতা যাচাই করে না।', 'Follow official Bhumi app guidance for government tax receipt, khatian and DCR QR checks. Contact 16122 if suspicious. TreeTweet’s QR tool only looks up sample records; it does not authenticate government documents.')}</p><a className="guide-official-link" href="https://bhumipedia.land.gov.bd/" target="_blank" rel="noopener noreferrer">{t('ভূমি মন্ত্রণালয়ের নির্দেশনা ↗', 'Ministry of Land guidance ↗')}<span className="text-xs font-normal">bhumipedia.land.gov.bd</span></a></section>
      </div>
    </details>
    <details className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7">
      <summary className="min-h-11 cursor-pointer font-bold">{t('তথ্যের উৎস, গোপনীয়তা ও সীমাবদ্ধতা', 'Sources, privacy and limitations')}</summary>
      <div className="pt-3 space-y-3">
        <p>{t('এই নির্দেশনা আমাদের সংক্ষিপ্ত সহায়িকা। সরকারি পোর্টালের হুবহু বক্তব্য বা আইনি মতামত নয়। সেবার ঠিকানা পর্যালোচনার তারিখ: ১৮ অক্টোবর ২০২৬; কোনো নির্দিষ্ট জমির রেকর্ড যাচাইয়ের তারিখ নয়।', 'This is our concise guidance, not a verbatim government statement or a legal opinion. Service directory reviewed: 18 October 2026; this is not the verification date of any plot record.')}</p>
        <p>{t('এই পাঁচটি চিহ্ন শুধু পাতার স্মৃতিতে থাকে। ভাষার পছন্দ ও ডেমো দলিল এই ব্রাউজারে সংরক্ষিত হতে পারে। হোস্টিং সেবা সাধারণ সংযোগের তথ্য ও ত্রুটির লগ প্রক্রিয়া করতে পারে। বাইরের সরকারি সাইটের নিজস্ব নিয়ম প্রযোজ্য।', 'The five marks stay in page memory only. Language preferences and demo deeds may be stored in this browser. The hosting service may process ordinary connection data and error logs. External government sites apply their own policies.')}</p>
        <p>{t('ডেমো টুলে শুধু বানানো তথ্য দিন। কোনো আসল পরিচয়পত্র, ফোন নম্বর বা ব্যক্তিগত দলিল দেবেন না। ব্রাউজারের সাইট ডেটা মুছে স্থানীয় তথ্য সরাতে পারেন।', 'Use made-up information in demo tools. Do not provide real identity documents, phone numbers or private deeds. Clear this site’s browser data to remove local information.')}</p>
        <p>{t('কিছু সরকারি সাইট আমাদের স্বয়ংক্রিয় পরীক্ষায় খোলেনি। ঠিকানা সরকারি সূত্রে মিলিয়ে দেওয়া হয়েছে; সর্বক্ষণ চালু থাকার নিশ্চয়তা নেই।', 'Some official sites blocked or timed out in our automated checks. Addresses were cross-checked against official sources; continuous availability is not guaranteed.')}</p>
        <a href="https://bhumipedia.land.gov.bd/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{t('ভূমি মন্ত্রণালয়ের প্রকাশনা ও নির্দেশনা ↗', 'Ministry of Land publications and guidance ↗')}</a>
      </div>
    </details>
    <div className="border-t border-slate-200 pt-5 print:hidden"><p className="text-sm text-slate-600 mb-3">{t('নমুনা দিয়ে বুঝে দেখতে চান? বানানো রেকর্ডে ঝুঁকি পরীক্ষার উদাহরণ আছে।', 'Want to explore an example? Try risk checks using made-up sample records.')}</p><button type="button" onClick={onTryDemo} className="min-h-11 rounded-xl border border-emerald-300 bg-white px-4 py-2 font-semibold text-emerald-900">{t('নমুনা যাচাই দেখুন', 'Try the sample checker')}</button></div>
  </div>;
}
