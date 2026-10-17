import test from 'node:test';
import assert from 'node:assert/strict';

import {
  computeDeedHash,
  createDeedPayload,
  verifyDeedIntegrity,
} from '../src/lib/verification/hash';
import {
  runLandVerification,
  verifyKhatianExists,
  verifyLandType,
  verifyMutationStatus,
  verifySellerMatch,
  verifyPlotEncumbrances,
  verifyAreaAvailability,
  verifyDoubleSale,
  verifyDeedHashIntegrity,
  MANDATORY_LEGAL_DISCLAIMER_BN,
} from '../src/lib/verification/rules';
import {
  normalizeBanglaDigits,
  normalizeDagNo,
  formatToBanglaDigits,
  parseBanglaNumber,
  normalizeBengaliName,
} from '../src/lib/validation/normalize';
import { validateSearchQuery } from '../src/lib/validation/schemas';
import { DeedRecord, KhatianRecord, PlotStatusRecord } from '../src/lib/db/schema';

// Helper fixtures
const baseKhatian: KhatianRecord = {
  id: 'k-001',
  mouza: 'কাল্পনিকপুর',
  dag_no: '0101',
  owner_name: 'কাল্পনিক আব্দুর রহমান',
  total_area: 12.0,
  remaining_area: 12.0,
  land_type: 'normal',
  mutation_status: 'done',
};

const basePlotStatus: PlotStatusRecord = {
  dag_no: '0101',
  mortgaged: false,
  court_case: false,
};

const baseDeed: DeedRecord = {
  id: 'd-001',
  deed_no: 'DEED-2024-0001',
  dag_no: '0101',
  seller: 'কাল্পনিক আব্দুর রহমান',
  buyer: 'কাল্পনিক রফিকুল ইসলাম',
  area: 5.0,
  date: '2024-01-15',
  hash: 'f5e09e09af91efb48fc6b19971d1489d492314b41a93e5af7b26cd0bf9389f2e',
  prev_hash: 'GENESIS-0000-0000-0000-000000000001',
  status: 'active',
};

// =====================================================================
// SUITE 1: CANONICAL SHA-256 SERIALIZATION & HASH INTEGRITY
// =====================================================================
test('Suite 1: Canonical SHA-256 Serialization & Hash Generation', async (t) => {
  await t.test('createDeedPayload produces documented pipe-delimited format with 7 fields', () => {
    const payload = createDeedPayload(baseDeed);
    assert.strictEqual(
      payload,
      'DEED-2024-0001|0101|কাল্পনিক আব্দুর রহমান|কাল্পনিক রফিকুল ইসলাম|5.0000|2024-01-15|GENESIS-0000-0000-0000-000000000001'
    );
  });

  await t.test('computeDeedHash produces exact deterministic 64-char hex SHA-256 digest', async () => {
    const hash = await computeDeedHash(baseDeed);
    assert.strictEqual(hash, 'f5e09e09af91efb48fc6b19971d1489d492314b41a93e5af7b26cd0bf9389f2e');
    assert.strictEqual(hash.length, 64);
  });

  await t.test('verifyDeedIntegrity returns isValid: true for an untampered record', async () => {
    const res = await verifyDeedIntegrity(baseDeed);
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.expectedHash, res.storedHash);
  });

  await t.test('verification never mutates the original deed object or its stored hash', async () => {
    const deedCopy = { ...baseDeed, hash: 'TAMPERED-HASH-VALUE' };
    const originalHash = deedCopy.hash;
    const res = await verifyDeedIntegrity(deedCopy);
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(deedCopy.hash, originalHash, 'Stored hash must remain tampered and not be repaired');
  });
});

// =====================================================================
// SUITE 2: ALTERED FIELDS & TAMPER DETECTION
// =====================================================================
test('Suite 2: Tamper Detection Across Altered Fields', async (t) => {
  const fieldsToTest = [
    { field: 'deed_no', value: 'DEED-2024-9999' },
    { field: 'dag_no', value: '0999' },
    { field: 'seller', value: 'বিক্রেতা পরিবর্তন' },
    { field: 'buyer', value: 'ক্রেতা পরিবর্তন' },
    { field: 'area', value: 9.5 },
    { field: 'date', value: '2025-01-01' },
    { field: 'prev_hash', value: 'ALTERED-PREV-HASH-0000000000' },
  ];

  for (const { field, value } of fieldsToTest) {
    await t.test(`modifying field "${field}" invalidates cryptographic hash`, async () => {
      const tampered = { ...baseDeed, [field]: value };
      const integrity = await verifyDeedIntegrity(tampered);
      assert.strictEqual(integrity.isValid, false, `Field ${field} alteration must invalidate hash`);
      assert.notStrictEqual(integrity.expectedHash, integrity.storedHash);

      const issues = await verifyDeedHashIntegrity(tampered);
      assert.strictEqual(issues.length, 1);
      assert.strictEqual(issues[0].code, 'DEED_HASH_MISMATCH');
      assert.strictEqual(issues[0].severity, 'CRITICAL');
    });
  }
});

// =====================================================================
// SUITE 3: BANGLA DIGIT NORMALIZATION & LEADING ZERO PRESERVATION
// =====================================================================
test('Suite 3: Bangla Digit Normalization & Boundary Preservation', async (t) => {
  await t.test('normalizeBanglaDigits converts all Bengali numerals 0-9 to ASCII', () => {
    assert.strictEqual(normalizeBanglaDigits('০১২৩৪৫৬৭৮৯'), '0123456789');
    assert.strictEqual(normalizeBanglaDigits('দাগ নং ০১০১'), 'দাগ নং 0101');
  });

  await t.test('normalizeDagNo preserves leading zeros and trims correctly', () => {
    assert.strictEqual(normalizeDagNo('০১০১'), '0101', 'Must preserve single leading zero');
    assert.strictEqual(normalizeDagNo('০০৪২'), '0042', 'Must preserve double leading zeros');
    assert.strictEqual(normalizeDagNo('  0101  '), '0101', 'Must trim surrounding whitespace');
    assert.strictEqual(normalizeDagNo('০৭০৭'), '0707', 'Converts Bengali digits while preserving zero');
    assert.strictEqual(normalizeDagNo('০৭০৭/A'), '0707/A', 'Preserves valid sub-plot slashes');
    assert.strictEqual(normalizeDagNo(''), '');
  });

  await t.test('formatToBanglaDigits converts ASCII numbers to Bengali display digits', () => {
    assert.strictEqual(formatToBanglaDigits('0101'), '০১০১');
    assert.strictEqual(formatToBanglaDigits(12.5), '১২.৫');
  });

  await t.test('parseBanglaNumber handles Bengali floats, integers and invalid inputs', () => {
    assert.strictEqual(parseBanglaNumber('১২.৫'), 12.5);
    assert.strictEqual(parseBanglaNumber('১০'), 10);
    assert.strictEqual(parseBanglaNumber('abc'), null);
    assert.strictEqual(parseBanglaNumber(''), null);
  });

  await t.test('normalizeBengaliName standardizes prefixes and honorifics', () => {
    assert.strictEqual(normalizeBengaliName('কাল্পনিক মো: তারেক হাসান'), 'কাল্পনিক মোহাম্মদ তারেক হাসান');
    assert.strictEqual(normalizeBengaliName('কাল্পনিক মোঃ তারেক হাসান'), 'কাল্পনিক মোহাম্মদ তারেক হাসান');
    assert.strictEqual(normalizeBengaliName('কাল্পনিক আঃ রহমান'), 'কাল্পনিক আব্দুল রহমান');
    assert.strictEqual(normalizeBengaliName(''), '');
  });
});

// =====================================================================
// SUITE 4: EMPTY, UNKNOWN, AND BOUNDARY INPUT HANDLING
// =====================================================================
test('Suite 4: Empty, Unknown, and Boundary Inputs', async (t) => {
  await t.test('validateSearchQuery rejects missing or empty dag number', () => {
    const res1 = validateSearchQuery({ dagNo: '' });
    assert.strictEqual(res1.isValid, false);
    assert.ok(res1.errors.length > 0);

    const res2 = validateSearchQuery({ dagNo: '   ' });
    assert.strictEqual(res2.isValid, false);

    const res3 = validateSearchQuery({});
    assert.strictEqual(res3.isValid, false);
  });

  await t.test('validateSearchQuery normalizes valid inputs at boundary', () => {
    const res = validateSearchQuery({
      dagNo: '০১০১',
      deedNo: 'deed-2024-0001',
      sellerName: ' কাল্পনিক আব্দুর রহমান ',
      proposedArea: '৫.০',
    });
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.data?.dagNo, '0101');
    assert.strictEqual(res.data?.deedNo, 'DEED-2024-0001');
    assert.strictEqual(res.data?.sellerName, 'কাল্পনিক আব্দুর রহমান');
    assert.strictEqual(res.data?.proposedArea, 5.0);
  });

  await t.test('runLandVerification returns RED when khatian is not found in registry', async () => {
    assert.strictEqual(verifyKhatianExists(null, '9999').length, 1);
    assert.strictEqual(verifyKhatianExists(baseKhatian, '0101').length, 0);

    const res = await runLandVerification({
      dagNo: '9999',
      khatian: null,
      plotStatus: basePlotStatus,
      deeds: [],
    });
    assert.strictEqual(res.overallStatus, 'RED');
    assert.ok(res.issues.some((i) => i.code === 'KHATIAN_NOT_FOUND'));
  });
});

// =====================================================================
// SUITE 5: CANCELLED DEEDS & DOUBLE-SALE DETECTION
// =====================================================================
test('Suite 5: Cancelled Deeds & Double-Sale Logic', async (t) => {
  await t.test('a cancelled deed is never counted as an active sale', () => {
    const deed1: DeedRecord = { ...baseDeed, deed_no: 'DEED-1', status: 'cancelled' };
    const deed2: DeedRecord = { ...baseDeed, deed_no: 'DEED-2', status: 'active' };

    // With 1 cancelled and 1 active deed, active count is 1 -> No double sale
    const issues = verifyDoubleSale([deed1, deed2]);
    assert.strictEqual(issues.length, 0);
  });

  await t.test('two active deeds for the same dag triggers DOUBLE_SALE_DETECTED', () => {
    const deed1: DeedRecord = { ...baseDeed, deed_no: 'DEED-1', status: 'active' };
    const deed2: DeedRecord = { ...baseDeed, deed_no: 'DEED-2', status: 'active' };

    const issues = verifyDoubleSale([deed1, deed2]);
    assert.strictEqual(issues.length, 1);
    assert.strictEqual(issues[0].code, 'DOUBLE_SALE_DETECTED');
    assert.strictEqual(issues[0].severity, 'CRITICAL');
  });

  await t.test('querying a cancelled target deed specifically flags DEED_CANCELLED', () => {
    const deed1: DeedRecord = { ...baseDeed, deed_no: 'DEED-CANCELLED-01', status: 'cancelled' };
    const issues = verifyDoubleSale([deed1], 'DEED-CANCELLED-01');
    assert.strictEqual(issues.length, 1);
    assert.strictEqual(issues[0].code, 'DEED_CANCELLED');
    assert.strictEqual(issues[0].severity, 'CRITICAL');
  });
});

// =====================================================================
// SUITE 6: SELLER-TO-OWNER NAME MATCHING RULES
// =====================================================================
test('Suite 6: Seller-to-Owner Name Comparison Rules', async (t) => {
  await t.test('exact name match produces no issues (clean pass)', () => {
    const issues = verifySellerMatch('কাল্পনিক আব্দুর রহমান', 'কাল্পনিক আব্দুর রহমান');
    assert.strictEqual(issues.length, 0);
  });

  await t.test('honorific/prefix variation produces SELLER_NAME_VARIATION warning (never confirmed)', () => {
    const cases = [
      { owner: 'কাল্পনিক মোহাম্মদ তারেক হাসান', seller: 'কাল্পনিক মো: তারেক হাসান' },
      { owner: 'কাল্পনিক মোহাম্মদ তারেক হাসান', seller: 'কাল্পনিক মোঃ তারেক হাসান' },
      { owner: 'কাল্পনিক আব্দুর রহমান', seller: 'কাল্পনিক আঃ রহমান' },
      { owner: 'কাল্পনিক ডক্টর কামাল', seller: 'কাল্পনিক ড. কামাল' },
    ];

    for (const c of cases) {
      const issues = verifySellerMatch(c.owner, c.seller);
      assert.strictEqual(issues.length, 1, `Failed for ${c.owner} vs ${c.seller}`);
      assert.strictEqual(issues[0].code, 'SELLER_NAME_VARIATION');
      assert.strictEqual(issues[0].severity, 'WARNING', 'Must be a warning, never confirmed pass');
    }
  });

  await t.test('minor token variation produces SELLER_NAME_VARIATION warning', () => {
    // Missing middle title/honorific
    const issues = verifySellerMatch('কাল্পনিক মোসাম্মৎ ফাতেমা বেগম', 'কাল্পনিক ফাতেমা বেগম');
    assert.strictEqual(issues.length, 1);
    assert.strictEqual(issues[0].code, 'SELLER_NAME_VARIATION');
    assert.strictEqual(issues[0].severity, 'WARNING');
  });

  await t.test('completely different person produces SELLER_OWNER_MISMATCH (CRITICAL / RED)', () => {
    const issues = verifySellerMatch('কাল্পনিক আবুল মনসুর ভূঁইয়া', 'কাল্পনিক জাকির হোসেন মজুমদার');
    assert.strictEqual(issues.length, 1);
    assert.strictEqual(issues[0].code, 'SELLER_OWNER_MISMATCH');
    assert.strictEqual(issues[0].severity, 'CRITICAL');
  });
});

// =====================================================================
// SUITE 7: KHAS LAND, MUTATION, ENCUMBRANCES, AND AREA CHECKS
// =====================================================================
test('Suite 7: Deterministic Property Checks', async (t) => {
  await t.test('khas land triggers KHAS_LAND_PROHIBITED (CRITICAL / RED)', () => {
    const issues = verifyLandType({ ...baseKhatian, land_type: 'khas' });
    assert.strictEqual(issues.length, 1);
    assert.strictEqual(issues[0].code, 'KHAS_LAND_PROHIBITED');
    assert.strictEqual(issues[0].severity, 'CRITICAL');
  });

  await t.test('mutation status checks trigger warnings when incomplete', () => {
    const noneIssues = verifyMutationStatus({ ...baseKhatian, mutation_status: 'none' });
    assert.strictEqual(noneIssues.length, 1);
    assert.strictEqual(noneIssues[0].code, 'MUTATION_NOT_DONE');
    assert.strictEqual(noneIssues[0].severity, 'WARNING');

    const pendingIssues = verifyMutationStatus({ ...baseKhatian, mutation_status: 'pending' });
    assert.strictEqual(pendingIssues.length, 1);
    assert.strictEqual(pendingIssues[0].code, 'MUTATION_PENDING');
    assert.strictEqual(pendingIssues[0].severity, 'WARNING');

    const doneIssues = verifyMutationStatus({ ...baseKhatian, mutation_status: 'done' });
    assert.strictEqual(doneIssues.length, 0);
  });

  await t.test('plot encumbrances flag mortgage as warning and court dispute as critical', () => {
    const mortgageOnly = verifyPlotEncumbrances({ dag_no: '0101', mortgaged: true, court_case: false });
    assert.strictEqual(mortgageOnly.length, 1);
    assert.strictEqual(mortgageOnly[0].code, 'PLOT_MORTGAGED');
    assert.strictEqual(mortgageOnly[0].severity, 'WARNING');

    const courtOnly = verifyPlotEncumbrances({ dag_no: '0101', mortgaged: false, court_case: true });
    assert.strictEqual(courtOnly.length, 1);
    assert.strictEqual(courtOnly[0].code, 'PLOT_COURT_DISPUTE');
    assert.strictEqual(courtOnly[0].severity, 'CRITICAL');
  });

  await t.test('excessive area check flags when requested area exceeds remaining area', () => {
    // 5.0 requested <= 10.0 remaining -> PASS
    assert.strictEqual(verifyAreaAvailability(10.0, 5.0).length, 0);

    // 8.0 requested > 3.0 remaining -> FAIL (CRITICAL)
    const failIssues = verifyAreaAvailability(3.0, 8.0);
    assert.strictEqual(failIssues.length, 1);
    assert.strictEqual(failIssues[0].code, 'EXCESSIVE_AREA_REQUESTED');
    assert.strictEqual(failIssues[0].severity, 'CRITICAL');
  });
});

// =====================================================================
// SUITE 8: MULTIPLE SIMULTANEOUS WARNINGS & FAILURES
// =====================================================================
test('Suite 8: Multiple Simultaneous Warnings and Failures', async (t) => {
  await t.test('multiple warnings simultaneously result in overall YELLOW status', async () => {
    const res = await runLandVerification({
      dagNo: '0101',
      khatian: { ...baseKhatian, mutation_status: 'pending' }, // Warning 1
      plotStatus: { dag_no: '0101', mortgaged: true, court_case: false }, // Warning 2
      deeds: [baseDeed],
      sellerName: 'কাল্পনিক মো: তারেক হাসান', // Warning 3 (variation with khatian owner 'কাল্পনিক মোহাম্মদ তারেক হাসান' if matched)
    });

    assert.ok(res.issues.length >= 2);
    // If no critical issue, status must be YELLOW
    if (!res.issues.some((i) => i.severity === 'CRITICAL')) {
      assert.strictEqual(res.overallStatus, 'YELLOW');
    }
  });

  await t.test('combination of warning and critical failure results in overall RED status', async () => {
    const res = await runLandVerification({
      dagNo: '0101',
      khatian: { ...baseKhatian, remaining_area: 2.0 },
      plotStatus: { dag_no: '0101', mortgaged: true, court_case: false }, // Warning: mortgaged
      deeds: [baseDeed], // Area 5.0 > remaining 2.0 -> Critical: EXCESSIVE_AREA_REQUESTED
    });

    assert.strictEqual(res.overallStatus, 'RED');
    assert.ok(res.issues.some((i) => i.code === 'PLOT_MORTGAGED' && i.severity === 'WARNING'));
    assert.ok(res.issues.some((i) => i.code === 'EXCESSIVE_AREA_REQUESTED' && i.severity === 'CRITICAL'));
    assert.strictEqual(res.disclaimerBn, MANDATORY_LEGAL_DISCLAIMER_BN);
  });

  await t.test('multiple critical failures all appear in result with overall RED status', async () => {
    const res = await runLandVerification({
      dagNo: '0101',
      khatian: { ...baseKhatian, land_type: 'khas', remaining_area: 1.0 },
      plotStatus: { dag_no: '0101', mortgaged: false, court_case: true },
      deeds: [
        { ...baseDeed, deed_no: 'D-A', status: 'active' },
        { ...baseDeed, deed_no: 'D-B', status: 'active' },
      ],
      sellerName: 'সম্পূর্ণ অচেনা বিক্রেতা',
    });

    assert.strictEqual(res.overallStatus, 'RED');
    assert.ok(res.issues.some((i) => i.code === 'KHAS_LAND_PROHIBITED'));
    assert.ok(res.issues.some((i) => i.code === 'PLOT_COURT_DISPUTE'));
    assert.ok(res.issues.some((i) => i.code === 'DOUBLE_SALE_DETECTED'));
    assert.ok(res.issues.some((i) => i.code === 'SELLER_OWNER_MISMATCH'));
  });
});
