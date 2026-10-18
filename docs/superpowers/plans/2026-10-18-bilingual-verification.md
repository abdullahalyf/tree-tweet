# TreeTweet Bilingual Verification Implementation Plan

> For agentic workers: use subagent-driven-development with isolated directories and task reviews.

**Goal:** Deliver the approved bilingual, polished and verified land risk assessment prototype.
**Architecture:** Keep the existing verification engine and feature boundaries. A shared client locale context translates presentation; core domain data and cryptographic serialization remain unchanged.
**Tech Stack:** Next.js, React, TypeScript, Tailwind, optional Supabase, qrcode.
**Spec:** docs/superpowers/specs/2026-10-18-bilingual-verification-design.md

## Global Constraints
- Bangla default; persistent Bangla/English language toggle at top.
- No false green on missing records, no fabricated government verification, immutable baseline fixtures.
- Keep changes within assigned files; no additional workers or application servers.
- Read installed Next.js documentation before framework changes.
- Target viewports: 390x844 and 1440x900; honor reduced motion and visible focus.

### Task 1: Complete bilingual feature presentation
**Files:** Create src/lib/i18n/*; modify src/components/search/*, src/components/verification/*, src/components/registration/*, src/components/tamper/*.
**Interfaces:** Export LanguageProvider, useLanguage() returning { language, setLanguage, t }; t accepts (bn: string, en: string) and returns selected string. Export a pure issue-localization helper for VerificationIssue, preserving original name/identifier data. Root wraps app in provider and translates app shell. Navbar consumes useLanguage.
- [ ] Implement locale context, guarded storage persistence and document language update.
- [ ] Translate every visible feature string including dynamic messages, accessibility labels, modal controls and result issue summaries.
- [ ] Do not change validation/hashing/verification domain behavior; report domain errors that need root changes.
- [ ] Run available targeted checks; write report with files, commands, outcomes, and concerns.

### Task 2: Responsive visual design and motion
**Files:** Modify src/app/globals.css, src/components/ui/navbar.tsx, card.tsx, badge.tsx; create src/components/ui/workspaceIntro.tsx.
**Interfaces:** Consume Task 1 useLanguage interface. Preserve Navbar props ActiveNavTab and onTabChange. Export WorkspaceIntro component for root to insert on initial search view.
- [ ] Design an earthy, trustworthy, distinctive tool with top bilingual control, clear mobile navigation, tasteful CSS motion and reduced-motion alternative.
- [ ] Style real forms, risk summaries, modal surfaces, focus, loading, empty, error and success states through coherent tokens and scoped styles.
- [ ] Avoid heavy animation dependencies or background processes.
- [ ] Document visual checks and produce report. Root performs rendered review after integration.

### Task 3: Regression evidence and user acceptance guide
**Files:** Create tests/reliability-tests.test.ts, docs/ACCEPTANCE_CHECKLIST.md; modify scripts only if required for independent tests. Do not edit package.json or source domains.
**Interfaces:** Consume existing runLandVerification, registerSyntheticDeed and executeLandVerification APIs. Root implements critical fixes informed by these tests.
- [ ] Inspect existing test coverage and write meaningful regressions for unknown target deed, missing deed/status evidence, non-finite/malformed area, registration date/delimiter validation, and search input consistency.
- [ ] Run new tests against baseline; report confirmed failures to root immediately.
- [ ] Create bilingual user acceptance instructions covering cases A-H, unknown identifiers, Bangla digits, language persistence, QR registration, tamper isolation, mobile and keyboard usage.
- [ ] Report observed evidence, remaining gaps and exact test commands.

### Task 4: Root integration and critical correctness
**Files:** src/components/LandTechApp.tsx, src/app/layout.tsx, page.tsx, src/lib/verification/*, src/lib/services/*, src/lib/actions/*, src/lib/demo/registry.ts, src/lib/validation/*, package.json, next.config.ts, deployment files.
- [ ] Establish baseline checks and fix reproducibility/configuration problems.
- [ ] Fail conservatively when verification evidence is absent, validate untrusted registration inputs and maintain server/client demo consistency.
- [ ] Integrate agent changes with independent review and run regressions, types, lint and build.
- [ ] Render desktop/mobile and exercise translated workflows, keyboard, errors and demo outcomes.
- [ ] Merge reviewed branches, push, deploy to Vercel and record limitations.
