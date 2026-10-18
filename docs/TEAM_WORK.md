# Puku work queue

Updated: 18 October 2026 (Asia/Dhaka). Root integrates all work. This file is a resumable task queue, not a promise of execution outside an active session or after account/runtime limits.

## Current shipped baseline

Main `0cbb00a` merged PR5: generated rural rice-field imagery, responsive image, camera/bird motion, scroll parallax, section entrances and pause controls. Production: https://treetweet.vercel.app/. Deployed source `6a2b5c0`; Vercel `dpl_GT6zTxPiECFAdY2XcnDbyPxmkRDc`. PR5 checks passed. Official-government-record integration remains unavailable.

## Assigned work

| Owner | Worktree / branch | State | Owned deliverables | Merge gate |
| --- | --- | --- | --- | --- |
| Puku1 | puku1 / puku/buyer-help | Assigned | New BuyerHelp component: bilingual glossary, FAQ, office/paper reminder; docs/PUKU1_HELP_HANDOFF.md | Primary-source evidence for new procedural claims, plain-language review, targeted checks, root rendered review |
| Puku2 | puku2 / puku/mobile-accessibility | Assigned | Navbar, SearchForm, QRScannerModal, NoResultView accessibility fixes; docs/PUKU2_ACCESSIBILITY_HANDOFF.md | Concrete bug evidence, safe QR/camera behavior preserved, targeted checks, root keyboard/mobile verification |
| Puku3 | puku3 / puku/reliability-hardening | Assigned | Services/actions/registry boundaries, concrete fixes and regression tests; docs/PUKU3_HARDENING_HANDOFF.md | Reproduced regression, conservative P5 outcomes, fixture immutability, full root tests |
| Root | root | Running | Live verification, motion lifecycle regression coverage, integration and release | Diff review, lint/typecheck/build/tests, CI, live browser checks |

## Worker continuation contract

Each worker proceeds independently through its scoped implementation, review, targeted verification and fixes. Keep a handoff file after milestones containing changed files, exact commands/results, unresolved issues and next action. Commit scoped files in its branch. Do not alter another worker's files, install dependencies, start another app server, or claim unobserved behavior. Root owns pushes/merges/deployment and a single shared production server/browser. Keep the existing three worker directories; no additional workers or services are needed.

If a worker or parent reaches a runtime/quota limit, its filesystem/checkpoint remains the continuation source. The next session should read this queue and handoffs, inspect actual git state, resume unfinished items, then update states to Review/Merged with commit evidence. Do not mark an item complete from a chat report alone.
