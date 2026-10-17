import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  registerSyntheticDeed,
  getCompletePlotFromRegistry,
  findDeedByDeedNo,
  resetCustomRegistry,
} from '../src/lib/demo/registry';
import { DEMO_SCENARIOS } from '../src/lib/demo/fixtures';
import { computeDeedHash, verifyDeedIntegrity } from '../src/lib/verification/hash';
import { executeLandVerification } from '../src/lib/services/landService';
import QRCode from 'qrcode';

describe('Phase 4: Synthetic Demo Registration, Hashing, QR & Tamper Testing', () => {
  // Baseline fixture preservation snapshot
  const initialFixtureSnapshot = JSON.stringify(DEMO_SCENARIOS);

  it('1. Rejects invalid synthetic registration inputs with clear error messages', async () => {
    // Missing deed_no
    const res1 = await registerSyntheticDeed({
      deed_no: '',
      dag_no: '0909',
      seller: 'কামাল',
      buyer: 'রফিক',
      area: 5.0,
      date: '2026-03-15',
    });
    assert.equal(res1.success, false);
    assert.match(res1.error || '', /দলিল নম্বর আবশ্যক/);

    // Negative or zero area
    const res2 = await registerSyntheticDeed({
      deed_no: 'DEED-TEST-001',
      dag_no: '0909',
      seller: 'কামাল',
      buyer: 'রফিক',
      area: -2.5,
      date: '2026-03-15',
    });
    assert.equal(res2.success, false);
    assert.match(res2.error || '', /জমির পরিমাণ অবশ্যই শূন্যের চেয়ে বেশি/);
  });

  it('2. Registers valid synthetic deed, normalizes Bengali digits, and generates canonical SHA-256 hash', async () => {
    const regRes = await registerSyntheticDeed({
      deed_no: 'DEED-2026-TEST1',
      dag_no: '০৯০৯', // Bengali digits
      seller: 'কাল্পনিক খন্দকার মোস্তফা',
      buyer: 'কাল্পনিক রেজওয়ান হক',
      area: '৭.৫০', // Bengali numeral string
      date: '2026-03-20',
      prev_hash: 'GENESIS-0000-0000-0000-000000000001',
    });

    assert.equal(regRes.success, true);
    assert.ok(regRes.deed);
    assert.equal(regRes.deed.dag_no, '0909'); // Normalized with leading zero preserved
    assert.equal(regRes.deed.area, 7.5);
    assert.equal(regRes.deed.hash.length, 64);

    // Verify server-side hash matches canonical computation
    const expectedHash = await computeDeedHash({
      deed_no: 'DEED-2026-TEST1',
      dag_no: '0909',
      seller: 'কাল্পনিক খন্দকার মোস্তফা',
      buyer: 'কাল্পনিক রেজওয়ান হক',
      area: 7.5,
      date: '2026-03-20',
      prev_hash: 'GENESIS-0000-0000-0000-000000000001',
    });
    assert.equal(regRes.deed.hash, expectedHash);

    // Verify cryptographic integrity check passes
    const integrity = await verifyDeedIntegrity(regRes.deed);
    assert.equal(integrity.isValid, true);
    assert.equal(integrity.storedHash, expectedHash);
  });

  it('3. Registered synthetic deed is immediately retrievable and verifiable in Local Demo Mode', async () => {
    const plotData = getCompletePlotFromRegistry('0909');
    assert.ok(plotData);
    assert.equal(plotData.dagNo, '0909');
    assert.ok(plotData.khatian);
    assert.equal(plotData.deeds.length, 1);
    assert.equal(plotData.deeds[0].deed_no, 'DEED-2026-TEST1');

    // Run verification service
    const verifyRes = await executeLandVerification({
      dagNo: '0909',
      deedNo: 'DEED-2026-TEST1',
    });
    assert.equal(verifyRes.success, true);
    assert.equal(verifyRes.source, 'demo');
    assert.ok(verifyRes.result);
    // All checks pass for a clean registered deed
    assert.equal(verifyRes.result.overallStatus, 'GREEN');
  });

  it('4. Tampering demonstration: Altering a field in a disposable copy invalidates SHA-256 hash', async () => {
    const originalDeed = findDeedByDeedNo('DEED-2026-TEST1');
    assert.ok(originalDeed);

    // Create disposable copy and alter the area (e.g. from 7.5000 to 12.0000)
    const disposableCopy = { ...originalDeed, area: 12.0 };
    // DO NOT change stored hash (simulating unauthorized modification)

    const integrity = await verifyDeedIntegrity(disposableCopy);
    assert.equal(integrity.isValid, false);
    assert.notEqual(integrity.storedHash, integrity.expectedHash);

    // Alter buyer name in another disposable copy
    const buyerAlteredCopy = { ...originalDeed, buyer: 'অননুমোদিত ভুয়া ব্যক্তি' };
    const buyerIntegrity = await verifyDeedIntegrity(buyerAlteredCopy);
    assert.equal(buyerIntegrity.isValid, false);

    // Ensure the original deed in registry remains completely unmodified
    const untouchedDeed = findDeedByDeedNo('DEED-2026-TEST1');
    assert.ok(untouchedDeed);
    assert.equal(untouchedDeed.area, 7.5);
    assert.equal(untouchedDeed.buyer, 'কাল্পনিক রেজওয়ান হক');
    const untouchedIntegrity = await verifyDeedIntegrity(untouchedDeed);
    assert.equal(untouchedIntegrity.isValid, true);
  });

  it('5. QR code generation produces a valid data URL encoding internal verification route', async () => {
    const deedNo = 'DEED-2026-TEST1';
    const dagNo = '0909';
    const verificationUrl = `/?dag=${encodeURIComponent(dagNo)}&deed=${encodeURIComponent(deedNo)}`;

    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 2,
      width: 280,
    });

    assert.ok(qrDataUrl.startsWith('data:image/png;base64,'));
    assert.ok(qrDataUrl.length > 500);
  });

  it('6. The original 8 baseline fixtures (Cases A through H) remain strictly immutable', () => {
    const currentFixtureSnapshot = JSON.stringify(DEMO_SCENARIOS);
    assert.equal(
      currentFixtureSnapshot,
      initialFixtureSnapshot,
      'CRITICAL: Original 8 scenarios must not be mutated!'
    );
  });

  // Clean up custom registry after tests
  resetCustomRegistry();
});
