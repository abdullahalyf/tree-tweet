# Puku work queue

Updated: 18 October 2026 (Asia/Dhaka). Root integrates all work. This file is a resumable task queue, not a promise of execution outside an active session or after account/runtime limits.

## Current batch: P5 portal and animated hero

All three Puku tasks below are completed and shipped in [PR7](https://github.com/abdullahalyf/tree-tweet/pull/7), main `8538d304eea3672494cde9c4dac3b50cd99c1385`. Source `044b8e227aa6864095c1cb93259ceb0ebcdada6d` is deployed ready as Vercel `dpl_9ReK1KULnNqXKp6mxEusLr5BFx9r` at https://treetweet.vercel.app/. Both CI jobs passed. Live Bangla390px confirmed the full-width hero, three slides, five correct card anchors, loaded images and no overflow. The acquisition card focused its section at189.8px, below the171.7px header; offscreen hero paused, global pause left zero running animations, and live console had no errors/warnings. No worker is represented as still running after its completed assignment. Detailed evidence and limitations: [P5_PORTAL_RELEASE.md](P5_PORTAL_RELEASE.md).

| Owner | Scope | State | Verification / handoff |
| --- | --- | --- | --- |
| Puku hero / review | Full-width, three-slide image hero; manual and automatic controls; motion/accessibility review | Shipped PR7 | Seven-second rotation gate, stable play/pause control, local browser focus/resume/pause checks passed |
| Puku portal | Five illustrated P5 cards and sidebar; guide/main integration; green footer; local aerial asset and provenance | Shipped PR7 | Targeted zero-warning lint, integrated typecheck/build and local mobile/desktop navigation checks passed |
| Puku carousel QA | Hero playback lifecycle hook and five tests; timer/focus review | Shipped PR7 | Five new lifecycle tests and full root test command passed; hook timer typing corrected |
| Root | Integration review, complete verification, Git publication and Vercel deployment | Merged and deployed; live checks passed | Full tests, typecheck, zero-warning lint, build and both CI jobs passed; local bn390/en320/desktop1440 and live390 layout/focus/pause/console checked |

Current hero uses crossfades and camera drift with offscreen/foreground/preference gating. The older side-by-side scene's birds and scroll parallax are historical and are no longer part of the rendered guide. Section-entry reveals and reading progress remain. The two image assets are illustrative; no government records or affiliation were added.

## Follow-up in progress

Hero Puku owns the user's next request: show the existing village image on the hero's right side. Implementation is in progress; root verification/publication are pending. This work is separate from the completed PR7 assignments above. Root should verify desktop/mobile layout, loaded imagery and unchanged slideshow/pause controls before publishing.

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

- PR7 is merged, deployed and live-verified. Its worker tasks are completed. The user's subsequent request to put the earlier village image on the hero's right side is assigned to the hero Puku as a separate follow-up batch, currently in progress; it is not included in PR7.
- No independent worker is promised to continue after session termination. Older worker branches intentionally remain at their own scoped commits; refresh from main before assigning overlapping implementation again.
- Actual government-record integration requires an authorized data source and access agreement; no worker should fabricate it or scrape private records.
- Physical-phone camera decoding/permission-pending behavior, native OS reduced motion and actual print/PDF output require hands-on acceptance. Source inspection and simulated preference tests do not establish these results.
- New user feedback should become a bounded task with owned files, acceptance criteria and saved evidence, rather than an idle or repetitive loop.
