'use client';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { getBuyerChecklist, type BuyerEvidence } from '@/lib/i18n/buyerChecklist';

export function BuyerChecklist({ evidence }: { evidence: BuyerEvidence }) {
  const { t } = useLanguage();
  const copy = {
    owner: [t('বিক্রেতা ও রেকর্ডের মালিক', 'Seller and recorded owner'), t('দুজনের পরিচয় ও বিক্রির অধিকার মিলিয়ে দেখুন।', 'Compare their identities and the authority to sell.')],
    mutation: [t('নামজারি ও আগের পরিবর্তন', 'Mutation and earlier changes'), t('কখন কার নামে রেকর্ড হয়েছে, তার কাগজ দেখুন।', 'Check documents showing when the recorded ownership changed.')],
    court: [t('জমি নিয়ে মামলা', 'Court disputes over the land'), t('বর্তমান মামলা ও আদালতের আদেশ খোঁজ নিন।', 'Check current cases and court orders.')],
    khas: [t('সরকারি খাস জমি কি না', 'Whether the land is government khas land'), t('ভূমি অফিসে জমির শ্রেণি মিলিয়ে নিন।', 'Confirm the land category at the land office.')],
    acquisition: [t('সরকারি অধিগ্রহণ', 'Government acquisition'), t('সরকার জমি নেওয়ার নোটিশ দিয়েছে কি না খোঁজ নিন।', 'Check whether the government has issued an acquisition notice.')],
  };
  return <section className="space-y-3" aria-labelledby="buyer-checklist-title">
    <h3 id="buyer-checklist-title" className="text-lg font-bold">{t('কেনার আগে এই ৫টি বিষয় দেখুন', 'Check these five things before buying')}</h3>
    <p className="text-sm leading-relaxed text-slate-600">{t('এগুলো শুধু দেওয়া তথ্যের ফল। মূল কাগজ ও অফিসের তথ্য আলাদা করে যাচাই করুন।', 'These results use only the supplied information. Independently check original papers and office records.')}</p>
    <ol className="space-y-3">{getBuyerChecklist(evidence).map((check, index) => <li key={check.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
      <div className="flex flex-wrap items-start justify-between gap-2"><h4 className="text-base font-bold">{index + 1}. {copy[check.id][0]}</h4><span className={`rounded-lg px-2 py-1 text-sm font-bold ${check.state.startsWith('review') ? 'bg-amber-50 text-amber-900' : check.state === 'missing' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-900'}`}>{check.state === 'clear' ? t('দেওয়া তথ্যে সমস্যা মেলেনি', 'No issue in supplied information') : check.state === 'review' ? t('আরও যাচাই দরকার', 'Needs review') : check.state === 'review-missing' ? t('যাচাই দরকার, তথ্যও কম', 'Needs review; information also missing') : t('তথ্য পাওয়া যায়নি', 'Information missing')}</span></div>
      <p className="text-sm leading-relaxed text-slate-600">{copy[check.id][1]}</p>
    </li>)}</ol>
  </section>;
}
