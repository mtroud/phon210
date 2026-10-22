import React, { useEffect, useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Radio, 
  Mail, 
  MapPin, 
  UserPlus, 
  Share2, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  QrCode, 
  Clock, 
  Droplet, 
  ArrowRight,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { Official, QrTargetMode } from '../types';
import { downloadVCard } from '../utils/vcardUtils';
import { generateQrDataUrl } from '../utils/qrUtils';
import { Emblem } from './Emblem';

interface SmartMobileViewProps {
  official: Official;
  onBack?: () => void;
  isStandalone?: boolean;
}

export const SmartMobileView: React.FC<SmartMobileViewProps> = ({
  official,
  onBack,
  isStandalone = false,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrMode, setQrMode] = useState<QrTargetMode>('direct_vcard');
  const [showQrExpanded, setShowQrExpanded] = useState<boolean>(false);

  useEffect(() => {
    generateQrDataUrl(official, qrMode, { width: 350, margin: 2, darkColor: '#000000' }).then(setQrCodeUrl);
  }, [official, qrMode]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${official.fullName} - ${official.title}`,
          text: `بطاقة المسؤول ${official.fullName} - مجمع سيد الشهداء الخدمي - العتبة الحسينية المقدسة`,
          url: url,
        });
      } catch {
        // user cancelled share
      }
    } else {
      handleCopy(url, 'رابط البطاقة');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start pb-16 px-3 sm:px-4 selection:bg-amber-500 selection:text-slate-950 font-cairo">
      {/* Top Navbar if in app preview */}
      <div className="w-full max-w-md pt-4 pb-2 flex items-center justify-between no-print">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للوحة الإدارة</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 text-xs text-amber-400/90 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>نظام التحقق الإلكتروني المعتمد</span>
          </div>
        )}

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition"
        >
          <Share2 className="w-4 h-4" />
          <span>مشاركة</span>
        </button>
      </div>

      {/* Main Digital Card Body */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden mt-2 relative">
        {/* Top Header Banner with Islamic Motifs */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/80 px-5 pt-7 pb-16 border-b border-amber-500/20 text-center">
          <div className="absolute inset-0 bg-islamic-pattern opacity-30 pointer-events-none" />
          
          <div className="relative flex flex-col items-center gap-2">
            <div className="flex items-center gap-2.5">
              <Emblem size="sm" variant="gold" />
              <div className="text-right">
                <h3 className="text-xs sm:text-sm font-bold text-amber-400 font-amiri tracking-wide">
                  العتبة الحسينية المقدسة
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-300/90 font-medium">
                  قسم مجمع سيد الشهداء (عليه السلام) الخدمي
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] mt-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>بطاقة تعريفية رقمية ذكية معتمدة</span>
            </div>
          </div>
        </div>

        {/* Profile Avatar overlapping header */}
        <div className="relative px-6 -mt-12 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-b from-amber-400 via-emerald-500 to-amber-600 shadow-xl shadow-amber-500/10">
              <img
                src={official.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                alt={official.fullName}
                className="w-full h-full object-cover rounded-xl bg-slate-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400';
                }}
              />
            </div>
            {official.badgeNumber && (
              <span className="absolute -bottom-2 right-1/2 translate-x-1/2 px-2.5 py-0.5 bg-slate-950 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold rounded-md shadow">
                {official.badgeNumber}
              </span>
            )}
          </div>

          {/* Name & Division Info */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-4 font-tajawal">
            {official.fullName}
          </h1>
          <p className="text-sm sm:text-base font-semibold text-amber-400 mt-0.5">
            {official.title}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 text-xs text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              {official.division}
            </span>
            {official.subUnit && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400">
                {official.subUnit}
              </span>
            )}
          </div>

          {/* Primary Quick Actions (Save Contact vCard) */}
          <div className="w-full grid grid-cols-2 gap-2 mt-5">
            <button
              onClick={() => downloadVCard(official)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>حفظ في الهاتف</span>
            </button>

            <button
              onClick={() => setShowQrExpanded(!showQrExpanded)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm active:scale-95 transition"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>{showQrExpanded ? 'إخفاء الباركود' : 'عرض الباركود'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible QR Box */}
        {showQrExpanded && (
          <div className="mt-4 mx-5 p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col items-center gap-3 animate-fadeIn">
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-slate-300 font-medium">رمز الاستجابة السريع (QR)</span>
              <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                <button
                  onClick={() => setQrMode('smart_profile')}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium transition ${
                    qrMode === 'smart_profile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  رابط البطاقة
                </button>
                <button
                  onClick={() => setQrMode('direct_vcard')}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium transition ${
                    qrMode === 'direct_vcard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  جهة اتصال مباشرة
                </button>
              </div>
            </div>

            {qrCodeUrl ? (
              <div className="p-2 bg-white rounded-xl shadow-inner">
                <img src={qrCodeUrl} alt="QR Code" className="w-44 h-44 object-contain" />
              </div>
            ) : (
              <div className="w-44 h-44 bg-slate-900 rounded-xl flex items-center justify-center text-xs text-slate-500">
                جاري التوليد...
              </div>
            )}

            <p className="text-[11px] text-center text-slate-400 leading-relaxed">
              {qrMode === 'smart_profile'
                ? 'امسح الكود بكاميرا الموبايل لفتح هذه الصفحة التفاعلية مباشرة'
                : 'امسح الكود بكاميرا الموبايل لإضافة جهة الاتصال مباشرة إلى سجل الهاتف'}
            </p>
          </div>
        )}

        {/* Detailed Contact List */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* SECTION: Mobile Phones (Multiple Phones Supported) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>أرقام الهواتف المحمولة</span>
                <span className="text-[10px] font-normal text-slate-400">({official.mobilePhones.length})</span>
              </h2>
            </div>

            <div className="space-y-2">
              {official.mobilePhones.map((phone, idx) => {
                const cleanNumber = phone.number.replace(/\D/g, '');
                const whatsappNumber = cleanNumber.startsWith('0') ? '964' + cleanNumber.slice(1) : cleanNumber;

                return (
                  <div
                    key={phone.id || idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 transition"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-amber-300">
                          {phone.label || `رقم هاتف ${idx + 1}`}
                        </span>
                        {phone.isPrimary && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                            رئيسي
                          </span>
                        )}
                      </div>
                      <span className="text-sm sm:text-base font-mono font-bold text-white tracking-wider mt-0.5">
                        {phone.number}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* WhatsApp Button */}
                      {phone.hasWhatsapp && (
                        <a
                          href={`https://wa.me/${whatsappNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          title="محادثة واتساب"
                          className="w-9 h-9 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      )}

                      {/* Direct Call Button */}
                      <a
                        href={`tel:${phone.number}`}
                        title="اتصال هاتفي"
                        className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow transition"
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      {/* Copy number */}
                      <button
                        onClick={() => handleCopy(phone.number, phone.label || phone.number)}
                        title="نسخ الرقم"
                        className="w-9 h-9 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                      >
                        {copiedText === (phone.label || phone.number) ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION: Internal Extensions (الهاتف الداخلي / البدالة) */}
          {official.internalExtensions && official.internalExtensions.length > 0 && (
            <div className="space-y-2 pt-1">
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>أرقام البدالة الداخلية للمجمع</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {official.internalExtensions.map((ext, idx) => (
                  <div
                    key={ext.id || idx}
                    className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">{ext.label}</p>
                      <p className="text-base font-mono font-black text-amber-300 mt-0.5 tracking-widest">
                        {ext.number}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(ext.number, `بدالة ${ext.label}`)}
                      className="p-2 rounded-lg bg-slate-750 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                      title="نسخ الرقم الداخلي"
                    >
                      {copiedText === `بدالة ${ext.label}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: Radio Device (جهاز النداء اللاسلكي) */}
          {official.radioDevice && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-850 to-slate-800 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[11px] text-emerald-400 font-semibold">جهاز النداء اللاسلكي (اللاسلكي الداخلي)</p>
                  <p className="text-sm font-bold text-white mt-0.5">{official.radioDevice}</p>
                </div>
              </div>
              <button
                onClick={() => handleCopy(official.radioDevice, 'جهاز النداء')}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition flex items-center gap-1"
              >
                {copiedText === 'جهاز النداء' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === 'جهاز النداء' ? 'تم النسخ' : 'نسخ الكود'}</span>
              </button>
            </div>
          )}

          {/* SECTION: Email */}
          {official.email && (
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 font-medium">البريد الإلكتروني الرسمي</p>
                  <p className="text-xs font-mono font-medium text-slate-200 truncate">{official.email}</p>
                </div>
              </div>
              <a
                href={`mailto:${official.email}`}
                className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold shrink-0 transition"
              >
                مراسلة
              </a>
            </div>
          )}

          {/* SECTION: Location, Shift & Blood type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            {official.dutyLocation && (
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block">موقع التواجد والمكتب:</span>
                  <span className="text-slate-200 font-medium">{official.dutyLocation}</span>
                </div>
              </div>
            )}

            {official.shift && (
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block">طبيعة الدوام / الوجبة:</span>
                  <span className="text-slate-200 font-medium">{official.shift}</span>
                </div>
              </div>
            )}

            {official.bloodType && (
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">فصيلة الدم للطوارئ:</span>
                  <span className="font-mono font-bold text-white text-xs">{official.bloodType}</span>
                </div>
              </div>
            )}
          </div>

          {official.notes && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 text-xs text-slate-400 leading-relaxed">
              <span className="text-slate-300 font-semibold block mb-0.5">ملاحظات ومهام:</span>
              {official.notes}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-950 px-5 py-4 border-t border-slate-800 text-center text-[10px] text-slate-500 flex flex-col items-center gap-1">
          <p className="font-amiri text-xs text-amber-500/80 font-bold">
            العتبة الحسينية المقدسة - الأمانة العامة
          </p>
          <p>مجمع سيد الشهداء (عليه السلام) الخدمي - كربلاء المقدسة</p>
          <p className="text-[9px] text-slate-600 font-mono">
            نظام البطاقات الذكية الموحد &bull; معتمد للخدمة والتشغيل
          </p>
        </div>
      </div>
    </div>
  );
};
