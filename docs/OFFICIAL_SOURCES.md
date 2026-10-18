# Official land-service sources · সরকারি ভূমিসেবার সূত্র

Checked / যাচাইয়ের তারিখ: **18 October 2026**. Method: public website reads and search-index evidence restricted to government domains. Applied the `ecc:research-ops` skill. No login, application submission, payment, personal-record query or authenticated API access was performed. This is a source directory and practical checking guide, not legal advice or proof of ownership.

## Browser verification after the initial research

Root opened the actual production pages in Chrome on 18 October 2026. `https://www.land.gov.bd/` rendered its service directory and 16122 help number. Its current revenue-case link points to `http://case.gov.bd/`; the HTTPS destination `https://case.gov.bd/` loaded the Ministry's revenue-case management landing page and hearing calendar. The guide uses that current working destination rather than the initially indexed `case.land.gov.bd` address.

`https://dlrms.land.gov.bd/` rendered survey-khatian, mutation-khatian and mouza-map tabs with geographic search selectors. `https://mutation.land.gov.bd/search-mortgage-info` rendered its public mortgage search form. `https://portal.ldtax.gov.bd/` rendered the land-tax service, login and registration-document guidance. `https://larms.land.gov.bd/` rendered the acquisition-management landing page. These successful browser observations supersede only the initial fetch restrictions below, not the limits on completeness, individual records or API access. No search involving a person or specific real plot was submitted, and no account/OTP/payment was used.

Supporting guidance: compare mortgage/release papers with the lender; tax receipts alone do not establish title; a map does not replace a physical boundary check. The Ministry's [Bhumipedia](https://bhumipedia.land.gov.bd/) indexed fraud notice directs citizens to official Bhumi app guidance for QR checks on dakhila, khatian and DCR documents. TreeTweet's QR tool is explicitly for synthetic sample lookups and rejects foreign-site absolute URLs. No government document authentication is claimed.

## Public sources and evidence boundaries

| Official destination | What was actually observed | Access and limits |
| --- | --- | --- |
| [Land service gateway / ভূমি তথ্য বাতায়ন](https://www.land.gov.bd/) | Government-domain indexed page lists mutation, records/maps, acquisition and revenue-case services, with citizen help resources. | Direct research fetch returned 403. The index establishes a public service directory, not a successful current plot lookup. Start here if a deep link changes. |
| [e-Mutation / ই-নামজারি](https://mutation.land.gov.bd/) and [public FAQ / সাধারণ জিজ্ঞাসা](https://mutation.land.gov.bd/query) | Indexed official FAQ explains mutation as updating the government record following an ownership change and describes the resulting khatian fields. [Official instructions](https://mutation.land.gov.bd/nirdeshika) describe application tracking and obtaining khatian/DCR copies. | Direct fetch returned 403. Instructions are publicly indexed; this audit did not complete tracking, obtain a record or establish whether a particular workflow requires login/OTP. Follow the portal's actual access requirements. |
| [Land records and maps / ভূমি রেকর্ড ও ম্যাপ](https://dlrms.land.gov.bd/) | The production URL is expressly listed for certified record-copy applications by the [Khulna district citizen charter](https://khulna.gov.bd/pages/static-pages/69812047a31054345f1e0bbb) and [Meherpur district citizen charter](https://meherpur.gov.bd/pages/static-pages/69813cbd35ce18e1c06ff8a9). | Production fetch timed out; production search form and login/payment sequence were not exercised. Search returned a `dlrms-stg` page: its fields, counts and prices are **not** treated as verified production behavior. |
| [Land revenue case service / ভূমি রাজস্ব মামলা](https://case.land.gov.bd/) | Government-domain indexed hearing pages expose case number, status/hearing information and describe revenue-case management. | Root fetch timed out. Indexed examples show some public case pages, not a complete current court database or a reliable all-disputes-by-plot search. Do not reproduce parties' names or addresses in a synthetic demo. |
| [Judiciary e-Causelist / বিচার বিভাগের ই-কজলিস্ট](https://causelist.judiciary.gov.bd/) and [case search / মামলা অনুসন্ধান](https://causelist.judiciary.gov.bd/caseinfo) | Direct public fetch succeeded. Landing page links case/court search; case page exposes columns for case number, parties and details. | No search was submitted and no matching case or order was obtained. A cause list is a court-listing service; an empty result cannot establish that no litigation exists. |
| [LARMS / ভূমি অধিগ্রহণ ও হুকুমদখল](https://larms.land.gov.bd/index.html) and [notice board / নোটিশ](https://larms.land.gov.bd/notice.html) | Indexed government-domain pages describe acquisition/requisition workflows and a notice table with date, district and download labels. | Direct fetch returned 403. Notice downloads, authenticity, geographic completeness and plot coverage were not verified. The indexed homepage includes an item dated **24 October 2026**, after this audit date: do not publish that item's assertions as established current fact. |
| [Official mortgage search page / বন্ধক অনুসন্ধান](https://mutation.land.gov.bd/search-mortgage-info) | Indexed government page shows location/record selections and plot/khatian inputs. | Direct fetch returned 403; no query or result was obtained. This is a public form observation, not verification of any lender liability or proof of complete coverage. |

These URLs identify government-hosted services. This audit does **not** certify every displayed record, prove operational availability, or establish a supported third-party data API. No blanket permission to scrape, mirror or republish personal records was found or assumed.

## Five P5 buyer questions · কেনার আগে পাঁচটি প্রশ্ন

The steps below are practical recommendations derived from each service's stated purpose. They are not a claim that the portal alone resolves the question.

| P5 question | বাংলা: কী করবেন | English: practical next step | What remains unresolved |
| --- | --- | --- | --- |
| Seller and recorded owner / বিক্রেতা ও রেকর্ডের মালিক | মূল দলিল ও খতিয়ানের কপি নিন। DLRMS-এর সরকারি পথে কপি চাইতে পারেন। নাম, মৌজা, দাগ ও জমির পরিমাণ একসাথে মিলিয়ে দেখুন। | Obtain original deed and khatian copies; use the official records service for copy requests. Compare names, mouza, plot identifiers and area together. | A matching recorded name alone does not establish current ownership, identity or authority to sell. Ask the relevant land/sub-registry office and obtain qualified help where needed. |
| Mutation and change history / নামজারি ও আগের পরিবর্তন | নামজারির আবেদন/কেস নম্বর ও সিদ্ধান্তের কপি সংগ্রহ করুন। সরকারি নির্দেশনা মেনে বর্তমান অবস্থা দেখুন; ভূমি অফিসে আগের ও বর্তমান খতিয়ান মিলিয়ে নিন। | Obtain the mutation application/case reference and decision. Follow official tracking instructions and compare earlier/current records with the land office. | A complete public chronological ownership history was not verified. A screenshot or status label does not replace the underlying decision. |
| Court disputes / মামলা | পরিচিত মামলা নম্বর থাকলে সঠিক আদালতের কার্যতালিকা দেখুন। রাজস্ব মামলা হলে ভূমি মামলার সেবায় খোঁজ নিন। বর্তমান আদেশ সংশ্লিষ্ট আদালত থেকে নিশ্চিত করুন। | With a known case reference, check the relevant court listing. Use the revenue-case service where appropriate and confirm current orders with the relevant court. | Revenue proceedings and civil court proceedings are different sources. Neither portal was verified as a comprehensive plot-based litigation clearance service. |
| Government khas land / সরকারি খাস জমি | জমির শ্রেণি ও খতিয়ান নিয়ে সংশ্লিষ্ট ভূমি অফিসে খোঁজ নিন। সরকারি রেকর্ডের কপি চাইতে DLRMS-এর পথ ব্যবহার করুন। | Ask the relevant land office to confirm classification using the khatian and plot details; obtain official record copies through the records service. | No public nationwide API or single search giving definitive khas-land clearance was verified. Missing online information must stay unknown. |
| Acquisition / অধিগ্রহণ | LARMS-এর নোটিশের পথ দেখুন। দাগ, মৌজা ও এলএ কেস নম্বর নিয়ে জেলা প্রশাসকের ভূমি অধিগ্রহণ শাখায় বর্তমান অবস্থা ও মূল নোটিশ নিশ্চিত করুন। | Consult the LARMS notice entry point, then confirm current status and original notices with the district administration's land acquisition branch using plot, mouza and LA case references. | A notice-board absence is not proof that no notice/acquisition exists. This audit did not establish full notice coverage, legal effect or plot-specific status. |

For mortgage concerns, the official mortgage-search page is a starting point; confirm a reported loan or release directly with the relevant lender and office. For deed history, obtain the relevant sub-registry records rather than treating a matching digital fingerprint as evidence that the initial deed was truthful.

## Publication wording and integration rules

**Safe bilingual copy:**

> সরকারি সূত্রে নিজে যাচাই করুন। এই অ্যাপ সরকারি রেকর্ড সরাসরি যাচাই করে না। তথ্য না পাওয়া মানে সমস্যা নেই, এমন নয়।
>
> Check independently with official sources. This app does not directly verify government records. Missing information does not mean there is no problem.

- Label outbound links **সরকারি সেবা খুলুন / Open official service**. Do not label a link or successful page load “government verified.”
- Keep synthetic results separate from external government pages. Do not import public parties' personal details into fixtures.
- Login, OTP, CAPTCHA, application and fee steps belong to the official service. Do not request users' government passwords/OTP inside TreeTweet or bypass those controls.
- A public page or undocumented browser request is not evidence of a supported integration API. Automated access would require separate review of authorization, terms, privacy, availability and provenance.
- Retain source URL, check date, jurisdiction and document reference when a user manually supplies evidence; keep unsupported fields unknown. Do not invent a clear court/khas/acquisition status from a failed fetch.
- Do not publish fixed fees, statutory deadlines or a promise of nationwide completeness from this audit. Confirm those matters on the live official service and with the relevant office.

## Recheck before release

Open each destination on an ordinary browser and mobile connection, starting from the land gateway. Confirm actual links, service names, authentication and accessibility. This audit's 403/timeouts must not be presented as proof that services are offline for citizens. The source directory can be published with these limits; no authenticated government integration was established.
