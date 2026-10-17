import { runLandVerification } from '../src/lib/verification/rules.js';

// Test Cases matching supabase/seed.sql
const testCasesData = [
  {
    code: 'A',
    name: 'Clean GREEN Case',
    expectedStatus: 'GREEN',
    expectedIssueCount: 0,
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
    name: 'Another Clean GREEN Case (Different Mouza & Names)',
    expectedStatus: 'GREEN',
    expectedIssueCount: 0,
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
    name: 'YELLOW Name Variation Only',
    expectedStatus: 'YELLOW',
    expectedIssueCode: 'SELLER_NAME_VARIATION',
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
        seller: 'কাল্পনিক মো: তারেক হাসান', // Minor variation: মো: vs মোহাম্মদ
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
    name: 'YELLOW Mortgage Only',
    expectedStatus: 'YELLOW',
    expectedIssueCode: 'PLOT_MORTGAGED',
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
    plotStatus: { dag_no: '0404', mortgaged: true, court_case: false }, // Mortgaged
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
    name: 'RED Double-Sale Case',
    expectedStatus: 'RED',
    expectedIssueCode: 'DOUBLE_SALE_DETECTED',
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
    name: 'RED Seller-Owner Mismatch Only',
    expectedStatus: 'RED',
    expectedIssueCode: 'SELLER_OWNER_MISMATCH',
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
        seller: 'কাল্পনিক জাকির হোসেন মজুমদার', // Mismatch!
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
    name: 'RED Excessive-Area Case',
    expectedStatus: 'RED',
    expectedIssueCode: 'EXCESSIVE_AREA_REQUESTED',
    khatian: {
      id: 'a0000000-0000-0000-0000-000000000007',
      mouza: 'সবুজপল্লী',
      dag_no: '0707',
      owner_name: 'কাল্পনিক ফারুক হোসেন',
      total_area: 10.0,
      remaining_area: 3.0, // Only 3.0 decimals remaining
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
        area: 8.0, // Exceeds 3.0 decimals
        date: '2024-07-22',
        hash: '9f5a5d192a9641e15f5512487a56d52c9c35767a1928d8ec2743f5ef791dd61a',
        prev_hash: 'GENESIS-0000-0000-0000-000000000007',
        status: 'active',
      },
    ],
  },
  {
    code: 'H',
    name: 'RED Altered-Document / Hash Mismatch',
    expectedStatus: 'RED',
    expectedIssueCode: 'DEED_HASH_MISMATCH',
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
        hash: 'TAMPERED-HASH-00000000000000000000000000000000000000000000000000000888', // Tampered!
        prev_hash: 'GENESIS-0000-0000-0000-000000000008',
        status: 'active',
      },
    ],
  },
];

async function runTests() {
  console.log('=== VERIFYING 8 ISOLATED TEST CASES (A through H) ===\n');
  let allPassed = true;

  for (const tc of testCasesData) {
    const res = await runLandVerification({
      dagNo: tc.khatian.dag_no,
      khatian: tc.khatian,
      plotStatus: tc.plotStatus,
      deeds: tc.deeds,
    });

    const statusMatch = res.overallStatus === tc.expectedStatus;
    let issueMatch = true;

    if (tc.expectedStatus === 'GREEN') {
      issueMatch = res.issues.length === 0;
    } else {
      issueMatch = res.issues.some((i) => i.code === tc.expectedIssueCode) && res.issues.length === 1;
    }

    const testPassed = statusMatch && issueMatch;
    if (!testPassed) allPassed = false;

    console.log(
      `[${testPassed ? '✓ PASS' : '✗ FAIL'}] Case ${tc.code}: ${tc.name}` +
        `\n       Expected Status: ${tc.expectedStatus} | Actual: ${res.overallStatus}` +
        `\n       Issue Count: ${res.issues.length}` +
        (res.issues.length > 0 ? `\n       Issues: ${res.issues.map((i) => `${i.code} (${i.severity})`).join(', ')}` : '') +
        '\n'
    );
  }

  if (allPassed) {
    console.log('🎉 ALL 8 TEST CASES PASSED WITH EXACT ISOLATED STATUS AND ISSUES!');
  } else {
    console.error('⚠️ SOME TEST CASES FAILED VERIFICATION.');
    process.exit(1);
  }
}

runTests();
