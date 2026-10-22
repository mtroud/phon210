import React, { useEffect } from 'react';
import { ToastNotification } from '../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none font-cairo">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastNotification; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-slate-900/95 shadow-emerald-500/10',
    error: 'border-rose-500/40 bg-slate-900/95 shadow-rose-500/10',
    warning: 'border-amber-500/40 bg-slate-900/95 shadow-amber-500/10',
    info: 'border-blue-500/40 bg-slate-900/95 shadow-blue-500/10',
  };

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl flex items-start gap-3 backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0 text-right">
        <h4 className="text-xs font-bold text-white leading-tight font-tajawal">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
