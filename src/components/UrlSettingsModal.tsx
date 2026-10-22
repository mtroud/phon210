import React, { useState } from 'react';
import { X, Globe, Check, ExternalLink, Copy, AlertCircle, RefreshCw } from 'lucide-react';
import { DEFAULT_PUBLIC_URL, getCustomBaseUrl, setCustomBaseUrl } from '../utils/qrUtils';

interface UrlSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const UrlSettingsModal: React.FC<UrlSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  if (!isOpen) return null;

  const [baseUrlInput, setBaseUrlInput] = useState(getCustomBaseUrl());
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    setCustomBaseUrl(baseUrlInput);
    onSaved();
    onClose();
  };

  const handleReset = () => {
    setBaseUrlInput(DEFAULT_PUBLIC_URL);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(baseUrlInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-cairo">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-amber-950/70 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-tajawal">
                إعدادات رابط الباركود للموبايل
              </h3>
              <p className="text-xs text-emerald-300">
                حل مشكلة فتح الرابط من الهواتف الأخرى والشبكات الخارجية
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

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Explanation Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-slate-200 leading-relaxed">
              <strong className="text-amber-300 block font-bold">لماذا ظهر "خطأ في النت ورك" سابقاً؟</strong>
              <p className="text-[11px] text-slate-300">
                رابط التطوير الداخلي (<code className="text-amber-300 bg-slate-950 px-1 rounded">ais-dev-...</code>) خاص بك ومحمي بواسطة حساب جوجل للمطور. الهواتف الأخرى لا تمتلك صلاحية الدخول إليه فيظهر لها خطأ في الشبكة.
              </p>
              <p className="text-[11px] text-emerald-300 font-semibold">
                تم ضبط النظام الآن ليرسل دائماً الرابط العام المشترك المتاح لكافة الهواتف، مع دعم وضع الاتصال المباشر (vCard) الذي يعمل حتى بدون إنترنت!
              </p>
            </div>
          </div>

          {/* Public Base URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              رابط النظام العام المستخدم في تشفير الباركود:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
                className="flex-1 text-xs font-mono px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 focus:border-amber-400 focus:outline-none dir-ltr"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition"
                title="نسخ الرابط"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              يمكنك كتابة أي دومين خاص بك إذا قمت بنشر التطبيق على سيرفر خاص بالعتبة الحسينية المقدسة.
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>استعادة الرابط العام الافتراضي</span>
            </button>

            <a
              href={baseUrlInput}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>فتح الرابط للتأكد</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Best Practice Offline Card Notice */}
          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <span className="text-amber-400 font-bold block">💡 الحل الأضمن بنسبة 100% داخل أروقة المجمع:</span>
            <p className="leading-relaxed">
              استخدم نمط <strong className="text-white">"📱 حفظ مباشر بالهاتف (vCard)"</strong> في الباجة؛ فهذا النمط يخزن أرقام المسؤول والبدالة واللاسلكي داخل الباركود نفسه، ولا يحتاج إلى إنترنت إطلاقاً ولا يتأثر بضعف شبكة الهاتف داخل المجمع أو السرداب.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
