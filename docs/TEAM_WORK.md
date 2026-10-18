# Puku work queue

Updated: 18 October 2026 (Asia/Dhaka). Root integrates all work. This file is a resumable task queue, not a promise of execution outside an active session or after account/runtime limits.

## Current shipped baseline

Main `0cbb00a` merged PR5: generated rural rice-field imagery, responsive image, camera/bird motion, scroll parallax, section entrances and pause controls. Production: https://treetweet.vercel.app/. Deployed source `6a2b5c0`; Vercel `dpl_GT6zTxPiECFAdY2XcnDbyPxmkRDc`. PR5 checks passed. Official-government-record integration remains unavailable.

## Assigned work

| Owner | Worktree / branch | State | Owned deliverables | Merge gate |
| --- | --- | --- | --- | --- |
| Puku1 | puku1 / puku/buyer-help | Integrated; release review | BuyerHelp: six bilingual terms, seven FAQs and office reminder; worker5d96b45 → root4b8e978 | Primary-source claim map, targeted lint/typecheck, root mobile/desktop and keyboard checks passed |
| Puku2 | puku2 / puku/mobile-accessibility | Integrated; release review | Native QR dialog, camera controls, linked errors, menu dismiss and wrapping; workeraf7b52b → root50cee04 | Root native modality/Escape/focus return, unsupported/manual QR, foreignURL rejection, menu and blank-error checks passed; camera hardware/pending permission untested |
| Puku3 | puku3 / puku/reliability-hardening | Integrated; release review | Strict identifiers, runtime service validation and receipt conflict checks; workera235e7a → root93a833f | New hardening3, receipts9 and full root regression suite passed; root raw-input UI correction verified |
| Root | root | Running | Live verification, motion lifecycle regression coverage, integration and release | Diff review, lint/typecheck/build/tests, CI, live browser checks |

## Worker continuation contract

Each worker proceeds independently through its scoped implementation, review, targeted verification and fixes. Keep a handoff file after milestones containing changed files, exact commands/results, unresolved issues and next action. Commit scoped files in its branch. Do not alter another worker's files, install dependencies, start another app server, or claim unobserved behavior. Root owns pushes/merges/deployment and a single shared production server/browser. Keep the existing three worker directories; no additional workers or services are needed.

If a worker or parent reaches a runtime/quota limit, its filesystem/checkpoint remains the continuation source. The next session should read this queue and handoffs, inspect actual git state, resume unfinished items, then update states to Review/Merged with commit evidence. Do not mark an item complete from a chat report alone.

## Next meaningful work

- Root: finish final source deployment/CI/merge and live smoke checks for this integrated batch. Worker tasks above are completed; no independent worker is promised to continue after session termination.
- Actual government-record integration requires an authorized data source and access agreement; no worker should fabricate it or scrape private records.
- Physical-phone camera decoding/permission-pending behavior, native OS reduced motion and actual print/PDF output require hands-on acceptance. Source inspection and simulated preference tests do not establish these results.
- New user feedback should become a bounded task with owned files, acceptance criteria and saved evidence, rather than an idle or repetitive loop.
