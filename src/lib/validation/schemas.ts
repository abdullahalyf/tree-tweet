import { normalizeDagNo, normalizeDeedNo, parseBanglaNumber } from './normalize';

/**
 * Verification Search Query Parameters
 */
export interface VerificationSearchQuery {
  dagNo: string;
  deedNo?: string;
  sellerName?: string;
  proposedArea?: number;
}

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors: string[];
}

/**
 * Validates and normalizes search input at the boundary before executing database queries.
 */
export function validateSearchQuery(input: {
  dagNo?: string | null;
  deedNo?: string | null;
  sellerName?: string | null;
  proposedArea?: string | number | null;
}): ValidationResult<VerificationSearchQuery> {
  const errors: string[] = [];

  if (!input.dagNo || typeof input.dagNo !== 'string' || input.dagNo.trim().length === 0) {
    errors.push('দাগ নম্বর প্রদান করা আবশ্যক (Dag number is required)');
    return { isValid: false, errors };
  }

  const normalizedDag = normalizeDagNo(input.dagNo);
  if (normalizedDag.length === 0) {
    errors.push('সঠিক দাগ নম্বর লিখুন (Valid dag number is required)');
  }

  let normalizedDeed: string | undefined;
  if (input.deedNo && typeof input.deedNo === 'string' && input.deedNo.trim().length > 0) {
    normalizedDeed = normalizeDeedNo(input.deedNo);
  }

  let sellerName: string | undefined;
  if (input.sellerName && typeof input.sellerName === 'string' && input.sellerName.trim().length > 0) {
    sellerName = input.sellerName.trim();
  }

  let proposedArea: number | undefined;
  if (input.proposedArea !== undefined && input.proposedArea !== null && input.proposedArea !== '') {
    const parsed = parseBanglaNumber(input.proposedArea);
    if (parsed === null || parsed <= 0) {
      errors.push('জমির পরিমাণ একটি বৈধ ধনাত্মক সংখ্যা হতে হবে (Proposed area must be a positive number)');
    } else {
      proposedArea = parsed;
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    data: {
      dagNo: normalizedDag,
      deedNo: normalizedDeed,
      sellerName,
      proposedArea,
    },
    errors: [],
  };
}
