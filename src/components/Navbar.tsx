import React from 'react';
import { Emblem } from './Emblem';
import { 
  Plus, 
  Printer, 
  QrCode, 
  Download, 
  RefreshCw, 
  Smartphone,
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react';
import { CardTemplate } from '../types';

interface NavbarProps {
  onAddNew: () => void;
  onOpenBatchPrint: () => void;
  onOpenPrintStudio: (template?: CardTemplate) => void;
  onOpenScanner: () => void;
  onExportBackup: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAddNew,
  onOpenBatchPrint,
  onOpenPrintStudio,
  onOpenScanner,
  onExportBackup,
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
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  منظومة معتمدة
                </span>
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
              <span className="hidden md:inline">الباركود</span>
              <span>الحديث</span>
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

            {/* Quick Tools & Database Backup */}
            <div className="relative group">
              <button
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition"
                title="أدوات ومحاكي المسح والنسخ الاحتياطي"
              >
                <Download className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 hidden group-hover:block transition z-50 text-xs font-medium">
                <button
                  onClick={onOpenScanner}
                  className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>محاكي فحص الباركود</span>
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                </button>
                <button
                  onClick={onExportBackup}
                  className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>تصدير نسخة احتياطية</span>
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('هل تريد إعادة تحميل البيانات الافتراضية المعتمدة للمجمع؟')) {
                      onResetData();
                    }
                  }}
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
