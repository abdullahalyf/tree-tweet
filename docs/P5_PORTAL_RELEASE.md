# P5 portal and animated hero

Release state: implemented and locally verified; root is reviewing and publishing this batch. Commit, PR, production deployment and live verification identifiers are pending. The observations below refer to the local integrated build unless explicitly updated with production evidence.

## Result

The buyer guide opens with a full-width photo hero inspired by the supplied service-portal references. Three slides explain the five P5 checks, papers to gather and official services. The slides use two local illustrative images, including the new aerial rice-field scene; the third slide uses a different crop of the aerial scene. Text stays in HTML with a consistent main heading. The current slide's action opens the relevant guide section.

Automatic rotation runs every seven seconds while the hero is visible, the page is in the foreground, motion is enabled, reduced motion is not requested and the user is not hovering over or focusing within the hero. Manual arrow/dot selection stops automatic rotation. A stable play/pause button lets the user request resumption; rotation waits until focus and pointer leave the hero. The separate global motion button stops movement throughout the workspace. The hero pauses offscreen and in background tabs. Without IntersectionObserver the hero stays static and its controls remain usable.

The hero uses crossfading image/text layers and a gentle image camera drift. Existing section-entry transitions and the reading-progress line remain. The earlier side-by-side scene with birds and scroll parallax has been replaced in the current guide; its historical implementation and verification notes in MEDIA_ASSETS.md should not be read as claims about this hero. This is animated imagery, not recorded video.

Five illustrated P5 cards cover owner and plot identity, mutation history, cases and court orders, khas status and acquisition. They open the existing detailed checks and preserve keyboard focus/scroll navigation. Desktop uses a two-column card grid with a sidebar; mobile stacks the cards and help panels. The sidebar includes a preparation checklist, official khatian/map, mutation and revenue-case links, and the 16122 land-service hotline. A forest-green footer provides official source links and the independent-project statement. Filled next-step buttons remain in each detailed check.

## Media and scope

The new committed `public/images/aerial-rice-fields.webp` is 1600×900, 432884 bytes. It was generated with the built-in image tool and prepared locally with Sharp; the source PNG remains unchanged. Exact generation prompt and preparation details are recorded in [MEDIA_ASSETS.md](MEDIA_ASSETS.md). Both aerial and village scenes are imagined illustrations, not photographs or surveys of an identified property. The UI labels the imagery accordingly. Card illustrations are locally authored decorative SVGs.

TreeTweet remains an independent public guide with synthetic demo tools. The portal styling adds no government affiliation, official login, live record source, clearance result or invented notice. Official links open the external services. Real ownership, mutation history, court, khas and acquisition verification still requires authorized records and the relevant offices.

## Verification

Root completed the integrated `npm test` command, including the new five hero-playback lifecycle tests and all earlier suites. Typecheck, zero-warning lint and the production build passed. The hero tests exercise visibility and foreground gating, pause and reduced-motion preferences, interval deduplication and cleanup, and static fallback without an observer. They are simulated lifecycle checks, not a physical-device or assistive-technology certification.

Root's local browser observations:

- Bangla at 390px, English at 320px and desktop at 1440px had no horizontal overflow. The hero spanned the available viewport width; slideshow controls met the 44px minimum touch target.
- All five P5 cards moved focus to the matching detailed section. Destination tops were 190px below the viewport top, clear of the measured 139px desktop sticky header.
- Global pause left zero running animations. Manual next stopped rotation. The stable resume button preserved focus; after focus moved to the language control outside the hero, the actual slide advanced from two to three after approximately 7.6 seconds.
- Scrolling the hero offscreen set its active state to false. Normal browser console contained no errors or warnings.

## Remaining acceptance

Native operating-system reduced-motion behavior, physical-phone camera/permission behavior, screen-reader conformance and actual print/PDF output remain unverified. No authorized live government-data integration is present. Deployment and live smoke checks are pending root publication; local observations do not establish production results.

The three Puku tasks for this batch are completed. See [TEAM_WORK.md](TEAM_WORK.md) for the current queue and the active-session limits on continuation.
