'use client';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Card, CardBody } from '../ui/card';
interface NoResultViewProps { searchedDagNo: string; searchedDeedNo?: string; onReset: () => void }
export function NoResultView({ searchedDagNo, searchedDeedNo, onReset }: NoResultViewProps) {
 const { t } = useLanguage();
 return <Card className="border-slate-200"><CardBody className="p-6 sm:p-10 space-y-4 text-center">
   <h2 className="font-bold text-xl">{t('কোনো রেকর্ড পাওয়া যায়নি', 'No records found')}</h2>
   <p className="break-words [overflow-wrap:anywhere]">{t('অনুসন্ধান করা দাগ', 'Requested plot')}: <b>{searchedDagNo || '—'}</b>{searchedDeedNo && <> · {t('দলিল', 'Deed')}: <b>{searchedDeedNo}</b></>}</p>
   <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">{t('রেকর্ড না পাওয়া নিরাপদ মালিকানার প্রমাণ নয়। নম্বর পুনরায় মিলিয়ে দেখুন অথবা আটটি কাল্পনিক নমুনা থেকে বেছে নিন। বাস্তব জমির জন্য মূল রেকর্ড স্বাধীনভাবে যাচাই করুন।', 'Missing records do not prove safe ownership. Check the identifiers or choose one of the eight synthetic samples. Independently verify original records for real land.')}</p>
   <button type="button" onClick={onReset} className="rounded-xl bg-slate-800 px-5 py-3 text-white">{t('নতুন অনুসন্ধান', 'New search')}</button>
 </CardBody></Card>;
}
