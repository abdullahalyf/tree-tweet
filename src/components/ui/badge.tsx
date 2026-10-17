import React from 'react';
import { VerificationStatus } from '@/lib/verification/types';

interface BadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  fullLabel?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = 'md',
  fullLabel = false,
  className = '',
}: BadgeProps) {
  const configs = {
    GREEN: {
      bg: 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-emerald-600/20',
      iconBg: 'bg-emerald-600 text-white',
      icon: '✓',
      shortText: 'ঝুঁকি শনাক্ত হয়নি (সবুজ)',
      fullText: 'প্রদত্ত রেকর্ডে নির্ধারিত পরীক্ষায় ঝুঁকি শনাক্ত হয়নি',
    },
    YELLOW: {
      bg: 'bg-amber-50 text-amber-900 border-amber-300 ring-amber-600/20',
      iconBg: 'bg-amber-600 text-white',
      icon: '⚠',
      shortText: 'সতর্কতা — অতিরিক্ত যাচাই (হলুদ)',
      fullText: 'সতর্কতা — অতিরিক্ত যাচাই প্রয়োজন',
    },
    RED: {
      bg: 'bg-rose-50 text-rose-900 border-rose-300 ring-rose-600/20',
      iconBg: 'bg-rose-600 text-white',
      icon: '✕',
      shortText: 'গুরুতর ঝুঁকি শনাক্ত (লাল)',
      fullText: 'গুরুতর ঝুঁকি শনাক্ত হয়েছে',
    },
  };

  const current = configs[status];
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-base sm:text-lg px-5 py-2.5 gap-3 font-bold',
  };

  const iconSizes = {
    sm: 'h-4 w-4 text-[10px]',
    md: 'h-5 w-5 text-xs',
    lg: 'h-6 w-6 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ring-1 font-semibold ${current.bg} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={current.fullText}
    >
      <span
        className={`inline-flex items-center justify-center rounded-full font-bold shrink-0 ${iconSizes[size]} ${current.iconBg}`}
        aria-hidden="true"
      >
        {current.icon}
      </span>
      <span>{fullLabel ? current.fullText : current.shortText}</span>
    </span>
  );
}
