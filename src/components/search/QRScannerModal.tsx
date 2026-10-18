'use client';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { scenarioEnglish } from '@/lib/i18n/issues';
interface QRScannerModalProps { isOpen: boolean; onClose: () => void; onScanSuccess: (dagNo: string, deedNo?: string) => void }
export function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const [error, setError] = useState<'empty' | 'invalid' | 'camera' | null>(null);
  const [active, setActive] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const stop = () => { stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; setActive(false); };
  const close = () => { stop(); setError(null); onClose(); };
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    return () => { stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; previous?.focus(); };
  }, [isOpen]);
  useEffect(() => { if (active && video.current && stream.current) { video.current.srcObject = stream.current; void video.current.play().catch(() => setError('camera')); } }, [active]);
  const start = async () => {
    setError(null);
    try {
      const next = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (!dialog.current) { next.getTracks().forEach(track => track.stop()); return; }
      stream.current?.getTracks().forEach(track => track.stop()); stream.current = next; setActive(true);
    } catch { setError('camera'); }
  };
  const select = (dag: string, deed?: string) => { stop(); onScanSuccess(dag, deed); close(); };
  const parse = () => {
    const input = value.trim();
    if (!input) { setError('empty'); return; }
    try {
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
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm">
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="qr-title" tabIndex={-1} className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border bg-white p-5 space-y-4 shadow-2xl" onKeyDown={event => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const items = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input, [tabindex="0"]');
        if (!items?.length) return;
        const first = items[0]; const last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }}>
      <div className="flex justify-between items-center gap-3"><h2 id="qr-title" className="font-bold text-lg">{t('দলিল QR সরঞ্জাম', 'Deed QR tools')}</h2><button onClick={close} aria-label={t('QR সরঞ্জাম বন্ধ করুন', 'Close QR tools')} className="rounded-lg border px-3 py-2">×</button></div>
      <p className="text-sm text-slate-600">{t('ক্যামেরা শুধু প্রিভিউ দেখায়; স্বয়ংক্রিয় QR পড়া এই ডেমোতে নেই। কোডের লেখা পেস্ট করুন অথবা নমুনা বেছে নিন।', 'The camera provides a preview only; automatic QR decoding is unavailable in this demo. Paste the code text or choose a sample.')}</p>
      {active ? <video ref={video} muted playsInline aria-label={t('ক্যামেরা প্রিভিউ', 'Camera preview')} className="aspect-video w-full rounded-xl bg-slate-950 object-cover" /> : <button onClick={start} className="rounded-xl border px-4 py-2">{t('ক্যামেরা প্রিভিউ চালু করুন', 'Open camera preview')}</button>}
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error === 'camera' ? t('ক্যামেরা চালু হয়নি। অনুমতি পরীক্ষা করুন অথবা কোড পেস্ট করুন।', 'Camera unavailable. Check permission or paste the code instead.') : error === 'empty' ? t('QR লিংক বা কোড লিখুন।', 'Enter a QR link or code.') : t('বৈধ দাগ বা দলিল নম্বর পাওয়া যায়নি।', 'No valid plot or deed number was found.')}</p>}
      <form onSubmit={event => { event.preventDefault(); parse(); }} className="space-y-2"><label htmlFor="qr-code" className="block text-sm font-semibold">{t('QR লিংক বা কোড পেস্ট করুন', 'Paste a QR link or code')}</label><input id="qr-code" value={value} onChange={event => { setValue(event.target.value); setError(null); }} placeholder="/?dag=0101&deed=DEED-2024-0001" className="w-full min-w-0 rounded-xl border p-3 text-sm" /><button type="submit" className="rounded-xl bg-emerald-700 px-4 py-2 text-white">{t('রেকর্ড খুলুন', 'Open records')}</button></form>
      <h3 className="text-sm font-bold">{t('কাল্পনিক QR নমুনা', 'Synthetic QR samples')}</h3>
      <div className="grid gap-2 sm:grid-cols-2">{[['A','0101','DEED-2024-0001'],['C','0303','DEED-2024-0003'],['E','0505','DEED-2024-0005B'],['H','0808','DEED-2024-0008']].map(([code, dag, deed]) => <button key={code} onClick={() => select(dag, deed)} className="rounded-xl border p-3 text-left text-sm">{t('কেস', 'Case')} {code} · {dag}<span className="block text-xs text-slate-600">{t(({ A:'প্রদত্ত রেকর্ডে ঝুঁকি শনাক্ত হয়নি', C:'নামের তারতম্য', E:'দ্বৈত বিক্রির ঝুঁকি', H:'দলিলের হ্যাশ অমিল' } as Record<string,string>)[code], scenarioEnglish[code])}</span></button>)}</div>
      <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-950">{t('QR কোড কেবল রেকর্ড খোঁজার উপায়। এটি বৈধ মালিকানা বা সরকারি অনুমোদনের প্রমাণ নয়।', 'A QR code only helps locate records. It does not prove legal ownership or government approval.')}</p>
      <button onClick={close} className="rounded-xl border px-4 py-2 text-sm">{t('বন্ধ করুন', 'Close')}</button>
    </div>
  </div>;
}
