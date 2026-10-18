# Publication audit

## Integration follow-up

The concerns below describe the audited baseline, not unresolved current behavior. Publication integration changed the action to stateless receipt issuance (no shared server registry retention/cap), added regression coverage, disclosed unverified/synthetic Supabase provenance, and added security headers/social metadata. Root ran the complete suite, TypeScript, zero-warning lint, production build and production dependency audit (0 vulnerabilities). Real-data Supabase access policy design and authorized government integration remain outside this public guidance release; no real records were uploaded.

Read-only source audit of root commit `5adedd3` on 2026-10-18. Applied ECC security-review and verification-loop guidance. No browser, hardware, live headers, production environment, database policy deployment, dependency audit or government integration was verified in this audit. No application source changed.

## Release judgment

The source supports publication as an explicitly synthetic educational prototype. It does **not** establish readiness for real personal records, authoritative ownership decisions or official integration. The registration page already explicitly prohibits real personal information, and the footer distinguishes temporary browser receipts from government/cloud records.

## Concrete concerns

1. **Public demo availability: shared capacity can be exhausted anonymously.** `src/lib/actions/registerDeed.ts` exposes synthetic registration without authentication or a rate limit. `src/lib/demo/registry.ts` retains submissions in process-wide memory and imposes a shared 200-record bound. One visitor can consume that capacity and make subsequent registrations fail until the instance resets; serverless instances also have inconsistent independent state. This is a concrete demo reliability risk. Before relying on uninterrupted public registration, scope the store per visitor or add bounded expiry/reset and abuse controls. Current concurrency checks prevent exceeding the bound, not exhausting it.

2. **Real-data blocker: Supabase tables are enumerable anonymously.** `supabase/migrations/001_initial_schema.sql` grants `SELECT USING (true)` on khatian, plot_status and deed, while the public client is intentionally browser accessible. A visitor can bypass the search UI and enumerate all exposed rows, including names and transfer details. This is acceptable only for intentionally public synthetic fixtures. Do not upload private or real personal records under these policies; decide access/privacy requirements and deploy appropriate policies first. Actual deployed policies were not inspected.

3. **Receipt privacy/retention: local storage is not private storage.** `DemoRegistrationForm.tsx` sends full form contents to the server action and saves deed receipts in persistent origin localStorage; the server registry also retains submitted contents temporarily. The warning against real personal data is therefore necessary. Other users of the same browser profile can see stored receipts. The footer's browser persistence statement should not be interpreted as a claim that data never reaches the server. This is not a blocker for synthetic-only publication.

## Other reviewed areas

- Metadata identifies a synthetic prototype in the description; titles and document language are set. Missing social preview/canonical metadata is a presentation improvement, not a release blocker.
- QR modal source includes dialog semantics, focus containment/restoration, Escape, stream cleanup and unsupported-decoder fallback. Camera hardware operation and rendered accessibility were not tested here. No accessibility conformance claim is justified by source inspection alone.
- `.env.example` is the only tracked environment file returned by the filename check; `.env` variants and `.vercel` are ignored. This is not a complete secret or history audit.
- Database lookups use parameterized Supabase filters. The browser client uses the public anonymous key; the administrative helper guards browser execution. No evidence of official government verification was found or inferred.
- `next.config.ts` disables the identifying framework header. Deployed HTTPS/security headers and hosting configuration remain unverified; absent source-level CSP alone was not treated as a critical blocker.

Evidence commands: read current layout/configuration, registry/server action, browser registration/receipt restoration, locale/modal components and SQL policies; `git -C .. rev-parse --short HEAD`; `git -C .. ls-files '*env*'`. No build or test pass is claimed by this publication audit.
