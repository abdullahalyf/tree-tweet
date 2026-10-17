import React from 'react';
import { Card, CardBody } from '../ui/card';

interface NoResultViewProps {
  searchedDagNo: string;
  searchedDeedNo?: string;
  onReset: () => void;
}

export function NoResultView({ searchedDagNo, searchedDeedNo, onReset }: NoResultViewProps) {
  return (
    <Card className="border-slate-200 shadow-md animate-fade-in overflow-hidden">
      <CardBody className="p-8 sm:p-12 text-center space-y-5">
        <div className="h-16 w-16 mx-auto rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl text-slate-500 shadow-inner">
          🔎
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-xl font-bold text-slate-800">
            কোনো রেকর্ড পাওয়া যায়নি
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            দাগ নম্বর <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">&quot;{searchedDagNo}&quot;</span>
            {searchedDeedNo && (
              <> ও দলিল নম্বর <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">&quot;{searchedDeedNo}&quot;</span></>
            )}{' '}
            এর বিপরীতে ডেমো ডাটাবেজে কোনো রেকর্ডীয় তথ্য পাওয়া যায়নি।
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-lg mx-auto text-left text-xs text-amber-900 leading-relaxed space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-800">
            <span>💡</span>
            <span>কী করণীয়:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
            <li>দাগ নম্বরের বানান বা ডিজিট পুনরায় মিলিয়ে নিন।</li>
            <li>ডেমো রেকর্ডে অন্তর্ভুক্ত দাগগুলো (<code className="font-mono font-bold text-slate-800">০১০১</code> থেকে <code className="font-mono font-bold text-slate-800">০৮০৮</code>) নির্বাচন করে পরীক্ষা করুন।</li>
            <li>বাস্তব জমি ক্রয়ের ক্ষেত্রে সংশ্লিষ্ট উপজেলা ভূমি অফিসে খতিয়ান ও পর্চা যাচাই করুন।</li>
          </ul>
        </div>

        <div className="pt-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <span>নতুন অনুসন্ধান করুন</span>
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
