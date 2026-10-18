# Receipt and concurrency regressions

Added `tests/receipt-tests.test.ts` after inspecting root's current registry implementation. It covers clean receipt restoration and idempotency, preserved original hash after editing receipt area, critical `DEED_HASH_MISMATCH`, baseline replacement rejection, malformed browser-storage rejection, concurrent duplicate registrations and concurrent capacity exhaustion at 199 existing records. Every case resets the custom registry and compares the immutable synthetic fixture snapshot.

No source/configuration/dependency changes. The tests use the existing node:test/assert conventions and check externally observable outcomes. Root should run:

```powershell
node_modules/.bin/tsx.cmd tests/receipt-tests.test.ts
```

Execution against updated source is delegated to root: this worker's source branch predates `restoreSyntheticDeed`, so running here would test an absent API rather than the implementation reviewed. No passing result or coverage is claimed. The root source inspection shows uniqueness and capacity are checked again after awaited hash calculation and restoration explicitly preserves the saved digest. The new tests independently verify those claims once integrated. Build/type/lint/full-suite verification remains with root.
