# PUKU1 bilingual feature report

Applied the `ecc:react-patterns` skill from `E:/Software_C_back/.codex/plugins/cache/ecc/ecc/2.2.3/skills/react-patterns/SKILL.md`. Read AGENTS.md, approved design, Task 1/global constraints, and the installed Next.js use-client documentation before implementation.

Implemented:
- LanguageProvider/useLanguage with bn default, guarded persistence, in-memory fallback, hydration-safe external store and document language synchronization.
- Fully bilingual search, QR tools, missing results, assessment/issues/checks/records/guidance, synthetic registration and tamper/mutation demonstration.
- Pure localizeIssue mapping with original quoted names and deed identifiers preserved; new safety codes and all eight sample captions covered.
- Conservative summaries and evidence availability checks, associated form labels, status/error semantics, QR keyboard focus trap and Escape cleanup.
- Preserved original fixtures, canonical payloads, stored hashes and disposable tamper handlers. Search clears stale deed selections. Registration maps safe stable error codes and restores the server receipt into the browser demo registry.

Checks:
- `node ../node_modules/typescript/bin/tsc --noEmit` passed before adding the explicitly requested root-integration import `restoreSyntheticDeed`. After that import, this isolated branch reports only the expected missing export because root owns that export and has not been cherry-picked here. Parent must confirm final integrated TypeScript.
- `node ../node_modules/eslint/bin/eslint.js src/lib/i18n src/components/search src/components/verification src/components/registration src/components/tamper` passed with zero warnings/errors.
- Pure issue-localization assertions executed through TypeScript transpileModule plus Node VM: passed bilingual title selection, original name/deed preservation, six new safety-code mappings and all eight captions.
- Initial tsx assertion execution could not spawn esbuild in the sandbox (EPERM); reran equivalent pure assertions without child processes successfully.

Limits/integration:
- Root wraps the application in LanguageProvider and supplies restoreSyntheticDeed/errorCode server contracts.
- No dependency installation, application server or browser run was started here, per RAM constraint. Parent owns integrated desktop/mobile/browser/build checks.
- QR camera was explicitly labeled preview-only; puku3 is adding native BarcodeDetector support after commit a2618df while preserving fallback, translations, focus management and cleanup.
- Original Bengali names/mouzas are retained as record data in English presentation. Hashes and canonical data intentionally remain unchanged.

Feature commit: a2618df. Follow-up report/preservation refinement committed separately.
