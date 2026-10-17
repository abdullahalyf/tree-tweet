# PRELIMINARY CONCEPT NOTE
## AI-Assisted Pre-Purchase Land Verification System
**LandTech Innovation Hackathon 2026 • Problem P5: Check Before You Buy**

---

### Basic Information
- **Product Name:** AI-Assisted Pre-Purchase Land Verification System (জমি কেনার আগে ঝুঁকি যাচাইকরণ)
- **Problem Category:** P5 — Check Before You Buy
- **Team Name:** Hector
- **Team Leader:** MD IRFANUL HOQUE TASEEN
- **Team Member:** Abdullah Alif
- **Faculty Mentor:** Md. Sagar Hossen
- **Submission Date:** October 2026
- **Target Audience:** Ordinary Bangladeshi citizens purchasing land, prospective property buyers, legal advisors.

---

## 1. Problem Statement & Bangladesh Context

Land is the single most valuable capital asset for ordinary families in Bangladesh. Yet, property acquisition is fraught with severe systemic risks. Millions of citizens face fraud, prolonged civil litigation, and financial devastation due to fragmented records and information asymmetry.

Key challenges in the Bangladeshi land purchase ecosystem include:
1. **Double-Sale & Overlapping Deeds:** Unscrupulous sellers conceal prior registrations and execute duplicate deeds for the same land plot (*দাগ*).
2. **Name & Identity Discrepancies:** Discrepancies between historical land record (*খতিয়ান*) owner names and National ID / deed seller names (e.g., spelling differences or unauthorized persons executing transfers).
3. **Excessive Area Conveyance:** Deeds attempting to transfer more land than remains in the seller's recorded share.
4. **Unmutated Titles (*নামজারিবিহীন জমি*):** Land transferred through deeds without an updated mutation record (*খারিজ পর্চা*).
5. **Government Khas Land Fraud (*খাস জমি*):** Prohibited government lands fraudulently sold as private property.
6. **Undisclosed Encumbrances:** Undisclosed active bank mortgages or pending civil court cases (*দেওয়ানি মোকদ্দমা*).
7. **Paper Document Tampering:** Manual alteration of deed copies, area values, or buyer details.

Currently, an ordinary citizen must navigate multiple disconnected offices (AC Land, Sub-Registry, and Civil Courts) with little to no technological decision support.

---

## 2. Proposed Solution & Intended Users

Our system provides an **AI-assisted, Bengali-first pre-purchase verification platform** tailored to ordinary Bangladeshi land buyers.

By entering a land Dag number (*দাগ নম্বর*) and optional Deed number (*দলিল নম্বর*), or by scanning a deed's QR code, citizens receive an instant, objective, traffic-light risk report:
- **GREEN (সবুজ):** *“প্রদত্ত রেকর্ডে নির্ধারিত পরীক্ষায় ঝুঁকি শনাক্ত হয়নি”* — Zero identified anomalies across all seven deterministic checks.
- **YELLOW (হলুদ):** *“সতর্কতা — অতিরিক্ত যাচাই প্রয়োজন”* — Non-fatal warnings (e.g., minor name spelling differences, active bank mortgage).
- **RED (লাল):** *“গুরুতর ঝুঁকি শনাক্ত হয়েছে”* — Critical risks (e.g., double-sale, excessive area, unauthorized seller, court dispute, or cryptographic document tampering).

### Intended Users:
- **Primary:** Ordinary land buyers and non-expert citizens seeking pre-purchase risk visibility.
- **Secondary:** Real estate paralegals, legal advisors, and community land facilitators assisting buyers during preliminary document scrutiny.

---

## 3. Workflow & Key Features

```
[ Citizen Inputs Dag / Deed or Scans QR ]
                   │
                   ▼
[ Data Acquisition (Local Demo Fixtures or Supabase) ]
                   │
                   ▼
[ Seven Deterministic Integrity & Rule Checks ]
   ├── 1. SHA-256 Cryptographic Digest Verification
   ├── 2. Active Deeds & Double-Sale Detection
   ├── 3. Seller-to-Owner Name & Token Comparison
   ├── 4. Remaining Area vs. Requested Area Limit
   ├── 5. Mutation (*নামজারি*) Status Scrutiny
   ├── 6. Government Khas Land Exclusion
   └── 7. Encumbrance Audit (Bank Mortgages & Court Disputes)
                   │
                   ▼
[ Accessible Traffic-Light Result Banner (Color + Symbol + Text) ]
   ├── Specific Warning & Failure Reasons
   ├── Detailed Records Breakdown (Khatian, Status, Deeds)
   ├── Step-by-Step Citizen Guidance (Next Physical Office Checks)
   └── Mandatory Legal Disclaimer
```

### Key Technical Features:
1. **Bengali-First, Accessible Interface:** Accepts Bangla digits (`০-৯`) and English digits (`0-9`) while preserving leading zeros (e.g., `০১০১`). Accessible to color-blind users through symbols (`✓`, `⚠`, `✕`) and explanatory Bangla text.
2. **Zero-Invention Rule Engine:** Reusable deterministic rule modules evaluate facts without arbitrary heuristics or probabilistic hallucination.
3. **Canonical SHA-256 Tamper Detection:** A standard serialization algorithm hashes seven critical deed fields (`deed_no`, `dag_no`, `seller`, `buyer`, `formattedArea`, `date`, `prev_hash`). Any change to a single character triggers an immediate mismatch.
4. **Synthetic Deed Registration & QR Generator:** Allows simulated registration of new synthetic deeds, generating verifiable QR codes linking directly to the platform's verification route.
5. **Interactive Tamper Demonstration Lab:** Enables judges to test a disposable copy of a synthetic record, alter a field, and observe cryptographic tamper detection without corrupting baseline records.
6. **Simulated Mutation Workflow:** Educational demonstration illustrating how mutation approval updates records (*with strict simulation notices*).

---

## 4. Innovation & Differentiation

| Feature / Aspect | Traditional Manual Process | Our AI-Assisted System |
| :--- | :--- | :--- |
| **Verification Speed** | Weeks of manual office visits | Instant (< 200 milliseconds) |
| **Language & Usability** | Complex legal jargon in colonial terminology | Plain Bengali with actionable next steps |
| **Document Integrity** | Vulnerable to paper page substitutions | Cryptographic SHA-256 verification |
| **Double-Sale Visibility** | Hidden in manual volume books (*বালাম বই*) | Instant detection of multiple active deeds |
| **Area Math Verification** | Prone to manual calculation errors | Strict mathematical check against remaining area |
| **Accessibility** | Requires physical presence at sub-district offices | Accessible on any mobile browser |

---

## 5. Technical Approach & Data Integrity

- **Frontend & App Architecture:** Next.js 16 (App Router) with TypeScript 5, React 19, and Tailwind CSS.
- **Server-Side Security:** Cryptographic hashing and registration run exclusively inside Next.js Server Actions. Client-supplied hashes are never trusted.
- **Service Layer Abstraction:** Decoupled service layer (`landService.ts`) handles data fetching, cleanly routing between configured cloud databases and local demo fixtures.
- **Test-Driven Reliability:** 
  - 8 isolated scenario tests (`test:cases`).
  - 47 deep unit tests (`test:unit`) verifying canonical serialization, digit normalization, name comparison rules, tamper detection, and fixture immutability.
  - Zero TypeScript compiler errors (`tsc --noEmit`) and zero ESLint warnings.

---

## 6. Scope, Synthetic-Data Assumptions & Limitations

### Strict Hackathon Scope:
- **Demonstration Prototype (MVP):** Built specifically for Problem P5 of the LandTech Innovation Hackathon 2026.
- **Synthetic Data Exclusivity:** All khatians, deeds, mouzas, and names are completely fictional. The system neither stores nor scrapes real citizen personal data.
- **Local Demo Storage Mode:** Operates independently of live Supabase credentials using built-in synthetic fixtures (`DEMO_SCENARIOS` Cases A to H).
- **In-Memory & LocalStorage Limitation:** Custom registrations in demo mode are stored in server memory and synced to client `localStorage`. For production permanence, live PostgreSQL integration is required.

### What the System Is NOT:
- **NOT an Official Title Registry:** It does not grant official ownership or replace government land registration.
- **NOT an Official Mutation Clearance:** Mutation simulations are educational only.
- **NOT Proof of Historical Authenticity:** A matching SHA-256 hash confirms digital data integrity against a stored record; it cannot verify if the original submitted document was legally sound.

---

## 7. Expected Impact & Future Roadmap

### Citizen Impact:
- **Risk Prevention:** Alerts ordinary citizens to hidden mortgages, pending lawsuits, or duplicate sales before parting with life savings.
- **Actionable Guidance:** Equips buyers with specific queries to pose to the AC Land office or Sub-Registry before executing deeds.
- **Digital Literacy:** Educates citizens on the importance of mutations, clean title chains, and official record verification.

### Future Development Roadmap:
1. **Government API Integration:** Integration with the Ministry of Land's *e-Mutation*, *National Land Zoning System*, and *DLRS* platforms.
2. **NID Verification Gateway:** Secure integration with Bangladesh Election Commission NID services to verify buyer and seller biometric identities.
3. **Certified Title Chain Mapping:** Visual tree diagram illustrating deed chains across generations from CS/RS/SA surveys to present owners.

---

## 8. Team & Mentors

- **Team Name:** Hector
- **Team Leader:** MD IRFANUL HOQUE TASEEN (Full-stack architecture, rule engine & cryptographic integrity)
- **Team Member:** Abdullah Alif (UI/UX design, Bengali accessibility, mobile layout & test scenarios)
- **Faculty Mentor:** Md. Sagar Hossen (Domain guidance, land legal principles & academic oversight)

---
*Prepared for the LandTech Innovation Hackathon 2026 Preliminary Submission.*
