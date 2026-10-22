import React, { useEffect, useState } from 'react';
import { Official, CardTemplate, QrTargetMode, CardTheme } from '../types';
import { generateQrDataUrl } from '../utils/qrUtils';
import { Emblem } from './Emblem';
import { Phone, Radio, Mail, Building2, Shield, QrCode, Cpu, CheckCircle2, Droplet, MapPin } from 'lucide-react';

interface BadgeRendererProps {
  official: Official;
  template?: CardTemplate;
  side?: 'front' | 'back' | 'both';
  qrMode?: QrTargetMode;
  theme?: CardTheme;
  showCropMarks?: boolean;
}

export const BadgeRenderer: React.FC<BadgeRendererProps> = ({
  official,
  template = 'vertical_badge',
  side = 'front', // Default to front because it now contains all info + modern square barcode!
  qrMode = 'direct_vcard',
  theme = 'royal_emerald',
  showCropMarks = true,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate maximum contrast QR code (pure black on pure white)
    generateQrDataUrl(official, qrMode, {
      width: 380,
      margin: 2,
      darkColor: '#000000',
      lightColor: '#ffffff',
      errorCorrectionLevel: 'M',
    }).then(setQrDataUrl);
  }, [official, qrMode]);

  // Theme styling configurations
  const themeClasses = {
    royal_emerald: {
      card: 'bg-gradient-to-b from-emerald-950 via-slate-950 to-emerald-950 text-slate-100 border-2 border-amber-500/80 shadow-2xl',
      headerText: 'text-amber-400 font-amiri',
      subText: 'text-emerald-300',
      box: 'bg-slate-900/95 border border-slate-800 text-slate-200',
      tag: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
      accent: 'text-amber-400',
      hologram: 'bg-gradient-to-r from-amber-400/20 via-emerald-400/20 to-amber-400/20 border-y border-amber-400/30',
      printCard: 'print:bg-emerald-950 print:text-white',
    },
    obsidian_gold: {
      card: 'bg-slate-950 text-slate-100 border-2 border-amber-400 shadow-2xl',
      headerText: 'text-amber-300 font-amiri',
      subText: 'text-amber-200/80',
      box: 'bg-slate-900/95 border border-amber-500/30 text-slate-200',
      tag: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
      accent: 'text-amber-400',
      hologram: 'bg-gradient-to-r from-amber-500/20 via-yellow-200/20 to-amber-500/20 border-y border-amber-400/30',
      printCard: 'print:bg-slate-950 print:text-white',
    },
    print_white: {
      card: 'bg-white text-slate-950 border-2 border-amber-600 shadow-xl',
      headerText: 'text-amber-800 font-amiri',
      subText: 'text-emerald-800',
      box: 'bg-slate-50 border border-slate-300 text-slate-900',
      tag: 'bg-amber-100 border-amber-400 text-amber-900 font-bold',
      accent: 'text-amber-700',
      hologram: 'bg-slate-100 border-y border-amber-400/40 text-slate-700',
      printCard: 'print:bg-white print:text-slate-950 print:border-amber-600',
    },
  }[theme];

  // Helper for corner crop marks (علامات القص الركنية)
  const renderCropMarks = () => {
    if (!showCropMarks) return null;
    return (
      <div className="absolute inset-0 pointer-events-none no-print">
        <div className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400/60" />
        <div className="absolute -top-2 -right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400/60" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400/60" />
        <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400/60" />
      </div>
    );
  };

  // =========================================================================
  // 1. TEMPLATE: MINIMAL MODERN SQUARE BARCODE (الباركود الحديث المربع فقط)
  // Dedicated square format showing Official's Name, Info & Modern Square Barcode
  // =========================================================================
  if (template === 'minimal_qr') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6 print:gap-4 font-cairo print-break-inside-avoid">
        <div
          className={`relative w-[320px] rounded-3xl p-5 flex flex-col justify-between items-center text-center overflow-hidden ${themeClasses.card} ${themeClasses.printCard} print:shadow-none print-break-inside-avoid`}
          style={{ minHeight: '440px' }}
        >
          {renderCropMarks()}

          {/* Header */}
          <div className="w-full pb-2 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Emblem size="sm" variant={theme === 'print_white' ? 'light' : 'gold'} />
              <div className="text-right">
                <h4 className={`text-[12px] font-bold ${themeClasses.headerText} leading-tight`}>
                  العتبة الحسينية المقدسة
                </h4>
                <p className={`text-[9px] font-semibold ${themeClasses.subText}`}>
                  قسم مجمع سيد الشهداء الخدمي
                </p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${themeClasses.tag}`}>
              {official.badgeNumber || 'SSH-000'}
            </span>
          </div>

          {/* Official Name & Position */}
          <div className="my-2 space-y-0.5 w-full">
            <h2 className="text-base font-black font-tajawal text-amber-400">
              {official.fullName}
            </h2>
            <p className="text-xs font-bold text-white">
              {official.title}
            </p>
            <p className="text-[10px] text-slate-300">
              {official.division}
            </p>
          </div>

          {/* The Large Modern Square Barcode */}
          <div className="my-1 p-2 bg-white rounded-2xl shadow-xl border-3 border-amber-400 flex flex-col items-center justify-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Modern Square Barcode"
                className="w-40 h-40 object-contain block"
              />
            ) : (
              <div className="w-40 h-40 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                جاري توليد الباركود...
              </div>
            )}
          </div>

          {/* Subtitle instructions */}
          <div className="space-y-1 my-1">
            <span className="text-[11px] font-extrabold text-amber-400 block font-tajawal">
              الباركود المربع الحديث (QR Code)
            </span>
            <p className="text-[9px] text-slate-300 leading-tight">
              امسح بكاميرا الهاتف المحمول لحفظ جميع الأرقام والبيانات فوراً
            </p>
          </div>

          {/* Quick numbers summary footer */}
          <div className={`w-full p-2 rounded-xl text-[10px] space-y-1 ${themeClasses.box}`}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 opacity-75">
                <Phone className="w-3 h-3 text-amber-400" />
                <span>الهاتف المحمول:</span>
              </span>
              <span className="font-mono font-bold text-white dir-ltr">
                {official.mobilePhones[0]?.number || '-'}
              </span>
            </div>
            {official.internalExtensions && official.internalExtensions.length > 0 && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                <span className="flex items-center gap-1 opacity-75">
                  <Building2 className="w-3 h-3 text-emerald-400" />
                  <span>الداخلي (البدالة):</span>
                </span>
                <span className={`font-mono font-bold ${themeClasses.accent}`}>
                  {official.internalExtensions.map(e => e.number).join(' / ')}
                </span>
              </div>
            )}
            {official.radioDevice && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                <span className="flex items-center gap-1 opacity-75">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  <span>النداء:</span>
                </span>
                <span className="font-bold text-emerald-400">
                  {official.radioDevice}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. TEMPLATE: ALL-IN-ONE VERTICAL BADGE (الباجة الرأسية المرتبة والشاملة)
  // Contains Name, Photo, Full Info AND Modern Square Barcode on one single card!
  // =========================================================================
  if (template === 'vertical_badge') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6 print:gap-4 font-cairo print-break-inside-avoid">
        {/* UNIFIED ALL-IN-ONE CARD */}
        {(side === 'front' || side === 'both') && (
          <div
            className={`relative w-[340px] rounded-3xl p-4 flex flex-col justify-between overflow-hidden ${themeClasses.card} ${themeClasses.printCard} print:shadow-none print-break-inside-avoid`}
            style={{ minHeight: '520px' }}
          >
            {renderCropMarks()}

            {/* Lanyard punch hole slot simulation */}
            <div className="w-12 h-2.5 mx-auto rounded-full bg-slate-800/80 border border-slate-700 -mt-1 print:bg-slate-200" />

            {/* Top Official Header */}
            <div className="text-center mt-1">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Emblem size="sm" variant={theme === 'print_white' ? 'light' : 'gold'} />
                  <div className="text-right">
                    <h4 className={`text-[12px] font-bold ${themeClasses.headerText} leading-tight`}>
                      العتبة الحسينية المقدسة
                    </h4>
                    <p className={`text-[9px] font-semibold ${themeClasses.subText}`}>
                      قسم مجمع سيد الشهداء (عليه السلام) الخدمي
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${themeClasses.tag}`}>
                  {official.badgeNumber || 'SSH-000'}
                </span>
              </div>
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1.5" />
            </div>

            {/* Official Photo & Full Name */}
            <div className="flex items-center gap-3 my-2 px-1">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl p-0.5 bg-gradient-to-br from-amber-400 via-emerald-500 to-amber-600 shadow-md">
                  <img
                    src={official.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                    alt={official.fullName}
                    className="w-full h-full object-cover rounded-2xl bg-slate-800"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0 text-right">
                <h2 className="text-base font-extrabold font-tajawal tracking-tight leading-snug">
                  {official.fullName}
                </h2>
                <p className={`text-xs font-bold mt-0.5 ${themeClasses.accent}`}>{official.title}</p>
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full border text-[9px] font-medium border-slate-700/60 bg-slate-900/40">
                  {official.division}
                </div>
              </div>
            </div>

            {/* Full Information Box (معلومات التواصل والبدالة واللاسلكي) */}
            <div className={`space-y-1.5 rounded-2xl p-2.5 text-[10px] my-1 ${themeClasses.box}`}>
              {/* Multiple Mobile Phones */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[9px] opacity-75 font-semibold">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>أرقام الهواتف المحمولة:</span>
                  </span>
                  {official.bloodType && (
                    <span className="text-red-500 font-mono font-bold">فصيلة: {official.bloodType}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {official.mobilePhones.map((phone, idx) => (
                    <span
                      key={phone.id || idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[10px] font-mono dir-ltr font-bold text-white flex items-center gap-1"
                    >
                      <span className="text-amber-300 font-sans text-[8px]">{phone.label}:</span>
                      <span>{phone.number}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Internal Extension (البدالة) */}
              {official.internalExtensions && official.internalExtensions.length > 0 && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                  <span className="flex items-center gap-1 opacity-75">
                    <Building2 className="w-3 h-3 text-emerald-400" />
                    <span>الهاتف الداخلي (البدالة):</span>
                  </span>
                  <div className="flex gap-1">
                    {official.internalExtensions.map((e, idx) => (
                      <span key={idx} className={`font-mono font-bold ${themeClasses.accent}`}>
                        {e.label ? `${e.label} ` : ''}({e.number})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Radio Device (جهاز النداء) */}
              {official.radioDevice && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                  <span className="flex items-center gap-1 opacity-75">
                    <Radio className="w-3 h-3 text-emerald-400" />
                    <span>جهاز النداء اللاسلكي:</span>
                  </span>
                  <span className="font-semibold text-emerald-400 truncate max-w-[170px]">
                    {official.radioDevice}
                  </span>
                </div>
              )}

              {/* Email */}
              {official.email && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                  <span className="flex items-center gap-1 opacity-75">
                    <Mail className="w-2.5 h-2.5 text-blue-400" />
                    <span>البريد:</span>
                  </span>
                  <span className="font-mono text-[9px] opacity-80 truncate max-w-[170px] dir-ltr">
                    {official.email}
                  </span>
                </div>
              )}
            </div>

            {/* Modern Square Barcode Integrated Directly on the Card */}
            <div className="my-1.5 p-2 rounded-2xl bg-slate-900/60 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex-1 text-right pr-1">
                <span className="text-[10px] font-bold text-amber-400 block font-tajawal">
                  الباركود المربع الحديث (QR)
                </span>
                <p className="text-[8px] opacity-75 leading-tight mt-0.5">
                  امسح الكود بكاميرا أي هاتف محمول لحفظ بيانات وأرقام المسؤول فوراً
                </p>
                <div className="flex items-center gap-1 mt-1 text-[8px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>مسح سريع فوري بدون إنترنت</span>
                </div>
              </div>

              {/* Square QR Box with Gold Border */}
              <div className="shrink-0 p-1.5 bg-white rounded-xl shadow-lg border-2 border-amber-400 flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Modern Barcode"
                    className="w-24 h-24 object-contain block"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-[9px] text-slate-400">
                    جاري التوليد...
                  </div>
                )}
              </div>
            </div>

            {/* Official Footer Strip */}
            <div className={`p-1 text-center text-[9px] font-bold tracking-wider rounded-lg flex items-center justify-between px-3 ${themeClasses.hologram}`}>
              <span className="flex items-center gap-1 text-amber-400">
                <Shield className="w-3 h-3" />
                <span>باجة معتمدة - مجمع سيد الشهداء</span>
              </span>
              <span className="text-[8px] opacity-75 font-mono">
                كربلاء المقدسة
              </span>
            </div>
          </div>
        )}

        {/* OPTIONAL BACK SIDE (If user requests both sides) */}
        {side === 'both' && (
          <div
            className={`relative w-[340px] rounded-3xl p-5 flex flex-col justify-between overflow-hidden ${themeClasses.card} ${themeClasses.printCard} print:shadow-none print-break-inside-avoid`}
            style={{ minHeight: '520px' }}
          >
            {renderCropMarks()}

            <div className="text-center mt-2">
              <div className="flex items-center justify-center gap-2">
                <Emblem size="sm" variant={theme === 'print_white' ? 'light' : 'gold'} />
                <div>
                  <h4 className={`text-[12px] font-bold ${themeClasses.headerText}`}>
                    العتبة الحسينية المقدسة
                  </h4>
                  <p className={`text-[10px] font-semibold ${themeClasses.subText}`}>
                    الأمانة العامة &bull; مجمع سيد الشهداء الخدمي
                  </p>
                </div>
              </div>
            </div>

            {/* Large QR Display on Back */}
            <div className="flex flex-col items-center justify-center my-3">
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-amber-400 flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Official QR Code"
                    className="w-36 h-36 object-contain block"
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-100 flex items-center justify-center text-xs">...</div>
                )}
              </div>
              <span className="text-[10px] font-bold text-amber-400 mt-2 font-mono">
                {official.badgeNumber} &bull; {official.fullName}
              </span>
            </div>

            {/* Shrine Notice & Return Policy */}
            <div className={`p-3 rounded-2xl text-[9px] space-y-1.5 leading-relaxed text-center ${themeClasses.box}`}>
              <p className="font-bold text-amber-400">تعليمات حمل الباجة:</p>
              <p>1. هذه الباجة وثيقة رسمية معتمدة للتعريف بمسؤولي مجمع سيد الشهداء الخدمي.</p>
              <p>2. يرجى إبرازها عند الطلب وتسهيل مهام حاملها أثناء خدمة زائري الإمام الحسين عليه السلام.</p>
              <p className="text-slate-400 pt-1 border-t border-slate-700/60">
                في حال العثور على هذه البطاقة يرجى تسليمها للاستعلامات المركزية لمجمع سيد الشهداء - كربلاء المقدسة - شارع ميثم التمار.
              </p>
            </div>

            <div className="text-center text-[8px] opacity-60 font-mono">
              Official Smart Identity Badge &copy; Al-Ataba Al-Husayniya
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. TEMPLATE: ALL-IN-ONE HORIZONTAL SMART CARD (البطاقة الذكية الأفقية المنظمة)
  // Clean split layout: Official details on right, Modern square barcode on left!
  // =========================================================================
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 print:gap-4 font-cairo print-break-inside-avoid">
      <div
        className={`relative w-[480px] rounded-3xl p-4 flex items-center justify-between overflow-hidden ${themeClasses.card} ${themeClasses.printCard} print:shadow-none print-break-inside-avoid`}
        style={{ minHeight: '290px' }}
      >
        {renderCropMarks()}

        {/* RIGHT SIDE: OFFICIAL CREDENTIALS & ALL INFO */}
        <div className="flex-1 pr-1 flex flex-col justify-between h-full py-0.5 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-500/25 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Emblem size="sm" variant={theme === 'print_white' ? 'light' : 'gold'} />
              <div>
                <h4 className={`text-[11px] font-bold ${themeClasses.headerText} leading-tight`}>
                  العتبة الحسينية المقدسة
                </h4>
                <p className={`text-[9px] font-semibold ${themeClasses.subText}`}>
                  قسم مجمع سيد الشهداء الخدمي
                </p>
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${themeClasses.tag}`}>
              {official.badgeNumber || 'SSH-000'}
            </span>
          </div>

          {/* Official Name & Avatar */}
          <div className="flex items-center gap-2.5">
            <img
              src={official.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
              alt={official.fullName}
              className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400 bg-slate-800 shrink-0"
            />
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold font-tajawal truncate">
                {official.fullName}
              </h2>
              <p className={`text-[11px] font-bold ${themeClasses.accent} truncate`}>
                {official.title}
              </p>
              <p className="text-[9px] opacity-80 truncate">{official.division}</p>
            </div>
          </div>

          {/* Organized Information Details */}
          <div className={`p-2 rounded-xl text-[9px] space-y-1 ${themeClasses.box}`}>
            {/* Phones */}
            <div className="flex items-center justify-between">
              <span className="opacity-75 flex items-center gap-1">
                <Phone className="w-2.5 h-2.5 text-amber-400" />
                <span>المحمول:</span>
              </span>
              <span className="font-mono font-bold dir-ltr text-white">
                {official.mobilePhones.map(p => p.number).join(' | ')}
              </span>
            </div>

            {/* Internal Extension */}
            {official.internalExtensions && official.internalExtensions.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="opacity-75 flex items-center gap-1">
                  <Building2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span>الداخلي (البدالة):</span>
                </span>
                <span className={`font-mono font-bold ${themeClasses.accent}`}>
                  {official.internalExtensions.map(e => e.number).join(' / ')}
                </span>
              </div>
            )}

            {/* Radio */}
            {official.radioDevice && (
              <div className="flex items-center justify-between">
                <span className="opacity-75 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 text-emerald-400" />
                  <span>النداء:</span>
                </span>
                <span className="font-semibold text-emerald-400 truncate max-w-[130px]">
                  {official.radioDevice}
                </span>
              </div>
            )}

            {/* Blood type & Email */}
            <div className="flex items-center justify-between pt-0.5 border-t border-slate-700/50 text-[8px] opacity-75">
              <span>{official.email || 'البريد الرسمي'}</span>
              {official.bloodType && (
                <span className="font-mono font-bold text-red-400">دم: {official.bloodType}</span>
              )}
            </div>
          </div>
        </div>

        {/* LEFT SIDE: MODERN SQUARE BARCODE BOX */}
        <div className="w-[170px] shrink-0 pr-3 flex flex-col items-center justify-center text-center border-r border-amber-500/20">
          <div className="p-2.5 bg-white rounded-2xl shadow-xl border-3 border-amber-400 flex items-center justify-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Modern Square Barcode"
                className="w-32 h-32 object-contain block"
              />
            ) : (
              <div className="w-32 h-32 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                ...
              </div>
            )}
          </div>

          <div className="mt-1.5 space-y-0.5">
            <span className="text-[10px] font-black text-amber-400 block font-tajawal">
              الباركود المربع الحديث
            </span>
            <span className="text-[8px] opacity-75 block">
              امسح بالكاميرا للحفظ الفوري بالهاتف
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-[8px] text-emerald-400 font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>معتمد رسمياً للخدمة والتشغيل</span>
          </div>
        </div>
      </div>
    </div>
  );
};
