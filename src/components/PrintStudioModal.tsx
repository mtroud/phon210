import React, { useState } from 'react';
import { Official, CardTemplate, QrTargetMode, CardTheme, PaperType, DuplexLayout } from '../types';
import { BadgeRenderer } from './BadgeRenderer';
import { Emblem } from './Emblem';
import { 
  X, 
  Printer, 
  CheckSquare, 
  Square, 
  Layers, 
  FileText, 
  QrCode, 
  Smartphone,
  CheckCircle2, 
  AlertCircle, 
  Palette, 
  Scissors, 
  Maximize2,
  Copy,
  Download,
  Settings,
  Sparkles,
  Info
} from 'lucide-react';

interface PrintStudioModalProps {
  officials: Official[];
  isOpen: boolean;
  onClose: () => void;
  defaultQrMode?: QrTargetMode;
  initialTemplate?: CardTemplate;
}

export const PrintStudioModal: React.FC<PrintStudioModalProps> = ({
  officials,
  isOpen,
  onClose,
  defaultQrMode = 'direct_vcard',
  initialTemplate = 'minimal_qr',
}) => {
  if (!isOpen) return null;

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>(officials.map((o) => o.id));
  
  // Design & Print Configurations
  const [template, setTemplate] = useState<CardTemplate>(initialTemplate);
  const [theme, setTheme] = useState<CardTheme>('royal_emerald');
  const [side, setSide] = useState<'both' | 'front' | 'back'>('front');
  const [qrMode, setQrMode] = useState<QrTargetMode>(defaultQrMode);
  const [paperType, setPaperType] = useState<PaperType>('a4_sheet');
  const [showCropMarks, setShowCropMarks] = useState<boolean>(true);
  const [duplexLayout, setDuplexLayout] = useState<DuplexLayout>('side_by_side');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto font-cairo">
      <div className="relative w-full max-w-7xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-3 max-h-[96vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/80 border-b border-amber-500/25 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <Emblem size="md" variant="gold" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-tajawal tracking-tight">
                  استوديو الطباعة الاحترافي للمنظومة
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                  {selectedOfficials.length} من {officials.length} محددة للطباعة
                </span>
              </div>
              <p className="text-xs text-emerald-300 font-medium">
                قسم مجمع سيد الشهداء (عليه السلام) الخدمي &bull; العتبة الحسينية المقدسة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              disabled={selectedOfficials.length === 0}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 active:scale-95 transition disabled:opacity-50"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>إرسال للطابعة الآن (Print)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Master Toolbar & Setting Controls */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3 text-xs no-print shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* 1. Template Choice */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">النمط المطلوب:</span>
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                <button
                  onClick={() => setTemplate('minimal_qr')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                    template === 'minimal_qr'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>الباركود الحديث فقط (QR Only)</span>
                </button>

                <button
                  onClick={() => setTemplate('vertical_badge')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                    template === 'vertical_badge'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>باجة صدر رأسية (Badge)</span>
                </button>

                <button
                  onClick={() => setTemplate('horizontal_id')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                    template === 'horizontal_id'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>بطاقة ذكية أفقية (CR80)</span>
                </button>
              </div>
            </div>

            {/* 2. Theme / Ink-Saving Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">سمة الألوان والطباعة:</span>
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                <button
                  onClick={() => setTheme('royal_emerald')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    theme === 'royal_emerald' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="أخضر وذهبي حسيني فاخر"
                >
                  أخضر وذهبي فاخر
                </button>

                <button
                  onClick={() => setTheme('print_white')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    theme === 'print_white' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="خلفية بيضاء نقية لتوفير الحبر وجودة طباعة الليزر"
                >
                  الأبيض الاقتصادي (توفير الحبر)
                </button>

                <button
                  onClick={() => setTheme('obsidian_gold')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    theme === 'obsidian_gold' ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                  title="أسود ملكي وذهبي"
                >
                  الأسود والذهبي
                </button>
              </div>
            </div>

            {/* 3. Sides selection */}
            {template !== 'minimal_qr' && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">أوجه الطباعة:</span>
                <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                  <button
                    onClick={() => setSide('front')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      side === 'front' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    البطاقة الموحدة (الاسم + المعلومات + الباركود)
                  </button>
                  <button
                    onClick={() => setSide('both')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      side === 'both' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    الوجه والظهر معاً
                  </button>
                  <button
                    onClick={() => setSide('back')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      side === 'back' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    الظهر فقط
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sub-bar: Crop marks & QR destination */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80 text-[11px]">
            <div className="flex items-center gap-4">
              {/* Crop marks toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showCropMarks}
                  onChange={(e) => setShowCropMarks(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <Scissors className="w-3.5 h-3.5 text-amber-400" />
                <span>إظهار علامات القص الركنية (Crop Marks ✂️)</span>
              </label>

              {/* Selection summary */}
              <button
                onClick={handleToggleSelectAll}
                className="flex items-center gap-1 text-slate-300 hover:text-white font-semibold transition"
              >
                {selectedIds.length === officials.length ? (
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>تحديد الكل ({selectedIds.length} من {officials.length})</span>
              </button>
            </div>

            {/* QR encoding mode notice */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">تشفير الباركود:</span>
              <select
                value={qrMode}
                onChange={(e) => setQrMode(e.target.value as QrTargetMode)}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 font-bold focus:outline-none"
              >
                <option value="direct_vcard">📱 حفظ جهة اتصال مباشرة (vCard - أسرع قراءة وبدون إنترنت)</option>
                <option value="smart_profile">🌐 رابط البطاقة الذكية على الويب</option>
                <option value="quick_call">📞 اتصال فوري بالرقم الرئيسي</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selected List Chips */}
        <div className="px-6 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-print shrink-0 text-xs">
          <span className="text-slate-400 font-semibold shrink-0">المسؤولين:</span>
          {officials.map((o) => {
            const isSelected = selectedIds.includes(o.id);
            return (
              <button
                key={o.id}
                onClick={() => handleToggleOfficial(o.id)}
                className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-semibold whitespace-nowrap transition ${
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

        {/* Print Canvas & Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/60 print:bg-white print:p-0">
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
          ) : (
            <div className="space-y-8 print:space-y-4">
              {/* Preview scale badge (no-print) */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-300 no-print">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    معاينة الطباعة بحجم قياسي حقيقي (1:1 Scale) &bull; جاهز للطباعة على طابعات PVC أو ورق A4
                  </span>
                </div>
                <span className="font-mono text-amber-400 font-bold">
                  {selectedOfficials.length} بطاقة
                </span>
              </div>

              {/* Badges Grid (Styled for high-res output on A4 & PVC) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:grid print:grid-cols-2 print:gap-4 print:p-0">
                {selectedOfficials.map((official) => (
                  <div
                    key={official.id}
                    className="p-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center justify-center print:bg-white print:border-none print:p-2 print-break-inside-avoid relative"
                  >
                    <div className="w-full text-center text-xs text-slate-400 mb-2 font-mono no-print">
                      {official.badgeNumber} &bull; {official.fullName}
                    </div>

                    <BadgeRenderer
                      official={official}
                      template={template}
                      side={side}
                      qrMode={qrMode}
                      theme={theme}
                      showCropMarks={showCropMarks}
                    />

                    {/* Cut-line instruction for print */}
                    <div className="hidden print:block text-[8px] text-slate-500 mt-2 font-mono text-center">
                      ✂️ خط القص المعتمد - مجمع سيد الشهداء الخدمي ({official.badgeNumber})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>نظام طباعة معتمد لمسؤولي قسم مجمع سيد الشهداء الخدمي</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              إغلاق
            </button>

            <button
              onClick={handlePrint}
              disabled={selectedOfficials.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>طباعة البطاقات الآن ({selectedOfficials.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
