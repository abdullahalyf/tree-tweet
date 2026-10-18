'use client';

import { useId } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

type Copy = readonly [string, string];
const terms: { name: Copy; meaning: Copy }[] = [
  { name: ['খতিয়ান', 'Khatian'], meaning: ['জমির রেকর্ডের বিবরণ। এতে রেকর্ডের মালিক, মৌজা, দাগ ও জমির পরিমাণের মতো তথ্য থাকে। শুধু এটি দেখে কেনার সিদ্ধান্ত নেবেন না।', 'A land record containing details such as the recorded owner, mouza, plot and area. Do not decide to buy from this record alone.'] },
  { name: ['দাগ নম্বর', 'Dag / plot number'], meaning: ['নির্দিষ্ট মৌজা ও জরিপের রেকর্ডে জমির অংশ চেনার নম্বর। জেলা, মৌজা ও জরিপ না মিলিয়ে শুধু নম্বর মেলাবেন না।', 'A number identifying a plot in a particular mouza and survey record. Match its location and survey as well as the number.'] },
  { name: ['মৌজা', 'Mouza'], meaning: ['ভূমির রেকর্ডে ব্যবহৃত এলাকার পরিচয়। কাগজে লেখা মৌজার নাম ও জেএল নম্বর মিলিয়ে দেখুন।', 'An area identifier used in land records. Compare the mouza name and JL number shown on the papers.'] },
  { name: ['নামজারি', 'Mutation'], meaning: ['মালিকানা পরিবর্তনের পর সরকারি রেকর্ডে নাম হালনাগাদের প্রক্রিয়া। আবেদন করা আর সিদ্ধান্ত হয়ে যাওয়া এক কথা নয়।', 'The process of updating the recorded name after an ownership change. Submitting an application is different from receiving a decision.'] },
  { name: ['খাস জমি', 'Government khas land'], meaning: ['সরকারের খাস হিসেবে থাকা জমি বোঝাতে ব্যবহৃত কথা। এই নির্দিষ্ট জমি খাস কি না, ভূমি অফিসের রেকর্ডে মিলিয়ে নিন।', 'A term used for land held as government khas land. Confirm the classification of this particular plot with the land office.'] },
  { name: ['অধিগ্রহণ', 'Acquisition'], meaning: ['সরকারের জমি নেওয়ার প্রক্রিয়া বোঝাতে ব্যবহৃত কথা। নোটিশ আছে কি না ও বর্তমান অবস্থা জেলা প্রশাসকের ভূমি অধিগ্রহণ শাখায় জানুন।', 'A term for the government acquiring land. Ask the district administration land acquisition office about notices and current status.'] },
];
const questions: { question: Copy; answer: Copy }[] = [
  { question: ['সব কাগজ হাতে নেই। শুরু করব কীভাবে?', 'Some papers are missing. Where do I start?'], answer: ['যে কাগজ আছে, সেখান থেকে জেলা, উপজেলা, মৌজা, জরিপ, খতিয়ান ও দাগ লিখে রাখুন। কোন কাগজ নেই তার তালিকা করুন। খতিয়ানের কপির জন্য ভূমি রেকর্ডের সেবা এবং দলিলের কপির জন্য সংশ্লিষ্ট সাব-রেজিস্ট্রি অফিসে পাওয়ার উপায় জিজ্ঞেস করুন।', 'Write down the district, upazila, mouza, survey, khatian and plot from the papers you have. List what is missing. Ask the land records service how to obtain a khatian copy and the relevant sub-registry office how to obtain deed copies.'] },
  { question: ['বিক্রেতার নাম ও খতিয়ানের নাম আলাদা হলে?', 'What if the seller’s name differs from the khatian?'], answer: ['নিজে নাম বদলে বা মিল ধরে নেবেন না। মূল পরিচয়পত্র, দলিল ও নামজারির কাগজ একসাথে মিলিয়ে দেখুন। বানানের অল্প অমিল হলেও একই ব্যক্তি কি না এবং বিক্রির অধিকার আছে কি না, সংশ্লিষ্ট অফিস ও প্রয়োজনে আইনজীবীর সাহায্যে জানুন।', 'Do not edit the name or assume a match. Compare original identity documents, the deed and mutation papers together. Even a spelling difference needs a check of identity and authority to sell with the relevant office and, when needed, a lawyer.'] },
  { question: ['সরকারি সাইট খুলছে না। কী করব?', 'What if the official website will not open?'], answer: ['কিছুক্ষণ পরে চেষ্টা করুন বা সরকারি ভূমি পোর্টাল থেকে সেবার পথ খুলুন। তবুও না হলে সংশ্লিষ্ট ভূমি অফিসে সেবার উপায় জিজ্ঞেস করুন। সাইট না খোলা জমির ভালো বা খারাপ অবস্থার প্রমাণ নয়।', 'Try again later or open the service through the official land portal. If it is still unavailable, ask the relevant land office how to obtain the service. A website failure says nothing about the land’s status.'] },
  { question: ['অনলাইনে কোনো ফল পাইনি। জমি ঠিক আছে?', 'No online result appeared. Is the land clear?'], answer: ['না—তথ্য না পাওয়া মানে সমস্যা নেই নয়। এলাকা, মৌজা, জরিপ ও নম্বর আবার মিলিয়ে দেখুন। মামলা, খাস বা অধিগ্রহণের তথ্য জানতে সংশ্লিষ্ট অফিসে খোঁজ নিন। না জানা বিষয়কে অজানা হিসেবেই রাখুন।', 'No. Missing information does not mean there is no problem. Recheck the location, mouza, survey and identifiers. Ask the relevant office about disputes, khas status or acquisition. Keep anything unconfirmed marked unknown.'] },
  { question: ['নামজারির আবেদন আছে। আর কী দেখব?', 'There is a mutation application. What else should I check?'], answer: ['আবেদনের নম্বরের সঙ্গে সিদ্ধান্ত বা আদেশ এবং হালনাগাদ খতিয়ান চান। আগের ও বর্তমান কাগজে দাগ, জমির পরিমাণ ও নাম মিলিয়ে দেখুন। ইতিহাস অসম্পূর্ণ হলে ভূমি অফিসে মূল নথি সম্পর্কে জিজ্ঞেস করুন।', 'Ask for the decision or order and updated khatian as well as the application reference. Compare names, plots and area in earlier and current papers. Ask the land office about the original file if the history is incomplete.'] },
  { question: ['এই অ্যাপ কি আসল জমি সরকারি রেকর্ডে যাচাই করে?', 'Does this app verify real land against government records?'], answer: ['না। মূল নির্দেশিকা আপনাকে কাগজ ও সরকারি সেবার পথ দেখায়। ডেমো টুলের রেকর্ড বানানো; তার ফল আসল জমির সিদ্ধান্ত নয়। সরকারি রেকর্ড সরাসরি এখানে আনা হয় না। ডেমোতে আসল নাম, পরিচয়পত্র, ফোন বা ব্যক্তিগত দলিল দেবেন না।', 'No. The guide helps you prepare papers and find official services. Demo tools use made-up records; their results do not assess real land. Government records are not retrieved here. Do not enter real names, identity details, phone numbers or private deeds in demo tools.'] },
  { question: ['সব কাগজ জোগাড় হয়েছে। এখন টাকা দিতে পারি?', 'I have collected all the papers. Can I pay now?'], answer: ['কাগজ জোগাড় মানে যাচাই শেষ নয়। মূল কাগজ, জমির পরিচয়, বিক্রির অধিকার, মামলা ও অন্য প্রয়োজনীয় তথ্য মিলিয়ে নিন। অমিল বা ঘাটতি থাকলে আগে সমাধান করুন; প্রয়োজনে ভূমি বিষয়ে অভিজ্ঞ আইনজীবীর সাহায্য নিন।', 'Collecting papers does not finish the checks. Compare original documents, plot identity, authority to sell, disputes and other relevant information. Resolve differences or gaps first; seek a lawyer experienced in land matters when needed.'] },
];

/** Compact supporting help; parent places this after the main five buyer checks. */
export function BuyerHelp() {
  const { t } = useLanguage();
  const headingId = useId();
  const pick = (copy: Copy) => t(copy[0], copy[1]);
  return <section aria-labelledby={headingId} className="space-y-3">
    <h2 id={headingId} className="text-lg font-bold text-emerald-950">{t('সহজ করে বুঝে নিন', 'A little help with the next step')}</h2>
    <details className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <summary className="min-h-11 cursor-pointer py-3 text-base font-bold text-slate-900">{t('কাগজের পরিচিত কথাগুলোর মানে', 'What common words on the papers mean')}</summary>
      <dl className="mt-3 grid gap-4 sm:grid-cols-2">{terms.map(term => <div key={term.name[1]} className="space-y-1 border-t border-slate-100 pt-3">
        <dt className="text-base font-bold text-emerald-950">{pick(term.name)}</dt><dd className="text-base leading-relaxed text-slate-700">{pick(term.meaning)}</dd>
      </div>)}</dl>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{t('এগুলো বোঝার সুবিধার জন্য ছোট ব্যাখ্যা, আইনের পূর্ণ সংজ্ঞা নয়।', 'These are short explanations for understanding the papers, not complete legal definitions.')}</p>
    </details>
    <details className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <summary className="min-h-11 cursor-pointer py-3 text-base font-bold text-slate-900">{t('কাগজে সমস্যা হলে কী করবেন?', 'What can I do when papers or information are missing?')}</summary>
      <div className="mt-3 divide-y divide-slate-100">{questions.map(item => <details key={item.question[1]} className="py-2">
        <summary className="min-h-11 cursor-pointer py-3 text-base font-semibold leading-relaxed text-slate-900">{pick(item.question)}</summary>
        <p className="pb-3 text-base leading-relaxed text-slate-700">{pick(item.answer)}</p>
      </details>)}</div>
      <aside className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2" aria-label={t('অফিসে যাওয়ার প্রস্তুতি', 'Prepare for an office visit')}>
        <h3 className="text-base font-bold text-amber-950">{t('অফিসে যাওয়ার আগে', 'Before visiting an office')}</h3>
        <p className="text-base leading-relaxed text-amber-950">{t('যে কাগজ আছে তার মূল ও কপি, জেলা–মৌজা–দাগের পরিচয়, দলিলের নম্বর ও সাল, নামজারি বা মামলার নম্বর থাকলে সঙ্গে রাখুন। কোন তথ্য নেই বা মেলেনি, লিখে নিন। কী কপি বা আবেদন লাগবে, অফিসে জিজ্ঞেস করুন।', 'Have available originals and copies, district–mouza–plot details, deed number and year, and any mutation or case references ready. Write down missing or conflicting details. Ask the office which copies or applications are needed.')}</p>
        <p className="text-sm leading-relaxed text-amber-950">{t('সরকারি সাইটের পাসওয়ার্ড বা OTP এখানে দেবেন না। এই সাহায্য আইনি মতামত বা জমি নিরাপদ হওয়ার সনদ নয়।', 'Do not give this app government-site passwords or OTPs. This help is not a legal opinion or a land clearance certificate.')}</p>
      </aside>
    </details>
  </section>;
}
