'use client';

import React from 'react';
import { VerificationStatus } from '@/lib/verification/types';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

interface BadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  fullLabel?: boolean;
  className?: string;
}
export function StatusBadge({ status, size = 'md', fullLabel = false, className = '' }: BadgeProps) {
  const { t } = useLanguage();
  const configs = {
    GREEN: { icon: '✓', short: t('ঝুঁকি শনাক্ত হয়নি (সবুজ)', 'No risk detected (green)'), full: t('প্রদত্ত রেকর্ডের পরীক্ষায় ঝুঁকি শনাক্ত হয়নি', 'No risk detected in checks of supplied records') },
    YELLOW: { icon: '!', short: t('অতিরিক্ত যাচাই (হলুদ)', 'Further review (yellow)'), full: t('সতর্কতা — অতিরিক্ত যাচাই প্রয়োজন', 'Caution — further verification required') },
    RED: { icon: '×', short: t('গুরুতর ঝুঁকি (লাল)', 'Serious risk (red)'), full: t('গুরুতর ঝুঁকি শনাক্ত হয়েছে', 'Serious risk detected') },
  };
  const current = configs[status];
  return <span className={`risk-badge risk-${status.toLowerCase()} risk-badge-${size} ${className}`} role="status" aria-label={current.full}><span className="risk-badge-icon" aria-hidden="true">{current.icon}</span><span>{fullLabel ? current.full : current.short}</span></span>;
}
