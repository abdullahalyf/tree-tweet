import React from 'react';

export type ActiveNavTab = 'search' | 'register' | 'tamper';

interface NavbarProps {
  activeTab?: ActiveNavTab;
  onTabChange?: (tab: ActiveNavTab) => void;
}

export function Navbar({ activeTab = 'search', onTabChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-auto sm:h-16 py-2.5 sm:py-0 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-xl shadow-sm shadow-emerald-700/20 shrink-0">
              জমির
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                  জমি যাচাইকরণ ব্যবস্থা
                </span>
                <span className="hidden md:inline-flex text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  LandTech 2026
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                AI-Assisted Pre-Purchase Land Verification (Problem P5)
              </p>
            </div>
          </div>

          <span className="text-[11px] sm:hidden px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
            MVP
          </span>
        </div>

        {/* View Switcher Tabs */}
        {onTabChange && (
          <nav className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 w-full sm:w-auto overflow-x-auto justify-center">
            <button
              type="button"
              onClick={() => onTabChange('search')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔍 জমি যাচাই
            </button>
            <button
              type="button"
              onClick={() => onTabChange('register')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📝 ডেমো দলিল নিবন্ধন
            </button>
            <button
              type="button"
              onClick={() => onTabChange('tamper')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'tamper'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛡️ টেম্পারিং ডেমো
            </button>
          </nav>
        )}

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
            ডেমো সংস্করণ (MVP)
          </span>
        </div>
      </div>
    </header>
  );
}
