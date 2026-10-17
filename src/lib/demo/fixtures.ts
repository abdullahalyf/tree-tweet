import { CompletePlotData, DeedRecord, KhatianRecord, PlotStatusRecord } from '../db/schema';
import { VerificationStatus } from '../verification/types';

export interface DemoScenario {
  code: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  nameBn: string;
  taglineBn: string;
  dagNo: string;
  deedNo: string;
  mouza: string;
  expectedStatus: VerificationStatus;
  primaryRiskBn: string;
  khatian: KhatianRecord;
  plotStatus: PlotStatusRecord;
  deeds: DeedRecord[];
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    code: 'A',
    nameBn: 'কেস A: শতভাগ ত্রুটিমুক্ত রেকর্ড',
    taglineBn: 'মালিক ও বিক্রেতা এক, এলাকা ঠিক, কোনো ঋণ বা মামলা নেই',
    dagNo: '0101',
    deedNo: 'DEED-2024-0001',
    mouza: 'কাল্পনিকপুর',
    expectedStatus: 'GREEN',
    primaryRiskBn: 'কোনো ঝুঁকি নেই (সব পরীক্ষা উত্তীর্ণ)',
    khatian: {
      id: 'a0000000-0000-0000-0000-000000000001',
      mouza: 'কাল্পনিকপুর',
      dag_no: '0101',
      owner_name: 'কাল্পনিক আব্দুর রহমান',
      total_area: 12.0,
      remaining_area: 12.0,
      land_type: 'normal',
      mutation_status: 'done',
    },
    plotStatus: { dag_no: '0101', mortgaged: false, court_case: false },
    deeds: [
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
    ],
  },
  {
    code: 'B',
    nameBn: 'কেস B: দ্বিতীয় পরিচ্ছন্ন কেস',
    taglineBn: 'ভিন্ন নাম ও ভিন্ন মৌজায় আরেকটি পরিষ্কার রেকর্ড',
    dagNo: '0202',
    deedNo: 'DEED-2024-0002',
    mouza: 'রূপনগর',
    expectedStatus: 'GREEN',
    primaryRiskBn: 'কোনো ঝুঁকি নেই (সব পরীক্ষা উত্তীর্ণ)',
    khatian: {
      id: 'a0000000-0000-0000-0000-000000000002',
      mouza: 'রূপনগর',
      dag_no: '0202',
      owner_name: 'কাল্পনিক ফাতেমা বেগম',
      total_area: 20.0,
      remaining_area: 15.0,
      land_type: 'normal',
      mutation_status: 'done',
    },
    plotStatus: { dag_no: '0202', mortgaged: false, court_case: false },
    deeds: [
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
    ],
  },
  {
    code: 'C',
    nameBn: 'কেস C: নামের সামান্য তারতম্য',
    taglineBn: 'খতিয়ানে "মোহাম্মদ তারেক হাসান", দলিলে "মো: তারেক হাসান"',
    dagNo: '0303',
    deedNo: 'DEED-2024-0003',
    mouza: 'মায়াদ্বীপ',
    expectedStatus: 'YELLOW',
    primaryRiskBn: 'মালিক ও বিক্রেতার নামে পদবী বা বানানের সামান্য পার্থক্য',
    khatian: {
      id: 'a0000000-0000-0000-0000-000000000003',
      mouza: 'মায়াদ্বীপ',
      dag_no: '0303',
      owner_name: 'কাল্পনিক মোহাম্মদ তারেক হাসান',
      total_area: 15.0,
      remaining_area: 15.0,
      land_type: 'normal',
      mutation_status: 'done',
    },
    plotStatus: { dag_no: '0303', mortgaged: false, court_case: false },
    deeds: [
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
    ],
  },
  {
    code: 'D',
    nameBn: 'কেস D: ব্যাংকে বন্ধকযুক্ত জমি',
    taglineBn: 'জমিটি আর্থিক প্রতিষ্ঠানে বন্ধক রাখা (Mortgaged)',
    dagNo: '0404',
    deedNo: 'DEED-2024-0004',
    mouza: 'মেঘনাগাঁও',
    expectedStatus: 'YELLOW',
    primaryRiskBn: 'জমিটি ব্যাংকে বন্ধকযুক্ত রয়েছে (দায়মুক্তি সনদ আবশ্যক)',
    khatian: {
      id: 'a0000000-0000-0000-0000-000000000004',
      mouza: 'মেঘনাগাঁও',
      dag_no: '0404',
      owner_name: 'কাল্পনিক কামাল উদ্দিন আহমেদ',
      total_area: 18.0,
      remaining_area: 18.0,
      land_type: 'normal',
      mutation_status: 'done',
    },
    plotStatus: { dag_no: '0404', mortgaged: true, court_case: false },
    deeds: [
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
    ],
  },
  {
    code: 'E',
    nameBn: 'কেস E: দ্বৈত বিক্রির ঝুঁকি (Double Sale)',
    taglineBn: 'একই দাগের জমি আগেই অন্য ক্রেতার নিকট বিক্রিত',
    dagNo: '0505',
    deedNo: 'DEED-2024-0005B',
    mouza: 'পদ্মাপাড়',
    expectedStatus: 'RED',
    primaryRiskBn: 'একই দাগের বিপরীতে একাধিক সক্রিয় হস্তান্তর দলিল বিদ্যমান',
    khatian: {
      id: 'a0000000-0000-0000-0000-000000000005',
      mouza: 'পদ্মাপাড়',
      dag_no: '0505',
      owner_name: 'কাল্পনিক সেলিম চৌধুরী',
      total_area: 10.0,
      remaining_area: 10.0,
      land_type: 'normal',
      mutation_status: 'done',
    },
    plotStatus: { dag_no: '0505', mortgaged: false, court_case: false },
    deeds: [
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
    ],
  },
  {
    code: 'F',
    nameBn: 'কেস F: অননুমোদিত বিক্রেতা (মালিক অমিল)',
    taglineBn: 'খতিয়ানের মূল মালিকের সাথে দলিলের বিক্রেতার নামের মিল নেই',
    dagNo: '0606',
    deedNo: 'DEED-2024-0006',
    mouza: 'সোনারগাঁ-কল্পিত',
    expectedStatus: 'RED',
    primaryRiskBn: 'অননুমোদিত ব্যক্তি কর্তৃক জমি বিক্রির গুরুতর ঝুঁকি',
    khatian: {
      id: 'a0000000-0000-0000-0000-000000000006',
      mouza: 'সোনারগাঁ-কল্পিত',
      dag_no: '0606',
      owner_name: 'কাল্পনিক আবুল মনসুর ভূঁইয়া',
      total_area: 14.0,
      remaining_area: 14.0,
      land_type: 'normal',
      mutation_status: 'done',
    },
    plotStatus: { dag_no: '0606', mortgaged: false, court_case: false },
    deeds: [
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
    ],
  },
  {
    code: 'G',
    nameBn: 'কেস G: অতিরিক্ত জমি বিক্রির চেষ্টা',
    taglineBn: 'খতিয়ানে অবশিষ্ট ৩ শতক, কিন্তু বিক্রির চুক্তি ৮ শতকের',
    dagNo: '0707',
    deedNo: 'DEED-2024-0007',
    mouza: 'সবুজপল্লী',
    expectedStatus: 'RED',
    primaryRiskBn: 'অবশিষ্ট পরিমাণের চেয়ে বেশি জমি বিক্রির চেষ্টা',
    khatian: {
      id: 'a0000000-0000-0000-0000-000000000007',
      mouza: 'সবুজপল্লী',
      dag_no: '0707',
      owner_name: 'কাল্পনিক ফারুক হোসেন',
      total_area: 10.0,
      remaining_area: 3.0,
      land_type: 'normal',
      mutation_status: 'done',
    },
    plotStatus: { dag_no: '0707', mortgaged: false, court_case: false },
    deeds: [
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
    ],
  },
  {
    code: 'H',
    nameBn: 'কেস H: দলিল টেম্পারিং বা ডিজিটাল হ্যাশ অমিল',
    taglineBn: 'দলিলের ক্রিপ্টোগ্রাফিক SHA-256 হ্যাশ মেলেনি (বিকৃতির ঝুঁকি)',
    dagNo: '0808',
    deedNo: 'DEED-2024-0008',
    mouza: 'আনন্দপুর',
    expectedStatus: 'RED',
    primaryRiskBn: 'দলিল টেম্পারিং বা তথ্যের অননুমোদিত বিকৃতি শনাক্ত',
    khatian: {
      id: 'a0000000-0000-0000-0000-000000000008',
      mouza: 'আনন্দপুর',
      dag_no: '0808',
      owner_name: 'কাল্পনিক হারুন অর রশিদ',
      total_area: 16.0,
      remaining_area: 16.0,
      land_type: 'normal',
      mutation_status: 'done',
    },
    plotStatus: { dag_no: '0808', mortgaged: false, court_case: false },
    deeds: [
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
    ],
  },
];

/**
 * Retrieves a demo plot record by Dag number (preserving leading zeros).
 */
export function getDemoPlotData(dagNo: string): CompletePlotData | null {
  const cleanDag = dagNo.trim();
  const match = DEMO_SCENARIOS.find((s) => s.dagNo === cleanDag);
  if (!match) return null;

  return {
    dagNo: match.dagNo,
    khatian: match.khatian,
    plotStatus: match.plotStatus,
    deeds: match.deeds,
  };
}

/**
 * Retrieves a demo plot record by Deed registration number.
 */
export function getDemoPlotDataByDeed(deedNo: string): CompletePlotData | null {
  const cleanDeed = deedNo.trim().toUpperCase();
  const match = DEMO_SCENARIOS.find((s) =>
    s.deeds.some((d) => d.deed_no.toUpperCase() === cleanDeed)
  );
  if (!match) return null;

  return {
    dagNo: match.dagNo,
    khatian: match.khatian,
    plotStatus: match.plotStatus,
    deeds: match.deeds,
  };
}
