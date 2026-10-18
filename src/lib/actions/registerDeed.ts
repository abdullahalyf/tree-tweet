'use server';

import QRCode from 'qrcode';
import { DeedRecord } from '../db/schema';
import { registerSyntheticDeed, SyntheticDeedInput } from '../demo/registry';
import { headers } from 'next/headers';
import { isSupabaseConfigured } from '../db/client';

export interface RegisterActionResult {
  success: boolean;
  deed?: DeedRecord;
  canonicalPayload?: string;
  qrDataUrl?: string;
  verificationUrl?: string;
  error?: string;
  errorCode?: string;
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
    // Synthetic writes must never appear to be registrations in a live database.
    if (isSupabaseConfigured()) return { success: false, error: 'লাইভ ডাটাবেজ মোডে ডেমো নিবন্ধন বন্ধ রয়েছে।', errorCode: 'LIVE_MODE_DISABLED' };
    // 1. Register synthetic deed (validates and calculates canonical SHA-256 on server)
    const registration = await registerSyntheticDeed(input);

    if (!registration.success || !registration.deed) {
      return {
        success: false,
        error: registration.error || 'দলিল নিবন্ধনে ত্রুটি ঘটেছে।',
        errorCode: registration.errorCode || 'VALIDATION_ERROR',
      };
    }

    const deed = registration.deed;

    // 2. Generate stable verification path within this app
    // Uses clean query params (?dag=...&deed=...)
    const requestHeaders = await headers();
    const host = requestHeaders.get('host') || 'localhost:3000';
    const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
    const verificationUrl = `${protocol}://${host}/?dag=${encodeURIComponent(deed.dag_no)}&deed=${encodeURIComponent(deed.deed_no)}`;

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
      error: 'সার্ভার প্রক্রিয়াকরণে ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।',
      errorCode: 'REGISTRATION_FAILED',
    };
  }
}
