import React, { useState } from 'react';
import { Official } from '../types';
import { validateImportedOfficials, addAuditLog } from '../utils/storage';
import { Upload, FileText, CheckCircle2, AlertTriangle, AlertCircle, X, Users } from 'lucide-react';

interface ImportBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedList: Official[], mode: 'replace' | 'merge') => void;
}

export const ImportBackupModal: React.FC<ImportBackupModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  if (!isOpen) return null;

  const [fileContent, setFileContent] = useState<unknown>(null);
  const [fileName, setFileName] = useState<string>('');
  const [parsedOfficials, setParsedOfficials] = useState<Official[]>([]);
  const [validationError, setValidationError] = useState<string>('');
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setValidationError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const result = validateImportedOfficials(parsed);

        if (!result.valid || !result.list) {
          setValidationError(result.error || 'الملف لا يحتوي على بيانات صالحة');
          setParsedOfficials([]);
        } else {
          setParsedOfficials(result.list);
          setFileContent(result.list);
        }
      } catch (err) {
        setValidationError('فشل في قراءة ملف JSON. تأكد من أن الملف سليم بصيغة JSON.');
        setParsedOfficials([]);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (parsedOfficials.length === 0) return;

    addAuditLog({
      action: 'import',
      details: `استيراد نسخة احتياطية تتضمن (${parsedOfficials.length}) مسؤول بنمط (${importMode === 'replace' ? 'استبدال كامل' : 'دمج سجلات'})`,
      performedBy: 'مسؤول النظام',
    });

    onImportSuccess(parsedOfficials, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-cairo">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-tajawal">
                استيراد واستعادة قاعدة البيانات
              </h3>
              <p className="text-xs text-slate-400">
                استرجاع بيانات مسؤولي مجمع سيد الشهداء من ملف JSON
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload box */}
        <div className="mt-4 space-y-4">
          <label className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-950/50">
            <FileText className="w-10 h-10 text-amber-400 mb-2" />
            <span className="text-xs font-bold text-white block">
              {fileName ? fileName : 'انقر لاختيار ملف نسخة احتياطية (.json)'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              يقبل الملفات المصدرة مسبقاً من هذا النظام
            </span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Validation Feedback */}
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {parsedOfficials.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>الملف جاهز وصالح للاستيراد</span>
                </span>
                <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-700">
                  {parsedOfficials.length} مسؤول
                </span>
              </div>

              {/* Import mode options */}
              <div className="pt-2 border-t border-slate-700/60 space-y-2 text-xs">
                <label className="text-slate-300 font-semibold block">
                  طريقة معالجة السجلات:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImportMode('replace')}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      importMode === 'replace'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">استبدال كامل</div>
                    <div className="text-[10px] opacity-75 mt-0.5">مسح البيانات الحالية وتثبيت النسخة</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportMode('merge')}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      importMode === 'merge'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">دمج مع الحالي</div>
                    <div className="text-[10px] opacity-75 mt-0.5">إضافة السجلات الجديدة فقط</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            إلغاء
          </button>
          <button
            type="button"
            disabled={parsedOfficials.length === 0}
            onClick={handleExecuteImport}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition"
          >
            استيراد ({parsedOfficials.length}) مسؤول الآن
          </button>
        </div>
      </div>
    </div>
  );
};
