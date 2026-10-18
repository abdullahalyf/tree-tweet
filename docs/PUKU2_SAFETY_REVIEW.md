# Puku2 independent safety review

Scope: root working-tree changes in `src/lib/verification/rules.ts`, `src/lib/validation/normalize.ts`, `src/lib/validation/schemas.ts`, `src/lib/demo/registry.ts`, `src/lib/services/landService.ts`, and `src/lib/actions/registerDeed.ts`, reviewed on 2026-10-18 before integration.

Skill: `review` (`E:/Software_C_back/.codex/skills/gstack-review/SKILL.md`) and its local checklist. Applied source-backed two-pass review for data safety, enum completeness, async state changes, boundary validation, and test coverage. Explicit parent instructions constrain this to read-only review: no fixes, extra agents, application processes, or test processes. No claim is made that reproduction snippets were executed.

## Findings

### P1 — Incomplete mortgage flag suppresses a known court dispute

`src/lib/verification/rules.ts:150-156`:

```ts
if (!plotStatus || typeof plotStatus.mortgaged !== 'boolean' || typeof plotStatus.court_case !== 'boolean') {
  return [{ code: 'PLOT_STATUS_UNAVAILABLE', severity: 'WARNING', ... }];
}
```

Reproduction: call `verifyPlotEncumbrances({ dag_no: '0101', mortgaged: undefined, court_case: true } as unknown as PlotStatusRecord)`. The new early return emits only WARNING and never reaches `PLOT_COURT_DISPUTE`. With otherwise clean case A inputs, this changes the overall result from RED to YELLOW even though court_case is explicitly true.

Recommended fix: retain the incomplete-data warning while independently reporting every known true flag. A missing sibling field must not erase established critical evidence. Add a regression asserting both the incomplete warning and court critical survive.

Confidence: 10/10 from direct control flow. New regression introduced by this diff.

### P1 — Unknown deed status can still receive GREEN

`src/lib/verification/rules.ts:291`:

```ts
selectedDeed = deeds.find((deed) => deed.status === 'active') || deeds[0];
```

The downstream `verifyDoubleSale` only filters status `active` (`rules.ts:212`) and rejects status `cancelled` (`rules.ts:231`). There is no unknown-status issue. `src/lib/verification/hash.ts:19-28` hashes deed_no, dag_no, seller, buyer, area, date, and prev_hash; status is deliberately outside the canonical payload.

Reproduction: clone clean case A and change only `deeds[0].status` to an unknown string or null using a runtime-data cast. Preserve the original hash. The fallback selects that deed, hash still passes, neither status branch fires, and the other clean checks leave zero issues, hence GREEN.

Recommended fix: validate known status values conservatively before classification, including non-selected records if they could hide a conflicting active deed. Keep the existing canonical hashing contract unchanged. Add a regression with unchanged valid hash and unknown status.

Confidence: 10/10 from full selection/rule/hash path. Existing gap exposed by this status-hardening work, not a newly introduced regression.

### P2 — Concurrent registrations bypass the 200-record memory bound

`src/lib/demo/registry.ts:95` checks `customDeeds.length >= 200` before `await computeDeedHash(deedPayloadData)` at line 121. Only duplicate identity is checked again after the await at line 124; insert occurs at line 141.

Reproduction: populate 199 valid custom records, then start two distinct registrations with `Promise.all`. Each sees length 199 before yielding to hashing. Both resume, pass distinct deed uniqueness, and push; final length is 201. Larger concurrent batches can exceed the bound further.

Recommended fix: recheck the capacity next to the post-hash uniqueness check immediately before the synchronous insert. The existing post-await uniqueness recheck already demonstrates the required pattern.

Confidence: 10/10 from async execution ordering. New bound is incomplete under concurrency.

## Verified improvements by source inspection

- Unknown explicit deed now produces CRITICAL `DEED_NOT_FOUND` with `selectedDeed: null`; no fallback deed silently substitutes for it.
- No deed records or missing encumbrance records now prevent GREEN.
- Record dag mismatches produce a critical issue.
- Number parsing consumes the complete normalized decimal and rejects non-finite values; area rules reject non-finite, zero/negative proposed areas and invalid remaining areas.
- Registration rejects canonical delimiters/control characters before dag normalization, validates calendar date round-trips, and rejects positive areas that round to zero.
- Post-hash deed uniqueness is rechecked before insertion.
- Service normalizes Bangla digits at its own boundary and supports live deed-only lookup.
- Restoring a browser receipt retains its original hash after validating registration fields, so edited receipt contents do not silently receive a replacement matching hash.
- Server action blocks synthetic registration in configured live mode and replaces exception details with generic user-visible errors.

## Test coverage inspected; no tests run

Existing `tests/unit-tests.test.ts` covers canonical hash compatibility, active/cancelled deed rules, fully populated encumbrance flags, area comparison, and accumulated issues. Existing `tests/phase4-tests.test.ts` covers valid registration, basic required/negative input, QR generation, retrieval, and disposable tampering. Neither existing suite covers malformed status fields or partial encumbrance records.

Read `puku3/tests/reliability-tests.test.ts`: it adds unknown target deed, missing evidence, cross-dag records, invalid area, strict numeric text, date/delimiter rejection, Bangla service normalization, clean A-H expected statuses, and fixture isolation. Shared root execution is still needed. Both P1 cases were sent to puku3 for additional regressions and to root for correction.

## Review limitations

All findings are static, concrete control-flow reproductions; no test or browser process was run because the parent owns the shared checks. No Supabase credentials/live database, deployed QR scanning, or concurrent executable harness was exercised. This report reflects a moving uncommitted working tree; root should re-review the affected guards after fixing these findings. No source files were edited.
