# Independent P5 review and resolution

The independent reviewer inspected the P5 branch against the buyer checklist contract, with source/diff review separate from implementation. Earlier safety and presentation reviews are retained in PUKU2_* reports.

## Finding: ambiguous latest mutation events
Two events on the same latest date could disagree, while sorting picked whichever appeared first. A clean `done` event before a `pending` event could incorrectly retain GREEN. Root reproduced the finding with a failing regression, then changed the check to examine every event on the latest date. Both array orders now warn with MUTATION_HISTORY_CONFLICT. Tests/p5-tests.test.ts preserves the reproduction.

## Finding: conflict presentation
MUTATION_HISTORY_CONFLICT initially fell through generic issue copy and did not affect the five-item checklist. The translator added explicit plain-language meaning/action and review status. The presentation regression verifies that this row never appears clear.

## Receipt review evidence
Independent tests verify clean receipt restoration, preserved original hashes after edits, rejection of baseline replacement and malformed data, concurrent duplicate uniqueness and the capacity bound. All seven reported receipt tests passed after integration.

## Review limits
The final reviewer reached an account usage limit before committing a complete review report. The findings above were delivered in chat and verified by root; this document does not claim a completed broad independent review. Physical camera, live database, actual print preview and OS reduced-motion testing remain separately identified in PROGRESS.md.
