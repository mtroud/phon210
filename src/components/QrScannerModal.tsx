import React, { useState } from 'react';
import { Official } from '../types';
import { X, QrCode, Smartphone, Sparkles, Search, CheckCircle2, ArrowLeft } from 'lucide-react';

interface QrScannerModalProps {
  officials: Official[];
  isOpen: boolean;
  onClose: () => void;
  onSelectOfficial: (official: Official) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  officials,
  isOpen,
  onClose,
  onSelectOfficial,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [testIdInput, setTestIdInput] = useState('');

  const filteredOfficials = officials.filter((o) =>
    o.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManualLookup = () => {
    const found = officials.find(
      (o) =>
        o.id === testIdInput.trim() ||
        o.badgeNumber.toLowerCase() === testIdInput.trim().toLowerCase()
    );
    if (found) {
      onSelectOfficial(found);
      onClose();
    } else {
      alert('لم يتم العثور على مسؤول بهذا الرمز أو المعرف');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-cairo">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-amber-950/70 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-tajawal">
                محاكي وماسح الباركود الذكي
              </h3>
              <p className="text-xs text-emerald-300">
                تجربة استعراض البيانات فور مسح الكود بهاتف محمول
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

        <div className="p-5 sm:p-6 space-y-5">
          {/* Visual Scanner Animation Graphic */}
          <div className="relative rounded-2xl bg-slate-950 border-2 border-emerald-500/40 p-6 flex flex-col items-center justify-center overflow-hidden">
            {/* Animated Laser Scanning Line */}
            <div className="w-40 h-40 border-2 border-dashed border-amber-400/70 rounded-2xl relative flex items-center justify-center bg-slate-900/50">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
              
              <QrCode className="w-20 h-20 text-slate-500 opacity-60" />
              
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce shadow-lg shadow-emerald-400/50" />
            </div>

            <p className="text-xs text-slate-300 font-semibold mt-3 text-center">
              عند توجيه كاميرا هاتف أي شخص للباجة، تفتح شاشة البطاقة فوراً
            </p>
            <p className="text-[11px] text-slate-400 text-center mt-1">
              اختر أحد المسؤولين بالأسفل لمحاكاة تجربة المسح بالهاتف:
            </p>
          </div>

          {/* Quick Filter Search */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو الشعبة لاختبار المسح..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pr-9 pl-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Officials test list */}
            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
              {filteredOfficials.map((official) => (
                <div
                  key={official.id}
                  onClick={() => {
                    onSelectOfficial(official);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 flex items-center justify-between cursor-pointer transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={official.avatarUrl}
                      alt={official.fullName}
                      className="w-9 h-9 rounded-lg object-cover border border-amber-500/40"
                    />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                        {official.fullName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {official.title} &bull; {official.division}
                      </p>
                    </div>
                  </div>

                  <button className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 group-hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/20 transition">
                    <span>محاكاة المسح</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Code Entry */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1.5">أو إدخال رقم الباجة يدوياً:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="مثال: SSH-101 أو SSH-205"
                value={testIdInput}
                onChange={(e) => setTestIdInput(e.target.value)}
                className="flex-1 text-xs font-mono font-bold px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleManualLookup}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                فتح البطاقة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
