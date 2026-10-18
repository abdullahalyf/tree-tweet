'use client';
import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
export type Language = 'bn' | 'en';
const STORAGE_KEY = 'treetweet_language';
interface LanguageContextValue { language: Language; setLanguage: (language: Language) => void; t: (bn: string, en: string) => string }
const LanguageContext = createContext<LanguageContextValue | null>(null);
let currentLanguage: Language | undefined;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const getSnapshot = (): Language => {
  if (currentLanguage) return currentLanguage;
  try { currentLanguage = window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'bn'; }
  catch { currentLanguage = 'bn'; }
  return currentLanguage;
};
const getServerSnapshot = (): Language => 'bn';
const setLanguage = (next: Language) => {
  currentLanguage = next;
  try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* Keep the choice in memory when storage is unavailable. */ }
  listeners.forEach(listener => listener());
};
export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: (bn, en) => language === 'bn' ? bn : en }}>{children}</LanguageContext.Provider>;
}
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage requires LanguageProvider');
  return context;
}
