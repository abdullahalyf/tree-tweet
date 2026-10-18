'use client';

import { useSyncExternalStore } from 'react';

const KEY = 'treetweet_motion_paused_v1';
let paused: boolean | undefined;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const getServerSnapshot = () => false;
const getSnapshot = () => {
  if (paused !== undefined) return paused;
  try { paused = window.sessionStorage.getItem(KEY) === '1'; } catch { paused = false; }
  return paused;
};
const setMotionPaused = (next: boolean | ((previous: boolean) => boolean)) => {
  paused = typeof next === 'function' ? next(getSnapshot()) : next;
  try { window.sessionStorage.setItem(KEY, paused ? '1' : '0'); } catch { /* Keep the preference in memory while navigating. */ }
  listeners.forEach(listener => listener());
};

export function useMotionPreference() {
  return [useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot), setMotionPaused] as const;
}
