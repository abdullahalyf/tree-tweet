# Guide extraction handoff

18 October 2026. Worker: Puku guide/hero. Integration owner: Puku carousel QA. No Git mutation, dependency install or government-data access performed in this batch.

## Delivered

- `guideTopics.ts`: neutral five-check data, approved case-year copy, `CheckId`, `PaperStatus`, eight-value `GuideTopic`, `guideTopicTitles` and own-property whitelist `isGuideTopic`.
- `BuyerGuide.tsx`: home now contains the animated hero, three concise how-to links and five-topic portal. Duplicate bottom quick links were removed after QA review; the portal provides those routes. Full check/help/source content is removed from home. Same-page handler intercepts only same-path/query hash links with a real target; route and modified clicks retain native/Next behavior.
- `GuideDetail.tsx`: one requested P5 check with official links and a preparation selector; separate papers/supporting-documents, preparation and help/FAQ/source/privacy pages. One h1, breadcrumb, actual `/check/...` next links and home/all-topic links. Existing conservative source wording retained. Uses the integration owner's `usePaperPreparation`; five personal marks are explicitly not verification or clearance. Storage explanation is tab-scoped and acknowledges unavailable-storage fallback.
- `BuyerHero.tsx`: primary CTA now uses `next/link`, preserving client navigation and the in-memory fallback. Foreground scene changes remain photo / fictional sample papers / neutral topic list, with clear sample/non-result labels and stable controls.
- `buyer-hero.css`: mobile text overlaps the foreground scene instead of adding a separate tall photo block; compact headings/CTA/controls. Gradient lightened to approximately .70/.55/.38 with text shadows after root found the previous compounded overlay obscured the image. Desktop two-column composition remains. Frame entrance and camera/panel motion retain manual/reduced-motion gates.

## Verification actually completed

Targeted ESLint for `BuyerGuide.tsx`, `GuideDetail.tsx`, `guideTopics.ts` passed; full TypeScript `--noEmit --incremental false` passed after initial extraction. After converting the hero CTA to NextLink, targeted ESLint for those three files plus `BuyerHero.tsx` passed.

Read-only review of `paperPreparationStore.ts` and `usePaperPreparation.ts`: only known five keys and three values restored/written; malformed/blocked storage catches; immutable cached snapshots and stable server empty snapshot; clear removes storage key; memory fallback and UI count/selector contract align. No real personal information is stored by this feature.

## Browser/build ownership and pending gate

The worker started the single dev server on `127.0.0.1:3000`, exec session `36339`, and subsequently stopped it at the integration owner's request for the production build. Browser discovery initially failed because the managed Chrome profile was already running; no worker screenshot or browser interaction was completed. Integration QA subsequently reported restoring the browser and observing a readable photo-backed mobile hero at 390px. **Other screenshots, slide visibility/contrast, 320/1440 layouts, route navigation/state/reload/404, full tests/build and deployment remain the integration owner's acceptance gate.** Do not describe this handoff's CSS inspection as the worker's visual test.

The detailed primary-source audit is in `P5_SOURCE_AUDIT.md`. Its source snapshot preceded the extraction; the five data objects it audited now live in `guideTopics.ts`. Only the case-year proposal was approved and applied. Other proposed copy refinements remain recommendations.
