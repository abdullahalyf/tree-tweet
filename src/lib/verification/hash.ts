import { DeedRecord } from '../db/schema';

/**
 * Creates canonical payload string for a deed record.
 * Format: deed_no|dag_no|seller|buyer|area_formatted|date|prev_hash
 */
export function createDeedPayload(deed: {
  deed_no: string;
  dag_no: string;
  seller: string;
  buyer: string;
  area: number;
  date: string;
  prev_hash?: string | null;
}): string {
  const formattedArea = Number(deed.area).toFixed(4);
  const prevHashVal = deed.prev_hash || 'GENESIS';
  return [
    deed.deed_no.trim(),
    deed.dag_no.trim(),
    deed.seller.trim(),
    deed.buyer.trim(),
    formattedArea,
    deed.date.trim(),
    prevHashVal,
  ].join('|');
}

/**
 * Computes SHA-256 hash using the Web Crypto API (standard in modern browsers and Node 19+).
 */
export async function computeDeedHash(deed: {
  deed_no: string;
  dag_no: string;
  seller: string;
  buyer: string;
  area: number;
  date: string;
  prev_hash?: string | null;
}): Promise<string> {
  const payload = createDeedPayload(deed);
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Synchronous hash computation for Node server environments (Node crypto).
 */
export function computeDeedHashSync(deed: {
  deed_no: string;
  dag_no: string;
  seller: string;
  buyer: string;
  area: number;
  date: string;
  prev_hash?: string | null;
}): string {
  // If running in Node.js
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require('crypto');
    const payload = createDeedPayload(deed);
    return nodeCrypto.createHash('sha256').update(payload, 'utf8').digest('hex');
  } catch {
    // Fallback if require is not available
    return '';
  }
}

/**
 * Verifies whether the deed record's stored hash matches its authentic cryptographic digest.
 */
export async function verifyDeedIntegrity(deed: DeedRecord): Promise<{
  isValid: boolean;
  expectedHash: string;
  storedHash: string;
}> {
  const expectedHash = await computeDeedHash(deed);
  const storedHash = (deed.hash || '').toLowerCase().trim();
  const isValid = expectedHash.toLowerCase() === storedHash;

  return {
    isValid,
    expectedHash,
    storedHash,
  };
}
