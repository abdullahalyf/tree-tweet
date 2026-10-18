# Stateless receipt issuance

The anonymous server action now calls `registerSyntheticDeed(input, { persist: false })`. This validates and hashes the receipt without inserting submitted data into the process registry, creating plot metadata or consuming its shared capacity. Stateless issuance rejects baseline identifiers and malformed inputs, but does not reserve custom identifiers across visitors. Default callers and browser restoration retain existing bounded registry behavior and concurrency guards. Live database writes remain disabled.

Added independent receipt regressions: 205 stateless receipts leave no lookup records, plot metadata or custom entries; receipts have valid digests; a full local registry cannot prevent stateless issuance; existing data remains unchanged; baseline conflicts and invalid areas still fail. Existing receipt/concurrency cases remain intact.

Verification: targeted ESLint and `git diff --check` passed. Attempted `../node_modules/.bin/tsx.cmd tests/receipt-tests.test.ts` failed before assertions because the stale worker branch lacks root's `src/lib/validation/date.ts`. No test pass is claimed. Root must run the exact receipt suite and normal integration checks after cherry-picking the fix. No dependencies, app server or browser were started.

Read installed Next.js `dist/docs/01-app/02-guides/server-actions.md` before editing the action. Root's assigned registry/action files were synchronized in an isolated baseline commit; that synchronization commit is not part of the fix to cherry-pick.
