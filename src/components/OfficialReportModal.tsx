import React, { useState } from 'react';
import { Official } from '../types';
import { Emblem } from './Emblem';
import { Printer, X, Download, Filter, Building2, Phone, Radio } from 'lucide-react';
import { exportOfficialsCsv } from '../utils/storage';

interface OfficialReportModalProps {
  officials: Official[];
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  officials,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [filterDivision, setFilterDivision] = useState<string>('all');

  const divisions = Array.from(new Set(officials.map((o) => o.division))).filter(Boolean);

  const displayed = officials.filter((o) => {
    if (filterDivision === 'all') return true;
    return o.division === filterDivision;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-cairo">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[95vh] flex flex-col">
        {/* Modal Controls (No print) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs no-print shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white font-tajawal">
              التقرير الإداري الرسمي المعتمد لمسؤولي المجمع
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono font-bold border border-amber-500/30">
              {displayed.length} مسؤول
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Division Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none"
              >
                <option value="all">جميع الشعب ({officials.length})</option>
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => exportOfficialsCsv(displayed)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>تصدير إكسل (CSV)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>طباعة التقرير (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper (Simulates official A4 shrine document) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/70 print:bg-white print:p-0">
          <div className="max-w-4xl mx-auto bg-white text-slate-950 p-6 sm:p-10 rounded-2xl shadow-xl print:shadow-none print:rounded-none print:p-4 border border-slate-200 print:border-none">
            {/* Document Header */}
            <div className="border-b-2 border-emerald-900 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <h2 className="text-sm sm:text-base font-extrabold text-emerald-900 font-amiri">
                    العتبة الحسينية المقدسة
                  </h2>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 font-tajawal mt-0.5">
                    الأمانة العامة &bull; قسم مجمع سيد الشهداء (عليه السلام) الخدمي
                  </h3>
                  <p className="text-[10px] text-slate-600 mt-0.5 font-medium">
                    منظومة البطاقات الذكية والاتصال الإداري السريع
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <Emblem size="md" variant="light" />
                </div>

                <div className="text-left text-[11px] font-mono text-slate-700 space-y-0.5">
                  <div>التاريخ: {new Date().toLocaleDateString('ar-IQ')}</div>
                  <div>العدد: ق.م.ش / {Math.floor(1000 + Math.random() * 9000)}</div>
                  <div>المدينة: كربلاء المقدسة</div>
                </div>
              </div>

              <div className="mt-3 text-center py-1.5 bg-emerald-900/10 rounded-lg border border-emerald-900/30">
                <h1 className="text-sm sm:text-base font-black text-emerald-950 font-tajawal">
                  كشف مسؤولي الشعب والوحدات المعتمد - مجمع سيد الشهداء الخدمي
                </h1>
              </div>
            </div>

            {/* Document Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] border-collapse border border-slate-300">
                <thead className="bg-emerald-900 text-white font-bold">
                  <tr>
                    <th className="border border-slate-400 py-2 px-2 text-center w-10">ت</th>
                    <th className="border border-slate-400 py-2 px-2.5">رقم الباجة</th>
                    <th className="border border-slate-400 py-2 px-3">اسم المسؤول الكامل</th>
                    <th className="border border-slate-400 py-2 px-2.5">المسمى الوظيفي</th>
                    <th className="border border-slate-400 py-2 px-2.5">الشعبة التابعة</th>
                    <th className="border border-slate-400 py-2 px-3">الهاتف المحمول</th>
                    <th className="border border-slate-400 py-2 px-2">البدالة</th>
                    <th className="border border-slate-400 py-2 px-2">النداء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {displayed.map((official, idx) => (
                    <tr key={official.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="border border-slate-300 py-2 px-2 text-center font-bold text-slate-700">
                        {idx + 1}
                      </td>
                      <td className="border border-slate-300 py-2 px-2.5 font-mono font-bold text-emerald-900 text-[10px]">
                        {official.badgeNumber}
                      </td>
                      <td className="border border-slate-300 py-2 px-3 font-bold text-slate-900">
                        {official.fullName}
                      </td>
                      <td className="border border-slate-300 py-2 px-2.5 font-semibold text-slate-700 text-[10px]">
                        {official.title}
                      </td>
                      <td className="border border-slate-300 py-2 px-2.5 text-slate-800 text-[10px]">
                        {official.division}
                      </td>
                      <td className="border border-slate-300 py-2 px-3 font-mono dir-ltr text-left font-bold text-slate-900 text-[10px]">
                        {official.mobilePhones.map((p) => p.number).join(' | ')}
                      </td>
                      <td className="border border-slate-300 py-2 px-2 font-mono font-bold text-emerald-900 text-center">
                        {official.internalExtensions?.map((e) => e.number).join(', ') || '-'}
                      </td>
                      <td className="border border-slate-300 py-2 px-2 text-slate-700 text-[10px] text-center">
                        {official.radioDevice || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Document Footer Signatures */}
            <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-8">
                <span className="font-bold text-slate-800 block">إعداد ومتابعة السيطرة</span>
                <span className="text-[10px] text-slate-500 block">التوقيع: .....................</span>
              </div>
              <div className="space-y-8">
                <span className="font-bold text-slate-800 block">معاون رئيس القسم</span>
                <span className="text-[10px] text-slate-500 block">التوقيع: .....................</span>
              </div>
              <div className="space-y-8">
                <span className="font-bold text-slate-800 block">مصادقة رئيس قسم المجمع</span>
                <span className="text-[10px] text-slate-500 block">الختم والتوقيع الرسمي</span>
              </div>
            </div>

            {/* Bottom stamp notice */}
            <div className="mt-6 pt-3 border-t border-dashed border-slate-300 text-center text-[9px] text-slate-500 font-mono">
              وثيقة إدارية رسمية معتمدة &bull; العتبة الحسينية المقدسة &bull; قسم مجمع سيد الشهداء الخدمي &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
