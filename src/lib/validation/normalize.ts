/**
 * LandTech Innovation Hackathon 2026
 * Bengali Digit Normalization and String Utilities
 *
 * CRITICAL REQUIREMENT (Task 4):
 * "Make dag_no a string so leading zeros are preserved.
 * Normalize Bangla digits at input boundaries, not by altering stored identifiers indiscriminately."
 */

// Mapping between Bangla numerals and ASCII digits
const BANGLA_TO_ASCII_DIGITS: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

const ASCII_TO_BANGLA_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

/**
 * Converts Bengali digits ('০'-'৯') in any string to standard ASCII digits ('0'-'9').
 * Does not strip leading zeros or alter other characters.
 */
export function normalizeBanglaDigits(input: string): string {
  if (!input) return '';
  return input.replace(/[০-৯]/g, (char) => BANGLA_TO_ASCII_DIGITS[char] || char);
}

/**
 * Converts ASCII digits ('0'-'9') in any string/number to Bengali numerals ('০'-'৯').
 * Ideal for displaying numbers to Bengali users in the UI.
 */
export function formatToBanglaDigits(value: string | number): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return str.replace(/[0-9]/g, (char) => ASCII_TO_BANGLA_DIGITS[char] || char);
}

/**
 * Normalizes user-inputted Dag Number at the application boundary:
 * 1. Converts Bangla digits to ASCII digits.
 * 2. Trims leading and trailing whitespace.
 * 3. PRESERVES leading zeros (e.g. '০১০১' -> '0101', '0042' -> '0042').
 * 4. Rejects unsupported characters rather than aliasing a different identifier.
 */
export function normalizeDagNo(input: string): string {
  if (typeof input !== 'string' || !input) return '';
  // 1. Convert Bangla numerals to ASCII
  const ascii = normalizeBanglaDigits(input.trim());
  // 2. Remove characters that are not digits, letters, or hyphens/slashes
  return /^[a-zA-Z0-9\-_/]+$/.test(ascii) ? ascii : '';
}

/**
 * Normalizes Deed Number at input boundary.
 */
export function normalizeDeedNo(input: string): string {
  if (!input) return '';
  const ascii = normalizeBanglaDigits(input.trim());
  return ascii.toUpperCase();
}

/**
 * Parses a numeric value from Bangla or English string into a standard JavaScript number.
 */
export function parseBanglaNumber(input: string | number): number | null {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  if (!input) return null;

  const normalized = normalizeBanglaDigits(input.trim());
  // Consume the whole decimal; parseFloat silently accepts values like "5junk".
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Normalizes Bengali names to distinguish minor spelling/prefix variations
 * (e.g., 'মো:' vs 'মোহাম্মদ', 'মোঃ' vs 'মোহাম্মদ') from genuine mismatches.
 */
export function normalizeBengaliName(name: string): string {
  if (!name) return '';

  return name
    .trim()
    // Standardize common prefixes (মো:, মোঃ, মো.) anywhere after word boundary
    .replace(/(?:^|\s)মো[ঃ:\.]\s*/g, ' মোহাম্মদ ')
    // Standardize ডঃ, ড., ড: -> ডক্টর
    .replace(/(?:^|\s)ড[ঃ:\.]\s*/g, ' ডক্টর ')
    // Standardize মোঃ without colon
    .replace(/(?:^|\s)মোঃ\s*/g, ' মোহাম্মদ ')
    // Standardize আঃ, আ., আ: -> আব্দুল
    .replace(/(?:^|\s)আ[ঃ:\.]\s*/g, ' আব্দুল ')
    // Replace multiple spaces with a single space
    .replace(/\s+/g, ' ')
    .trim();
}
