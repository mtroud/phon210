import React, { useState } from 'react';
import { AuditLog } from '../types';
import { getAuditLogs, clearAuditLogs } from '../utils/storage';
import { Shield, Clock, FileText, Trash2, X, RefreshCw, CheckCircle2, UserCheck } from 'lucide-react';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [logs, setLogs] = useState<AuditLog[]>(getAuditLogs());

  const handleRefresh = () => {
    setLogs(getAuditLogs());
  };

  const handleClear = () => {
    if (confirm('هل أنت متأكد من مسح سجل العمليات؟')) {
      clearAuditLogs();
      setLogs([]);
    }
  };

  const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
      case 'add':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">إضافة</span>;
      case 'edit':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">تعديل</span>;
      case 'delete':
        return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">حذف</span>;
      case 'reset':
        return <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold">استعادة</span>;
      case 'import':
        return <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">استيراد</span>;
      case 'export_backup':
      case 'export_csv':
        return <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold">تصدير</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-cairo">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-tajawal">
                سجل العمليات والنشاط الإداري (Audit Log)
              </h3>
              <p className="text-xs text-slate-400">
                توثيق كامل للعمليات الحساسة وتعديلات قاعدة البيانات
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              title="تحديث السجل"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of logs */}
        <div className="flex-1 overflow-y-auto my-4 space-y-2.5 pr-1">
          {logs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold">لا توجد عمليات مسجلة حالياً</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 text-right flex-1">
                  <div className="flex items-center gap-2">
                    {getActionBadge(log.action)}
                    <span className="font-bold text-slate-200">
                      {log.performedBy}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleString('ar-IQ')}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {log.details}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-400">
            إجمالي السجلات: <strong className="text-amber-400 font-mono">{logs.length}</strong> عملية
          </span>
          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <button
                onClick={handleClear}
                className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition text-xs font-medium"
              >
                مسح السجل
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs font-semibold"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
