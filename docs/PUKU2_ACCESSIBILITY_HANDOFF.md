# Puku2 mobile/accessibility handoff

Base: current main 0cbb00a, branch puku/mobile-accessibility. Own only navbar.tsx, SearchForm.tsx, QRScannerModal.tsx, NoResultView.tsx and this report.

## Milestone 1 — source audit and fixes

- QR scan start removed the focused camera button; the custom trap only caught Tab on first/last elements and did not make background content inert. Replaced it with native dialog/showModal, browser-managed modality, cancel/Escape handling and connected-opener restoration. Kept a stable camera button for start, cancel pending request and stop; status explains pending permission and active scanning.
- A stale video.play rejection could stop a newer camera session. It now checks the same generation token used by acquisition/detection before mutating state.
- Search and QR input errors were announced but not associated with controls. Added aria-invalid/describedby and focused the plot/manual input on empty submission. QR input uses base text size to avoid small mobile input text.
- Demo tools stayed open after keyboard/pointer users left. Added focus-leave and outside-pointer dismissal; Escape still returns focus to its summary.
- Missing-result identifiers had no wrapping and can be arbitrarily long. Added overflow wrapping.

Cross-origin QR checks, synthetic-only copy, manual entry, sample actions, generation guards and track cleanup are preserved. Native modal has no extra dependency.

## Pending verification

Run focused ESLint and worker TypeScript with shared root dependencies. Request parent integrated Chrome check after files are copied; no server/browser has been started or mutated by this worker. Parent owns globals, LandTechApp and guide and must integrate rather than overwrite those files.

Skills read: ecc:frontend-a11y and caveman:verify-and-stop. Installed Next use-client guide read before changes. No subagents, installs or full builds.

## Milestone 2 — checks and lifecycle review complete

Passed from puku2 using shared installed dependencies:

- `node ../node_modules/eslint/bin/eslint.js src/components/ui/navbar.tsx src/components/search/SearchForm.tsx src/components/search/QRScannerModal.tsx src/components/verification/NoResultView.tsx --max-warnings 0`
- `node ../node_modules/typescript/bin/tsc --noEmit --incremental false`
- `git diff --check` (only LF/CRLF conversion notices)

Source lifecycle review: close/cancel increments generation and stops existing tracks; a getUserMedia result arriving after close/cancel still stops its own tracks and exits; detector results and playback rejections cannot change newer sessions. Unsupported/denied permission retains editable manual input and sample buttons. Native cancel prevents automatic state divergence and invokes the existing close path. The camera control remains mounted throughout start/pending/active transitions.

Parent explicitly owns shared Chrome verification after integration; this worker did not run a browser or camera. Required integrated checks: Tab/Shift+Tab remain in modal, background controls cannot focus, Escape/close restore opener, close during pending permission then resolve stream, unsupported/denied/manual/external-link paths, demo menu Tab-out/outside-click/Escape, both languages at 390px, very long missing-record identifiers. Physical camera hardware and assistive technology remain separate manual limits. No full build or dependencies installed.

Changes are ready to integrate as this scoped commit against refreshed base 0cbb00a; all four source paths and this handoff are owned by Puku2. No changes to parent-owned LandTechApp, global stylesheet or BuyerGuide.
