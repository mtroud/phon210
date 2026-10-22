import React from 'react';
import { AlertTriangle, AlertCircle, HelpCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'تأكيد العملية',
  cancelLabel = 'إلغاء',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const icons = {
    danger: <AlertCircle className="w-6 h-6 text-rose-400" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-400" />,
    info: <HelpCircle className="w-6 h-6 text-blue-400" />,
  };

  const confirmColors = {
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30',
    warning: 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 font-bold',
    info: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-cairo">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 shrink-0">
            {icons[variant]}
          </div>

          <div className="flex-1 text-right">
            <h3 className="text-base font-bold text-white font-tajawal">
              {title}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-xs font-bold shadow-lg transition active:scale-95 ${confirmColors[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
