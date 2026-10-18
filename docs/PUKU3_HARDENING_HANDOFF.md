# Reliability hardening handoff

Completed on branch `puku/reliability-hardening`, based on main `0cbb00a`. Reused previously read security-review and verification-loop skills and read local AGENTS.md. No UI, translations, configuration, fixture facts, dependency installation, application server, build, deployment or database policy changes.

## Findings and changes

- Plot normalization silently removed arbitrary characters: `01!01` became known dag `0101`, allowing a malformed identifier to receive its GREEN result. Normalization now rejects unsupported characters while preserving Bangla digits, surrounding whitespace, leading zeros and supported subplot separators. This also protects UI paths that normalize before calling the service.
- The public service trusted TypeScript types at runtime: null/numeric/object fields could throw before its database error boundary or reach verification unchecked. Added bounded runtime checks for identifiers, seller and finite positive area, returning an unsuccessful response with no trusted result. Deed-only search remains supported.
- Browser receipt restoration treated any existing identifier as success before validating other fields, and baseline protection used case-sensitive comparison. Restoration now validates through stateless issuance first (including normalized baseline duplicate rejection), then accepts existing custom receipts only when signed fields and stored digest match. Conflicting cache data cannot silently masquerade as successful restoration. First restoration of edited data still retains the original digest for critical tamper detection; existing receipt tests verify this.

## Observed verification

Run serially from worker directory using shared parent dependencies:

- `../node_modules/.bin/tsx.cmd tests/hardening-tests.test.ts`: 3/3 pass.
- `../node_modules/.bin/tsx.cmd tests/receipt-tests.test.ts`: 9/9 pass (includes aggregate parent).
- `../node_modules/.bin/tsx.cmd tests/reliability-tests.test.ts`: 52/52 pass.
- Targeted ESLint on the three changed source files and new regression file: pass.

Escalated execution was necessary for esbuild's child process, as established earlier. No coverage percentage, build, full-suite or live Supabase pass is claimed. Parent owns final integration checks.

## Scope review and limits

Reviewed stateless server issuance, registry capacity/uniqueness checks around digest awaits, browser restoration and service routing. Existing persistent registration capacity checks remain unchanged; stateless issuance retains no custom records. Fixture immutability and canonical digest regressions pass. Optional Supabase queries use parameterized filters and the service catches query/engine errors rather than silently falling back to synthetic results. No configured live database was exercised, and database response schema casts are not a complete runtime validation layer. Public-read policies remain synthetic-only as requested. UI stale-search cancellation remains parent-owned; no UI code changed.

Next: parent integrates the commit, runs normal complete gates, and verifies malformed identifier error presentation. All scoped implementation and targeted verification work is complete; no background process remains.
