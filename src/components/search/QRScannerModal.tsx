'use client';

import React, { useState, useRef, useEffect } from 'react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (dagNo: string, deedNo?: string) => void;
}

export function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCameraError(null);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Hardware cleanup when modal unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('আপনার ব্রাউজারে ক্যামেরা সুবিধা সমর্থিত নয়।');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('[QR Scanner] Camera error:', err);
      setCameraError(
        'ক্যামেরা অ্যাক্সেস করা সম্ভব হয়নি। অনুগ্রহ করে পারমিশন চেক করুন অথবা ডেমো কোড সিলেক্ট করুন।'
      );
      setCameraActive(false);
    }
  };

  if (!isOpen) return null;

  // Preset demo QR simulation options
  const demoQRCodes = [
    { label: 'কেস A: ক্লিন কেস (দাগ ০১০১)', dag: '0101', deed: 'DEED-2024-0001' },
    { label: 'কেস C: নামের তারতম্য (দাগ ০৩০৩)', dag: '0303', deed: 'DEED-2024-0003' },
    { label: 'কেস E: দ্বৈত বিক্রি (দাগ ০৫০৫)', dag: '0505', deed: 'DEED-2024-0005B' },
    { label: 'কেস H: টেম্পার্ড দলিল (দাগ ০৮০৮)', dag: '0808', deed: 'DEED-2024-0008' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📷</span>
            <h3 className="font-bold text-slate-800 text-lg">দলিল QR কোড স্ক্যানার</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Camera Viewport or Permission Request */}
        <div className="relative aspect-video rounded-2xl bg-slate-950 flex flex-col items-center justify-center overflow-hidden border border-slate-200">
          {cameraActive ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
          ) : (
            <div className="p-6 text-center space-y-3">
              <div className="text-4xl text-emerald-400">🔍</div>
              <p className="text-xs sm:text-sm text-slate-300">
                দলিল বা পর্চার উপর থাকা QR কোডটি স্ক্যান করার জন্য ক্যামেরা চালু করুন
              </p>
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-700/20 transition-all"
              >
                <span>ক্যামেরা চালু করুন</span>
              </button>
            </div>
          )}

          {cameraActive && (
            <div className="absolute inset-8 border-2 border-dashed border-emerald-400 rounded-xl pointer-events-none animate-pulse" />
          )}
        </div>

        {cameraError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed">
            {cameraError}
          </div>
        )}

        {/* Manual QR Text / URL input fallback */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-slate-600 block">
            বা QR কোডের লিংক / কোড টেক্সট পেস্ট করুন:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="qr-manual-input"
              placeholder="উদাঃ /?dag=0909&deed=DEED-2026-9001 বা DEED-..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.currentTarget.value || '').trim();
                  if (!val) return;

                  // Parse URL or raw query
                  try {
                    let dag: string | undefined;
                    let deed: string | undefined;

                    if (val.includes('dag=') || val.includes('deed=')) {
                      const searchStr = val.includes('?') ? val.split('?')[1] : val;
                      const params = new URLSearchParams(searchStr);
                      dag = params.get('dag') || undefined;
                      deed = params.get('deed') || undefined;
                    } else if (val.startsWith('{') && val.endsWith('}')) {
                      const parsed = JSON.parse(val);
                      dag = parsed.dag;
                      deed = parsed.deed;
                    } else if (val.toUpperCase().startsWith('DEED-')) {
                      deed = val.toUpperCase();
                    } else if (/^[\d০-৯]+$/.test(val)) {
                      dag = val;
                    }

                    if (dag || deed) {
                      stopCamera();
                      onScanSuccess(dag || '', deed);
                      handleClose();
                    } else {
                      setCameraError('এই QR কোডে কোনো স্বীকৃত ডেমো দাগ বা দলিল নম্বর পাওয়া যায়নি।');
                    }
                  } catch {
                    setCameraError('QR কোড টেক্সট প্রক্রিয়া করতে ত্রুটি হয়েছে।');
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const inputEl = document.getElementById('qr-manual-input') as HTMLInputElement | null;
                const val = inputEl?.value.trim() || '';
                if (!val) {
                  setCameraError('অনুগ্রহ করে QR লিংক বা কোড লিখুন।');
                  return;
                }

                try {
                  let dag: string | undefined;
                  let deed: string | undefined;

                  if (val.includes('dag=') || val.includes('deed=')) {
                    const searchStr = val.includes('?') ? val.split('?')[1] : val;
                    const params = new URLSearchParams(searchStr);
                    dag = params.get('dag') || undefined;
                    deed = params.get('deed') || undefined;
                  } else if (val.startsWith('{') && val.endsWith('}')) {
                    const parsed = JSON.parse(val);
                    dag = parsed.dag;
                    deed = parsed.deed;
                  } else if (val.toUpperCase().startsWith('DEED-')) {
                    deed = val.toUpperCase();
                  } else if (/^[\d০-৯]+$/.test(val)) {
                    dag = val;
                  }

                  if (dag || deed) {
                    stopCamera();
                    onScanSuccess(dag || '', deed);
                    handleClose();
                  } else {
                    setCameraError('এই QR কোডে কোনো স্বীকৃত ডেমো দাগ বা দলিল নম্বর পাওয়া যায়নি।');
                  }
                } catch {
                  setCameraError('QR কোড টেক্সট প্রক্রিয়া করতে ত্রুটি হয়েছে।');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              যাচাই
            </button>
          </div>
        </div>

        {/* Demo QR Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            বা ডেমো QR কোড নির্বাচন করুন (বিচারক প্রদর্শনী):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {demoQRCodes.map((qr) => (
              <button
                key={qr.dag}
                onClick={() => {
                  stopCamera();
                  onScanSuccess(qr.dag, qr.deed);
                  handleClose();
                }}
                className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-xs font-medium text-slate-700 transition-all flex items-center justify-between group"
              >
                <span>{qr.label}</span>
                <span className="text-slate-400 group-hover:text-emerald-600 font-mono text-[10px]">
                  {qr.dag} →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Legal notice regarding QR codes */}
        <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
          ⚠️ <strong>সতর্কতা:</strong> QR কোড থাকা মানেই জমি বা দলিলের বৈধ স্বত্বাধিকার প্রমাণিত হয় না। এটি শুধুমাত্র ডিজিটাল তথ্যের সহজ অনুসন্ধানের মাধ্যম।
        </p>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors"
          >
            বন্ধ করুন (ম্যানুয়ালি লিখুন)
          </button>
        </div>
      </div>
    </div>
  );
}
