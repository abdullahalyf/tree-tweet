import type { CheckId, PaperStatus } from './guideTopics';

export type PaperPreparation = Readonly<Partial<Record<CheckId, PaperStatus>>>;
type PreparationStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export const PAPER_PREPARATION_KEY = 'treetweet_preparation_v1';
const EMPTY: PaperPreparation = Object.freeze({});
const IDS: readonly CheckId[] = ['owner', 'mutation', 'case', 'khas', 'acquisition'];
const STATUSES: readonly PaperStatus[] = ['missing', 'collected', 'mismatch'];

export function createPaperPreparationStore(storage: () => PreparationStorage | null) {
  let snapshot = EMPTY;
  let initialized = false;
  const listeners = new Set<() => void>();
  const initialize = () => {
    if (initialized) return;
    initialized = true;
    try {
      const raw = storage()?.getItem(PAPER_PREPARATION_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return;
      const value = parsed as Record<string, unknown>;
      const safe: Partial<Record<CheckId, PaperStatus>> = {};
      for (const id of IDS) {
        if (Object.hasOwn(value, id) && STATUSES.includes(value[id] as PaperStatus)) safe[id] = value[id] as PaperStatus;
      }
      if (Object.keys(safe).length) snapshot = Object.freeze(safe);
    } catch { /* Blocked or malformed storage must not prevent preparation. */ }
  };
  const publish = (next: PaperPreparation) => {
    snapshot = next;
    listeners.forEach(listener => listener());
  };
  const getSnapshot = () => { initialize(); return snapshot; };
  const getServerSnapshot = () => EMPTY;
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  };
  const setPaper = (id: CheckId, status: PaperStatus) => {
    if (!IDS.includes(id) || !STATUSES.includes(status)) return;
    initialize();
    if (snapshot[id] === status) return;
    const next = Object.freeze({ ...snapshot, [id]: status });
    try { storage()?.setItem(PAPER_PREPARATION_KEY, JSON.stringify(next)); } catch { /* Keep this session's memory fallback. */ }
    publish(next);
  };
  const clearPapers = () => {
    initialize();
    try { storage()?.removeItem(PAPER_PREPARATION_KEY); } catch { /* Memory can still be cleared. */ }
    if (snapshot !== EMPTY) publish(EMPTY);
  };
  return { getSnapshot, getServerSnapshot, subscribe, setPaper, clearPapers };
}
