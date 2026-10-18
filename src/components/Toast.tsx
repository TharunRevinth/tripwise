'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-slide-up ${
            t.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800'
              : t.type === 'error'
              ? 'bg-rose-950/90 text-rose-100 border-rose-800'
              : 'bg-slate-900/90 text-slate-100 border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />}
            <span className="text-xs sm:text-sm font-semibold">{t.message}</span>
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
