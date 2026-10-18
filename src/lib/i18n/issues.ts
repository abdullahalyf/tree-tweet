import type { VerificationIssue } from '@/lib/verification/types';
import type { Language } from './LanguageProvider';

const english: Record<string, [string, string]> = {
  KHATIAN_NOT_FOUND: ['Khatian unavailable', 'No ownership record was supplied. Ownership and available area cannot be assessed.'],
  KHAS_LAND_PROHIBITED: ['Government khas land', 'The supplied record marks this plot as government khas land. Do not proceed without professional review.'],
  MUTATION_NOT_DONE: ['Mutation incomplete', 'The supplied ownership mutation record is incomplete. Verify the current record with the land office.'],
  MUTATION_PENDING: ['Mutation pending', 'The supplied record shows a pending ownership mutation. Obtain the completed record before proceeding.'],
  SELLER_NAME_VARIATION: ['Seller name variation', 'The seller and recorded owner names differ. Check the original names and supporting identity documents.'],
  SELLER_OWNER_MISMATCH: ['Seller does not match owner', 'The supplied seller name does not match the recorded owner. Investigate the seller’s authority.'],
  PLOT_MORTGAGED: ['Mortgage reported', 'The supplied plot record reports a mortgage. Independently verify its status and any release documents.'],
  PLOT_COURT_DISPUTE: ['Court dispute reported', 'The supplied plot record reports a court dispute. Obtain professional advice and review the relevant orders.'],
  EXCESSIVE_AREA_REQUESTED: ['Sale exceeds available area', 'The proposed sale area exceeds the remaining area in the supplied khatian.'],
  DOUBLE_SALE_DETECTED: ['Possible double sale', 'Multiple active transfer deeds were found for this plot. Their legal effect needs independent review.'],
  DEED_CANCELLED: ['Cancelled deed', 'The selected deed is marked cancelled in the supplied records.'],
  DEED_HASH_MISMATCH: ['Deed integrity mismatch', 'The calculated SHA-256 fingerprint differs from the stored hash. This signals changed data, not conclusive legal proof of fraud.'],
  DEED_NOT_FOUND: ['Requested deed not found', 'The requested deed is absent from the supplied plot records. It cannot receive a reassuring assessment.'],
  DEED_RECORDS_MISSING: ['Deed records missing', 'No transfer deeds were supplied. Integrity, seller identity and transfer history cannot be assessed.'],
  PLOT_STATUS_UNAVAILABLE: ['Plot status unavailable', 'Mortgage and court dispute evidence is missing. No conclusion can be drawn about encumbrances.'],
  INVALID_AREA: ['Invalid land area', 'The supplied area is invalid or non-finite. Availability cannot be assessed.'],
  RECORD_DATA_INCOMPLETE: ['Incomplete record data', 'Essential record fields are missing or invalid. The supplied evidence cannot support a complete assessment.'],
  RECORD_PLOT_MISMATCH: ['Plot identifier mismatch', 'The supplied records refer to different plot identifiers. Confirm the original records before proceeding.'],
};

/** Pure presentation mapping; original identifiers and quoted names stay unchanged. */
export function localizeIssue(issue: VerificationIssue, language: Language): { title: string; description: string } {
  if (language === 'bn') return { title: issue.titleBn, description: issue.descriptionBn };
  const translated = english[issue.code];
  const originalDetails = issue.descriptionBn.match(/[“"'‘][^”"'’]+[”"'’]|DEED-[A-Za-z0-9-]+/g) ?? [];
  return {
    title: translated?.[0] ?? 'Additional verification required',
    description: `${translated?.[1] ?? 'An additional issue was reported. Review the original records with a qualified professional.'}${originalDetails.length ? ` Recorded details: ${originalDetails.join('; ')}` : ''}`,
  };
}

export const scenarioEnglish: Record<string, string> = {
  A: 'No risk detected in supplied records', B: 'Another sample with no risk detected in supplied records', C: 'Owner and seller name variation',
  D: 'Mortgage reported', E: 'Possible double sale', F: 'Seller does not match owner',
  G: 'Sale exceeds remaining area', H: 'Deed fingerprint mismatch',
};
