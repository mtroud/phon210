import React, { useState } from 'react';
import { Official, CardTemplate, QrTargetMode, PrintBatchMode } from '../types';
import { BadgeRenderer } from './BadgeRenderer';
import { 
  X, 
  Printer, 
  CheckSquare, 
  Square, 
  Layers, 
  FileText, 
  QrCode, 
  Smartphone,
  Phone,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Emblem } from './Emblem';

interface BatchPrintModalProps {
  officials: Official[];
  isOpen: boolean;
  onClose: () => void;
  defaultQrMode?: QrTargetMode;
  initialBatchMode?: PrintBatchMode;
}

export const BatchPrintModal: React.FC<BatchPrintModalProps> = ({
  officials,
  isOpen,
  onClose,
  defaultQrMode = 'direct_vcard',
  initialBatchMode = 'qr_stickers',
}) => {
  if (!isOpen) return null;

  // Selected officials (defaults to ALL officials)
  const [selectedIds, setSelectedIds] = useState<string[]>(officials.map((o) => o.id));
  const [batchMode, setBatchMode] = useState<PrintBatchMode>(initialBatchMode);
  const [template, setTemplate] = useState<CardTemplate>(initialBatchMode === 'vertical_badges' ? 'vertical_badge' : 'minimal_qr');
  const [side, setSide] = useState<'both' | 'front' | 'back'>('both');
  const [qrMode, setQrMode] = useState<QrTargetMode>(defaultQrMode);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === officials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(officials.map((o) => o.id));
    }
  };

  const handleToggleOfficial = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedOfficials = officials.filter((o) => selectedIds.includes(o.id));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-cairo">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-amber-950/80 border-b border-amber-500/20 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <Emblem size="sm" variant="gold" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-tajawal flex items-center gap-2">
                <span>طباعة جميع بطاقات المسؤولين دفعة واحدة</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                  ({selectedOfficials.length} بطاقة جاهزة للطباعة)
                </span>
              </h3>
              <p className="text-xs text-emerald-300">
                قسم مجمع سيد الشهداء (عليه السلام) الخدمي - العتبة الحسينية المقدسة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Print Settings Toolbar */}
        <div className="p-4 bg-slate-950/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs no-print shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Print Layout Mode */}
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => {
                  setBatchMode('qr_stickers');
                  setTemplate('minimal_qr');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  batchMode === 'qr_stickers' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>الباركود الحديث فقط (QR)</span>
              </button>

              <button
                onClick={() => {
                  setBatchMode('vertical_badges');
                  setTemplate('vertical_badge');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  batchMode === 'vertical_badges' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>باجات صدر (A4)</span>
              </button>

              <button
                onClick={() => {
                  setBatchMode('horizontal_cards');
                  setTemplate('horizontal_id');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  batchMode === 'horizontal_cards' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>بطاقات أفقية (CR80)</span>
              </button>

              <button
                onClick={() => setBatchMode('quick_directory_sheet')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  batchMode === 'quick_directory_sheet' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>دليل السيطرة</span>
              </button>
            </div>

            {/* Side selection if badges */}
            {batchMode !== 'quick_directory_sheet' && (
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                <button
                  onClick={() => setSide('both')}
                  className={`px-2.5 py-1 rounded-lg ${side === 'both' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  الوجه والظهر
                </button>
                <button
                  onClick={() => setSide('front')}
                  className={`px-2.5 py-1 rounded-lg ${side === 'front' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  الوجه فقط
                </button>
                <button
                  onClick={() => setSide('back')}
                  className={`px-2.5 py-1 rounded-lg ${side === 'back' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  الظهر (الباركود)
                </button>
              </div>
            )}

            {/* QR Mode Switcher with Clarity Notice */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">نوع الباركود:</span>
              <select
                value={qrMode}
                onChange={(e) => setQrMode(e.target.value as QrTargetMode)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold focus:outline-none"
              >
                <option value="direct_vcard">📱 حفظ مباشر في الهاتف (vCard - أسرع قراءة وبدون نت)</option>
                <option value="smart_profile">🌐 صفحة البطاقة الرقمية على الويب</option>
                <option value="quick_call">📞 اتصال فوري بالرقم الرئيسي</option>
              </select>
            </div>
          </div>

          {/* Big Print Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              {selectedIds.length === officials.length ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>تحديد الكل ({selectedIds.length})</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={selectedOfficials.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 active:scale-95 transition disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>طباعة جميع البطاقات المحددة ({selectedOfficials.length})</span>
            </button>
          </div>
        </div>

        {/* Selected List Chips (clickable to toggle individual officials) */}
        <div className="px-6 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-print shrink-0 text-xs">
          <span className="text-slate-400 font-semibold shrink-0">المسؤولين:</span>
          {officials.map((o) => {
            const isSelected = selectedIds.includes(o.id);
            return (
              <button
                key={o.id}
                onClick={() => handleToggleOfficial(o.id)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/40 border-slate-800 text-slate-500 line-through opacity-60'
                }`}
              >
                {o.fullName}
              </button>
            );
          })}
        </div>

        {/* Print Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/40">
          {selectedOfficials.length === 0 ? (
            <div className="py-24 text-center text-slate-400 space-y-2">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-sm font-bold text-white">يرجى تحديد مسؤول واحد على الأقل للطباعة</p>
              <button
                onClick={handleToggleSelectAll}
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                تحديد جميع المسؤولين
              </button>
            </div>
          ) : batchMode === 'quick_directory_sheet' ? (
            /* MODE 3: QUICK DIRECTORY SHEET FOR CONTROL ROOM / WALL HANGING */
            <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 print:shadow-none print:border-none print-break-inside-avoid">
              <div className="text-center border-b-2 border-amber-500 pb-4 mb-4">
                <h2 className="text-xl font-bold font-amiri text-amber-800">
                  العتبة الحسينية المقدسة - قسم مجمع سيد الشهداء (عليه السلام) الخدمي
                </h2>
                <h3 className="text-sm font-bold text-emerald-800 mt-1 font-tajawal">
                  دليل الاتصال السريع وباركودات الاستعراض الفوري لمسؤولي الشعب والوحدات
                </h3>
                <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                  امسح باركود أي مسؤول بكاميرا الهاتف لحفظ رقمه وبياناته مباشرة في سجل الأسماء
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedOfficials.map((official) => (
                  <div
                    key={official.id}
                    className="p-3 rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-between gap-3 print:border-slate-400 print-break-inside-avoid"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={official.avatarUrl}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-amber-500 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-950 font-tajawal">
                          {official.fullName}
                        </h4>
                        <p className="text-[10px] font-semibold text-amber-800">{official.title}</p>
                        <p className="text-[10px] text-emerald-700">{official.division}</p>
                        <div className="text-[10px] font-mono text-slate-700 mt-1 space-y-0.5">
                          {official.mobilePhones.map((p, i) => (
                            <span key={i} className="block dir-ltr font-bold text-slate-900">
                              {p.label}: {p.number}
                            </span>
                          ))}
                          {official.radioDevice && (
                            <span className="block text-emerald-900 font-semibold font-sans">
                              اللاسلكي: {official.radioDevice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-center">
                      <div className="p-1 bg-white border border-slate-300 rounded-lg shadow-sm">
                        <BadgeRenderer
                          official={official}
                          template="vertical_badge"
                          side="back"
                          qrMode={qrMode}
                        />
                      </div>
                      <span className="text-[8px] font-bold text-slate-500 block mt-1 font-mono">
                        {official.badgeNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-3 border-t border-slate-300 text-center text-[10px] text-slate-500">
                منظومة البطاقات الذكية المعتمدة &bull; قسم مجمع سيد الشهداء الخدمي &bull; كربلاء المقدسة
              </div>
            </div>
          ) : batchMode === 'qr_stickers' ? (
            /* MODE: MODERN SQUARE BARCODES ONLY SHEET */
            <div className="space-y-6">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 flex items-center justify-between no-print">
                <span className="flex items-center gap-1.5 font-bold">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>وضع طباعة الباركودات الحديثة فقط (بطاقات وملصقات QR للمسؤولين)</span>
                </span>
                <span className="text-[11px] text-slate-300">
                  مثالي للصق على باجات الموظفين أو وضعها في المكاتب
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 print:grid print:grid-cols-2 print:gap-4">
                {selectedOfficials.map((official) => (
                  <div
                    key={official.id}
                    className="p-3 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center print:bg-white print:border-2 print:border-dashed print:border-slate-300 print:mb-4 print:p-2 print-break-inside-avoid"
                  >
                    <BadgeRenderer
                      official={official}
                      template="minimal_qr"
                      side="back"
                      qrMode={qrMode}
                    />
                    <div className="hidden print:block text-[8px] text-slate-500 mt-1 font-mono text-center">
                      ✂️ خط القص - مجمع سيد الشهداء ({official.fullName} - {official.badgeNumber})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* MODES 1 & 2: A4 SHEET WITH CARDS & CUTTING MARKS */
            <div className="space-y-8 print:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:space-y-6">
                {selectedOfficials.map((official) => (
                  <div
                    key={official.id}
                    className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center print:bg-white print:border-2 print:border-dashed print:border-slate-300 print:mb-6 print:p-2 print-break-inside-avoid"
                  >
                    <div className="w-full text-center text-xs text-slate-400 mb-2 font-mono no-print">
                      {official.badgeNumber} &bull; {official.fullName} &bull; {official.division}
                    </div>

                    <BadgeRenderer
                      official={official}
                      template={template}
                      side={side}
                      qrMode={qrMode}
                    />

                    {/* Cutting guide line indicator for printing */}
                    <div className="hidden print:block text-[8px] text-slate-400 mt-2 font-mono">
                      ✂️ خط القص المعتمد - مجمع سيد الشهداء الخدمي ({official.badgeNumber})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              جاهز للطباعة على طابعة A4 عادية أو طابعة بطاقات PVC البلاستيكية
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition"
            >
              إلغاء
            </button>

            <button
              onClick={handlePrint}
              disabled={selectedOfficials.length === 0}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>إرسال للطابعة الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
