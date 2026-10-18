import { DeedRecord, CompletePlotData, KhatianRecord, PlotStatusRecord } from '../db/schema';
import { DEMO_SCENARIOS } from './fixtures';
import { computeDeedHash } from '../verification/hash';
import { normalizeDagNo, normalizeDeedNo, parseBanglaNumber } from '../validation/normalize';

/**
 * In-memory custom registered deeds store for Local Demo Mode.
 * CRITICAL RULE: DEMO_SCENARIOS (Cases A through H) are immutable baselines and MUST NEVER be modified.
 */
const customDeeds: DeedRecord[] = [];
const customKhatians: Map<string, KhatianRecord> = new Map();
const customPlotStatuses: Map<string, PlotStatusRecord> = new Map();

export interface SyntheticDeedInput {
  deed_no: string;
  dag_no: string;
  seller: string;
  buyer: string;
  area: number | string;
  date: string;
  prev_hash?: string | null;
  mouza?: string;
}

export interface SyntheticRegistrationResult {
  success: boolean;
  deed: DeedRecord | null;
  plotData: CompletePlotData | null;
  canonicalPayload: string;
  error?: string;
  errorCode?: 'VALIDATION_ERROR' | 'DUPLICATE_DEED' | 'REGISTRY_FULL';
}

/**
 * Registers a synthetic demo deed in Local Demo Mode.
 * - Server-side calculates cryptographic SHA-256 hash using computeDeedHash.
 * - Never trusts client-supplied hash.
 * - Normalizes Bengali digits in Dag number and area.
 * - Preserves leading zeros in Dag numbers.
 */
export async function registerSyntheticDeed(
  input: SyntheticDeedInput
): Promise<SyntheticRegistrationResult> {
  const reject = (error: string): SyntheticRegistrationResult => ({ success: false, deed: null, plotData: null, canonicalPayload: '', error, errorCode: 'VALIDATION_ERROR' });
  if (!input || typeof input !== 'object') return reject('সঠিক দলিলের তথ্য প্রদান করুন।');
  // Signed fields must not contain the canonical separator or control characters.
  for (const key of ['deed_no', 'dag_no', 'seller', 'buyer', 'date', 'prev_hash', 'mouza'] as const) {
    const value = input[key];
    if (value !== undefined && value !== null && (typeof value !== 'string' || value.length > 256 || /[|\u0000-\u001f\u007f]/.test(value))) {
      return reject('তথ্যে অবৈধ অক্ষর আছে বা নির্ধারিত দৈর্ঘ্য অতিক্রম করেছে।');
    }
  }
  const deedNo = normalizeDeedNo(input.deed_no || '');
  const rawDag = (input.dag_no || '').trim();
  const normalizedDag = normalizeDagNo(rawDag);
  const seller = (input.seller || '').trim();
  const buyer = (input.buyer || '').trim();
  const date = (input.date || '').trim();
  const prevHash = (input.prev_hash || '').trim() || 'GENESIS-0000-0000-0000-000000000001';
  const mouza = (input.mouza || '').trim() || 'ডেমোপুর';

  // Validation
  if (!deedNo) {
    return { success: false, deed: null, plotData: null, canonicalPayload: '', error: 'দলিল নম্বর আবশ্যক।' };
  }
  if (!normalizedDag) {
    return { success: false, deed: null, plotData: null, canonicalPayload: '', error: 'দাগ নম্বর আবশ্যক।' };
  }
  if (!seller) {
    return { success: false, deed: null, plotData: null, canonicalPayload: '', error: 'বিক্রেতার নাম আবশ্যক।' };
  }
  if (!buyer) {
    return { success: false, deed: null, plotData: null, canonicalPayload: '', error: 'ক্রেতার নাম আবশ্যক।' };
  }
  if (!date) {
    return { success: false, deed: null, plotData: null, canonicalPayload: '', error: 'দলিল সম্পাদনের তারিখ আবশ্যক।' };
  }

  const parsedArea = typeof input.area === 'number' ? input.area : parseBanglaNumber(String(input.area));
  if (parsedArea === null || !Number.isFinite(parsedArea) || parsedArea <= 0 || Number(parsedArea.toFixed(4)) <= 0) {
    return {
      success: false,
      deed: null,
      plotData: null,
      canonicalPayload: '',
      error: 'জমির পরিমাণ অবশ্যই শূন্যের চেয়ে বেশি এবং বৈধ সংখ্যা হতে হবে।',
    };
  }
  const numericArea = parsedArea;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
    return reject('দলিলের তারিখ একটি বৈধ ক্যালেন্ডার তারিখ হতে হবে।');
  }

  if (customDeeds.length >= 200) return { ...reject('ডেমো নিবন্ধনের সীমা পূর্ণ হয়েছে। নতুন সেশনে চেষ্টা করুন।'), errorCode: 'REGISTRY_FULL' };

  // Prevent duplicate deed_no within custom deeds or fixtures
  const existingDeed = findDeedByDeedNo(deedNo);
  if (existingDeed) {
    return {
      success: false,
      deed: null,
      plotData: null,
      canonicalPayload: '',
      error: `দলিল নম্বর "${deedNo}" ইতিপূর্বে নিবন্ধিত হয়েছে। ভিন্ন একটি নম্বর ব্যবহার করুন।`,
      errorCode: 'DUPLICATE_DEED',
    };
  }

  // Prepare payload fields and compute server-side SHA-256 hash
  const deedPayloadData = {
    deed_no: deedNo,
    dag_no: normalizedDag,
    seller,
    buyer,
    area: Number(numericArea.toFixed(4)),
    date,
    prev_hash: prevHash,
  };

  const computedHash = await computeDeedHash(deedPayloadData);

  // Digest calculation yields: recheck uniqueness before the atomic in-memory insert.
  if (findDeedByDeedNo(deedNo)) return { ...reject('এই দলিল নম্বর ইতিপূর্বে নিবন্ধিত হয়েছে।'), errorCode: 'DUPLICATE_DEED' };
  if (customDeeds.length >= 200) return { ...reject('ডেমো নিবন্ধনের সীমা পূর্ণ হয়েছে।'), errorCode: 'REGISTRY_FULL' };

  const newDeed: DeedRecord = {
    id: `custom-deed-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    deed_no: deedNo,
    dag_no: normalizedDag,
    seller,
    buyer,
    area: Number(numericArea.toFixed(4)),
    date,
    hash: computedHash,
    prev_hash: prevHash,
    status: 'active',
    created_at: new Date().toISOString(),
  };

  // Add to custom deeds
  customDeeds.push(newDeed);

  // If the plot does not already exist in baseline fixtures or custom khatians, create a synthetic khatian for it
  const baselinePlot = DEMO_SCENARIOS.find((s) => s.dagNo === normalizedDag);
  if (!baselinePlot && !customKhatians.has(normalizedDag)) {
    customKhatians.set(normalizedDag, {
      id: `custom-khatian-${normalizedDag}`,
      mouza,
      dag_no: normalizedDag,
      owner_name: seller,
      total_area: Number(numericArea.toFixed(4)),
      remaining_area: Number(numericArea.toFixed(4)),
      land_type: 'normal',
      mutation_status: 'done',
      created_at: new Date().toISOString(),
    });

    customPlotStatuses.set(normalizedDag, {
      dag_no: normalizedDag,
      mortgaged: false,
      court_case: false,
      updated_at: new Date().toISOString(),
    });
  }

  const plotData = getCompletePlotFromRegistry(normalizedDag);

  return {
    success: true,
    deed: newDeed,
    plotData,
    canonicalPayload: `${newDeed.deed_no}|${newDeed.dag_no}|${newDeed.seller}|${newDeed.buyer}|${newDeed.area.toFixed(4)}|${newDeed.date}|${newDeed.prev_hash}`,
  };
}

/**
 * Searches for a deed record by deed number in both baseline fixtures and custom registered deeds.
 */
export function findDeedByDeedNo(deedNo: string): DeedRecord | null {
  const clean = deedNo.trim().toUpperCase();

  // Search in custom registered deeds first
  const custom = customDeeds.find((d) => d.deed_no.toUpperCase() === clean);
  if (custom) return custom;

  // Search in baseline fixtures
  for (const scenario of DEMO_SCENARIOS) {
    const found = scenario.deeds.find((d) => d.deed_no.toUpperCase() === clean);
    if (found) return found;
  }

  return null;
}

/**
 * Retrieves a complete plot record by Dag number, seamlessly combining baseline fixtures with custom registered deeds.
 * Never mutates original fixtures.
 */
export function getCompletePlotFromRegistry(dagNo: string): CompletePlotData | null {
  const cleanDag = dagNo.trim();

  // 1. Check baseline scenarios
  const baseline = DEMO_SCENARIOS.find((s) => s.dagNo === cleanDag);
  if (baseline) {
    // Append any custom deeds registered for this dag without mutating the baseline array
    const attachedCustomDeeds = customDeeds.filter((d) => d.dag_no === cleanDag);
    return {
      dagNo: baseline.dagNo,
      khatian: baseline.khatian,
      plotStatus: baseline.plotStatus,
      deeds: [...baseline.deeds, ...attachedCustomDeeds],
    };
  }

  // 2. Check custom registered khatians
  const customKhatian = customKhatians.get(cleanDag);
  if (customKhatian) {
    const plotStatus = customPlotStatuses.get(cleanDag) || {
      dag_no: cleanDag,
      mortgaged: false,
      court_case: false,
    };
    const deedsForPlot = customDeeds.filter((d) => d.dag_no === cleanDag);

    return {
      dagNo: cleanDag,
      khatian: customKhatian,
      plotStatus,
      deeds: deedsForPlot,
    };
  }

  return null;
}

/**
 * Retrieves a complete plot record by deed number from the combined registry.
 */
export function getCompletePlotByDeedFromRegistry(deedNo: string): CompletePlotData | null {
  const deed = findDeedByDeedNo(deedNo);
  if (!deed) return null;
  return getCompletePlotFromRegistry(deed.dag_no);
}

/**
 * Returns all custom registered deeds (for listing / demo review).
 */
export function getCustomRegisteredDeeds(): DeedRecord[] {
  return [...customDeeds];
}

/** Restore a local demo receipt without rehashing or disguising edited data. */
export async function restoreSyntheticDeed(value: unknown): Promise<boolean> {
  if (!value || typeof value !== 'object') return false;
  const deed = value as DeedRecord;
  if (typeof deed.deed_no !== 'string' || typeof deed.hash !== 'string' || !/^[a-f0-9]{64}$/i.test(deed.hash) || deed.status !== 'active') return false;
  // Baseline receipts cannot be replaced by browser storage.
  if (DEMO_SCENARIOS.some((scenario) => scenario.deeds.some((item) => item.deed_no === deed.deed_no))) return false;
  if (findDeedByDeedNo(deed.deed_no)) return true;
  const restored = await registerSyntheticDeed({
    deed_no: deed.deed_no, dag_no: deed.dag_no, seller: deed.seller, buyer: deed.buyer,
    area: deed.area, date: deed.date, prev_hash: deed.prev_hash,
  });
  if (!restored.success || !restored.deed) return false;
  // Keep the original receipt hash so tampering is still detected by the engine.
  restored.deed.hash = deed.hash;
  return true;
}

/**
 * Resets custom deeds (used during testing to ensure clean state).
 * Baseline fixtures are unaffected because they are immutable.
 */
export function resetCustomRegistry(): void {
  customDeeds.length = 0;
  customKhatians.clear();
  customPlotStatuses.clear();
}
