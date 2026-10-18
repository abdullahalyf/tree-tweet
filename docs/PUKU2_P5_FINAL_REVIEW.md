# Puku2 P5 final review and publication check

Reviewed parent source on 2026-10-18, latest main `5adedd3`, including P5 scope, review patches/commit list, prior Puku2 findings, current rules/presentation, receipt restoration, QR camera lifecycle, database access and publication copy. The parent source is authoritative; this report-only worker checkout is stale.

Applied the requested requesting-code-review skill at `C:/Users/Abdullah Alif/.agents/skills/synced/49221f79-4052-4898-8ae2-b87c02cf4aa5_25577de5-635b-43b8-a94f-c6f3667a6098/requesting-code-review/SKILL.md`. No source changes, tests, browsers, servers, dependency installs or subagents were run.

## Prioritized remaining finding

### P2 — Seeded Supabase mutation dates lose their explicit synthetic disclosure

`src/components/verification/VerificationResultView.tsx:60` shows the warning that mutation dates/history are invented only when `source === 'demo'`. However, `scripts/seed.mjs:258-261` and `supabase/seed.sql` populate Supabase with invented `DEMO-MUT-*` history. `executeLandVerification` sets source to `supabase` for these rows. Following the documented optional database setup and opening the Records tab therefore hides the explicit invented-history warning. The header says app database/no government connection, which does not explain that these particular dates were fabricated.

Recommended correction: preserve explicit synthetic provenance for seeded database records, or label the supported Supabase demonstration as synthetic as well. This matters before publishing a seeded Supabase version. It does not block a publication that uses the unconfigured bundled fixtures, where the existing disclosure is displayed. Source-derived reproduction; no live database was queried.

## Findings corrected during review

- **Same-day mutation ambiguity:** the previous implementation selected one latest event by array order. Two latest-date events with different statuses could yield GREEN with `done` first and YELLOW with `pending` first. Reported immediately to parent. Commit `5651e44` now checks all events on the latest date against the current status. The added regression covers both input orders; inspected but not rerun here.
- **Mutation conflict in primary presentation:** the parent-known missing checklist code and the missing specific bilingual issue text are fixed in current source. `MUTATION_HISTORY_CONFLICT` now makes the mutation row require review and explains the discrepancy/action in the overview.
- Previously resolved Puku2 encumbrance tri-state, unknown enum, registry capacity, print and result-focus findings were not reopened. The existing guards remain present.

## Source evidence supporting publication as a synthetic demo

- Acquisition missing/unknown values produce a warning; notice produces warning and acquired produces critical. Known court/acquisition risks remain present alongside incomplete evidence.
- The main result has five buyer checks. Record mismatch/incomplete data prevents clear check states; known positive evidence remains review-required. Raw hashes, diagnostic codes and engine text are within a closed native details element in results.
- Browser receipt restoration validates input through the registration path and restores the original receipt hash rather than accepting the newly computed hash as its stored fingerprint. Baseline fixtures cannot be replaced through this path. Restoration is skipped in configured Supabase searches, and synthetic registration is rejected in configured Supabase mode.
- QR code input is parsed as record identifiers rather than navigated as an external URL. Camera work uses generation guards after asynchronous permission/detection; stale acquired streams are stopped, tracks stop on close/unmount, animation frames are cancelled, and unsupported/denied paths retain manual entry. Physical scanning and screen-reader behavior remain unverified.
- README, registration, mutation simulation, QR and result copy explicitly reject government approval/title guarantees. Registration instructs users to use only synthetic information and not enter real personal data.
- Database policies intentionally permit anonymous reads of every record. README explicitly limits this setup to synthetic data. This is consistent with a public demo, not an approval to store real personal records.
- Tracked credential-related filename check found only `.env.example`, containing placeholders. A limited source scan for common secret/private-key prefixes returned no matches. This is not a complete repository-history secret audit.
- Query errors include submitted plot/deed identifiers and database error text in console logs. The supported dataset is synthetic and no real-person logging leak was established. No analytics/third-party logging sink was found in the reviewed paths.

## Verification limits

Parent previously reported all eight cases, P5/reliability/existing/presentation tests, type checking, lint and build passing; those are parent-reported results, not independently executed in this review. No live Supabase migration, physical camera, production configuration, print, browser viewport or assistive-technology check was performed here. No new blocker was established for publishing the current application with bundled synthetic fixtures and no Supabase credentials.

## Publication disclosure correction

At the parent request, the current main VerificationResultView was copied into this existing worker checkout and changed only for provenance wording and the disclosure predicate. The synthetic-history warning now appears for bundled demo mode or any validated mutation reference beginning `DEMO-`, including both supplied database seed paths. The app-database header explicitly says its records are unverified. Mixed history wording says the list includes invented entries without declaring every other entry authentic.

Installed Next.js server/client component guide was read before editing. Targeted TypeScript compilation passed using a temporary config resolving shared parent source dependencies; the temporary file was removed. Targeted ESLint passed with zero warnings from the worker directory. Full integrated root checks remain the parent responsibility. The P2 above is corrected in this worker file, pending integration.

Because this checkout predates P5, the parent should copy only `src/components/verification/VerificationResultView.tsx` from this worker, or compare it directly against main; do not interpret its broad stale-baseline Git diff as additional requested changes.
