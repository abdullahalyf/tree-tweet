import { getSupabaseClient, isSupabaseConfigured } from './client';
import { KhatianRecord, PlotStatusRecord, DeedRecord, CompletePlotData } from './schema';

/**
 * Fetches Khatian record by Dag number.
 * dag_no is matched exactly as string to preserve leading zeros.
 */
export async function fetchKhatianByDag(dagNo: string): Promise<KhatianRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('khatian')
    .select('*')
    .eq('dag_no', dagNo)
    .maybeSingle();

  if (error) {
    console.error(`[DB Error] fetchKhatianByDag failed for dag ${dagNo}:`, error.message);
    throw new Error(`খতিয়ান অনুসন্ধানে ত্রুটি হয়েছে: ${error.message}`);
  }

  return (data as KhatianRecord) || null;
}

/**
 * Fetches Plot Status (mortgage and court case) by Dag number.
 */
export async function fetchPlotStatusByDag(dagNo: string): Promise<PlotStatusRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('plot_status')
    .select('*')
    .eq('dag_no', dagNo)
    .maybeSingle();

  if (error) {
    console.error(`[DB Error] fetchPlotStatusByDag failed for dag ${dagNo}:`, error.message);
    throw new Error(`দাগের স্থিতি অনুসন্ধানে ত্রুটি হয়েছে: ${error.message}`);
  }

  return (data as PlotStatusRecord) || null;
}

/**
 * Fetches all Deeds registered against a Dag number.
 */
export async function fetchDeedsByDag(dagNo: string): Promise<DeedRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('deed')
    .select('*')
    .eq('dag_no', dagNo)
    .order('date', { ascending: false });

  if (error) {
    console.error(`[DB Error] fetchDeedsByDag failed for dag ${dagNo}:`, error.message);
    throw new Error(`দলিল অনুসন্ধানে ত্রুটি হয়েছে: ${error.message}`);
  }

  return (data as DeedRecord[]) || [];
}

/**
 * Fetches a specific Deed by unique Deed registration number.
 */
export async function fetchDeedByNo(deedNo: string): Promise<DeedRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('deed')
    .select('*')
    .eq('deed_no', deedNo)
    .maybeSingle();

  if (error) {
    console.error(`[DB Error] fetchDeedByNo failed for deed ${deedNo}:`, error.message);
    throw new Error(`নির্দিষ্ট দলিল অনুসন্ধানে ত্রুটি হয়েছে: ${error.message}`);
  }

  return (data as DeedRecord) || null;
}

/**
 * Fetches all verification data for a plot in a single coordinated query.
 */
export async function fetchCompletePlotRecord(dagNo: string): Promise<CompletePlotData> {
  const [khatian, plotStatus, deeds] = await Promise.all([
    fetchKhatianByDag(dagNo),
    fetchPlotStatusByDag(dagNo),
    fetchDeedsByDag(dagNo),
  ]);

  return {
    dagNo,
    khatian,
    plotStatus,
    deeds,
  };
}
