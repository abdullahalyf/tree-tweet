'use client';

import dynamic from 'next/dynamic';

const LandTechApp = dynamic(() => import('@/components/LandTechApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg animate-pulse mb-3">
        জমির
      </div>
      <p className="text-xs font-semibold text-slate-500">সিস্টেম প্রস্তুত হচ্ছে...</p>
    </div>
  ),
});

export default function Home() {
  return <LandTechApp />;
}
