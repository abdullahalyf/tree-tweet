# Puku2 final UI / locale integration review

Reviewed parent working tree and puku1 commit `da87f3e` on 2026-10-18, using the already loaded `review` skill/checklist and `ecc:frontend-design-direction` product-state contract. Read-only review: no source edits, tests, browser, server, or subagents. Parent owns rendered checks and corrections.

## Findings

### P1 — Partial encumbrance evidence displays a green passed row

`puku1/src/components/verification/VerificationResultView.tsx:24` marks the mortgage/court check available when `!!plotStatus && !inconsistent`, and its issue codes include only `PLOT_MORTGAGED` / `PLOT_COURT_DISPUTE`. `PLOT_STATUS_UNAVAILABLE` is absent from availability/issue logic. Line 37 maps available plus no matching issue to green `No issue in supplied records`.

Reproduction: use otherwise clean case A result with `plotStatus: { dag_no: '0101', mortgaged: undefined, court_case: false }` at runtime. Root engine correctly emits YELLOW `PLOT_STATUS_UNAVAILABLE`, but Assessment still paints the encumbrance row green. The same problem occurs with unknown court status and no known true flag.

Fix: classify this row as insufficient evidence when either flag is not a boolean or `PLOT_STATUS_UNAVAILABLE` exists. Preserve known positive evidence and its review-required state. Parent has assigned this fix to puku1.

### P1 — Records tab converts unknown values into definite legal statuses

`VerificationResultView.tsx:44` uses `plotStatus.mortgaged ? reported : not reported` and likewise court_case. Undefined/null become reassuring negative statements, while malformed truthy strings such as `false` become positive statements. Line 47 uses `deed.status === 'active' ? Active : Cancelled`, and line 42 uses `land_type === 'khas' ? Government khas : Normal`. These invent known values for unavailable/invalid data, contradicting engine caution messages. Mutation similarly labels every unknown value Incomplete rather than Unknown.

Reproduction: open Records for partial encumbrance or unknown selected deed status (root regression scenarios). Unknown mortgage displays Not reported, unknown deed displays Cancelled, and unknown land type displays Normal.

Fix: explicit boolean tri-state and exhaustive known enum branches with a bilingual Unknown / unavailable fallback. Parent has assigned this fix to puku1.

### P2 — Existing registration print action was removed

Baseline `agent/puku2~1:src/components/registration/DemoRegistrationForm.tsx` had a success-state button with `onClick={() => window.print()}` beside the QR download. Latest registration success UI (`puku1/src/components/registration/DemoRegistrationForm.tsx:159-167`) retains QR PNG download but has no print action. No alternative print action exists in the component tree.

Reproduction: complete demo registration; available actions include Download QR, Check this deed, and another registration, but no print control.

Fix: retain a bilingual print action and verify a readable registration/QR print preview. No result-report export action was found in the original VerificationResultView, so this report does not assert loss of an original report-export feature.

### P2 — Search completion removes focus without an accessible result handoff

Parent `src/components/LandTechApp.tsx` keys SearchForm by submitted identifiers and changes those identifiers at search start. This remounts the form and removes the focused submit/demo control. Its completion effect only calls `resultsRef.current?.scrollIntoView(...)`; the results wrapper has aria-busy but is neither focused nor a live completion announcement. The existing role=status announces loading, not result availability.

Reproduction for parent rendered review: focus a case button or submit field by keyboard, activate it, then inspect document.activeElement and screen-reader announcement after completion. Source confirms the original control is removed on changed-key submission; exact browser/screen-reader behavior remains untested.

Fix: provide a deliberate keyboard/screen-reader handoff to a focusable result heading or announce concise completion and expose a jump-to-results action. Apply the same policy to empty and error states without repeatedly stealing focus on language changes.

## Additional state caveat

`VerificationResultView.tsx:18-19` can show integrity/history passed when khatian is null because those rows do not require khatian, whereas root rules currently execute both checks only inside `if (khatian)`. The normal service returns no result when khatian is missing, so no current app workflow reaching this mismatch was established. Treat as component robustness / future direct-consumer risk, not an additional release-blocking finding.

## Source checks with no detected regression

- LanguageProvider defaults Bangla, safely accesses guarded storage, updates html language, and keeps in-memory changes when storage is unavailable.
- Form labels, validation, known error-code messages, result headings, QR tools, mutation simulation, and tamper controls have bilingual presentation.
- Recorded Bengali names and identifiers remain original data as specified.
- QR PNG download is retained; generated code image has localized alt text.
- QR modal has a named modal role, Escape close, Tab boundary loop, initial focus, focus restoration, bounded scrolling, and camera cleanup. Browser behavior remains unverified.
- QR tools explicitly disclose that camera preview does not decode codes, and provide pasted-link/manual sample recovery paths.
- Root rendering uses ssr:false for this browser-dependent workspace, so its window-based initial tab read is not currently a server-render crash.
- Existing result-report export was not found, so none is claimed removed.

## Parent follow-up / known work

Parent already assigned tri-state/enum and row availability fixes to puku1; parent also found inaccurate English B/D scenario captions and is handling them. Parent owns skip-link styling and desktop/mobile screenshots. This report is source evidence, not a rendered accessibility/viewport pass. Review the next puku1 commit independently before finalizing.
