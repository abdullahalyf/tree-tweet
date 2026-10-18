# Puku2 UI delivery

Skill used: `ecc:frontend-design-direction`, read from `E:/Software_C_back/.codex/plugins/cache/ecc/ecc/2.2.3/skills/frontend-design-direction/SKILL.md`.

## Design contract

TreeTweet is a preliminary land risk assessment workspace. The user should see search and synthetic sample cases immediately, then scan risk findings and evidence. Targets are 390x844 and 1440x900, in Bangla and English. Local references were the existing SearchForm, verification cards, and the approved bilingual design specification. No external service or assets were used.

- Forest branding and action color, warm cream surfaces, clay prototype labels, and distinct green/amber/red risk indicators preserve a practical, sober tone.
- Compact intro replaces the previous large marketing hero. Parent inserts WorkspaceIntro, while puku1 removes the old SearchForm hero and attaches search-panel scope.
- Top language buttons use native language names and aria-pressed. Numbered navigation keeps orientation without heavy icons or dependencies.
- Cards have quiet fixed surfaces instead of hover elevation implying clickability. Actual scenario buttons get a subtle hover lift; state appearance gets a short entrance transition.
- Explicit risk wording and symbols support color-independent interpretation. Wrapping headers and badges support long Bengali content.
- The global Tailwind slate tokens are intentionally remapped to warm neutral/forest values so existing result, modal, registration, and tamper surfaces share the palette. Search-specific overrides use search-panel; risk colors retain their semantic roles.
- Visible focus uses a clay outline, controls have minimum touch heights, and reduced motion removes transitions and entrance movement.

## Checks performed

Read installed Next documentation at `../node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` before changing stylesheet conventions.

`node ../node_modules/eslint/bin/eslint.js src/components/ui/navbar.tsx src/components/ui/card.tsx src/components/ui/badge.tsx src/components/ui/workspaceIntro.tsx` — passed.

`git diff --check` — passed; only Git LF/CRLF conversion notices.

No dependencies, servers, browser instances, or additional agents were started.

## Required rendered follow-up

The parent owns the shared server/browser and integration, so no rendered claims or screenshot evidence are made here. Both target viewports, both languages, keyboard navigation, reduced motion, sticky header space, contrast, and long result data remain to be checked after integration. Specifically inspect search QR/button label fit at 390px and all eight scenario descriptions after line-clamping is removed.

Content states awaiting parent review:

| State | Trigger / expected feedback / safe next action |
| --- | --- |
| Loading | Submit search; existing progress label and spinner; wait for result. Reduced motion disables spinner movement but retains text. |
| Empty | Unknown identifier; missing-record message; edit search or choose sample. |
| Error | Invalid input or service failure; explicit error panel; correct input or retry. |
| Partial | Missing record evidence; caution/risk wording and available details; investigate records. |
| Success | Completed record checks or demo registration; risk summary or generated QR; inspect details or verify registered deed. |
| Permission | Not applicable to these UI components: no privileged API operation, authentication, or camera permission is introduced. QR entry remains owned by feature agent. |

The skill's rendered evidence checker is **not passed**: browser observations and screenshot artifacts are intentionally pending root review. Root should write the final JSON evidence record alongside real captures, then run the skill's `scripts/check-evidence.js` against it. Source checks cannot substitute for that finish gate.
