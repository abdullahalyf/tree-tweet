import { executeLandVerification } from '../src/lib/services/landService.js';
import { registerSyntheticDeed, resetCustomRegistry } from '../src/lib/demo/registry.js';
import { verifyDeedIntegrity } from '../src/lib/verification/hash.js';
import { DEMO_SCENARIOS } from '../src/lib/demo/fixtures.js';
import QRCode from 'qrcode';

async function runPreSubmissionAudit() {
  console.log('========================================================');
  console.log('       LANDTECH MVP: PRE-SUBMISSION VERIFICATION        ');
  console.log('========================================================\n');

  // 1. Test baseline case 0101 (GREEN)
  console.log('1. Testing Baseline Case 0101 (Expected: GREEN)');
  const res0101 = await executeLandVerification({ dagNo: '0101', deedNo: 'DEED-2024-0001' });
  const pass0101 = res0101.success && res0101.result?.overallStatus === 'GREEN' && res0101.result.issues.length === 0;
  console.log(`   Status: ${res0101.result?.overallStatus} | Issues: ${res0101.result?.issues.length} -> [${pass0101 ? 'PASS' : 'FAIL'}]\n`);

  // 2. Test baseline case 0404 (YELLOW)
  console.log('2. Testing Baseline Case 0404 (Expected: YELLOW - Mortgage Warning)');
  const res0404 = await executeLandVerification({ dagNo: '0404', deedNo: 'DEED-2024-0004' });
  const hasMortgage = res0404.result?.issues.some(i => i.code === 'PLOT_MORTGAGED');
  const pass0404 = res0404.success && res0404.result?.overallStatus === 'YELLOW' && hasMortgage;
  console.log(`   Status: ${res0404.result?.overallStatus} | Issues: ${res0404.result?.issues.map(i => i.code).join(', ')} -> [${pass0404 ? 'PASS' : 'FAIL'}]\n`);

  // 3. Test baseline case 0505 (RED)
  console.log('3. Testing Baseline Case 0505 (Expected: RED - Double-Sale Critical)');
  const res0505 = await executeLandVerification({ dagNo: '0505', deedNo: 'DEED-2024-0005B' });
  const hasDoubleSale = res0505.result?.issues.some(i => i.code === 'DOUBLE_SALE_DETECTED');
  const pass0505 = res0505.success && res0505.result?.overallStatus === 'RED' && hasDoubleSale;
  console.log(`   Status: ${res0505.result?.overallStatus} | Issues: ${res0505.result?.issues.map(i => i.code).join(', ')} -> [${pass0505 ? 'PASS' : 'FAIL'}]\n`);

  // 4. Test unknown record 9999
  console.log('4. Testing Unknown Record 9999 (Expected: No plot found / null result)');
  const res9999 = await executeLandVerification({ dagNo: '9999' });
  const pass9999 = res9999.success && res9999.plotData === null && res9999.result === null;
  console.log(`   PlotData: ${res9999.plotData} | Result: ${res9999.result} -> [${pass9999 ? 'PASS' : 'FAIL'}]\n`);

  // 5. Register synthetic deed and QR code
  console.log('5. Registering Synthetic Deed & Verifying QR Code');
  const regInput = {
    deed_no: 'DEED-2026-FINAL01',
    dag_no: '0909',
    seller: 'কাল্পনিক খন্দকার মোস্তফা',
    buyer: 'কাল্পনিক রেজওয়ান হক',
    area: 7.5,
    date: '2026-03-20',
  };
  const regRes = await registerSyntheticDeed(regInput);
  const qrUrl = `/?dag=${regInput.dag_no}&deed=${regInput.deed_no}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl);
  const passQR = regRes.success && regRes.deed !== null && qrDataUrl.startsWith('data:image/png;base64,');
  console.log(`   Registration: ${regRes.success ? 'OK' : 'ERROR'} | Hash: ${regRes.deed?.hash.substring(0, 16)}... | QR Format: Valid PNG Data URL -> [${passQR ? 'PASS' : 'FAIL'}]\n`);

  // 6. Verification within active server session
  console.log('6. Verifying Newly Registered Deed (Same Session)');
  const resRegVerify = await executeLandVerification({ dagNo: '0909', deedNo: 'DEED-2026-FINAL01' });
  const passRegVerify = resRegVerify.success && resRegVerify.result?.overallStatus === 'GREEN';
  console.log(`   Retrieved: ${resRegVerify.plotData !== null} | Status: ${resRegVerify.result?.overallStatus} -> [${passRegVerify ? 'PASS' : 'FAIL'}]\n`);

  // 7. Simulating Clean Server / Different Device Context (Server Restart without Client localStorage)
  console.log('7. Testing Clean Context / Serverless Instance Isolation (Clean Server Memory)');
  resetCustomRegistry(); // Clears memory
  const resCleanContext = await executeLandVerification({ dagNo: '0909', deedNo: 'DEED-2026-FINAL01' });
  const passCleanBehavior = resCleanContext.plotData === null; // Confirms in-memory is empty on clean server
  console.log(`   Clean Server Lookup: ${resCleanContext.plotData === null ? 'Empty State (as expected without DB)' : 'Found'} -> Verified [${passCleanBehavior ? 'CONFIRMED' : 'UNEXPECTED'}]\n`);

  // 8. Tampering Demonstration Safety Check
  console.log('8. Verifying Tampering Demo Disposable Copy & Baseline Fixture Immutability');
  const baseDeed = DEMO_SCENARIOS[0].deeds[0]; // Case A deed
  const originalSnapshot = JSON.stringify(baseDeed);
  
  // Create disposable copy and alter area
  const disposableCopy = { ...baseDeed, area: 15.5 };
  const integrity = await verifyDeedIntegrity(disposableCopy);
  const hashMismatchDetected = integrity.isValid === false;
  
  // Verify original fixture is 100% untouched
  const untouchedDeed = DEMO_SCENARIOS[0].deeds[0];
  const fixturesUntouched = JSON.stringify(untouchedDeed) === originalSnapshot;
  const passTamper = hashMismatchDetected && fixturesUntouched;
  console.log(`   Tampered Copy Valid: ${integrity.isValid} (Mismatch detected) | Original Fixture Intact: ${fixturesUntouched} -> [${passTamper ? 'PASS' : 'FAIL'}]\n`);

  console.log('========================================================');
  console.log('                   AUDIT COMPLETED                      ');
  console.log('========================================================');
}

runPreSubmissionAudit().catch(err => {
  console.error('Audit script error:', err);
  process.exit(1);
});
