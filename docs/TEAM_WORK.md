# Puku work queue

Updated: 18 October 2026 (Asia/Dhaka). Root integrates all work. This file is a resumable task queue, not a promise of execution outside an active session or after account/runtime limits.

## Current batch: P5 portal and animated hero

All three Puku tasks below are completed. Root has reviewed the integrated local build and is publishing it; commit/PR/deployment identifiers and live checks are pending. No worker is represented as still running after its completed assignment. Detailed local evidence and limitations: [P5_PORTAL_RELEASE.md](P5_PORTAL_RELEASE.md).

| Owner | Scope | State | Verification / handoff |
| --- | --- | --- | --- |
| Puku hero / review | Full-width, three-slide image hero; manual and automatic controls; motion/accessibility review | Completed; root publishing | Seven-second rotation gate, stable play/pause control, local browser focus/resume/pause checks passed |
| Puku portal | Five illustrated P5 cards and sidebar; guide/main integration; green footer; local aerial asset and provenance | Completed; root publishing | Targeted zero-warning lint, integrated typecheck/build and local mobile/desktop navigation checks passed |
| Puku carousel QA | Hero playback lifecycle hook and five tests; timer/focus review | Completed; root publishing | Five new lifecycle tests and full root test command passed; hook timer typing corrected |
| Root | Integration review, complete verification, Git publication and Vercel deployment | Local checks passed; publication pending | Full tests, typecheck, zero-warning lint and production build passed; local bn390/en320/desktop1440 checked; production evidence pending |

Current hero uses crossfades and camera drift with offscreen/foreground/preference gating. The older side-by-side scene's birds and scroll parallax are historical and are no longer part of the rendered guide. Section-entry reveals and reading progress remain. The two image assets are illustrative; no government records or affiliation were added.

## Previously shipped baseline

Main `bb31180` merged [PR6](https://github.com/abdullahalyf/tree-tweet/pull/6): all three Puku deliverables, raw-input safety, motion lifecycle tests and the requested filled next-step buttons. Production: https://treetweet.vercel.app/. Deployed app source `0a087f2`; Vercel `dpl_8m1ptB6t8SP4c45CnefEa1D68uFq`. Both app-source CI jobs passed; live mobile buttons/help/image and malformed-query rejection were checked. Earlier PR5 supplied the rural imagery and scroll motion. Official-government-record integration remains unavailable.

## Previous batch: merged work

| Owner | Worktree / branch | State | Owned deliverables | Merge gate |
| --- | --- | --- | --- | --- |
| Puku1 | puku1 / puku/buyer-help | Merged PR6 | BuyerHelp: six bilingual terms, seven FAQs and office reminder; worker5d96b45 → root4b8e978 | Primary-source claim map, targeted lint/typecheck, root mobile/desktop and keyboard checks passed |
| Puku2 | puku2 / puku/mobile-accessibility | Merged PR6 | Native QR dialog, camera controls, linked errors, menu dismiss and wrapping; workeraf7b52b → root50cee04 | Root native modality/Escape/focus return, unsupported/manual QR, foreignURL rejection, menu and blank-error checks passed; camera hardware/pending permission untested |
| Puku3 | puku3 / puku/reliability-hardening | Merged PR6 | Strict identifiers, runtime service validation and receipt conflict checks; workera235e7a → root93a833f | New hardening3, receipts9 and full root regression suite passed; root raw-input UI correction verified |
| Root | root | Merged and deployed | Live verification, motion lifecycle regression coverage, integration and release | Diff review, lint/typecheck/build/tests, CI and live browser checks completed; local app server stopped |

## Worker continuation contract

Each worker proceeds independently through its scoped implementation, review, targeted verification and fixes. Keep a handoff file after milestones containing changed files, exact commands/results, unresolved issues and next action. Root assigns either a worktree/branch or explicitly disjoint shared-root files; follow that assignment and do not commit another worker's changes. Do not alter another worker's files, install dependencies, start another app server, or claim unobserved behavior. Root owns commits, pushes, merges, deployment and a single shared server/browser unless explicitly delegated. Keep the existing three worker directories; no additional services are needed.

If a worker or parent reaches a runtime/quota limit, its filesystem/checkpoint remains the continuation source. The next session should read this queue and handoffs, inspect actual git state, resume unfinished items, then update states to Review/Merged with commit evidence. Do not mark an item complete from a chat report alone.

## Next meaningful work

- Root is publishing the completed P5 portal/hero batch and will add commit/deployment/live evidence. Worker implementation tasks are completed; no independent worker is promised to continue after session termination. Older worker branches intentionally remain at their own scoped commits; refresh from main before assigning overlapping implementation again.
- Actual government-record integration requires an authorized data source and access agreement; no worker should fabricate it or scrape private records.
- Physical-phone camera decoding/permission-pending behavior, native OS reduced motion and actual print/PDF output require hands-on acceptance. Source inspection and simulated preference tests do not establish these results.
- New user feedback should become a bounded task with owned files, acceptance criteria and saved evidence, rather than an idle or repetitive loop.
