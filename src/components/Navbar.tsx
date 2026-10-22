import React from 'react';
import { Emblem } from './Emblem';
import { 
  Plus, 
  Printer, 
  QrCode, 
  Download, 
  Upload,
  RefreshCw, 
  ShieldCheck,
  ShieldAlert,
  FileSpreadsheet,
  FileText,
  Lock,
  Unlock,
  Layers,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { CardTemplate } from '../types';

interface NavbarProps {
  isAdmin: boolean;
  onToggleAdminLogin: () => void;
  onAddNew: () => void;
  onOpenBatchPrint: () => void;
  onOpenPrintStudio: (template?: CardTemplate) => void;
  onOpenScanner: () => void;
  onOpenReport: () => void;
  onOpenImport: () => void;
  onExportBackup: () => void;
  onExportCsv: () => void;
  onOpenAuditLogs: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  onToggleAdminLogin,
  onAddNew,
  onOpenBatchPrint,
  onOpenPrintStudio,
  onOpenScanner,
  onOpenReport,
  onOpenImport,
  onExportBackup,
  onExportCsv,
  onOpenAuditLogs,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-amber-500/25 shadow-2xl no-print font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Holy Shrine Identity */}
          <div className="flex items-center gap-3.5">
            <Emblem size="md" variant="gold" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-amber-400 font-amiri tracking-wide">
                  العتبة الحسينية المقدسة
                </h1>
                
                {/* Admin / Viewer Security Status Badge */}
                <button
                  onClick={onToggleAdminLogin}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                    isAdmin
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-amber-300'
                  }`}
                  title={isAdmin ? 'وضع الإدارة مفعل - انقر لقفل الجلسة' : 'وضع المشاهدة - انقر لإدخال رمز الإدارة'}
                >
                  {isAdmin ? (
                    <>
                      <Unlock className="w-3 h-3 text-emerald-400" />
                      <span>إدارة مفعّلة</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>وضع المشاهدة</span>
                    </>
                  )}
                </button>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white font-tajawal">
                قسم مجمع سيد الشهداء (عليه السلام) الخدمي
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">
                منظومة البطاقات الذكية والباجات القابلة للطباعة مع الباركود المربع الحديث
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Barcode Print Studio */}
            <button
              onClick={() => onOpenPrintStudio('minimal_qr')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 text-xs font-bold transition shadow-sm"
              title="طباعة واستعراض الباركودات المربعة الحديثة فقط"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">الباركود</span>
              <span>الحديث</span>
            </button>

            {/* Official Administrative Report Button */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold shadow-sm transition"
              title="عرض وطباعة التقرير الإداري الرسمي (A4)"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">التقرير</span>
              <span>الإداري</span>
            </button>

            {/* Professional Print Studio Button */}
            <button
              onClick={() => onOpenPrintStudio('vertical_badge')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 text-xs font-bold shadow-md hover:border-amber-500/50 transition"
              title="استوديو الطباعة الاحترافي للباجات والبطاقات الذكية"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">استوديو</span>
              <span>الطباعة</span>
            </button>

            {/* Add New Official Button */}
            <button
              onClick={onAddNew}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/20 active:scale-95 transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة مسؤول</span>
            </button>

            {/* Administrative Management Tools Menu */}
            <div className="relative group">
              <button
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition"
                title="أدوات إدارة النظام والنسخ الاحتياطي"
              >
                <Download className="w-4 h-4" />
              </button>

              <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 hidden group-hover:block transition z-50 text-xs font-medium">
                <button
                  onClick={onOpenScanner}
                  className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>محاكي فحص الباركود</span>
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                </button>

                <button
                  onClick={onExportCsv}
                  className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>تصدير كشف إكسل (CSV)</span>
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                </button>

                <button
                  onClick={onExportBackup}
                  className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>تصدير نسخة احتياطية (JSON)</span>
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={onOpenImport}
                  className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>استيراد نسخة احتياطية</span>
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                </button>

                <button
                  onClick={onOpenAuditLogs}
                  className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>سجل النشاط والعمليات (Audit)</span>
                  <ClipboardList className="w-3.5 h-3.5 text-purple-400" />
                </button>

                <div className="h-px bg-slate-800 my-1" />

                <button
                  onClick={onResetData}
                  className="w-full text-right px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-300 flex items-center justify-between"
                >
                  <span>استعادة بيانات المجمع الأصلية</span>
                  <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
