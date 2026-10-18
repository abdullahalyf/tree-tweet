import { isSupabaseConfigured } from '../db/client';
import { fetchCompletePlotRecord, fetchDeedByNo } from '../db/queries';
import { normalizeDagNo, normalizeDeedNo } from '../validation/normalize';
import { CompletePlotData } from '../db/schema';
import { getDemoPlotData, getDemoPlotDataByDeed } from '../demo/fixtures';
import { getCompletePlotFromRegistry, getCompletePlotByDeedFromRegistry } from '../demo/registry';
import { runLandVerification } from '../verification/rules';
import { VerificationResult } from '../verification/types';

export interface VerificationServiceResponse {
  success: boolean;
  source: 'demo' | 'supabase';
  plotData: CompletePlotData | null;
  result: VerificationResult | null;
  error?: string;
}

/**
 * High-level Land Verification Service
 * Safely routes between live Supabase (if configured) and local synthetic demo fixtures.
 * Never misrepresents synthetic fixtures as live database records.
 */
export async function executeLandVerification(params: {
  dagNo: string;
  deedNo?: string;
  proposedArea?: number;
  sellerName?: string;
}): Promise<VerificationServiceResponse> {
  const source = isSupabaseConfigured() ? 'supabase' : 'demo';
  const invalid = (): VerificationServiceResponse => ({ success: false, source, plotData: null, result: null, error: 'Invalid search input.' });
  if (!params || typeof params !== 'object' || typeof params.dagNo !== 'string' || params.dagNo.length > 256 ||
    (params.deedNo !== undefined && (typeof params.deedNo !== 'string' || params.deedNo.length > 256 || /[|\u0000-\u001f\u007f]/.test(params.deedNo))) ||
    (params.sellerName !== undefined && (typeof params.sellerName !== 'string' || params.sellerName.length > 256)) ||
    (params.proposedArea !== undefined && (typeof params.proposedArea !== 'number' || !Number.isFinite(params.proposedArea) || params.proposedArea <= 0))) return invalid();
  const dagNo = normalizeDagNo(params.dagNo || '');
  const deedNo = params.deedNo ? normalizeDeedNo(params.deedNo) : undefined;
  if ((params.dagNo.trim() && !dagNo) || (!dagNo && !deedNo)) return invalid();
  const { proposedArea, sellerName } = params;

  // 1. If Supabase is configured, attempt remote query
  if (isSupabaseConfigured()) {
    try {
      const resolvedDag = dagNo || (deedNo ? (await fetchDeedByNo(deedNo))?.dag_no : '') || '';
      const plotData = await fetchCompletePlotRecord(resolvedDag);

      if (!plotData || !plotData.khatian) {
        return {
          success: true,
          source: 'supabase',
          plotData: null,
          result: null,
        };
      }

      const result = await runLandVerification({
        dagNo: resolvedDag,
        khatian: plotData.khatian,
        plotStatus: plotData.plotStatus,
        deeds: plotData.deeds,
        targetDeedNo: deedNo,
        proposedArea,
        sellerName,
      });

      return {
        success: true,
        source: 'supabase',
        plotData,
        result,
      };
    } catch (err) {
      console.error('[LandService] Supabase query failed:', err);
      return {
        success: false,
        source: 'supabase',
        plotData: null,
        result: null,
        error: 'ডাটাবেজ সংযোগে ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।',
      };
    }
  }

  // 2. Local Demo Mode (Transparently labelled synthetic fixtures & custom registry)
  let demoData: CompletePlotData | null = null;

  if (deedNo && (!dagNo || dagNo.trim() === '')) {
    demoData = getCompletePlotByDeedFromRegistry(deedNo) || getDemoPlotDataByDeed(deedNo);
  } else {
    demoData = getCompletePlotFromRegistry(dagNo) || getDemoPlotData(dagNo);
  }

  if (!demoData || !demoData.khatian) {
    return {
      success: true,
      source: 'demo',
      plotData: null,
      result: null,
    };
  }

  // Execute verification engine rules deterministically
  const result = await runLandVerification({
    dagNo: demoData.dagNo,
    khatian: demoData.khatian,
    plotStatus: demoData.plotStatus,
    deeds: demoData.deeds,
    targetDeedNo: deedNo,
    proposedArea,
    sellerName,
  });

  return {
    success: true,
    source: 'demo',
    plotData: demoData,
    result,
  };
}
