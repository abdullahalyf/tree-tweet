# Public guidance release · প্রকাশযোগ্য সহায়িকা

Date: 18 October 2026. Live: https://treetweet.vercel.app/. Source deployed: `8f782ac`. Vercel deployment: `dpl_CvFeTUPDpTDU838ScAGJeqV4iQW2`. Publication PR: https://github.com/abdullahalyf/tree-tweet/pull/3.

## What is ready to share

- Bangla-first, English-switchable P5 buyer guidance: owner/plot identity, mutation history, court cases, government khas status and acquisition. Each step explains papers, offices and the limits of online results.
- Government-service directory, researched from primary sources and checked in an ordinary browser. Supporting mortgage, tax, map and government QR guidance stays secondary. No personal government records were copied or queried.
- A session-only preparation tracker and print action. Marks never issue a title clearance. Reload clears marks. Privacy/storage/source limits are available in the page.
- A separately labeled synthetic sample checker, eight baseline cases, browser-local demo receipts, sample QR tools and tamper demonstrations. Foreign-site absolute QR URLs are rejected.
- Static rendered guide HTML, social preview, icons, canonical URL, robots/sitemap and deployed security headers. Camera remains self-origin only; microphone/geolocation are disabled.

## Observed verification

- Complete regression suite passed, including stateless server-issuance isolation, validation, original A–H outcomes, receipt restoration/tampering/concurrency and conservative handling of absent P5 evidence. TypeScript, zero-warning ESLint and production builds passed locally and on Vercel.
- Final-source CI passed: [push run](https://github.com/abdullahalyf/tree-tweet/actions/runs/39114909927), [PR run](https://github.com/abdullahalyf/tree-tweet/actions/runs/39114912490). Production dependency audit reported zero vulnerabilities at check time; this is not a guarantee of vulnerability absence.
- Chrome: all eight sample outcomes matched; all five P5 questions rendered, with technical details closed. Created synthetic `DEED-PUB-2026-1018`, generated loaded280px QR and verified the same-browser receipt. After reload, Bangla-digit equivalent `DEED-PUB-২০২৬-১০১৮` correctly failed as a duplicate and did not replace the cached receipt.
- A foreign government-site URL carrying sample identifiers was rejected by the QR modal; the matching TreeTweet URL opened Case A. No actual government document was tested or authenticated.
- Guide preparation count, mismatch message and clear action responded correctly. Five marks remain local page state. Bangla default and stored English preference, including the single document title after hydration/reload, were observed.
- No horizontal overflow at390×844 and1440×900. The guide, official link targets and service hostname labels rendered. Local screenshots: `artifacts/publication-mobile.jpg`, `artifacts/publication-desktop.jpg` (ignored evidence files).
- Cold reload under Chrome Slow4G +4× CPU emulation: first contentful paint1668ms, DOMContentLoaded1687ms, load4113ms; guide and all five selects present, width390px, eight visible mobile particles. One synthetic measurement, not a physical-device benchmark or performance SLA. Throttling was reset afterward.
- Live response checks: `nosniff`, frame denial, no-referrer, camera/self and microphone/geolocation restrictions, and CSP frame/object/base/form restrictions. Robots, sitemap, social card, touch icon and SVG icon returned200. No final-page console warnings/errors observed.

## Puku review and fixes

Puku1 researched official sources and reviewed government claims; wording suggestions were applied. Puku2 reviewed seeded Supabase provenance and fixed the missing synthetic-history disclosure. Puku3 found shared registration-cap exhaustion, implemented stateless issuance with regression tests, and found the Bangla-identifier duplicate issue; root normalized the browser boundary and reproduced the corrected behavior live. Root reviewed/integrated their changes and ran the release checks.

## What this release does not establish

This release is a public guidance service and synthetic demonstration, **not an integrated government verification system**. No supported authorized government API or account access was established. Current real ownership, a complete mutation chain, absence of litigation, khas clearance or acquisition clearance cannot be certified by this app.

The optional Supabase schema has anonymous public-read policies intended only for synthetic fixtures. No real personal records were uploaded and no live database migration/configuration was performed. Real-data deployment needs an agreed lawful data source, authorized access, jurisdiction-specific identifiers, evidence provenance/freshness, access policies and operational monitoring.

Physical-phone camera decoding/permission denial, actual print preview and OS reduced-motion behavior still need hands-on sign-off; CSS/source coverage is not that sign-off. The final public workflow does not require camera access. Browser-local custom QR receipts are not available automatically on another device. Government service availability, fees and procedures may change; verify them on the service itself.

## Quick user check · নিজের ফোনে দেখুন

1. Open the live link in a private tab: Bangla guide and five steps should appear; switch English and reload.
2. Mark one paper collected and another as a difference: count and help message update; Clear marks resets them.
3. Open the relevant government-service button; confirm the hostname. Do not give TreeTweet a government password or OTP.
4. In Demo tools → sample checker, try Cases A and H: A shows no detected issue in supplied sample information; H warns that the deed information differs. Neither is a real-land certificate.
5. On an actual phone, review text size, tapping, scrolling, print/PDF and optional camera. Report the failing step and device/browser, without sending private deeds or identity documents.
