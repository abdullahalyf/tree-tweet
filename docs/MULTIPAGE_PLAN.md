# P5 pages and a shorter home page

Status: implementation plan only, awaiting root's branch/ownership signal. No app files were changed while preparing this plan. This follows the user's request for actual pages and less scrolling; it is not a plan for hiding the same long page behind more accordions.

## Routes and content

| Route | Main content | Primary next step |
| --- | --- | --- |
| `/` | Current animated hero; three short how-to steps; five illustrated P5 cards; official service/help sidebar | Choose a topic or gather papers |
| `/check/owner` | Owner/plot instructions, relevant official link, preparation marker | `/check/mutation` |
| `/check/mutation` | Current and earlier mutation papers, official service, preparation marker | `/check/case` |
| `/check/case` | Cases/court-order instructions, judiciary and revenue-case links, preparation marker | `/check/khas` |
| `/check/khas` | Khas classification instructions, office guidance and preparation marker | `/check/acquisition` |
| `/check/acquisition` | Acquisition notice/LA-office guidance, official service and preparation marker | `/check/preparation` |
| `/check/papers` | Existing paper/location checklist and supporting paper guidance | `/check/owner` |
| `/check/preparation` | All five preparation markers, paper-count summary, reset/print and limitations | Revisit a missing topic or `/check/help` |
| `/check/help` | BuyerHelp glossary/FAQ, office preparation, supporting help, source/privacy/limitation details | Return home or open a relevant topic |

The eight allowed dynamic topics are `owner`, `mutation`, `case`, `khas`, `acquisition`, `papers`, `preparation`, `help`. All live government-service links remain external, and all verification/data-access limits remain true. Do not copy all five detailed checks or the full FAQ/source blocks onto home. A compact independent-project boundary can remain near the hero/footer.

Retain the shared header, Bangla-first language switch, ambient motion setting and footer. Topic pages should open with a clear heading/breadcrumb and a home link, show only the requested content, then a filled next-step link and a way to return to all five topics. They should not repeat the full home hero. Support direct access, refresh, browser back/forward and opening a topic in another tab.

## Implementation contract

`src/app/check/[topic]/page.tsx` stays a Server Component. Export `generateStaticParams()` returning the eight topic objects. The page receives `params: Promise<{ topic: string }>`, awaits it, checks the explicit whitelist and calls `notFound()` for invalid values. Return `<LandTechApp guideTopic={topic} />` only after narrowing the string to the allowed type. Do not interpolate arbitrary paths into imports or execute arbitrary URL values. An optional `dynamicParams = false` can enforce the built list in addition to the explicit guard if compatible with the current Next configuration.

Use one shared pure topic definition/type module if the extraction owner creates it; the route, portal and guide must agree on the same eight strings. Avoid importing a Client Component's runtime constants into a Server Component solely for validation. A type-only import is fine, or keep the whitelist in a neutral module with no client directive/browser dependencies. Root should coordinate ownership of any new shared module before implementation.

`LandTechApp` accepts optional `guideTopic` and passes it to `BuyerGuide`. The existing root page still renders `<LandTechApp />`. Existing `/?view=search`, `/?view=register`, `/?view=tamper`, and dag/deed QR queries remain root-only demo flows. On a topic route, query hydration must not unexpectedly switch the topic into an embedded demo: skip root-only initial query processing when `guideTopic` is present.

Make `changeTab` route-aware using `useRouter` from `next/navigation`: from a topic page, the guide action navigates to `/`, and demo actions navigate to `/?view=search`, `/?view=register` or `/?view=tamper` using known internal strings. On root, preserve the current demo state/query behavior and raw-input validation. Do not use `history.replaceState` to put demo parameters onto `/check/owner`; do not leave the page URL pointing at one topic while rendering a different tool.

Use `next/link` for topic/card/next/home links. Keep external services as ordinary external anchors with new-tab labels. Existing section-scroll handlers must intercept only same-path hash links whose target exists; they must let real route navigation proceed. Modified clicks/new tabs should retain native link behavior. Hero actions become `/#guide-topics`, `/check/papers`, and `/check/case`; the home-topic action may retain a same-page anchor while on home. A route is represented by its URL, not only a new local tab state.

BuyerPortal cards change from `#check-ID` to `/check/ID`; its preparation action becomes `/check/papers`. The home how-to section stays concise and can link to papers/preparation/help. On detail pages “all topics” goes to `/#guide-topics` and next-step buttons go to the next actual route. No stale `#guide-papers`, `#preparation` or `#check-case` destination should remain on home after those sections move.

## Preparation state: resolve before extraction

Current paper marks live inside BuyerGuide's `useState` and disappear when the component remounts. Separate pages will otherwise lose marks while navigating and show zero on `/check/preparation`. This must be addressed explicitly.

Recommended small solution: a shared session-level store backed by `sessionStorage`, containing only the five known topic keys with `missing | collected | mismatch` values. Validate restored keys/values and ignore malformed content; catch unavailable-storage errors and retain an in-memory fallback. Use a versioned key and make all detail/preparation pages consume the same source. A short helper plus subscription is sufficient; do not add a database, account or state-management dependency. Root/extraction owner must agree the exact implementation and file ownership first.

The user-facing limitation must match: **এই ট্যাবের জন্য প্রস্তুতির চিহ্ন রাখা হয়। এটি জমি নিরাপদ হওয়ার সনদ নয়। / Preparation marks are kept for this browser tab. They are not a land clearance certificate.** Remove the previous blanket claim that reload always clears marks if sessionStorage is used. Explain unavailable storage only if it affects the user's action. A different tab/device is not promised to share marks. Clearing marks and printing the complete preparation page must work independently of which topic the user visited first.

If root chooses not to persist even these non-private marks, clearly define preparation as a separate page-local checklist and remove implied cross-page accumulation; do not silently ship a broken cross-page counter. Language preference already persists in LanguageProvider. Global motion pause is currently workspace memory only and may reset across page remounts; preserve it in a shared session preference or label its scope honestly, especially for users relying on the manual pause. Native reduced-motion preference must continue to be respected regardless of route.

## Metadata and navigation details

The current root layout sets canonical `/` for all children. Each new topic should override canonical/OpenGraph URL with its own `/check/topic` and have a concise topic title/description. The dynamic LanguageProvider currently emits a generic document title; if topic-aware titles are added, coordinate that provider so it does not overwrite them. Use `generateMetadata` only with the same validated params, without fetching government data. Root can include the eight public routes in sitemap after the implementation is real; do not list draft or invalid topics.

Use Next's standard route scroll/focus behavior as the starting point, then verify the heading is visible below the sticky header and accessible by keyboard. Do not transfer focus through DOM nodes from the page that is being removed. Preserve the skip link, one meaningful h1 per page, clear current-page context and home navigation. A translated not-found view is desirable if root assigns it; the whitelist/404 itself is required.

## Ownership after root signals the new branch

- Portal/routes worker: BuyerPortal links and new `/check/[topic]/page.tsx`; optional route metadata within that file. No extraction or LandTechApp edits without explicit reassignment.
- Guide extraction worker: BuyerGuide home/detail split, paper/help/preparation content selection, next links and agreed preparation state module. Coordinate all props/types with root before editing.
- Root/shell owner: LandTechApp props and route-aware demo navigation/query hydration; hero action destinations, shared preferences, metadata/provider/sitemap changes or explicit delegation of these files. Root owns review, commits, push/merge, one app server and deployment.
- QA worker: route/navigation evidence and targeted regressions after the files exist; no overlapping implementation by default.

## Acceptance and release gates

1. Build output includes the eight static topic pages. All eight URLs work directly and after refresh; a ninth arbitrary topic returns404 rather than rendering an empty guide. No client/server serialization or params warnings.
2. Home has hero, three steps, five cards/sidebar and footer, without the five full detailed checks/FAQ/source content. Every card and hero action goes to the intended page or remaining home anchor.
3. Each P5 page shows only its own check, has working home/next navigation and keeps official links and conservative unknown/non-clearance language. Help/papers/preparation contain the moved content without accidental loss or duplication.
4. At320px/390px and1440px, no horizontal overflow; touch targets at least44px; heading and focused destinations clear the sticky header. Bangla is initial default and switching languages continues to work on every route.
5. Mark one topic collected, another mismatch, navigate through next/home/help, and open preparation: the selected state and count remain correct under the agreed storage policy. Reload/clear/browser-storage-disabled behavior matches its copy. No private or government-record information is stored by this new feature.
6. From a topic, use each demo navigation option: URL becomes the root `/?view=...`, with the right tool displayed. Return home works. Existing direct QR queries, deed-only lookup, malformed mixed-query rejection, no-result/reset focus and all eight synthetic fixtures remain correct.
7. Browser back/forward, modified-click/new-tab navigation, unknown-route404, console and route metadata are checked. Hero arrows/dots and global/reduced-motion behavior remain intact after the split.
8. Run lint, typecheck, complete existing tests and production build; add only targeted meaningful route/state regressions required by the change. Root publishes and verifies actual live topic URLs before claiming multipage completion.

## Local documentation inspected

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`: asynchronous params and runtime value narrowing.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md`: build-time path generation and dynamic-param behavior.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`: Server Component page and Promise params contract.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/not-found.md`:404 interrupt and noindex behavior.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md` and `02-components/link.md`: App Router navigation, known URLs, link behavior and scroll defaults.

No network lookup, app edit, Git mutation, install or server start was performed for this plan. Existing root route, layout, sitemap, Next config and shared-shell/query behavior were inspected.
