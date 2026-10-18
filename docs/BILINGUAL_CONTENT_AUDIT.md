# Bangla and English content audit

Checkpoint: 18 October 2026. Status: source review and exact copy proposals. After reviewing the initial findings, root explicitly approved only the sample-checker wording in SearchForm and WorkspaceIntro for implementation; the remaining proposals are pending review. This document does not itself authorize app changes. Line references identify the reviewed source and may move during the concurrent hero follow-up.

## Scope and method

Read every rendered-content component under `src/components`: BuyerGuide, BuyerHero, BuyerPortal, BuyerHelp, Navbar, WorkspaceIntro, SearchForm, QRScannerModal, VerificationResultView, NoResultView, BuyerChecklist, DemoRegistrationForm, TamperDemonstrationView and the LandTechApp footer/loading/errors. Also reviewed LanguageProvider, issue localization, checklist/presentation helpers and the badge component. Card/particle/motion primitives have no additional user-facing prose. StatusBadge is currently not imported by another component, so its wording is not a current rendered-flow finding.

Used the i18n-sync skill's context/terminology review principles. Its JSON editing workflow does not apply to this app's inline `t(bn,en)` pairs; no locale tool, package, engine or serializer was introduced. Reused `docs/OFFICIAL_SOURCES.md` for existing information boundaries. No new legal/procedure/fee claims or government-data research are needed for these wording proposals. This was source inspection, not a new browser layout audit or a certification of translation quality. Record names, identifiers, hashes and URLs are data, not prose to translate.

## Prioritized changes

### 1. P1 — The sample checker still invites real records

Locations: `src/components/ui/workspaceIntro.tsx:10–12`, `src/components/search/SearchForm.tsx:34–48`, `src/components/LandTechApp.tsx:163–169`. The demo boundary is present, but larger headings say “Find land records” and “Enter a plot or deed number”; the invalid-input message tells a user to consult their papers. This conflicts with the app's made-up-input-only policy. Put the scope in the action itself.

Exact proposed pairs:

| Placement | বাংলা | English |
| --- | --- | --- |
| Checker intro h1 | নমুনা দিয়ে জমির তথ্যের অমিল বুঝুন | Explore land-record differences with samples |
| Intro description | একটি নমুনা বেছে নিন, অথবা আপনার বানানো নমুনার নম্বর দিন। আসল জমির তথ্য দেবেন না। | Choose a sample or enter a number from your own made-up example. Do not enter real land information. |
| Search h2 | নমুনা রেকর্ড খুঁজুন | Find a sample record |
| Search hint | নমুনার দাগ বা দলিল নম্বর দিন। বাংলা বা ইংরেজি সংখ্যা চলবে। শুরুর ০ বাদ দেবেন না। | Enter a sample plot or deed number in Bangla or English digits. Keep any leading zeros. |
| Submit / busy | নমুনার অমিল দেখুন / নমুনা দেখা হচ্ছে… | Check the sample / Checking the sample… |
| Outer loading status | নমুনার তথ্য মিলিয়ে দেখা হচ্ছে… | Comparing the sample information… |
| Invalid-input error | নমুনার নম্বরটি ঠিক হয়নি। দাগ বা দলিলের নম্বর আবার লিখুন। | The sample number is not written correctly. Re-enter the plot or deed number. |

Keep the existing “no proof of ownership” boundary. This is a wording correction; do not loosen runtime identifier validation or import actual records.

### 2. P1 — English technical disclosure renders Bangla engine prose

Location: `src/components/verification/VerificationResultView.tsx:67–71`. `result.summaryBn`, `issue.titleBn` and `issue.descriptionBn` are inserted regardless of the chosen language. This is a confirmed source-level missing translation, even though the main issue cards already use `localizeIssue`.

Propose summary label **সফটওয়্যারের পরীক্ষার বিস্তারিত / Software check details**. For this disclosure's result summary, reuse the existing localized `summary` value. For each issue, reuse `localizeIssue(issue, language).title` and `.description`, retaining the machine code as code. If raw engine prose must remain for developer diagnosis, put it in a separate collapsed section labelled **মূল পরীক্ষার বার্তা (বাংলা) / Original engine messages (Bangla)** with `lang="bn"`; do not silently present it as translated English. Neither route changes verification behavior or translates record data.

### 3. P1 — Result provenance should identify a sample, rather than “your supplied information”

Location: `src/components/verification/VerificationResultView.tsx:43–46`. The user usually supplies an identifier; the app supplies the actual sample fields. The optional Supabase branch says “unverified app database records,” which can suggest unverified real records although the published schema/guide contract is synthetic-only.

Exact replacements:

- Result eyebrow: **নমুনা রেকর্ডের পরীক্ষার ফল / Check result for the sample record**.
- Demo provenance: **শেখার জন্য বানানো তথ্য। এটি আসল জমির ফল নয়। / Made-up information for learning. This is not a result for real land.**
- Current Supabase provenance: **অ্যাপের নমুনা ডাটাবেজের তথ্য। সরকারি রেকর্ড নয়। / Sample records from the app database. These are not government records.**

Keep “problem not detected in supplied information” and unknown/missing distinctions in the outcome itself; never rename a green result “safe land.” If a future authorized data source changes this contract, provenance needs a separate source-specific design, not this blanket wording.

### 4. P2 — Sample creation starts with registration and cryptography jargon

Location: `src/components/registration/DemoRegistrationForm.tsx:160–161,176,179`. The navbar says “Create a sample deed,” but the destination says “Register a synthetic deed” and leads with SHA-256. Rural users need the learning action before the technical explanation.

| Placement | বাংলা | English |
| --- | --- | --- |
| Heading | শেখার জন্য নমুনা দলিল তৈরি করুন | Create a sample deed for learning |
| Intro | বানানো তথ্য দিয়ে একটি নমুনা দলিল ও সেটি খোলার QR কোড তৈরি করুন। | Use made-up information to create a sample deed and a QR code that opens it. |
| Submit | নমুনা দলিল তৈরি করুন | Create sample deed |
| Busy | নমুনা দলিল তৈরি হচ্ছে… | Creating the sample deed… |
| Success | নমুনা দলিল তৈরি হয়েছে | Sample deed created |

Retain the prominent boundary that this is not official registration/mutation and proves no ownership, plus the browser-only/cross-device limitation after creation. Technical hash details can remain in an optional disclosure.

### 5. P2 — “Previous hash / genesis / canonical” asks ordinary users to understand internal mechanics

Location: `src/components/registration/DemoRegistrationForm.tsx:175,181–182`. The default previous hash is already populated, but “Use a genesis value” gives no usable instruction. Preserve the underlying default and validation.

Exact proposed pairs:

- Previous field label: **আগের নমুনার পরিচিতি কোড (ঐচ্ছিক) / Previous sample reference code (optional)**.
- Field help: **প্রথমবার হলে আগে থেকে দেওয়া মানটি রাখুন। এটি শুধু নমুনার সফটওয়্যার পরীক্ষার জন্য। / For your first sample, keep the supplied value. This is only for the sample software check.**
- Stored digest heading: **তথ্য মিলিয়ে দেখার কোড (SHA-256) / Data comparison code (SHA-256)**.
- Canonical disclosure: **কোন তথ্য দিয়ে কোড তৈরি হয়েছে / Information used to create the code**.

Prefer placing these details together in a collapsed “সফটওয়্যারের বিস্তারিত / Software details” area in a later UI task; this audit does not authorize removing a field or changing signing behavior. The proposed “optional” matches the current lack of `required`; verify the service's acceptance of an empty previous hash before adopting the label, otherwise keep the label without “optional.”

### 6. P2 — Tamper demonstration repeats the technical screenshot problem

Location: `src/components/tamper/TamperDemonstrationView.tsx:158,165–168`. The main screen exposes “tampering,” hashes, canonical input and `DEED_HASH_MISMATCH` rather than the understandable before/after change. The mismatch code is visible in the main status, unlike the improved checker.

Exact proposed pairs:

- Heading: **নমুনার তথ্য বদলালে কী হয় / See what happens when sample data changes**.
- Intro: **নাম, দাগ বা জমির পরিমাণ বদলান। আগের তথ্যের সঙ্গে কোথায় অমিল হয় দেখুন। / Change the name, plot number or area. See how it differs from the earlier information.**
- Untested: **এখনও তথ্য বদলে দেখা হয়নি / No change has been tried yet**.
- Match: **আগের তথ্যের সঙ্গে মিলেছে / Matches the earlier information**.
- Mismatch: **আগের তথ্যের সঙ্গে মিলছে না / Does not match the earlier information**.
- Technical explanation: **এই কোড দিয়ে তথ্যের অমিল বোঝা যায়। এটি একা জালিয়াতি বা মালিকানার প্রমাণ নয়। / This code helps detect differences in the data. It alone proves neither fraud nor ownership.**

Keep hashes and the raw mismatch code available in a labelled closed software-details section. Preserve the explicit temporary-copy behavior and the existing caution that a mismatch alone is not conclusive fraud evidence.

### 7. P2 — Mutation simulation wording obscures the fact that it is a sample toggle

Location: `src/components/tamper/TamperDemonstrationView.tsx:170`. “Software simulation,” “demo approval” and “reset” increase reading effort. Keep the real-government boundary while naming the action plainly.

| Placement | বাংলা | English |
| --- | --- | --- |
| Heading | নমুনায় নামজারির অবস্থা বদলে দেখুন | Try changing the sample mutation status |
| Intro | শুধু এই নমুনায় ‘চলছে’ থেকে ‘শেষ’ দেখাবে। সরকারি রেকর্ডে কোনো পরিবর্তন হবে না। | Change this sample from pending to complete. No government record changes. |
| Pending / done | নমুনা: নামজারির কাজ চলছে / নমুনা: নামজারির কাজ শেষ | Sample: mutation pending / Sample: mutation complete |
| Action / reset | নমুনায় ‘শেষ’ দেখান / নমুনা আবার শুরু করুন | Mark sample complete / Start the sample again |

Keep the separate text that this neither connects to an office nor approves ownership. No real mutation workflow should be implied or implemented by a wording change.

### 8. P2 — Main owner instruction combines too many jobs in one paragraph

Location: `src/components/guide/BuyerGuide.tsx:13–14`, owner `body`. It asks for three papers, lists six location identifiers and explains uniqueness in one run. The details matter, so shorten the sentence structure rather than discard checks.

Proposed Bangla: **বিক্রেতার পরিচয়পত্র, দলিল ও খতিয়ান হাতে নিন। কাগজে জেলা, উপজেলা, মৌজা, জরিপ, খতিয়ান ও দাগ মিলান। শুধু দাগ নম্বর মেলালেই হবে না—একই নম্বর অন্য এলাকাতেও থাকতে পারে।**

Proposed English: **Gather the seller’s identity document, deed and khatian. Compare the district, upazila, mouza, survey, khatian and plot. The plot number alone is not enough; the same number can appear in other locations.**

Keep the separate sub-registry/transfer-chain instruction and “khatian alone does not establish clear title” warning. If implemented as short steps, each sentence can be a separate list item without changing meaning.

### 9. P2 — “Mouza” help introduces an unexplained JL number

Location: `src/components/guide/BuyerHelp.tsx:10`, `terms` entry for mouza. A glossary entry should not require another unexplained abbreviation. Do not invent a legal definition or substitute a different administrative unit.

Proposed Bangla meaning: **ভূমির রেকর্ডে ব্যবহৃত এলাকার নাম। কাগজের মৌজার নাম ও তার পাশে লেখা জেএল নম্বর মিলিয়ে দেখুন। জেএল নম্বর বুঝতে না পারলে ভূমি অফিসে জিজ্ঞেস করুন।**

Proposed English meaning: **An area name used in land records. Compare the mouza name and the JL number written beside it. Ask the land office if you are unsure which JL number to use.**

This explains how to act on the paper without claiming that a matching mouza/JL establishes ownership.

### 10. P2 — The FAQ group summary has different scope in the two languages

Location: `src/components/guide/BuyerHelp.tsx:40`. Bangla asks what to do with problems; English asks only about missing information, while the actual group includes application-vs-decision, unavailable sites and whether the app verifies real land.

Replace the group summary with **কাগজ ও যাচাই নিয়ে সাধারণ প্রশ্ন / Common questions about papers and checks**. Replace the section heading's mismatched **সহজ করে বুঝে নিন / A little help with the next step** pair with **কাগজ ও ধাপগুলো বুঝে নিন / Understand the papers and steps**. These two short labels cover the actual content without expanding any legal claim.

### 11. P2 — QR instructions use inconsistent “paste code” language when users need a sample link

Location: `src/components/search/QRScannerModal.tsx:99–105`, `qr-help`, camera/empty/invalid errors and manual-field label. The parser accepts multiple developer formats, but the visible default is a URL and ordinary users do not know which “code” to paste. Keep all accepted formats; simplify the common path.

| Placement | বাংলা | English |
| --- | --- | --- |
| Dialog title | নমুনার QR খুলুন | Open a sample QR |
| Manual label | নমুনার লিংক বা নম্বর লিখুন | Enter a sample link or number |
| Camera error | ক্যামেরা চালু হয়নি। অনুমতি দেখুন, অথবা নিচে নমুনার লিংক বা নম্বর দিন। | The camera did not start. Check permission or enter a sample link or number below. |
| Empty error | নমুনার লিংক, দাগ বা দলিল নম্বর দিন। | Enter a sample link, plot number or deed number. |
| Invalid error | এই নমুনার লিংক বা নম্বর বোঝা যায়নি। আবার দেখুন, অথবা নিচের নমুনা বেছে নিন। | This sample link or number could not be read. Check it again or choose a sample below. |
| Submit | নমুনা খুলুন | Open sample |

Keep the current foreign-URL rejection, government-document authentication boundary and camera fallback. No real government QR should become accepted as part of this wording task.

### 12. P2 — Two hero pause controls need scope and resumption explained

Location: `src/components/guide/BuyerHero.tsx:103–108`. “Resume slideshow” sets an intention, but rotation correctly waits until focus/pointer leave. Users can think it failed. The nearby global animation button currently says only “movement,” without identifying its wider scope.

Proposed button pairs:

- Slideshow running / manually stopped: **ছবি বদলানো থামান / ছবি আবার নিজে থেকে বদলাক** and **Pause slideshow / Resume slideshow**.
- Global motion active / paused: **সব নড়াচড়া বন্ধ করুন / সব নড়াচড়া চালু করুন** and **Turn all animations off / Turn all animations on**.
- Short slideshow help: **ছবি বেছে নিলে নিজে থেকে বদলানো থামে। আবার চালু করলে বোতাম ছেড়ে বাইরে গেলে বদলাবে। / Choosing a slide stops automatic changes. After resuming, move focus and the pointer outside the banner to let it advance.**

Associate the short help with the stable slideshow control if this proposal is chosen. Do not remove hover/focus pause, change the seven-second gate or announce every automatic slide through a live region.

### 13. P2 — Empty-result copy should say which collection had no match

Location: `src/components/verification/NoResultView.tsx:8–10`. “No records found” plus instructions to check identifiers/original records can sound like a search of real government data. The boundary warning is correct but long.

Proposed heading: **এই নম্বরের নমুনা পাওয়া যায়নি / No sample found for this number**.

Proposed body: **নমুনার নম্বর মিলিয়ে লিখুন, অথবা আটটি নমুনা থেকে বেছে নিন। এখানে ফল না পাওয়া আসল জমির ভালো বা খারাপ অবস্থার প্রমাণ নয়। বাস্তব জমির কাগজ সংশ্লিষ্ট অফিসে যাচাই করুন।**

Proposed English: **Check the sample number or choose one of the eight samples. No result here says nothing about the status of real land. Check real land documents with the relevant offices.**

Keep the requested identifiers visible and safely wrapped. Do not turn a missing match into a negative court/khas/acquisition assertion.

## Keep without weakening

- The guide's five checks and outbound official services; missing online results do not establish no dispute, no khas status or no acquisition.
- Tax receipts, maps, matching names and digital fingerprints do not independently prove ownership. The current guide states these boundaries well.
- Government links are labelled as external services, not as “verified land” results. Header language control is explicit Bangla/English; footer independence, hotline call-charge caveat and demo-only persistence text are suitable.
- The checklist tracks paper collection, not completed verification. Reload/reset limitations are explicit. English “mutation” is clarified by its glossary explanation; wholesale renaming would make it harder to match official service names.
- Bangla names, record references, machine codes, hashes and identifier digits may remain as underlying data in English mode. Translate system prose, not signed fields or names; do not mutate hashes to produce English-looking examples.

## Suggested bounded implementation and verification

First batch: findings1–3,11,13 (sample scope and confirmed missing translation). Second batch:4–7 (plain-language optional demo tools). Third batch:8–10,12 (guide/help/control refinement). Root should assign disjoint files and avoid overlapping active hero changes. Review the exact chosen pairs before applying them; this document is not a claim that all thirteen changes shipped.

After changes, use both language modes to inspect the initial checker, empty/invalid search, Cases A/H, English technical disclosure, QR fallback/errors, registration validation/success and all three tamper actions. Change language after an error or result is already visible to catch stale strings. Check 320px and390px wrapping, action labels/focus, preserved slideshow pause semantics and that unknown results remain unknown. Run relevant lint/typecheck/presentation checks and the verification suites if anything beyond copy changes. Source matching or tests alone cannot establish readability for rural users; ask a Bangla-speaking intended user to explain each main action back in their own words.

Checkpoint handoff: this audit added only this document. Following root approval, a separate scoped patch updated `src/components/search/SearchForm.tsx` and `src/components/ui/workspaceIntro.tsx`: sample-only headings, field labels, guidance, empty-input error and submit/busy labels. It preserves identifiers, fixtures, error associations and behavior. The outer LandTechApp loading/invalid messages and all other findings remain proposals. No other documents, Git state, dependencies, browser sessions or server processes were changed. No new public-source requests were made.

Approved-patch checks: `npx.cmd eslint src/components/search/SearchForm.tsx src/components/ui/workspaceIntro.tsx --max-warnings 0` passed with no output/warnings; `npx.cmd tsc --noEmit --incremental false` passed; scoped `git diff --check` passed. Root owns the integrated build and browser verification. No new tests were added for this copy-only patch.
