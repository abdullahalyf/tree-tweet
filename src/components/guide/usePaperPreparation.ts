'use client';

import { useSyncExternalStore } from 'react';
import { createPaperPreparationStore } from './paperPreparationStore';

const store = createPaperPreparationStore(() => typeof window === 'undefined' ? null : window.sessionStorage);

export function usePaperPreparation() {
  const papers = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { papers, setPaper: store.setPaper, clearPapers: store.clearPapers };
}
