/**
 * LandTech Innovation Hackathon 2026
 * Database Seeder Script (Node.js)
 *
 * Seeds Supabase database with 8 fictional test cases (A through H).
 * Can be run via: npm run seed
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Helper to read .env.local if present
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...vals] = trimmed.split('=');
        if (key && vals.length > 0) {
          process.env[key.trim()] = vals.join('=').trim();
        }
      }
    });
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key if available, otherwise anon key (requires insert policy)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
  console.log('----------------------------------------------------------------------');
  console.log('⚠️  Supabase শংসাপত্র (.env.local) পাওয়া যায়নি বা প্লেসহোল্ডার অবস্থায় আছে।');
  console.log('সরাসরি Supabase Dashboard -> SQL Editor এ গিয়ে নিচের ফাইলগুলো রান করুন:');
  console.log('  1. supabase/migrations/001_initial_schema.sql');
  console.log('  2. supabase/migrations/002_p5_buyer_evidence.sql');
  console.log('  3. supabase/seed.sql');
  console.log('----------------------------------------------------------------------');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const khatianRecords = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    mouza: 'কাল্পনিকপুর',
    dag_no: '0101',
    owner_name: 'কাল্পনিক আব্দুর রহমান',
    total_area: 12.0,
    remaining_area: 12.0,
    land_type: 'normal',
    mutation_status: 'done',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    mouza: 'রূপনগর',
    dag_no: '0202',
    owner_name: 'কাল্পনিক ফাতেমা বেগম',
    total_area: 20.0,
    remaining_area: 15.0,
    land_type: 'normal',
    mutation_status: 'done',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    mouza: 'মায়াদ্বীপ',
    dag_no: '0303',
    owner_name: 'কাল্পনিক মোহাম্মদ তারেক হাসান',
    total_area: 15.0,
    remaining_area: 15.0,
    land_type: 'normal',
    mutation_status: 'done',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    mouza: 'মেঘনাগাঁও',
    dag_no: '0404',
    owner_name: 'কাল্পনিক কামাল উদ্দিন আহমেদ',
    total_area: 18.0,
    remaining_area: 18.0,
    land_type: 'normal',
    mutation_status: 'done',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    mouza: 'পদ্মাপাড়',
    dag_no: '0505',
    owner_name: 'কাল্পনিক সেলিম চৌধুরী',
    total_area: 10.0,
    remaining_area: 10.0,
    land_type: 'normal',
    mutation_status: 'done',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000006',
    mouza: 'সোনারগাঁ-কল্পিত',
    dag_no: '0606',
    owner_name: 'কাল্পনিক আবুল মনসুর ভূঁইয়া',
    total_area: 14.0,
    remaining_area: 14.0,
    land_type: 'normal',
    mutation_status: 'done',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000007',
    mouza: 'সবুজপল্লী',
    dag_no: '0707',
    owner_name: 'কাল্পনিক ফারুক হোসেন',
    total_area: 10.0,
    remaining_area: 3.0,
    land_type: 'normal',
    mutation_status: 'done',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000008',
    mouza: 'আনন্দপুর',
    dag_no: '0808',
    owner_name: 'কাল্পনিক হারুন অর রশিদ',
    total_area: 16.0,
    remaining_area: 16.0,
    land_type: 'normal',
    mutation_status: 'done',
  },
];

const plotStatusRecords = [
  { dag_no: '0101', mortgaged: false, court_case: false },
  { dag_no: '0202', mortgaged: false, court_case: false },
  { dag_no: '0303', mortgaged: false, court_case: false },
  { dag_no: '0404', mortgaged: true, court_case: false }, // Mortgaged!
  { dag_no: '0505', mortgaged: false, court_case: false },
  { dag_no: '0606', mortgaged: false, court_case: false },
  { dag_no: '0707', mortgaged: false, court_case: false },
  { dag_no: '0808', mortgaged: false, court_case: false },
];

const deedRecords = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    deed_no: 'DEED-2024-0001',
    dag_no: '0101',
    seller: 'কাল্পনিক আব্দুর রহমান',
    buyer: 'কাল্পনিক রফিকুল ইসলাম',
    area: 5.0,
    date: '2024-01-15',
    hash: 'f5e09e09af91efb48fc6b19971d1489d492314b41a93e5af7b26cd0bf9389f2e',
    prev_hash: 'GENESIS-0000-0000-0000-000000000001',
    status: 'active',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    deed_no: 'DEED-2024-0002',
    dag_no: '0202',
    seller: 'কাল্পনিক ফাতেমা বেগম',
    buyer: 'কাল্পনিক সুলতানা কামাল',
    area: 10.0,
    date: '2024-02-20',
    hash: 'dba6725910fc83aeb45689ac6ee70d0babb11db01cd8e23d00dffefc3e7c93ad',
    prev_hash: 'GENESIS-0000-0000-0000-000000000002',
    status: 'active',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    deed_no: 'DEED-2024-0003',
    dag_no: '0303',
    seller: 'কাল্পনিক মো: তারেক হাসান',
    buyer: 'কাল্পনিক তানভীর আহমেদ',
    area: 6.0,
    date: '2024-03-10',
    hash: '745896bbdf7db0fc9e40b8b2419822258fcb7071045b3f333d37e3b2258bc861',
    prev_hash: 'GENESIS-0000-0000-0000-000000000003',
    status: 'active',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000004',
    deed_no: 'DEED-2024-0004',
    dag_no: '0404',
    seller: 'কাল্পনিক কামাল উদ্দিন আহমেদ',
    buyer: 'কাল্পনিক নাসির হোসেন',
    area: 8.0,
    date: '2024-04-12',
    hash: 'dfbfb4301bebfcec5b9360e8a0bc463bcc8c27b23097e7fe1f189792320e5b31',
    prev_hash: 'GENESIS-0000-0000-0000-000000000004',
    status: 'active',
  },
  {
    id: 'd0000000-0000-0000-0000-00000000005a',
    deed_no: 'DEED-2024-0005A',
    dag_no: '0505',
    seller: 'কাল্পনিক সেলিম চৌধুরী',
    buyer: 'কাল্পনিক আরিফুল হক',
    area: 10.0,
    date: '2024-05-01',
    hash: '5bf622d8b0e33a2ca4cd52ced5cab5a8b60fba84d94171f8b99b3aa1a7744cc5',
    prev_hash: 'GENESIS-0000-0000-0000-000000000005',
    status: 'active',
  },
  {
    id: 'd0000000-0000-0000-0000-00000000005b',
    deed_no: 'DEED-2024-0005B',
    dag_no: '0505',
    seller: 'কাল্পনিক সেলিম চৌধুরী',
    buyer: 'কাল্পনিক মাহবুবুর রহমান',
    area: 10.0,
    date: '2024-05-15',
    hash: '968c5dd51ed82b6d358fc457ebac9eba29d2af14f636496fb8a1f05021621443',
    prev_hash: 'GENESIS-0000-0000-0000-000000000005',
    status: 'active',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000006',
    deed_no: 'DEED-2024-0006',
    dag_no: '0606',
    seller: 'কাল্পনিক জাকির হোসেন মজুমদার',
    buyer: 'কাল্পনিক শাহেদ আলী',
    area: 6.0,
    date: '2024-06-18',
    hash: '432b6b037c726dc26272948c3f30337a4f71cf54be9a615acc599de471047099',
    prev_hash: 'GENESIS-0000-0000-0000-000000000006',
    status: 'active',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000007',
    deed_no: 'DEED-2024-0007',
    dag_no: '0707',
    seller: 'কাল্পনিক ফারুক হোসেন',
    buyer: 'কাল্পনিক আনোয়ার সাদাত',
    area: 8.0,
    date: '2024-07-22',
    hash: '9f5a5d192a9641e15f5512487a56d52c9c35767a1928d8ec2743f5ef791dd61a',
    prev_hash: 'GENESIS-0000-0000-0000-000000000007',
    status: 'active',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000008',
    deed_no: 'DEED-2024-0008',
    dag_no: '0808',
    seller: 'কাল্পনিক হারুন অর রশিদ',
    buyer: 'কাল্পনিক বেলাল চৌধুরী',
    area: 5.0,
    date: '2024-08-30',
    hash: 'TAMPERED-HASH-00000000000000000000000000000000000000000000000000000888',
    prev_hash: 'GENESIS-0000-0000-0000-000000000008',
    status: 'active',
  },
];

async function seed() {
  console.log('🌱 সিডিং শুরু হচ্ছে...');

  console.log('1. Khatian সিডিং...');
  const syntheticKhatians = khatianRecords.map((record, index) => ({
    ...record,
    mutation_history: [{ date: '2023-12-01', status: record.mutation_status, reference: `DEMO-MUT-${String.fromCharCode(65 + index)}` }],
  }));
  const { error: err1 } = await supabase.from('khatian').upsert(syntheticKhatians, { onConflict: 'dag_no' });
  if (err1) {
    console.error('Khatian সিডিং ত্রুটি:', err1.message);
    return;
  }

  console.log('2. Plot Status সিডিং...');
  const syntheticStatuses = plotStatusRecords.map(record => ({ ...record, acquisition_status: 'not_reported' }));
  const { error: err2 } = await supabase.from('plot_status').upsert(syntheticStatuses, { onConflict: 'dag_no' });
  if (err2) {
    console.error('Plot Status সিডিং ত্রুটি:', err2.message);
    return;
  }

  console.log('3. Deed সিডিং...');
  const { error: err3 } = await supabase.from('deed').upsert(deedRecords, { onConflict: 'deed_no' });
  if (err3) {
    console.error('Deed সিডিং ত্রুটি:', err3.message);
    return;
  }

  console.log('✅ সফলভাবে ৮টি কাল্পনিক টেস্ট রেকর্ড সিড সম্পন্ন হয়েছে!');
}

seed().catch((err) => {
  console.error('অপ্রত্যাশিত ত্রুটি:', err);
});
