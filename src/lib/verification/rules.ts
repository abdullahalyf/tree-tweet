import { KhatianRecord, PlotStatusRecord, DeedRecord } from '../db/schema';
import { normalizeBengaliName } from '../validation/normalize';
import { verifyDeedIntegrity } from './hash';
import { VerificationIssue, VerificationResult, VerificationStatus } from './types';

export const MANDATORY_LEGAL_DISCLAIMER_BN =
  'সতর্কীকরণ ও ঘোষণা: এই অ্যাপ্লিকেশনটি শুধুমাত্র প্রাথমিক যাচাইকরণ ও ঝুঁকি মূল্যায়নের জন্য তৈরি (LandTech Innovation Hackathon 2026)। এটি সরকারের কোনো অফিসিয়াল মালিকানা সনদ নয়। জমি ক্রয়ের পূর্বে মূল দলিলপত্র সংশ্লিষ্ট সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রি অফিস হতে যাচাই করা আবশ্যক।';

/**
 * Rule 1: Checks if Khatian record exists
 */
export function verifyKhatianExists(khatian: KhatianRecord | null, dagNo: string): VerificationIssue[] {
  if (!khatian) {
    return [
      {
        code: 'KHATIAN_NOT_FOUND',
        severity: 'CRITICAL',
        titleBn: 'খতিয়ান পাওয়া যায়নি',
        descriptionBn: `দাগ নম্বর ${dagNo} এর জন্য কোনো সরকারি রেকর্ডীয় খতিয়ান তথ্য সিস্টেমে পাওয়া যায়নি।`,
      },
    ];
  }
  return [];
}

/**
 * Rule 2: Checks if land is government khas land
 */
export function verifyLandType(khatian: KhatianRecord): VerificationIssue[] {
  if (khatian.land_type === 'khas') {
    return [
      {
        code: 'KHAS_LAND_PROHIBITED',
        severity: 'CRITICAL',
        titleBn: 'সরকারি খাস জমি',
        descriptionBn: 'উক্ত জমিটি সরকারের খাস খতিয়ানভুক্ত। ব্যক্তি পর্যায়ে এই জমি ক্রয়-বিক্রয় আইনত নিষিদ্ধ।',
        field: 'land_type',
      },
    ];
  }
  return [];
}

/**
 * Rule 3: Checks Mutation (নামজারি) Status
 */
export function verifyMutationStatus(khatian: KhatianRecord): VerificationIssue[] {
  if (khatian.mutation_status === 'none') {
    return [
      {
        code: 'MUTATION_NOT_DONE',
        severity: 'WARNING',
        titleBn: 'নামজারি সম্পন্ন হয়নি',
        descriptionBn: 'জমির নামজারি (মিউটেশন) সম্পন্ন হয়নি। জমি ক্রয়ের পূর্বে হালনাগাদ নামজারি পর্চা আবশ্যক।',
        field: 'mutation_status',
      },
    ];
  }
  if (khatian.mutation_status === 'pending') {
    return [
      {
        code: 'MUTATION_PENDING',
        severity: 'WARNING',
        titleBn: 'নামজারি প্রক্রিয়াধীন',
        descriptionBn: 'এই দাগের নামজারি প্রক্রিয়াধীন রয়েছে। চূড়ান্ত নামজারি খতিয়ান পরীক্ষা করুন।',
        field: 'mutation_status',
      },
    ];
  }
  return [];
}

/**
 * Rule 4: Compares Seller Name with Khatian Owner Name
 * Distinguishes minor spelling/prefix variation (YELLOW) from total mismatch (RED).
 */
export function verifySellerMatch(ownerName: string, sellerName: string): VerificationIssue[] {
  const normOwner = normalizeBengaliName(ownerName);
  const normSeller = normalizeBengaliName(sellerName);

  // Exact match
  if (ownerName.trim() === sellerName.trim()) {
    return [];
  }

  // Check if they match after normalizing honorific prefixes (e.g. 'মো:' vs 'মোহাম্মদ')
  if (normOwner === normSeller) {
    return [
      {
        code: 'SELLER_NAME_VARIATION',
        severity: 'WARNING',
        titleBn: 'মালিক ও বিক্রেতার নামে সামান্য অমিল',
        descriptionBn: `রেকর্ডীয় মালিক '${ownerName}' এবং দলিলের বিক্রেতা '${sellerName}' এর বানানে বা পদবীতে সামান্য পার্থক্য রয়েছে। এনআইডি যাচাই বা হলফনামা প্রয়োজন।`,
        field: 'seller',
      },
    ];
  }

  // Check if they match after removing spaces and punctuation
  const cleanOwner = normOwner.replace(/[\.\:\-\s]/g, '');
  const cleanSeller = normSeller.replace(/[\.\:\-\s]/g, '');

  if (cleanOwner === cleanSeller) {
    return [
      {
        code: 'SELLER_NAME_VARIATION',
        severity: 'WARNING',
        titleBn: 'মালিক ও বিক্রেতার নামে সামান্য অমিল',
        descriptionBn: `রেকর্ডীয় মালিক '${ownerName}' এবং দলিলের বিক্রেতা '${sellerName}' এর বানানে বা পদবীতে সামান্য পার্থক্য রয়েছে। এনআইডি যাচাই বা হলফনামা প্রয়োজন।`,
        field: 'seller',
      },
    ];
  }

  // Token-level comparison (e.g., missing honorific or minor word omission)
  const ownerWords = normOwner.split(/\s+/).filter(Boolean);
  const sellerWords = normSeller.split(/\s+/).filter(Boolean);
  const sharedWords = ownerWords.filter((w) => sellerWords.includes(w));
  const maxWords = Math.max(ownerWords.length, sellerWords.length);

  // If at least 2 core words and majority of words match
  if (sharedWords.length >= 2 && sharedWords.length / maxWords >= 0.5) {
    return [
      {
        code: 'SELLER_NAME_VARIATION',
        severity: 'WARNING',
        titleBn: 'মালিক ও বিক্রেতার নামে সামান্য অমিল',
        descriptionBn: `রেকর্ডীয় মালিক '${ownerName}' এবং দলিলের বিক্রেতা '${sellerName}' এর বানানে বা পদবীতে সামান্য পার্থক্য রয়েছে। এনআইডি যাচাই বা হলফনামা প্রয়োজন।`,
        field: 'seller',
      },
    ];
  }

  // Major mismatch: Different person claiming to sell
  return [
    {
      code: 'SELLER_OWNER_MISMATCH',
      severity: 'CRITICAL',
      titleBn: 'মালিক ও বিক্রেতার তথ্যে গুরুতর অমিল',
      descriptionBn: `রেকর্ডীয় খতিয়ানের মূল মালিক '${ownerName}', কিন্তু বিক্রয়ের প্রস্তাবক বা দলিলের বিক্রেতা '${sellerName}'। অননুমোদিত ব্যক্তির জমি বিক্রির ঝুঁকি রয়েছে।`,
      field: 'seller',
    },
  ];
}

/**
 * Rule 5: Checks Financial & Legal Encumbrances (Mortgage, Court Case)
 */
export function verifyPlotEncumbrances(plotStatus: PlotStatusRecord | null): VerificationIssue[] {
  const issues: VerificationIssue[] = [];
  if (!plotStatus || typeof plotStatus.mortgaged !== 'boolean' || typeof plotStatus.court_case !== 'boolean') {
    issues.push({
      code: 'PLOT_STATUS_UNAVAILABLE', severity: 'WARNING',
      titleBn: 'বন্ধক ও মামলার তথ্য অসম্পূর্ণ',
      descriptionBn: 'বন্ধক ও আদালতের মামলার রেকর্ড পাওয়া যায়নি বা অসম্পূর্ণ। অনুপস্থিত তথ্যকে দায়মুক্তির প্রমাণ হিসেবে বিবেচনা করা যাবে না।',
    });
  }
  if (!plotStatus) return issues;

  if (plotStatus.mortgaged) {
    issues.push({
      code: 'PLOT_MORTGAGED',
      severity: 'WARNING',
      titleBn: 'জমি বন্ধকযুক্ত রয়েছে',
      descriptionBn: 'এই জমিটি ব্যাংক অথবা আর্থিক প্রতিষ্ঠানে বন্ধক রাখা হয়েছে। দায়মুক্তি সনদ ব্যতীত জমি হস্তান্তর ঝুঁকিপূর্ণ।',
      field: 'mortgaged',
    });
  }

  if (plotStatus.court_case) {
    issues.push({
      code: 'PLOT_COURT_DISPUTE',
      severity: 'CRITICAL',
      titleBn: 'আদালতে বিচারাধীন মামলা রয়েছে',
      descriptionBn: 'এই দাগের জমির উপর বিজ্ঞ আদালতে মোকদ্দমা বা নিষেধাজ্ঞা রয়েছে। মামলা নিষ্পত্তি ব্যতীত ক্রয় নিষেধ।',
      field: 'court_case',
    });
  }

  return issues;
}

/**
 * Rule 6: Checks Area Availability (Excessive Area Check)
 */
export function verifyAreaAvailability(remainingArea: number, proposedArea: number): VerificationIssue[] {
  if (!Number.isFinite(remainingArea) || remainingArea < 0 || !Number.isFinite(proposedArea) || proposedArea <= 0) {
    return [{
      code: 'INVALID_AREA', severity: 'CRITICAL',
      titleBn: 'জমির পরিমাণের তথ্য অবৈধ',
      descriptionBn: 'রেকর্ডীয় বা প্রস্তাবিত জমির পরিমাণ একটি বৈধ সসীম সংখ্যা নয়। মূল রেকর্ড যাচাই করুন।',
      field: 'area',
    }];
  }
  if (proposedArea > remainingArea) {
    return [
      {
        code: 'EXCESSIVE_AREA_REQUESTED',
        severity: 'CRITICAL',
        titleBn: 'খতিয়ানের অবশিষ্টের চেয়ে বেশি জমি বিক্রির চেষ্টা',
        descriptionBn: `খতিয়ানের অবশিষ্ট জমির পরিমাণ ${remainingArea.toFixed(4)} শতক, কিন্তু বিক্রির জন্য চাওয়া হচ্ছে ${proposedArea.toFixed(4)} শতক (${(proposedArea - remainingArea).toFixed(4)} শতক অতিরিক্ত)।`,
        field: 'area',
      },
    ];
  }
  return [];
}

/**
 * Rule 7: Checks for Double-Sale or Conflicting Deeds
 */
export function verifyDoubleSale(deeds: DeedRecord[], currentDeedNo?: string): VerificationIssue[] {
  const activeDeeds = deeds.filter((d) => d.status === 'active');

  // If there are multiple active deeds or conflicting deed transfers
  if (activeDeeds.length > 1) {
    const deedNumbers = activeDeeds.map((d) => d.deed_no).join(', ');
    return [
      {
        code: 'DOUBLE_SALE_DETECTED',
        severity: 'CRITICAL',
        titleBn: 'দ্বৈত বিক্রির ঝুঁকি (Double Sale)',
        descriptionBn: `উক্ত দাগের বিপরীতে একাধিক সক্রিয় হস্তান্তর দলিল (${deedNumbers}) বিদ্যমান। একই দাগের জমি পুনরায় বিক্রির প্রচেষ্টা থাকতে পারে।`,
        field: 'deed_no',
      },
    ];
  }

  // If target deed is already recorded as transferred
  if (currentDeedNo) {
    const match = deeds.find((d) => d.deed_no.toUpperCase() === currentDeedNo.toUpperCase());
    if (match && match.status === 'cancelled') {
      return [
        {
          code: 'DEED_CANCELLED',
          severity: 'CRITICAL',
          titleBn: 'দলিলটি বাতিল ঘোষিত',
          descriptionBn: `দলিল নম্বর ${currentDeedNo} ইতিপূর্বে বাতিল (Cancelled) করা হয়েছে।`,
          field: 'deed_no',
        },
      ];
    }
  }

  return [];
}

/**
 * Rule 8: Checks Cryptographic Deed Hash Integrity
 */
export async function verifyDeedHashIntegrity(deed: DeedRecord): Promise<VerificationIssue[]> {
  const { isValid, expectedHash, storedHash } = await verifyDeedIntegrity(deed);
  if (!isValid) {
    return [
      {
        code: 'DEED_HASH_MISMATCH',
        severity: 'CRITICAL',
        titleBn: 'দলিল টেম্পারিং বা ডিজিটাল হ্যাশ অমিল',
        descriptionBn: `দলিলের মূল তথ্য পরিবর্তন বা বিকৃতি শনাক্ত হয়েছে। মূল হ্যাশ: ${expectedHash.slice(0, 16)}..., সংরক্ষিত হ্যাশ: ${storedHash.slice(0, 16)}...`,
        field: 'hash',
      },
    ];
  }
  return [];
}

/**
 * Comprehensive Verification Orchestrator
 * Executes all rules and compiles a clear traffic-light status result.
 */
export async function runLandVerification(params: {
  dagNo: string;
  khatian: KhatianRecord | null;
  plotStatus: PlotStatusRecord | null;
  deeds: DeedRecord[];
  targetDeedNo?: string;
  proposedArea?: number;
  sellerName?: string;
}): Promise<VerificationResult> {
  const issues: VerificationIssue[] = [];
  const { dagNo, khatian, plotStatus, deeds, targetDeedNo, proposedArea, sellerName } = params;

  // 1. Khatian existence
  const khatianIssues = verifyKhatianExists(khatian, dagNo);
  issues.push(...khatianIssues);

  // Identify matching or target deed
  let selectedDeed: DeedRecord | null = null;
  if (targetDeedNo) {
    selectedDeed = deeds.find((d) => d.deed_no.toUpperCase() === targetDeedNo.toUpperCase()) || null;
  } else if (deeds.length > 0) {
    selectedDeed = deeds.find((deed) => deed.status === 'active') || deeds[0];
  }

  if (!selectedDeed) {
    issues.push({
      code: targetDeedNo ? 'DEED_NOT_FOUND' : 'DEED_RECORDS_MISSING',
      severity: targetDeedNo ? 'CRITICAL' : 'WARNING',
      titleBn: targetDeedNo ? 'অনুসন্ধানকৃত দলিল পাওয়া যায়নি' : 'দলিলের রেকর্ড অনুপস্থিত',
      descriptionBn: targetDeedNo
        ? `দলিল নম্বর ${targetDeedNo} এই দাগের রেকর্ডে পাওয়া যায়নি। বিক্রেতা, জমির পরিমাণ এবং দলিলের হ্যাশ যাচাই সম্পন্ন হয়নি।`
        : 'এই দাগের দলিলের রেকর্ড পাওয়া যায়নি। বিক্রেতা, জমির পরিমাণ এবং দলিলের হ্যাশ যাচাই সম্পন্ন হয়নি।',
      field: 'deed_no',
    });
  }

  if ((khatian && khatian.dag_no !== dagNo) || (plotStatus && plotStatus.dag_no !== dagNo) || deeds.some((deed) => deed.dag_no !== dagNo)) {
    issues.push({
      code: 'RECORD_PLOT_MISMATCH', severity: 'CRITICAL',
      titleBn: 'রেকর্ডের দাগ নম্বরে অমিল',
      descriptionBn: 'খতিয়ান, দলিল বা আইনি স্থিতির রেকর্ডটি অনুসন্ধানকৃত দাগের সঙ্গে মেলে না। অন্য দাগের তথ্য দিয়ে যাচাই গ্রহণযোগ্য নয়।',
      field: 'dag_no',
    });
  }

  if (khatian) {
    // 2. Land type
    issues.push(...verifyLandType(khatian));

    if (!['normal', 'khas'].includes(khatian.land_type) || !['none', 'pending', 'done'].includes(khatian.mutation_status) || !khatian.owner_name.trim()) {
      issues.push({
        code: 'RECORD_DATA_INCOMPLETE', severity: 'WARNING',
        titleBn: 'খতিয়ানের তথ্য অসম্পূর্ণ',
        descriptionBn: 'খতিয়ানের মালিকানা, জমির ধরন বা নামজারির তথ্য অসম্পূর্ণ। মূল উৎস থেকে তথ্য সংগ্রহ করুন।',
      });
    }

    // 3. Mutation status
    issues.push(...verifyMutationStatus(khatian));

    // 4. Seller verification
    const sellerToCheck = sellerName || selectedDeed?.seller;
    if (sellerToCheck) {
      issues.push(...verifySellerMatch(khatian.owner_name, sellerToCheck));
    }

    // 5. Encumbrances
    issues.push(...verifyPlotEncumbrances(plotStatus));

    // 6. Area check
    const areaToCheck = proposedArea !== undefined ? proposedArea : selectedDeed?.area;
    if (areaToCheck !== undefined) {
      issues.push(...verifyAreaAvailability(khatian.remaining_area, areaToCheck));
    }
    // A supplied valid proposal must not hide an invalid recorded deed area.
    if (selectedDeed && proposedArea !== undefined && (!Number.isFinite(selectedDeed.area) || selectedDeed.area <= 0)) {
      issues.push(...verifyAreaAvailability(khatian.remaining_area, selectedDeed.area));
    }

    // 7. Double-sale check
    issues.push(...verifyDoubleSale(deeds, selectedDeed?.deed_no || targetDeedNo));

    // 8. Deed Hash integrity check
    if (selectedDeed) {
      if (!['active', 'cancelled'].includes(selectedDeed.status)) {
        issues.push({
          code: 'RECORD_DATA_INCOMPLETE', severity: 'WARNING',
          titleBn: 'দলিলের স্থিতি নিশ্চিত নয়',
          descriptionBn: 'দলিলটি সক্রিয় না বাতিল তার নির্ভরযোগ্য তথ্য পাওয়া যায়নি। মূল রেকর্ড যাচাই করুন।',
          field: 'status',
        });
      }
      const hashIssues = await verifyDeedHashIntegrity(selectedDeed);
      issues.push(...hashIssues);
    }
  }

  // Determine Overall Traffic Light Status
  const hasCritical = issues.some((i) => i.severity === 'CRITICAL');
  const hasWarning = issues.some((i) => i.severity === 'WARNING');

  let overallStatus: VerificationStatus = 'GREEN';
  let summaryBn = 'প্রদত্ত রেকর্ডে নির্ধারিত পরীক্ষায় ঝুঁকি শনাক্ত হয়নি। এটি মালিকানা নিশ্চিত করে না; মূল উৎস থেকে তথ্য যাচাই করুন।';

  if (hasCritical) {
    overallStatus = 'RED';
    summaryBn = 'সতর্কতা: জমিতে গুরুতর আইনি বা তথ্যগত ঝুঁকি শনাক্ত হয়েছে। জমি ক্রয় স্থগিত রাখা সমীচীন।';
  } else if (hasWarning) {
    overallStatus = 'YELLOW';
    summaryBn = 'মনোযোগ দিন: কিছু তথ্যগত অসঙ্গতি বা শর্তাধীন সতর্কতা রয়েছে। প্রয়োজনীয় কাগজপত্র পুনরায় পরীক্ষা করুন।';
  }

  return {
    dagNo,
    overallStatus,
    summaryBn,
    issues,
    khatian,
    plotStatus,
    deeds,
    selectedDeed,
    timestamp: new Date().toISOString(),
    disclaimerBn: MANDATORY_LEGAL_DISCLAIMER_BN,
  };
}
