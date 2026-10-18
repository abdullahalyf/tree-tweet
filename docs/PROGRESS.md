# TreeTweet progress — 2026-10-18

## Approved scope
Source import, Bangla/English interface, top toggle, responsive motion, three workers, correctness review, merge/push and Vercel deployment. Root performs critical fixes. Limit RAM: one dependency install and one app server.

## Completed
- Imported upstream history at 5a81a8a.
- Pushed unchanged baseline to abdullahalyf/tree-tweet main.
- Verified local authenticated Git access outside network sandbox.

## Preflight review
| Tasks | Shared interface | Finding / decision |
| --- | --- | --- |
| 1 / 2 | useLanguage hook | Fixed contract: language, setLanguage, t(bn,en). Independent worktrees prevent file conflicts. |
| 1 / 4 | Result issue localization / new safety codes | Root reports new codes to translator; fallback must never silently hide issues. |
| 2 / 4 | App shell and WorkspaceIntro | Root imports intro; navbar props preserved. |
| 3 / 4 | Safety regressions | Test writer reports failures; root owns critical source fixes. |
| 1 | Locale implementation / checks | Translation only; domain data remains unchanged. |
| 2 | Styling / checks | Source style report is provisional until root rendered review. |
| 3 | Tests / guide | New failing tests are evidence for root fixes, not a passing completion claim. |
| 4 | Integration / deployment | Deployment depends on verified Vercel access. |

## Resolved findings
- Unknown selected deed now yields a critical missing-deed result; no substitution.
- Missing encumbrance/acquisition/history evidence warns, while known risks remain visible.
- Invalid areas, calendar dates, ambiguous signed fields and conflicting latest mutation events are rejected or warned.
- Browser receipt restore preserves the original digest; edited data still fails integrity.
- Concurrent registration enforces uniqueness and the 200-record bound after hashing yields.
- QR URLs are absolute. Supported browsers decode camera frames; unsupported browsers have a manual fallback.
- Removed global console interception and DOM mutation observer.
- Primary citizen results use plain words, meaning and next actions. Codes and hashes are closed optional details.

## Integrated delivery
- PR #1 merged into main at 74b91be: bilingual interface, mobile layout and reliability fixes.
- P5 follow-up branch: improve/p5-citizen-checklist; includes the five buyer questions, synthetic mutation history and explicit acquisition evidence.
- Moving leaf/light particles use CSS only: 12 desktop / 8 mobile, pointer-events none, hidden for reduced motion and print.
- Live production URL: https://treetweet.vercel.app
- Latest verified production deployment: dpl_FijV7ZqrQD5zzjPvDNEpoFcinsMn, source cf2e924.

## Verification observed
- All 8 fixture outcomes preserved: A/B green; C/D yellow; E–H red.
- npm test passed: existing unit/registration, reliability, P5, receipt and presentation suites.
- TypeScript, zero-warning ESLint and production build passed locally and in GitHub Actions.
- GitHub Actions run 39113048901 succeeded for cf2e924.
- Live browser: all eight outcomes and five P5 rows, no visible hash jargon in primary results, language persistence/title, missing record recovery, modal keyboard focus/Escape/return, registration/reload restore and edited-cache mismatch.
- 390×844 mobile and 1440×900 desktop render without horizontal overflow. Mobile inputs are 16px, key controls at least 44px, initial submit fits in first viewport. Moving particles verified via changing computed transforms, eight visible on mobile.
- Console has no errors/warnings during the final sampled workflows.

## Remaining external/manual limits
- All sample data is synthetic; no government source is connected.
- Live Supabase migration/read behavior has not been exercised. Migration 002 defaults existing records to unknown/empty.
- This browser lacks BarcodeDetector: unsupported-camera fallback was exercised; physical QR camera capture/permission denial remains untested on a supported phone.
- Reduced-motion and print CSS were inspected; OS reduced-motion emulation and actual print preview are not claimed as executed.
- Partial P5 evidence is covered by domain/presentation tests; no live database dataset with partial P5 records was available for rendered testing.
- Vercel CLI deployment works. Automatic GitHub-to-Vercel linking failed during initial setup, so deployment currently uses the authenticated CLI.
- Two final worker turns reached their account usage limit; root integrated their committed work and completed verification.
# Publication release update — 18 October 2026

The public homepage now opens the independent bilingual P5 government-service guide. Supporting mortgage/tax/map/official-QR guidance is included, and sample tools remain separate. Final deployed source `8f782ac` passed CI and live checks. See [PUBLICATION_RELEASE.md](PUBLICATION_RELEASE.md) for observed evidence and remaining real-data/hardware limits, and [OFFICIAL_SOURCES.md](OFFICIAL_SOURCES.md) for source provenance. No government API connection is claimed.

