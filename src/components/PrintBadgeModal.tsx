import React, { useState } from 'react';
import { Official, CardTemplate, QrTargetMode } from '../types';
import { BadgeRenderer } from './BadgeRenderer';
import { 
  X, 
  Printer, 
  Smartphone, 
  Layers, 
  QrCode, 
  Eye, 
  Download, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { downloadVCard } from '../utils/vcardUtils';

interface PrintBadgeModalProps {
  official: Official;
  isOpen: boolean;
  onClose: () => void;
  onOpenMobileView: (official: Official) => void;
}

export const PrintBadgeModal: React.FC<PrintBadgeModalProps> = ({
  official,
  isOpen,
  onClose,
  onOpenMobileView,
}) => {
  if (!isOpen) return null;

  const [template, setTemplate] = useState<CardTemplate>('vertical_badge');
  const [side, setSide] = useState<'both' | 'front' | 'back'>('both');
  const [qrMode, setQrMode] = useState<QrTargetMode>('direct_vcard');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-cairo">
      {/* Container - hide everything else during print via CSS */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-amber-950/70 border-b border-amber-500/20 flex items-center justify-between no-print">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-tajawal flex items-center gap-2">
              <span>استعراض وطباعة بطاقة:</span>
              <span className="text-amber-400">{official.fullName}</span>
            </h3>
            <p className="text-xs text-emerald-300">
              {official.title} &bull; {official.division}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Settings Controls (no-print) */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
          {/* Template Selection */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">نوع البطاقة:</span>
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => setTemplate('minimal_qr')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  template === 'minimal_qr'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                الباركود الحديث فقط (QR)
              </button>
              <button
                onClick={() => setTemplate('vertical_badge')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  template === 'vertical_badge'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                باجة صدر رأسية (Badge)
              </button>
              <button
                onClick={() => setTemplate('horizontal_id')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  template === 'horizontal_id'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                بطاقة أفقية (Smart Card)
              </button>
            </div>
          </div>

          {/* Sides Selection */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">أوجه العرض:</span>
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => setSide('both')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  side === 'both' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                الوجه والظهر
              </button>
              <button
                onClick={() => setSide('front')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  side === 'front' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                الوجه فقط
              </button>
              <button
                onClick={() => setSide('back')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  side === 'back' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                الظهر (الباركود)
              </button>
            </div>
          </div>

          {/* QR Destination Target */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">وجهة الباركود:</span>
            <select
              value={qrMode}
              onChange={(e) => setQrMode(e.target.value as QrTargetMode)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-semibold focus:outline-none"
            >
              <option value="direct_vcard">📱 حفظ مباشر بالهاتف (vCard - أسرع قراءة وبدون نت)</option>
              <option value="smart_profile">🌐 صفحة البطاقة الإلكترونية الذكية</option>
              <option value="quick_call">📞 اتصال فوري بالرقم الرئيسي</option>
            </select>
          </div>
        </div>

        {/* Badge Preview Area */}
        <div className="p-6 sm:p-10 flex flex-col items-center justify-center bg-slate-900/60 min-h-[460px] overflow-auto">
          <div className="print-container">
            <BadgeRenderer
              official={official}
              template={template}
              side={side}
              qrMode={qrMode}
            />
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenMobileView(official)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>تجربة مسح الموبايل فوراً</span>
            </button>

            <button
              onClick={() => downloadVCard(official)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs sm:text-sm font-medium transition"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>تحميل ملف الاتصال (vCard)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition"
            >
              إغلاق
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>طباعة البطاقة بجودة عالية</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
