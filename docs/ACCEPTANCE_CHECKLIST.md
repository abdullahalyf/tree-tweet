# ব্যবহারকারী যাচাই তালিকা / User acceptance checklist

এই তালিকা হাতে পরীক্ষা করার জন্য; টিক চিহ্ন দেওয়ার আগে ফল দেখুন। / This is a manual guide; check an item only after observing its result.

- [ ] মূল পাতায় পাঁচটি ধাপ ও সরকারি সেবার লিংক দেখুন। নমুনা অনুসন্ধান ডেমো টুলে আলাদা থাকে। / Confirm the default guide contains five P5 steps and official links; sample lookup stays in Demo tools.
- [ ] কাগজ জোগাড় ও অমিল চিহ্ন দিয়ে প্রস্তুতির হিসাব বদলান; রিলোডে চিহ্ন মুছে যায়। কোনো “জমি নিরাপদ” সনদ তৈরি হয় না। / Change preparation marks; count and difference message update, reload resets marks, no land clearance is issued.

- [ ] প্রকল্পের মূল ফোল্ডারে `npm ci`, তারপর `npm run dev`; দেখানো localhost ঠিকানা খুলুন। / In the project root run `npm ci`, then `npm run dev`, and open the printed localhost URL. Use one server; workers should reuse the shared dependencies. For a production check use `npm run build` then `npm start`.
- [ ] নতুন browser profile-এ বাংলা প্রথম ভাষা। উপরের English বোতাম চাপুন, reload করুন; English থাকে। বাংলা বেছে reload করলে বাংলা থাকে। / A fresh browser profile starts in Bangla. Use the top English toggle and reload; English persists. Repeat for Bangla.
- [ ] দুই ভাষায় অনুসন্ধান, ফল, সতর্কতা, নিবন্ধন, QR, ত্রুটি এবং বোতাম পড়ুন। নাম ও মূল শনাক্তকারী অপরিবর্তিত থাকে। / Inspect search, results, issues, registration, QR, errors and buttons in both languages. Recorded names and identifiers retain their original data.

| নমুনা / Case | প্রত্যাশিত ফল / Expected result |
| --- | --- |
| A, B | সবুজ / GREEN |
| C, D | হলুদ / YELLOW |
| E, F, G, H | লাল / RED |

- [ ] আটটি নমুনা খুলে উপরের রঙ ও কারণ মিলিয়ে দেখুন। / Open all eight samples and confirm both the color and the explanation.
- [ ] দাগ `0101` এবং দলিল `UNKNOWN-DEED` খুঁজুন: সবুজ হবে না, অন্য দলিলকে নির্বাচিত দেখাবে না। অজানা দাগ `9999` খুঁজুন: স্পষ্ট অনুপস্থিত ফল দেখাবে। / Search dag `0101` with deed `UNKNOWN-DEED`: never GREEN and never silently select another deed. Search unknown dag `9999`: show an explicit missing result.
- [ ] `০১০১` এবং `0101`, `deed-২০২৪-০০০১` এবং `DEED-2024-0001` একই নমুনায় পৌঁছায়; শুরুর শূন্য থাকে। / Bangla and ASCII digits reach the same sample; leading zeros remain intact.
- [ ] খালি দাগ, ঋণাত্মক/শূন্য পরিমাণ, `5junk`, `5.2.3`, `Infinity` দিলে ত্রুটি আসে। / Empty dag, negative/zero area, `5junk`, `5.2.3` and `Infinity` produce validation errors. Browser numeric inputs may block text before submission; automated boundary tests cover direct calls.
- [ ] নতুন synthetic দলিল: `DEED-ACCEPT-001`, দাগ `০০৯৯`, দুই কাল্পনিক নাম, পরিমাণ `৫`, তারিখ `2024-02-29`; সফল হলে সংরক্ষিত শনাক্তকারী ও hash দেখুন। একই দলিল আবার দিলে ব্যর্থ হবে। / Register a new synthetic deed with these values and two fictional names. Verify the identifiers and hash. A duplicate deed must fail.
- [ ] `2025-02-29`, `2026-04-31` বা `A|B` নাম/শনাক্তকারী নিবন্ধনে গ্রহণ হবে না। / Invalid calendar dates and pipe-delimited signed fields must be rejected.
- [ ] নিবন্ধিত দলিলের QR link কপি করে একই browser session-এ খুলুন; সঠিক দলিল ও দাগ দিয়ে অনুসন্ধান হয়। QR ছবি ও লিখিত link একই লক্ষ্য নির্দেশ করে। / Copy the registered deed's QR link and open it in the same browser session. Confirm the correct deed and dag. The QR image and written link must target the same record.
- [ ] QR modal-এ valid link paste ও Enter/যাচাই কাজ করে; invalid text স্পষ্ট ত্রুটি দেয়। Camera permission প্রত্যাখ্যান করলে manual input ব্যবহার করা যায়। Camera scan দাবি করলে আসল QR সামনে ধরে decoding পরীক্ষা করুন। / Test pasted QR links with Enter and the verify button, invalid text, camera denial and manual fallback. If camera scanning is advertised, confirm actual QR decoding with a physical code.
- [ ] Tamper demo-তে area/name বদলালে hash অমিল হয়। Reset করে আগের অবস্থা ফিরে আসে; পরে নমুনা A এবং নতুন দলিল পুনরায় খুঁজে অপরিবর্তিত তথ্য পান। / Alter area/name in the tamper demo; detect a hash mismatch. Reset restores the copy. Reopen Case A and the registered deed to confirm their stored data is unchanged.
- [ ] `390×844` ও `1440×900` viewport-এ form, ফল, modal, toggle পড়া ও ব্যবহার করা যায়; horizontal page scrolling নেই। / At both viewports, forms, results, modals and toggle remain usable without horizontal page scrolling.
- [ ] শুধু keyboard-এ Tab/Shift+Tab, Enter ও Escape ব্যবহার করুন। Focus দেখা যায়, modal থেকে পেছনের form-এ focus চলে যায় না, বন্ধ করলে focus ফেরে। / Use keyboard navigation, Enter and Escape. Focus is visible; modals contain focus and restore it on close.
- [ ] OS/browser-এ reduced motion চালিয়ে অপ্রয়োজনীয় animation বন্ধ/কমে যায় এবং কাজ সম্পন্ন করা যায়। / Enable reduced motion and confirm unnecessary animation stops or reduces while workflows remain usable.

সীমাবদ্ধতা: এগুলো কাল্পনিক demo record; সরকারি যাচাই বা মালিকানার নিশ্চয়তা নয়। Hash পরিবর্তন শনাক্ত করে, মূল তথ্য সত্য প্রমাণ করে না। নতুন নিবন্ধনের receipt browser-local demo; cross-device স্থায়ী নিবন্ধন নয়। নতুন browser-এ custom QR খুললে record না পাওয়া স্বাভাবিক; A–H baseline link কাজ করা উচিত। Reload বা server restart-এর পরেও স্থায়িত্ব ধরে নেবেন না। QR link নিজে record সংরক্ষণ করে না। / Limitations: records are synthetic, with no government verification or ownership guarantee. Hashes detect changes, not whether the original claims are true. A new receipt is a browser-local demo, with no durable cross-device registration. A custom QR may legitimately show no record in another browser; baseline A–H links should work. Do not assume persistence across reloads or server restarts. A QR link does not store the record itself.

পরীক্ষক / Tester: ______  তারিখ / Date: ______  Commit/URL: ______  ব্যর্থ ধাপ / Failed steps: ______
