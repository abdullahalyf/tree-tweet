export interface MutationHistoryEntry { date: string; status: 'none' | 'pending' | 'done'; reference: string }
export function readMutationHistory(value: unknown): MutationHistoryEntry[] {
  if (!Array.isArray(value) || value.length === 0) return [];
  const valid = value.every(entry => {
    if (typeof entry !== 'object' || entry === null) return false;
    const item = entry as Record<string, unknown>;
    return typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && Number.isFinite(Date.parse(item.date)) &&
      new Date(item.date).toISOString().slice(0, 10) === item.date && ['none', 'pending', 'done'].includes(String(item.status)) &&
      typeof item.reference === 'string' && item.reference.trim().length > 0;
  });
  return valid ? value as MutationHistoryEntry[] : [];
}
export type BuyerCheckState = 'clear' | 'review' | 'missing' | 'review-missing';
export interface BuyerEvidence {
  khatian: { owner_name?: unknown; mutation_status?: unknown; land_type?: unknown; mutation_history?: unknown } | null;
  selectedDeed: { seller?: unknown } | null;
  plotStatus: { court_case?: unknown; acquisition_status?: unknown } | null;
  issues: readonly { code: string }[];
}
export function getBuyerChecklist(data: BuyerEvidence): { id: 'owner' | 'mutation' | 'court' | 'khas' | 'acquisition'; state: BuyerCheckState }[] {
  const has = (codes: string[]) => data.issues.some(issue => codes.includes(issue.code));
  const mismatch = has(['RECORD_PLOT_MISMATCH', 'RECORD_DATA_INCOMPLETE']);
  const knownText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;
  const state = (available: boolean, review: boolean): BuyerCheckState => review ? available ? 'review' : 'review-missing' : available ? 'clear' : 'missing';
  const mutation = data.khatian?.mutation_status;
  const acquisition = data.plotStatus?.acquisition_status;
  return [
    { id: 'owner', state: state(!mismatch && knownText(data.khatian?.owner_name) && knownText(data.selectedDeed?.seller) && !has(['DEED_NOT_FOUND', 'DEED_RECORDS_MISSING', 'KHATIAN_NOT_FOUND']), has(['SELLER_NAME_VARIATION', 'SELLER_OWNER_MISMATCH'])) },
    { id: 'mutation', state: state(!mismatch && ['none', 'pending', 'done'].includes(String(mutation)) && readMutationHistory(data.khatian?.mutation_history).length > 0 && !has(['MUTATION_HISTORY_UNAVAILABLE']), mutation === 'none' || mutation === 'pending' || has(['MUTATION_NOT_DONE', 'MUTATION_PENDING'])) },
    { id: 'court', state: state(!mismatch && typeof data.plotStatus?.court_case === 'boolean', data.plotStatus?.court_case === true || has(['PLOT_COURT_DISPUTE'])) },
    { id: 'khas', state: state(!mismatch && ['normal', 'khas'].includes(String(data.khatian?.land_type)), data.khatian?.land_type === 'khas' || has(['KHAS_LAND_PROHIBITED'])) },
    { id: 'acquisition', state: state(!mismatch && ['not_reported', 'notice', 'acquired'].includes(String(acquisition)) && !has(['ACQUISITION_STATUS_UNAVAILABLE']), acquisition === 'notice' || acquisition === 'acquired' || has(['ACQUISITION_NOTICE', 'LAND_ACQUIRED'])) },
  ];
}
