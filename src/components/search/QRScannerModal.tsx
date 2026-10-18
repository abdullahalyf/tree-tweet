'use client';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { scenarioEnglish } from '@/lib/i18n/issues';
interface QRDetector { detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]> }
interface QRDetectorConstructor { new(options: { formats: string[] }): QRDetector; getSupportedFormats(): Promise<string[]> }
interface QRScannerModalProps { isOpen: boolean; onClose: () => void; onScanSuccess: (dagNo: string, deedNo?: string) => void }
export function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const [error, setError] = useState<'empty' | 'invalid' | 'camera' | 'unsupported' | 'external' | null>(null);
  const [active, setActive] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const generation = useRef(0);
  const frame = useRef<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const manualInput = useRef<HTMLInputElement>(null);
  const stop = () => { generation.current++; if (frame.current !== null) cancelAnimationFrame(frame.current); frame.current = null; stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; setActive(false); setRequesting(false); };
  const close = () => { stop(); setError(null); onClose(); };
  useEffect(() => {
    if (!isOpen) return;
    const sessionGeneration = generation;
    const previous = document.activeElement as HTMLElement | null;
    const modal = dialog.current;
    // Native modality keeps background controls inert, including after camera changes.
    modal?.showModal();
    modal?.focus();
    return () => { sessionGeneration.current++; if (frame.current !== null) cancelAnimationFrame(frame.current); frame.current = null; stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; modal?.close(); if (previous?.isConnected) previous.focus(); };
  }, [isOpen]);
  useEffect(() => { if (active && video.current && stream.current) { const session = generation.current; video.current.srcObject = stream.current; void video.current.play().catch(() => { if (session === generation.current) { stop(); setError('camera'); } }); } }, [active]);
  const select = (dag: string, deed?: string) => { stop(); onScanSuccess(dag, deed); close(); };
  const parse = (raw = value) => {
    const input = raw.trim();
    if (!input) { setError('empty'); manualInput.current?.focus(); return; }
    try {
      if (/^[a-z][a-z\d+.-]*:/i.test(input) || input.startsWith('//')) {
        const url = new URL(input, window.location.origin);
        if (![window.location.origin, 'https://treetweet.vercel.app'].includes(url.origin)) { setError('external'); return; }
      }
      let dag: unknown; let deed: unknown;
      if (input.startsWith('{')) { const parsed: unknown = JSON.parse(input); if (typeof parsed === 'object' && parsed !== null) { const record = parsed as Record<string, unknown>; dag = record.dag; deed = record.deed; } }
      else if (input.includes('dag=') || input.includes('deed=')) { const params = new URLSearchParams(input.includes('?') ? input.split('?')[1].split('#')[0] : input); dag = params.get('dag'); deed = params.get('deed'); }
      else if (/^DEED-/i.test(input)) deed = input.toUpperCase();
      else if (/^[\d০-৯]+$/.test(input)) dag = input;
      if ((dag != null && typeof dag !== 'string') || (deed != null && typeof deed !== 'string')) { setError('invalid'); return; }
      const cleanDag = typeof dag === 'string' ? dag.trim() : '';
      const cleanDeed = typeof deed === 'string' ? deed.trim() : '';
      if (!cleanDag && !cleanDeed) { setError('invalid'); return; }
      select(cleanDag, cleanDeed || undefined);
    } catch { setError('invalid'); }
  };
  const start = async () => {
    stop();
    setError(null);
    setRequesting(true);
    const session = generation.current;
    try {
      const Detector = (globalThis as typeof globalThis & { BarcodeDetector?: QRDetectorConstructor }).BarcodeDetector;
      if (!Detector || !(await Detector.getSupportedFormats()).includes('qr_code')) {
        if (session === generation.current) { setError('unsupported'); setRequesting(false); }
        return;
      }
      if (session !== generation.current) return;
      const detector = new Detector({ formats: ['qr_code'] });
      const next = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (session !== generation.current || !dialog.current) { next.getTracks().forEach(track => track.stop()); return; }
      stream.current = next;
      setRequesting(false);
      setActive(true);
      const scan = async () => {
        if (session !== generation.current) return;
        try {
          if (video.current && video.current.readyState >= 2) {
            const codes = await detector.detect(video.current);
            if (session !== generation.current) return;
            const decoded = codes.find(code => typeof code.rawValue === 'string' && code.rawValue.trim());
            if (decoded) { stop(); parse(decoded.rawValue); return; }
          }
          frame.current = requestAnimationFrame(() => { void scan(); });
        } catch {
          if (session === generation.current) { stop(); setError('camera'); }
        }
      };
      frame.current = requestAnimationFrame(() => { void scan(); });
    } catch {
      if (session === generation.current) { stop(); setError('camera'); }
    }
  };
  if (!isOpen) return null;
  const inputInvalid = error === 'empty' || error === 'invalid' || error === 'external';
  return <dialog ref={dialog} aria-labelledby="qr-title" aria-describedby="qr-help" tabIndex={-1} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_1.5rem)] max-w-lg overflow-y-auto rounded-3xl border bg-white p-5 space-y-4 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm" onCancel={event => { event.preventDefault(); close(); }}>
      <div className="flex justify-between items-center gap-3"><h2 id="qr-title" className="font-bold text-lg">{t('নমুনা QR সরঞ্জাম', 'Sample QR tools')}</h2><button onClick={close} aria-label={t('QR সরঞ্জাম বন্ধ করুন', 'Close QR tools')} className="min-h-11 min-w-11 rounded-lg border px-3 py-2">×</button></div>
      <p id="qr-help" className="text-sm text-slate-600">{t('শুধু TreeTweet-এর নমুনা QR ব্যবহার করুন। সরকারি দলিল, খতিয়ান বা দাখিলার সত্যতা এখানে যাচাই হয় না। ক্যামেরায় পড়া না গেলে নমুনার লিংক লিখুন।', 'Use TreeTweet sample QR codes only. This tool does not authenticate government deeds, khatians or tax receipts. If scanning is unavailable, paste a sample link.')}</p>
      <button type="button" onClick={active || requesting ? stop : start} className="min-h-11 rounded-xl border px-4 py-2">{requesting ? t('ক্যামেরার অনুরোধ বাতিল করুন', 'Cancel camera request') : active ? t('ক্যামেরা বন্ধ করুন', 'Stop camera') : t('ক্যামেরা দিয়ে QR পড়ুন', 'Scan QR with camera')}</button>
      <p role="status" className="text-sm text-slate-600">{requesting ? t('ব্রাউজারে ক্যামেরার অনুমতি দিন, অথবা নিচে নমুনার লিংক লিখুন।', 'Allow camera access in your browser, or paste a sample link below.') : active ? t('ক্যামেরা চালু আছে। নমুনা QR সামনে ধরুন।', 'Camera is active. Hold a sample QR code in view.') : ''}</p>
      {active && <video ref={video} muted playsInline aria-label={t('ক্যামেরা প্রিভিউ', 'Camera preview')} className="aspect-video w-full rounded-xl bg-slate-950 object-cover" />}
      {error && <p id="qr-error" role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error === 'external' ? t('শুধু TreeTweet-এর নমুনা লিংক গ্রহণ করা হয়। সরকারি কাগজ যাচাইয়ে সরকারি সেবা ব্যবহার করুন।', 'Only TreeTweet sample links are accepted. Use official services to check government documents.') : error === 'unsupported' ? t('এই ব্রাউজারে ক্যামেরা দিয়ে QR পড়া যায় না। নিচে লিংক লিখুন বা নমুনা বেছে নিন।', 'Camera QR scanning is unsupported in this browser. Paste the QR link below or choose a sample.') : error === 'camera' ? t('ক্যামেরা চালু হয়নি। অনুমতি পরীক্ষা করুন অথবা কোড পেস্ট করুন।', 'Camera unavailable. Check permission or paste the code instead.') : error === 'empty' ? t('QR লিংক বা কোড লিখুন।', 'Enter a QR link or code.') : t('বৈধ দাগ বা দলিল নম্বর পাওয়া যায়নি।', 'No valid plot or deed number was found.')}</p>}
      <form onSubmit={event => { event.preventDefault(); parse(); }} className="space-y-2"><label htmlFor="qr-code" className="block text-sm font-semibold">{t('QR লিংক বা কোড পেস্ট করুন', 'Paste a QR link or code')}</label><input ref={manualInput} aria-invalid={inputInvalid} aria-describedby={error ? "qr-help qr-error" : "qr-help"} id="qr-code" value={value} onChange={event => { setValue(event.target.value); setError(null); }} placeholder="/?dag=0101&deed=DEED-2024-0001" className="w-full min-w-0 rounded-xl border p-3 text-base" /><button type="submit" className="rounded-xl bg-emerald-700 px-4 py-2 text-white">{t('রেকর্ড খুলুন', 'Open records')}</button></form>
      <h3 className="text-sm font-bold">{t('কাল্পনিক QR নমুনা', 'Synthetic QR samples')}</h3>
      <div className="grid gap-2 sm:grid-cols-2">{[['A','0101','DEED-2024-0001'],['C','0303','DEED-2024-0003'],['E','0505','DEED-2024-0005B'],['H','0808','DEED-2024-0008']].map(([code, dag, deed]) => <button key={code} onClick={() => select(dag, deed)} className="rounded-xl border p-3 text-left text-sm">{t('কেস', 'Case')} {code} · {dag}<span className="block text-xs text-slate-600">{t(({ A:'প্রদত্ত রেকর্ডে ঝুঁকি শনাক্ত হয়নি', C:'নামের তারতম্য', E:'দ্বৈত বিক্রির ঝুঁকি', H:'দলিলের তথ্য মিলছে না' } as Record<string,string>)[code], code === 'H' ? 'Deed information does not match' : scenarioEnglish[code])}</span></button>)}</div>
      <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-950">{t('QR কোড কেবল রেকর্ড খোঁজার উপায়। এটি বৈধ মালিকানা বা সরকারি অনুমোদনের প্রমাণ নয়।', 'A QR code only helps locate records. It does not prove legal ownership or government approval.')}</p>
      <button onClick={close} className="rounded-xl border px-4 py-2 text-sm">{t('বন্ধ করুন', 'Close')}</button>
  </dialog>;
}
