# Puku publication follow-up

Shipped: [PR6](https://github.com/abdullahalyf/tree-tweet/pull/6), main merge `bb31180`. App source `0a087f2` deployed to https://treetweet.vercel.app/ as `dpl_8m1ptB6t8SP4c45CnefEa1D68uFq`. App-source [push CI](https://github.com/abdullahalyf/tree-tweet/actions/runs/39118169517) and [PR CI](https://github.com/abdullahalyf/tree-tweet/actions/runs/39118176414) passed. Final live390px check observed five filled49px next buttons, six glossary terms, loaded rural image, no overflow and malformed mixed query rejection without URL normalization; no console errors/warnings. Local app server was stopped after release.

## Result

Buyer guidance now includes a compact bilingual help/glossary section after the five P5 checks. QR tools use a native modal dialog, a stable camera start/cancel/stop control, linked input errors and a manual fallback. Demo navigation dismisses on Escape/focus leave/outside pointer. Long no-result identifiers wrap.

User feedback: each section's next-step link is now a filled forest-green button, full width on mobile with a minimum48px height. It retains anchor navigation, keyboard activation and focus/scroll behavior; the final step opens the preparation checklist.

Browser measured all five final buttons at49px high, with forest-green backgrounds, light text and no underline. Each moved focus to the expected next section at190px below the sticky header; no390px horizontal overflow. A later screenshot request stalled and was canceled; these button checks are measured browser observations, not a claimed new screenshot.

Strict plot validation rejects malformed identifiers rather than silently deleting characters and opening a different plot. The service validates runtime input shapes and returns an explicit invalid-input result. Root also fixed the UI boundary to pass raw identifiers through: malformed dag plus valid deed must not turn into a deed-only search. Raw query state stays intact until validation succeeds; only successful lookups rewrite the canonical query URL. Invalid input shows a plain correction action rather than a connection-error retry.

Cached receipts are validated before duplicate handling. Existing custom IDs only restore idempotently for matching signed fields and stored hash. Conflicts cannot overwrite the stored receipt; first-time edited receipts retain the original digest so the checker can report tampering.

## Evidence

- Worker commits5d96b45,af7b52b,a235e7a independently reviewed and cherry-picked onto the integration branch. Handoffs contain source maps, exact worker commands and limits.
- Root complete test command passed: immutable A–H scenarios, unit41, phase4 6, reliability52, P5 17, receipt9, presentation8, motion4 and hardening3 (some suite counts include parent tests). Typecheck and zero-warning lint passed; integrated production build passed.
- Motion tests exercise disabled/no-observer fallback, coalesced scroll scheduling, offscreen/background state, focused-target stability, one-shot reveals, cancellation and listener/observer/frame cleanup when preferences change or the guide unmounts.
- Root reproduced the prior malformed-dag behavior on the old live version using synthetic `01!01` with CaseA deed: it rewrote the dag to0101 and showed the no-issue result. The corrected local version preserved the malformed query and displayed a correction error with no verification result; its correction button focused the field. Direct service regression also covers mixed malformed dag/valid deed and legitimate deed-only lookup.
- At390px, QR dialog was native modal,366px wide with no internal horizontal overflow; buttons at least44px tall. Native Escape closed the modal and restored the QR opener. Ordinary Tab returned to dialog controls; no full assistive-technology conformance claim is made.
- Unsupported camera showed manual fallback. Foreign government QR URL stayed rejected, marked aria-invalid and described by the error. Empty search focused the first field and linked errors to both inputs. Menu Escape and focus leave closed the menu.
- Help showed six terms and seven FAQs, initially collapsed. Keyboard Enter toggled a glossary summary with visible outline. Bangla390px and English1440px had no horizontal overflow. Screenshot evidence is local under ignored artifacts/puku-help-*.jpg.

## Limits and continuation

One attempted programmatic background-focus test was rejected by automatic approval review; it was not repeated or bypassed. Ordinary keyboard tests were used instead. Physical camera permission/late-stream behavior remains source-reviewed, not runtime-tested. Native OS reduced motion, actual print/PDF and configured Supabase remain untested.

The project remains independent public guidance with synthetic samples. Authorized government-record/API access is still needed for real ownership/history/court/khas/acquisition verification. See TEAM_WORK.md and the three PUKU handoffs for resumable state; work does not run indefinitely beyond the active session/runtime limits.
