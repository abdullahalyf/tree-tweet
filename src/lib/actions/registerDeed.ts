'use server';

import QRCode from 'qrcode';
import { DeedRecord } from '../db/schema';
import { registerSyntheticDeed, SyntheticDeedInput } from '../demo/registry';

export interface RegisterActionResult {
  success: boolean;
  deed?: DeedRecord;
  canonicalPayload?: string;
  qrDataUrl?: string;
  verificationUrl?: string;
  error?: string;
}

/**
 * Server Action for Synthetic Demo Deed Registration
 * Strictly executes on server:
 * - Computes canonical SHA-256 hash server-side.
 * - Never trusts client-supplied hash.
 * - Generates QR code linking to this app's verification route.
 * - Stores synthetic record in Local Demo Mode registry (or Supabase if configured).
 */
export async function registerSyntheticDeedAction(
  input: SyntheticDeedInput
): Promise<RegisterActionResult> {
  try {
    // 1. Register synthetic deed (validates and calculates canonical SHA-256 on server)
    const registration = await registerSyntheticDeed(input);

    if (!registration.success || !registration.deed) {
      return {
        success: false,
        error: registration.error || 'দলিল নিবন্ধনে ত্রুটি ঘটেছে।',
      };
    }

    const deed = registration.deed;

    // 2. Generate stable verification path within this app
    // Uses clean query params (?dag=...&deed=...)
    const verificationUrl = `/?dag=${encodeURIComponent(deed.dag_no)}&deed=${encodeURIComponent(deed.deed_no)}`;

    // 3. Generate QR code data URL (PNG)
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 2,
      width: 280,
      color: {
        dark: '#064e3b', // Emerald-900 theme color
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });

    return {
      success: true,
      deed,
      canonicalPayload: registration.canonicalPayload,
      qrDataUrl,
      verificationUrl,
    };
  } catch (err) {
    console.error('[registerSyntheticDeedAction] Server error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'সার্ভার প্রক্রিয়াকরণে ত্রুটি হয়েছে।',
    };
  }
}
