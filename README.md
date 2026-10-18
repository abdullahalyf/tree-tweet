# TreeTweet · জমি কেনার আগে ঝুঁকি যাচাই

[Live demo / সরাসরি ডেমো](https://treetweet.vercel.app) · LandTech Innovation Hackathon 2026 · Problem P5: Check Before You Buy

TreeTweet is a Bangla/English prototype for checking potential land-purchase risks in supplied records. Its assessment uses deterministic rules and SHA-256 integrity checks; it does not use an AI model to decide ownership. The demo uses synthetic records and has no connection to government land systems.

TreeTweet প্রদত্ত রেকর্ডের ভিত্তিতে জমি কেনার সম্ভাব্য ঝুঁকি দেখানোর বাংলা/ইংরেজি প্রটোটাইপ। মূল্যায়নে নির্ধারিত নিয়ম ও SHA-256 অখণ্ডতা পরীক্ষা ব্যবহৃত হয়; মালিকানা নির্ধারণে কোনো AI মডেল ব্যবহার হয় না। ডেমোর তথ্য কাল্পনিক এবং সরকারি ভূমি ব্যবস্থার সাথে কোনো সংযোগ নেই।

## English

### Try the workflows

The interface starts in Bangla. Use the language toggle at the top to switch to English; the browser remembers your choice when storage is available. Recorded names and identifiers remain unchanged.

- **Search:** enter a plot (dag) number using Bangla or English digits, a deed number, or both. Leading zeros matter. Try the eight synthetic cases A–H: A/B have no detected risk in supplied records, C has a name variation, D a mortgage, E possible double sale, F an owner/seller mismatch, G excess sale area, and H a hash mismatch.
- **Read the assessment:** inspect reported issues, check availability, original record details and next steps. Green means only that the defined checks detected no risk in the supplied evidence. Missing or inconsistent evidence cannot establish safe ownership.
- **Register a demo deed:** fill sample details, submit synthetic information, then view its fingerprint, download or print the QR receipt, and check the deed. Demo registration is disabled when Supabase is configured.
- **QR tools:** paste a lookup link/code or choose a sample. Camera decoding uses the browser's native detector where supported; otherwise use the manual fallback. Camera access requires permission and a secure context, such as HTTPS or localhost.
- **Tamper lab:** change a disposable deed copy and compare fingerprints. Reset restores the copy. The mutation approval demonstration changes simulated state only.

A matching hash indicates consistency with the stored fingerprint; it does not establish the truth of the original record, seller authority or legal ownership. This prototype is not government verification, legal advice or an ownership certificate. Obtain original records and qualified professional review before any real transaction.

### Data and persistence

Without Supabase configuration, the app reads bundled synthetic fixtures. Custom demo registration computes a fingerprint on the server and returns a receipt. The browser restores that receipt into its local demo registry and attempts to cache it in `localStorage`. Browser storage can be blocked or cleared; server memory can disappear or differ between serverless instances. This is not a durable shared registry.

**A custom deed QR contains lookup identifiers, not the receipt itself.** Another browser/device may not have the custom receipt and may find no record. Use bundled samples for cross-device demonstrations. No record found is not proof of safe ownership.

Optional Supabase mode reads records from your configured PostgreSQL database, which can persist across browsers and server restarts. That database is not a government source. The supplied migration allows public reads under Row Level Security (RLS); populate it only with synthetic data and review policies before changing its purpose. Synthetic registration does not write to Supabase.

### Local setup

Use **Node.js 22+ on an LTS release**, npm and Git. From this repository:

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No database credentials are needed for the synthetic demo. To run a production build locally:

```bash
npm run build
npm start
```

For optional Supabase reads, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Apply the SQL in [supabase/migrations](supabase/migrations) to your intended demo database and review its RLS policies. Restart the app after changing environment variables. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only; never prefix it with `NEXT_PUBLIC_`, commit it or expose it in the browser. `npm run seed` populates the configured database with sample data; review its target before running it.

### Checks and project documents

```bash
npm test                   # cases, unit, reliability and presentation suites
npm run test:cases
npm run test:unit
npm run test:reliability
npm run test:p5
npm run test:receipts
npm run test:presentation
npm run typecheck
npm run lint
npm run build
```

These commands are verification instructions, not a claim that every check passed on your machine. Current evidence, known limitations and manual steps are recorded in [the acceptance checklist](docs/ACCEPTANCE_CHECKLIST.md) and [progress log](docs/PROGRESS.md).

The app uses Next.js, React, TypeScript, Tailwind CSS, Web Crypto SHA-256 and `qrcode`, with optional Supabase reads. Verification runs in the application's demo/read workflow; registration hashing is a server action and the tamper lab runs in the browser. Do not assume all checks run exclusively on the server.

## বাংলা

### ব্যবহার ও সীমাবদ্ধতা

অ্যাপ বাংলায় শুরু হয়। উপরের ভাষা পরিবর্তনের বোতাম দিয়ে ইংরেজি বেছে নিন; ব্রাউজার স্টোরেজ চালু থাকলে পছন্দটি মনে রাখা হয়। রেকর্ডের মূল নাম ও শনাক্তকারী অনুবাদ করা হয় না।

- **অনুসন্ধান:** বাংলা বা ইংরেজি সংখ্যায় দাগ নম্বর, দলিল নম্বর অথবা দুটিই দিন। শুরুর শূন্য অক্ষুণ্ণ রাখুন। আটটি কাল্পনিক নমুনা A–H ব্যবহার করুন: A/B-তে প্রদত্ত রেকর্ডে ঝুঁকি শনাক্ত হয় না; C-তে নামের তারতম্য, D-তে বন্ধক, E-তে দ্বৈত বিক্রির সম্ভাবনা, F-তে মালিক-বিক্রেতার অমিল, G-তে অতিরিক্ত জমি বিক্রি এবং H-তে হ্যাশ অমিল রয়েছে।
- **ফলাফল:** শনাক্ত বিষয়, প্রমাণের প্রাপ্যতা, রেকর্ড ও পরবর্তী ধাপ দেখুন। সবুজ কেবল প্রদত্ত প্রমাণে নির্ধারিত পরীক্ষায় ঝুঁকি না পাওয়া বোঝায়। অনুপস্থিত বা অসংগত প্রমাণ নিরাপদ মালিকানা প্রতিষ্ঠা করে না।
- **ডেমো নিবন্ধন:** শুধু কাল্পনিক তথ্য দিন। তৈরি ফিঙ্গারপ্রিন্ট দেখুন, QR রসিদ ডাউনলোড বা প্রিন্ট করুন এবং দলিল যাচাই করুন। Supabase চালু থাকলে ডেমো নিবন্ধন বন্ধ থাকে।
- **QR সরঞ্জাম:** লিংক/কোড পেস্ট করুন অথবা নমুনা বেছে নিন। সমর্থিত ব্রাউজারে ক্যামেরা QR পড়তে পারে; অন্য ক্ষেত্রে হাতে কোড দিন। ক্যামেরার জন্য অনুমতি ও HTTPS বা localhost দরকার।
- **টেম্পারিং ল্যাব:** অস্থায়ী কপির তথ্য বদলে হ্যাশের পার্থক্য দেখুন। রিসেট করলে কপি আগের অবস্থায় ফেরে। নামজারি অনুমোদন কেবল সফটওয়্যার সিমুলেশন।

হ্যাশ মিলে যাওয়া মূল তথ্যের সত্যতা, বিক্রেতার ক্ষমতা বা আইনি মালিকানা প্রমাণ করে না। এটি সরকারি যাচাই, আইনি পরামর্শ বা মালিকানার সনদ নয়। বাস্তব লেনদেনের আগে মূল রেকর্ড ও যোগ্য পেশাদারের পরামর্শ নিন।

### তথ্য কোথায় থাকে

Supabase ছাড়া অ্যাপের সাথে থাকা কাল্পনিক নমুনা ব্যবহার হয়। নতুন ডেমো দলিলের হ্যাশ সার্ভারে তৈরি হয়; ফেরত পাওয়া রসিদ ব্রাউজারের ডেমো রেজিস্ট্রিতে রাখা হয় এবং সম্ভব হলে `localStorage`-এ সংরক্ষিত হয়। ব্রাউজারের তথ্য মুছে যেতে পারে; সার্ভারের মেমোরিও স্থায়ী বা সব ইনস্ট্যান্সে এক নয়। এটি স্থায়ী যৌথ রেজিস্ট্রি নয়।

**নতুন ডেমো দলিলের QR-এ শুধু অনুসন্ধানের শনাক্তকারী থাকে, সম্পূর্ণ রসিদ থাকে না।** অন্য ডিভাইস বা ব্রাউজারে সেই রসিদ না থাকলে রেকর্ড নাও পাওয়া যেতে পারে। একাধিক ডিভাইসে প্রদর্শনের জন্য অ্যাপের মূল নমুনাগুলো ব্যবহার করুন। রেকর্ড না পাওয়া নিরাপদ মালিকানার প্রমাণ নয়।

ঐচ্ছিক Supabase মোড আপনার PostgreSQL ডাটাবেজের স্থায়ী রেকর্ড পড়ে; এটি সরকারি ডাটাবেজ নয়। দেওয়া মাইগ্রেশনের RLS নীতিতে সর্বসাধারণের পড়ার অনুমতি রয়েছে। শুধু কাল্পনিক তথ্য রাখুন এবং উদ্দেশ্য বদলানোর আগে নীতিগুলো পর্যালোচনা করুন। ডেমো নিবন্ধন Supabase-এ তথ্য লেখে না।

### চালানো ও পরীক্ষা

Node.js 22 বা পরবর্তী LTS সংস্করণ, npm ও Git ব্যবহার করুন। উপরের কমান্ড অনুযায়ী `npm ci`, তারপর `npm run dev` চালিয়ে `http://localhost:3000` খুলুন। প্রোডাকশন মোডে আগে `npm run build`, তারপর `npm start` চালান। সাধারণ ডেমোর জন্য ডাটাবেজের কী লাগে না।

Supabase ব্যবহার করতে `.env.example` থেকে `.env.local` বানিয়ে পাবলিক URL ও anon key দিন, নির্ধারিত ডেমো ডাটাবেজে মাইগ্রেশন প্রয়োগ করুন এবং RLS যাচাই করুন। Service role key শুধু সার্ভারে রাখুন; ব্রাউজার বা Git-এ প্রকাশ করবেন না। `npm run seed` চালানোর আগে কোন ডাটাবেজে নমুনা লেখা হবে তা নিশ্চিত করুন।

উপরের পরীক্ষার কমান্ডগুলো ব্যবহার করুন। ফলাফলের বর্তমান প্রমাণ ও হাতে যাচাইয়ের ধাপের জন্য [গ্রহণযোগ্যতা তালিকা](docs/ACCEPTANCE_CHECKLIST.md) এবং [অগ্রগতির নথি](docs/PROGRESS.md) দেখুন। এখানে পুরোনো পরীক্ষার সংখ্যা বা নিশ্চিত সফলতার দাবি করা হচ্ছে না।

## Original project and attribution · মূল প্রকল্প ও কৃতিত্ব

- Original upstream: [irfanulhoquetaseen/landtech_TreeTweet](https://github.com/irfanulhoquetaseen/landtech_TreeTweet)
- Current repository: [abdullahalyf/tree-tweet](https://github.com/abdullahalyf/tree-tweet)
- Team / দল: **Hector**
- Team leader / দলনেতা: **MD IRFANUL HOQUE TASEEN**
- Team member / সদস্য: **Abdullah Alif**
- Faculty mentor / অনুষদীয় মেন্টর: **Md. Sagar Hossen**

Original project materials: [Concept note / কনসেপ্ট নোট](docs/CONCEPT_NOTE.md) and [demo video script / ডেমো ভিডিও স্ক্রিপ্ট](docs/DEMO_VIDEO_SCRIPT.md). These preserve the original hackathon concept and demonstration narrative; use this README and current verification evidence for implemented behavior and limitations.

The upstream README credits **Antigravity AI Agent** for development assistance. AI-assisted development does not mean the running assessment uses an AI ownership decision model.

**License attribution:** the original project declares the **MIT License**, created for LandTech Innovation Hackathon 2026. This checkout has no `LICENSE` file; no license text or file is implied by this README. এই কপিতে `LICENSE` ফাইল নেই; মূল প্রকল্পের MIT লাইসেন্স ঘোষণার কৃতিত্ব এখানে সংরক্ষিত হয়েছে।
