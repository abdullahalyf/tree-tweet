-- =====================================================================
-- LandTech Innovation Hackathon 2026
-- Product: AI-Assisted Pre-Purchase Land Verification System
-- Problem P5: "Check Before You Buy" (জমি কেনার আগে যাচাই)
-- Seed File: 8 Clearly Labelled Fictional Demo Test Cases (A to H)
-- =====================================================================
-- STRICT COMPLIANCE:
-- 1. All records are 100% fictional demo data.
-- 2. No real NID, phone numbers, or real government records are used.
-- 3. Dag numbers are strings with preserved leading zeros ('0101', '0202', etc.).
-- 4. Reproducible & idempotent (cleans existing demo tables first).
-- =====================================================================

-- Clean existing demo records safely
TRUNCATE TABLE deed, plot_status, khatian CASCADE;

-- =====================================================================
-- TEST CASE A: Clean GREEN Case (সব যাচাই সঠিক)
-- Description: Legitimate transaction. Owner matches deed seller, area within
-- remaining balance, no mortgage, no court dispute, authentic cryptographic hash.
-- =====================================================================
INSERT INTO khatian (id, mouza, dag_no, owner_name, total_area, remaining_area, land_type, mutation_status)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'কাল্পনিকপুর',
    '0101',
    'কাল্পনিক আব্দুর রহমান',
    12.0000,
    12.0000,
    'normal',
    'done'
);

INSERT INTO plot_status (dag_no, mortgaged, court_case)
VALUES (
    '0101',
    FALSE,
    FALSE
);

INSERT INTO deed (id, deed_no, dag_no, seller, buyer, area, date, hash, prev_hash, status)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'DEED-2024-0001',
    '0101',
    'কাল্পনিক আব্দুর রহমান',
    'কাল্পনিক রফিকুল ইসলাম',
    5.0000,
    '2024-01-15',
    'f5e09e09af91efb48fc6b19971d1489d492314b41a93e5af7b26cd0bf9389f2e',
    'GENESIS-0000-0000-0000-000000000001',
    'active'
);


-- =====================================================================
-- TEST CASE B: Another Clean GREEN Case (ভিন্ন কাল্পনিক নাম ও মৌজা)
-- Description: Another verified clean record with different mouza and names
-- proving multi-record consistency.
-- =====================================================================
INSERT INTO khatian (id, mouza, dag_no, owner_name, total_area, remaining_area, land_type, mutation_status)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'রূপনগর',
    '0202',
    'কাল্পনিক ফাতেমা বেগম',
    20.0000,
    15.0000,
    'normal',
    'done'
);

INSERT INTO plot_status (dag_no, mortgaged, court_case)
VALUES (
    '0202',
    FALSE,
    FALSE
);

INSERT INTO deed (id, deed_no, dag_no, seller, buyer, area, date, hash, prev_hash, status)
VALUES (
    'd0000000-0000-0000-0000-000000000002',
    'DEED-2024-0002',
    '0202',
    'কাল্পনিক ফাতেমা বেগম',
    'কাল্পনিক সুলতানা কামাল',
    10.0000,
    '2024-02-20',
    'dba6725910fc83aeb45689ac6ee70d0babb11db01cd8e23d00dffefc3e7c93ad',
    'GENESIS-0000-0000-0000-000000000002',
    'active'
);


-- =====================================================================
-- TEST CASE C: YELLOW Name Variation Only (নামের সামান্য অমিল / বানানের বৈসাদৃশ্য)
-- Description: Minor difference in name spelling/prefix ('মো:' vs 'মোহাম্মদ').
-- All other checks (area, mortgage, court, hash) are clean.
-- =====================================================================
INSERT INTO khatian (id, mouza, dag_no, owner_name, total_area, remaining_area, land_type, mutation_status)
VALUES (
    'a0000000-0000-0000-0000-000000000003',
    'মায়াদ্বীপ',
    '0303',
    'কাল্পনিক মোহাম্মদ তারেক হাসান',
    15.0000,
    15.0000,
    'normal',
    'done'
);

INSERT INTO plot_status (dag_no, mortgaged, court_case)
VALUES (
    '0303',
    FALSE,
    FALSE
);

INSERT INTO deed (id, deed_no, dag_no, seller, buyer, area, date, hash, prev_hash, status)
VALUES (
    'd0000000-0000-0000-0000-000000000003',
    'DEED-2024-0003',
    '0303',
    'কাল্পনিক মো: তারেক হাসান',
    'কাল্পনিক তানভীর আহমেদ',
    6.0000,
    '2024-03-10',
    '745896bbdf7db0fc9e40b8b2419822258fcb7071045b3f333d37e3b2258bc861',
    'GENESIS-0000-0000-0000-000000000003',
    'active'
);


-- =====================================================================
-- TEST CASE D: YELLOW Mortgage Only (জমিটি ব্যাংকে বন্ধকযুক্ত)
-- Description: Encumbrance warning. The plot is mortgaged to a bank.
-- All other checks (names, area, hash) are clean.
-- =====================================================================
INSERT INTO khatian (id, mouza, dag_no, owner_name, total_area, remaining_area, land_type, mutation_status)
VALUES (
    'a0000000-0000-0000-0000-000000000004',
    'মেঘনাগাঁও',
    '0404',
    'কাল্পনিক কামাল উদ্দিন আহমেদ',
    18.0000,
    18.0000,
    'normal',
    'done'
);

INSERT INTO plot_status (dag_no, mortgaged, court_case)
VALUES (
    '0404',
    TRUE,   -- Mortgaged!
    FALSE
);

INSERT INTO deed (id, deed_no, dag_no, seller, buyer, area, date, hash, prev_hash, status)
VALUES (
    'd0000000-0000-0000-0000-000000000004',
    'DEED-2024-0004',
    '0404',
    'কাল্পনিক কামাল উদ্দিন আহমেদ',
    'কাল্পনিক নাসির হোসেন',
    8.0000,
    '2024-04-12',
    'dfbfb4301bebfcec5b9360e8a0bc463bcc8c27b23097e7fe1f189792320e5b31',
    'GENESIS-0000-0000-0000-000000000004',
    'active'
);


-- =====================================================================
-- TEST CASE E: RED Double-Sale Case (দ্বৈত বিক্রির ঝুঁকি / প্রতারণা)
-- Description: The same plot (dag 0505) was already sold in full by prior deed
-- DEED-2024-0005A, but is being sold again in DEED-2024-0005B.
-- =====================================================================
INSERT INTO khatian (id, mouza, dag_no, owner_name, total_area, remaining_area, land_type, mutation_status)
VALUES (
    'a0000000-0000-0000-0000-000000000005',
    'পদ্মাপাড়',
    '0505',
    'কাল্পনিক সেলিম চৌধুরী',
    10.0000,
    10.0000,   -- Remaining area matches proposed deed, isolating double-sale detection
    'normal',
    'done'
);

INSERT INTO plot_status (dag_no, mortgaged, court_case)
VALUES (
    '0505',
    FALSE,
    FALSE
);

-- Prior valid sale of the full plot
INSERT INTO deed (id, deed_no, dag_no, seller, buyer, area, date, hash, prev_hash, status)
VALUES (
    'd0000000-0000-0000-0000-00000000005a',
    'DEED-2024-0005A',
    '0505',
    'কাল্পনিক সেলিম চৌধুরী',
    'কাল্পনিক আরিফুল হক',
    10.0000,
    '2024-05-01',
    '5bf622d8b0e33a2ca4cd52ced5cab5a8b60fba84d94171f8b99b3aa1a7744cc5',
    'GENESIS-0000-0000-0000-000000000005',
    'active'
);

-- Fraudulent secondary sale attempt on the same plot
INSERT INTO deed (id, deed_no, dag_no, seller, buyer, area, date, hash, prev_hash, status)
VALUES (
    'd0000000-0000-0000-0000-00000000005b',
    'DEED-2024-0005B',
    '0505',
    'কাল্পনিক সেলিম চৌধুরী',
    'কাল্পনিক মাহবুবুর রহমান',
    10.0000,
    '2024-05-15',
    '968c5dd51ed82b6d358fc457ebac9eba29d2af14f636496fb8a1f05021621443',
    'GENESIS-0000-0000-0000-000000000005',
    'active'
);


-- =====================================================================
-- TEST CASE F: RED Seller-Owner Mismatch Only (মালিক ও বিক্রেতার তথ্যে গুরুতর অমিল)
-- Description: The person claiming to sell on the deed ('জাকির হোসেন মজুমদার')
-- is completely different from the registered Khatian owner ('আবুল মনসুর ভূঁইয়া').
-- =====================================================================
INSERT INTO khatian (id, mouza, dag_no, owner_name, total_area, remaining_area, land_type, mutation_status)
VALUES (
    'a0000000-0000-0000-0000-000000000006',
    'সোনারগাঁ-কল্পিত',
    '0606',
    'কাল্পনিক আবুল মনসুর ভূঁইয়া',
    14.0000,
    14.0000,
    'normal',
    'done'
);

INSERT INTO plot_status (dag_no, mortgaged, court_case)
VALUES (
    '0606',
    FALSE,
    FALSE
);

INSERT INTO deed (id, deed_no, dag_no, seller, buyer, area, date, hash, prev_hash, status)
VALUES (
    'd0000000-0000-0000-0000-000000000006',
    'DEED-2024-0006',
    '0606',
    'কাল্পনিক জাকির হোসেন মজুমদার', -- Mismatch with Khatian owner!
    'কাল্পনিক শাহেদ আলী',
    6.0000,
    '2024-06-18',
    '432b6b037c726dc26272948c3f30337a4f71cf54be9a615acc599de471047099',
    'GENESIS-0000-0000-0000-000000000006',
    'active'
);


-- =====================================================================
-- TEST CASE G: RED Excessive-Area Case (খতিয়ানের অবশিষ্ট অংশের চেয়ে বেশি জমি বিক্রির চেষ্টা)
-- Description: The seller owns remaining 3.0000 decimals, but the deed
-- attempts to sell 8.0000 decimals.
-- =====================================================================
INSERT INTO khatian (id, mouza, dag_no, owner_name, total_area, remaining_area, land_type, mutation_status)
VALUES (
    'a0000000-0000-0000-0000-000000000007',
    'সবুজপল্লী',
    '0707',
    'কাল্পনিক ফারুক হোসেন',
    10.0000,
    3.0000,   -- Only 3.0000 decimals remaining
    'normal',
    'done'
);

INSERT INTO plot_status (dag_no, mortgaged, court_case)
VALUES (
    '0707',
    FALSE,
    FALSE
);

INSERT INTO deed (id, deed_no, dag_no, seller, buyer, area, date, hash, prev_hash, status)
VALUES (
    'd0000000-0000-0000-0000-000000000007',
    'DEED-2024-0007',
    '0707',
    'কাল্পনিক ফারুক হোসেন',
    'কাল্পনিক আনোয়ার সাদাত',
    8.0000,   -- Exceeds 3.0000 decimals remaining!
    '2024-07-22',
    '9f5a5d192a9641e15f5512487a56d52c9c35767a1928d8ec2743f5ef791dd61a',
    'GENESIS-0000-0000-0000-000000000007',
    'active'
);


-- =====================================================================
-- TEST CASE H: RED Altered-Document / Hash Mismatch (দলিল টেম্পারিং বা হ্যাশ অমিল)
-- Description: The deed record has been altered or tampered with.
-- The stored cryptographic hash does not match the SHA-256 digest of the deed payload.
-- Authentic hash would be: 1a93dd602ad5d1c725ef82bf848ea627d420f720b0e015dda4bbb1a3f04bebc3
-- Stored hash is deliberately invalid to trigger tamper detection.
-- =====================================================================
INSERT INTO khatian (id, mouza, dag_no, owner_name, total_area, remaining_area, land_type, mutation_status)
VALUES (
    'a0000000-0000-0000-0000-000000000008',
    'আনন্দপুর',
    '0808',
    'কাল্পনিক হারুন অর রশিদ',
    16.0000,
    16.0000,
    'normal',
    'done'
);

INSERT INTO plot_status (dag_no, mortgaged, court_case)
VALUES (
    '0808',
    FALSE,
    FALSE
);

INSERT INTO deed (id, deed_no, dag_no, seller, buyer, area, date, hash, prev_hash, status)
VALUES (
    'd0000000-0000-0000-0000-000000000008',
    'DEED-2024-0008',
    '0808',
    'কাল্পনিক হারুন অর রশিদ',
    'কাল্পনিক বেলাল চৌধুরী',
    5.0000,
    '2024-08-30',
    'TAMPERED-HASH-00000000000000000000000000000000000000000000000000000888', -- Mismatched/corrupted hash!
    'GENESIS-0000-0000-0000-000000000008',
    'active'
);

-- Explicit synthetic P5 metadata only for the eight fixed demo khatian IDs.
-- Apply migration 002 before this seed. Never infer clear acquisition status
-- for other records merely because the new column has been added.
UPDATE public.khatian
SET mutation_history = jsonb_build_array(jsonb_build_object(
  'date', '2023-12-01', 'status', mutation_status,
  'reference', 'DEMO-MUT-' || dag_no
))
WHERE id IN (
  'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000008'
);

UPDATE public.plot_status AS status
SET acquisition_status = 'not_reported'
WHERE EXISTS (
  SELECT 1 FROM public.khatian AS record
  WHERE record.dag_no = status.dag_no
    AND record.id IN (
      'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
      'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004',
      'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006',
      'a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000008'
    )
);
