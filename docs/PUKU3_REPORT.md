# Puku3 regression evidence

Scope: `tests/reliability-tests.test.ts` and the bilingual `docs/ACCEPTANCE_CHECKLIST.md`. No application source, dependency manifest, existing tests or baseline fixtures changed.

Applied the requested ECC verification-loop skill. Used existing `node:test` conventions; Python testing does not apply. Root owns integration build/type/lint/security/browser checks, so this report does not claim those passed.

Baseline command from `puku3`:

```powershell
../node_modules/.bin/tsx.cmd tests/reliability-tests.test.ts
```

Observed exit code **1**: **48 tests, 7 passed, 41 failed**, including aggregate parent tests. Initial sandbox attempts with `--test` and direct execution failed with `spawn EPERM`; repeating direct execution with approved escalation allowed esbuild to run and produced the actual assertions above. No dependencies were installed by this worker and no application server/browser was launched.

Confirmed baseline failures: unknown explicit deed returns GREEN; absent deeds/status and mismatched record dag numbers can return GREEN; malformed/non-finite numeric input is accepted; invalid stored/proposed areas can pass; registration accepts invalid calendar dates, Infinity and ambiguous pipe-delimited fields. Tests assert conservative outcomes rather than newly invented issue code names. Missing evidence may legitimately yield YELLOW; unknown explicitly requested deed must yield RED and no substitute selection.

Passing positive evidence: valid Bangla digit normalization at the search validator, valid leap-date registration, leading zeros, canonical known-answer SHA-256, hash integrity, unchanged A–H expected outcomes and fixture preservation across registration/reset. The service test currently stops at its unknown-deed assertion; its later Bangla service normalization assertions have not yet run successfully. Root must rerun against source fixes.

Additional static finding: baseline `QRScannerModal.tsx` obtains a camera stream and displays preview but has no QR decoding loop/library/BarcodeDetector. Scan-success callbacks are reached through manual text or demo presets. Camera decoding must be implemented or the UI must clearly describe its limitations. Manual acceptance checks have been documented, not executed.

Diff review: three assigned files only; tests create disposable cloned records, rehash invalid stored values to avoid confusing hash detection with domain validation, and reset the custom registry with `finally`. No coverage claim: coverage was not collected. Demo service tests assume no live Supabase environment configuration; use a clean demo environment when running them.

Supplemental regression run (same command, unchanged baseline source): **52 tests, 8 passed, 44 failed**, exit 1. Added cases from independent review: unknown/null deed statuses both incorrectly yield GREEN; partial plot status with a known court dispute correctly remains RED on baseline and must continue to do so after missing-data handling changes. Acceptance guide now explicitly distinguishes browser-local demo receipts from durable cross-device registration.
