# BuyerHelp handoff

## Milestone 1 — scope and evidence
- Branch: puku/buyer-help; only new BuyerHelp.tsx and this document are owned.
- Applied previously read ecc:research-ops and ecc:frontend-design-direction; React patterns and installed Next use-client guidance inform implementation.
- Direction: quiet, Bangla-first practical help after the main five checks. Two native collapsed groups; no private-data inputs, no fees/timelines or clearance claims.
- Fresh primary research (18 October 2026): official mutation FAQ https://mutation.land.gov.bd/query describes khatian fields and mutation as updating records after ownership change. Official preparation instructions https://mutation.land.gov.bd/nirdeshika identify location, survey, plot/khatian, deed and application details. Official terms https://mutation.land.gov.bd/terms say some services may require registration. Indexed official content was available; direct automated page reads returned errors. No login, record lookup or office workflow was exercised.
- Existing verified project evidence docs/OFFICIAL_SOURCES.md covers land portal, DLRMS, court sources, khas/acquisition limits. No blanket API integration or government data retrieval is claimed.
- Remaining: implement, self-review content/accessibility, targeted lint and typecheck, update evidence, commit owned files.

## Milestone 2 — implementation and self-review
- Implemented BuyerHelp named export; parent can import from @/components/guide/BuyerHelp and render after the five main checks.
- Six plain-language terms and seven FAQs. Two top-level collapsed native details; individual FAQs stay collapsed inside the second group. All summary targets use min-h-11 (44px) plus padding. No motion, inputs, network calls, new dependencies or custom keyboard handlers.
- Bilingual content derives during render from useLanguage; useId labels the section without global ID collision. Body text is16px, secondary notes14px; mobile glossary becomes one column.
- Reviewed against scope: no automatic clearance, promises of record access, fees or deadlines; paper collection distinct from completed checks; unknown/no-result/site-error states remain unknown. Glossary explicitly educational rather than complete legal definitions.
- Preparation reminder is a recommendation to have available papers ready, not an asserted universal application requirement. Existing BuyerGuide office routes remain the primary actions; this component adds no duplicate resource panel.
- Remaining: run targeted lint and typecheck, fix any findings, record final evidence, commit only owned files. Browser/layout checks belong to parent integration because no server/build is authorized here.

## Primary-source claim map
- [Official mutation FAQ](https://mutation.land.gov.bd/query): record-field and mutation explanations. Paraphrased into khatian/mutation terms; no ownership guarantee inferred.
- [Official mutation instructions](https://mutation.land.gov.bd/nirdeshika): location/survey/plot/khatian/deed details and evidence preparation; distinguishes government-interest categories including khas and acquired land. Used for paper-comparison recommendations, not universal requirements or fee advice.
- [Official mutation terms](https://mutation.land.gov.bd/terms): registration may be required for services. Help does not promise anonymous access or a complete online history.
- [Ministry land administration manual](https://bhumipedia.land.gov.bd/ebook/view/216): official khas-land administration context. Khas wording stays a plain broad explanation, not a legal classification decision or blanket prohibition on all transfers.
- [Official LARMS notice entry point](https://larms.land.gov.bd/notice.html): indexed acquisition-notice service. No specific notice, statutory consequence, complete coverage or current plot status is asserted. Office follow-up matches the parent guide's existing documented route.
- Personal identity matching, asking the office about missing copies and resolving conflicts before paying are cautious recommendations, not claims of mandated procedures. An exact list of mandatory documents, response deadline, fee, authenticated API or land clearance was not established.

## Milestone 3 — checks and completion
- `node ../node_modules/eslint/bin/eslint.js src/components/guide/BuyerHelp.tsx`: PASS, no output/errors.
- `node ../node_modules/typescript/bin/tsc --noEmit`: PASS, exit0, no diagnostics.
- `git diff --check`: PASS.
- Component length:52 lines (under250). Native details preserve keyboard activation and browser disclosure semantics; no unnecessary ARIA roles or custom interaction state.
- Self-review: all six requested glossary terms and seven FAQ questions present in both languages. No private-data entry controls. Both top-level groups and individual FAQ answers default closed. Main guide/official links remain parent-owned and unchanged.
- Parent integration remaining: render `<BuyerHelp />` inside LanguageProvider, preferably after the five main buyer checks; browser-check390px/desktop, keyboard summary focus/activation, language toggle, wrapping and print behavior. Browser checks were not run because this task explicitly prohibits servers/builds. No dependencies installed, no application build/run, no merge/push/deploy.
