import React, { useEffect, useState } from 'react';
import { Official } from '../types';
import { generateQrDataUrl } from '../utils/qrUtils';
import { downloadVCard } from '../utils/vcardUtils';
import { 
  Phone, 
  Radio, 
  Mail, 
  Building2, 
  Smartphone, 
  Printer, 
  Edit3, 
  Trash2, 
  UserPlus, 
  QrCode,
  MapPin,
  Clock
} from 'lucide-react';

interface OfficialCardProps {
  official: Official;
  isAdmin?: boolean;
  onOpenMobileView: (official: Official) => void;
  onOpenPrintModal: (official: Official) => void;
  onEdit: (official: Official) => void;
  onDelete: (official: Official) => void;
  onRequireAdmin?: () => void;
}

export const OfficialCard: React.FC<OfficialCardProps> = ({
  official,
  isAdmin = true,
  onOpenMobileView,
  onOpenPrintModal,
  onEdit,
  onDelete,
  onRequireAdmin,
}) => {
  const [miniQrUrl, setMiniQrUrl] = useState<string>('');

  useEffect(() => {
    generateQrDataUrl(official, 'direct_vcard', { width: 160, margin: 2, darkColor: '#000000' }).then(setMiniQrUrl);
  }, [official]);

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-amber-500/40 shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 transition duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top Banner & Header */}
      <div className="p-4 sm:p-5 relative">
        <div className="flex items-start justify-between gap-3">
          {/* Avatar & Badge number */}
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <img
                src={official.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                alt={official.fullName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-400/80 bg-slate-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400';
                }}
              />
              <span className="absolute -bottom-1.5 right-1/2 translate-x-1/2 px-1.5 py-0.2 bg-slate-950 border border-amber-500/50 text-amber-300 text-[9px] font-mono font-bold rounded">
                {official.badgeNumber}
              </span>
            </div>

            {/* Name, Title, Division */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-white font-tajawal truncate group-hover:text-amber-300 transition">
                {official.fullName}
              </h3>
              <p className="text-xs font-semibold text-amber-400 truncate mt-0.5">
                {official.title}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{official.division}</span>
              </div>
            </div>
          </div>

          {/* Quick Miniature QR code click-to-preview */}
          <button
            onClick={() => onOpenPrintModal(official)}
            className="p-1 rounded-xl bg-white border border-amber-400/80 shadow shrink-0 hover:scale-105 transition"
            title="انقر لتكبير وطباعة الباركود والباجة"
          >
            {miniQrUrl ? (
              <img src={miniQrUrl} alt="QR" className="w-10 h-10 object-contain" />
            ) : (
              <div className="w-10 h-10 bg-slate-200 flex items-center justify-center text-[8px] text-slate-600">...</div>
            )}
          </button>
        </div>

        {/* Contact Specs Box */}
        <div className="mt-4 space-y-2 bg-slate-950/60 rounded-2xl p-3 border border-slate-800/80 text-xs">
          {/* Multiple Mobile Phones */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-amber-400" />
                <span>أرقام الهواتف المحمولة:</span>
              </span>
              <span className="text-amber-400 font-mono">({official.mobilePhones.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {official.mobilePhones.map((phone, i) => (
                <a
                  key={phone.id || i}
                  href={`tel:${phone.number}`}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-[10px] text-slate-200 font-mono flex items-center gap-1 transition"
                  title={`${phone.label} - انقر للاتصال`}
                >
                  <span className="text-amber-300 font-sans text-[9px]">{phone.label}:</span>
                  <span className="font-bold">{phone.number}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Internal Extension (البدالة) */}
          {official.internalExtensions && official.internalExtensions.length > 0 && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-emerald-400" />
                <span>الهاتف الداخلي (البدالة):</span>
              </span>
              <div className="flex gap-1.5">
                {official.internalExtensions.map((ext, idx) => (
                  <span
                    key={ext.id || idx}
                    className="font-mono font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[10px]"
                    title={ext.label}
                  >
                    {ext.number}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Radio Device (جهاز النداء) */}
          {official.radioDevice && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400" />
                <span>جهاز النداء:</span>
              </span>
              <span className="font-semibold text-emerald-300 text-[10px] truncate max-w-[170px]">
                {official.radioDevice}
              </span>
            </div>
          )}

          {/* Email */}
          {official.email && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Mail className="w-3 h-3 text-blue-400" />
                <span>البريد:</span>
              </span>
              <span className="font-mono text-slate-300 truncate max-w-[170px] dir-ltr">
                {official.email}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800/90 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1">
          {/* Mobile Smart View button */}
          <button
            onClick={() => onOpenMobileView(official)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition"
            title="معاينة بطاقة الموبايل التفاعلية عند مسح الكود"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">معاينة</span>
            <span>الموبايل</span>
          </button>

          {/* Print badge button */}
          <button
            onClick={() => onOpenPrintModal(official)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
            title="طباعة باجة الصدر أو البطاقة الذكية"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>طباعة الباجة</span>
          </button>
        </div>

        {/* Edit, Export vCard, Delete */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => downloadVCard(official)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="تحميل جهة الاتصال (vCard)"
          >
            <UserPlus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (!isAdmin && onRequireAdmin) {
                onRequireAdmin();
              } else {
                onEdit(official);
              }
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition"
            title={isAdmin ? 'تعديل بيانات المسؤول' : 'يلزم تسجيل دخول الإدارة للتعديل'}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (!isAdmin && onRequireAdmin) {
                onRequireAdmin();
              } else {
                onDelete(official);
              }
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
            title={isAdmin ? 'حذف المسؤول' : 'يلزم تسجيل دخول الإدارة للحذف'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
