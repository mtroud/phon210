import React, { useEffect, useState } from 'react';
import { Official, CardTemplate, QrTargetMode, CardTheme } from '../types';
import { generateQrDataUrl } from '../utils/qrUtils';
import { Emblem } from './Emblem';
import { Phone, Radio, Mail, Building2, Shield, QrCode, Cpu, CheckCircle } from 'lucide-react';

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
  side = 'both',
  qrMode = 'direct_vcard',
  theme = 'royal_emerald',
  showCropMarks = true,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
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
      box: 'bg-slate-900/90 border border-slate-800 text-slate-200',
      tag: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
      accent: 'text-amber-400',
      hologram: 'bg-gradient-to-r from-amber-400/20 via-emerald-400/20 to-amber-400/20 border-y border-amber-400/30',
      printCard: 'print:bg-emerald-950 print:text-white',
    },
    obsidian_gold: {
      card: 'bg-slate-950 text-slate-100 border-2 border-amber-400 shadow-2xl',
      headerText: 'text-amber-300 font-amiri',
      subText: 'text-amber-200/80',
      box: 'bg-slate-900 border border-amber-500/30 text-slate-200',
      tag: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
      accent: 'text-amber-400',
      hologram: 'bg-gradient-to-r from-amber-500/20 via-yellow-200/20 to-amber-500/20 border-y border-amber-400/30',
      printCard: 'print:bg-slate-950 print:text-white',
    },
    print_white: {
      card: 'bg-white text-slate-950 border-2 border-amber-600 shadow-xl',
      headerText: 'text-amber-800 font-amiri',
      subText: 'text-emerald-800',
      box: 'bg-slate-50 border border-slate-300 text-slate-800',
      tag: 'bg-amber-100 border-amber-400 text-amber-900',
      accent: 'text-amber-700',
      hologram: 'bg-slate-100 border-y border-amber-400/40',
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
  // 1. TEMPLATE: MINIMAL MODERN BARCODE ONLY CARD (الباركود الحديث فقط)
  // =========================================================================
  if (template === 'minimal_qr') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6 print:gap-4 font-cairo print-break-inside-avoid">
        <div className={`relative w-[300px] rounded-3xl p-5 text-center flex flex-col items-center justify-between overflow-hidden ${themeClasses.card} ${themeClasses.printCard} print:shadow-none print-break-inside-avoid`}>
          {renderCropMarks()}

          {/* Header */}
          <div className="w-full flex items-center justify-between border-b border-amber-500/30 pb-2">
            <div className="flex items-center gap-2">
              <Emblem size="sm" variant={theme === 'print_white' ? 'light' : 'gold'} />
              <div className="text-right">
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

          {/* Official Info */}
          <div className="my-2">
            <h2 className="text-base font-black font-tajawal">
              {official.fullName}
            </h2>
            <p className={`text-xs font-bold ${themeClasses.accent}`}>{official.title}</p>
            <p className="text-[10px] opacity-75 mt-0.5">{official.division}</p>
          </div>

          {/* High-Resolution Modern Square Barcode */}
          <div className="flex flex-col items-center justify-center my-1">
            <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-amber-400 flex items-center justify-center relative group">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Modern Barcode"
                  className="w-40 h-40 object-contain block"
                />
              ) : (
                <div className="w-40 h-40 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                  جاري التوليد...
                </div>
              )}
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold mt-2">
              <QrCode className="w-3 h-3" />
              <span>الباركود المربع الحديث &bull; مسح فوري بالهاتف</span>
            </span>
          </div>

          {/* Summary Details */}
          <div className={`w-full mt-2 p-2 rounded-xl text-[10px] space-y-1 ${themeClasses.box}`}>
            <div className="flex items-center justify-between">
              <span className="opacity-75">المحمول:</span>
              <span className="font-mono font-bold dir-ltr">
                {official.mobilePhones[0]?.number || '-'}
              </span>
            </div>
            {official.internalExtensions && official.internalExtensions.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="opacity-75">البدالة الداخلية:</span>
                <span className={`font-mono font-bold ${themeClasses.accent}`}>
                  {official.internalExtensions.map(e => e.number).join(' / ')}
                </span>
              </div>
            )}
            {official.radioDevice && (
              <div className="flex items-center justify-between">
                <span className="opacity-75">اللاسلكي:</span>
                <span className="font-semibold text-emerald-400 truncate max-w-[150px]">
                  {official.radioDevice}
                </span>
              </div>
            )}
          </div>

          <p className="text-[8px] opacity-60 mt-1">
            امسح الكود بكاميرا الموبايل لحفظ بيانات المسؤول والأرقام فوراً
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. TEMPLATE: STANDARD VERTICAL LANYARD CHEST BADGE (باجة صدر رأسية)
  // =========================================================================
  if (template === 'vertical_badge') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6 print:gap-4 font-cairo print-break-inside-avoid">
        {/* FRONT SIDE */}
        {(side === 'front' || side === 'both') && (
          <div className={`relative w-[320px] h-[480px] rounded-3xl p-4 flex flex-col justify-between overflow-hidden ${themeClasses.card} ${themeClasses.printCard} print:shadow-none print-break-inside-avoid`}>
            {renderCropMarks()}

            {/* Lanyard punch hole slot simulation */}
            <div className="w-12 h-2.5 mx-auto rounded-full bg-slate-800/80 border border-slate-700 -mt-1 print:bg-slate-200" />

            {/* Header with Holy Shrine branding */}
            <div className="text-center mt-1">
              <div className="flex items-center justify-center gap-2">
                <Emblem size="sm" variant={theme === 'print_white' ? 'light' : 'gold'} />
                <div>
                  <h4 className={`text-[12px] font-bold ${themeClasses.headerText} leading-tight`}>
                    العتبة الحسينية المقدسة
                  </h4>
                  <p className={`text-[10px] font-semibold ${themeClasses.subText}`}>
                    قسم مجمع سيد الشهداء (ع) الخدمي
                  </p>
                </div>
              </div>
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1.5" />
            </div>

            {/* Photo & Badge Number */}
            <div className="flex flex-col items-center mt-1">
              <div className="w-24 h-24 rounded-2xl p-0.5 bg-gradient-to-br from-amber-400 via-emerald-500 to-amber-600 shadow-lg">
                <img
                  src={official.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                  alt={official.fullName}
                  className="w-full h-full object-cover rounded-2xl bg-slate-800"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400';
                  }}
                />
              </div>
              <span className={`mt-1 px-2.5 py-0.5 rounded font-mono text-[9px] font-bold border ${themeClasses.tag}`}>
                {official.badgeNumber || 'SSH-000'}
              </span>
            </div>

            {/* Official Details */}
            <div className="text-center px-1">
              <h2 className="text-base font-extrabold font-tajawal tracking-tight">
                {official.fullName}
              </h2>
              <p className={`text-xs font-bold mt-0.5 ${themeClasses.accent}`}>{official.title}</p>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full border text-[10px] font-medium border-slate-700/60 bg-slate-900/40">
                {official.division}
              </div>
            </div>

            {/* Key Quick Contacts on front */}
            <div className={`space-y-1 rounded-xl p-2.5 text-[10px] ${themeClasses.box}`}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 opacity-75">
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>المحمول:</span>
                </span>
                <span className="font-mono font-bold dir-ltr">
                  {official.mobilePhones[0]?.number || 'غير متوفر'}
                </span>
              </div>

              {official.internalExtensions && official.internalExtensions.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 opacity-75">
                    <Building2 className="w-3 h-3 text-emerald-400" />
                    <span>الداخلي (البدالة):</span>
                  </span>
                  <span className={`font-mono font-bold ${themeClasses.accent}`}>
                    {official.internalExtensions.map((e) => e.number).join(' / ')}
                  </span>
                </div>
              )}

              {official.radioDevice && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 opacity-75">
                    <Radio className="w-3 h-3 text-emerald-400" />
                    <span>النداء اللاسلكي:</span>
                  </span>
                  <span className="font-semibold text-emerald-400 truncate max-w-[170px]">
                    {official.radioDevice}
                  </span>
                </div>
              )}
            </div>

            {/* Simulated Holographic Security Ribbon */}
            <div className={`p-1 text-center text-[9px] font-bold tracking-wider rounded-lg flex items-center justify-between px-3 ${themeClasses.hologram}`}>
              <span className="flex items-center gap-1 text-amber-400">
                <Shield className="w-3 h-3" />
                <span>باجة رسمية معتمدة</span>
              </span>
              <span className="text-[8px] opacity-75 font-mono">
                العتبة الحسينية المقدسة
              </span>
            </div>
          </div>
        )}

        {/* BACK SIDE (WITH MODERN SQUARE BARCODE) */}
        {(side === 'back' || side === 'both') && (
          <div className={`relative w-[320px] h-[480px] rounded-3xl p-4 flex flex-col justify-between overflow-hidden ${themeClasses.card} ${themeClasses.printCard} print:shadow-none print-break-inside-avoid`}>
            {renderCropMarks()}

            {/* Lanyard punch hole slot simulation */}
            <div className="w-12 h-2.5 mx-auto rounded-full bg-slate-800/80 border border-slate-700 -mt-1 print:bg-slate-200" />

            <div className="text-center mt-1">
              <h4 className={`text-[12px] font-bold ${themeClasses.headerText} font-tajawal`}>
                الباركود الذكي للاستعراض والحفظ الفوري
              </h4>
              <p className="text-[9px] opacity-70">
                امسح بكاميرا أي هاتف لحفظ بيانات وأرقام المسؤول فوراً
              </p>
            </div>

            {/* Ultra High Contrast QR Code with clean padding */}
            <div className="flex flex-col items-center justify-center my-1">
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-amber-400 flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Official QR Code"
                    className="w-36 h-36 object-contain block"
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    جاري التوليد...
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" />
                <span>الباركود المربع الحديث &bull; قراءة سريعة</span>
              </span>
            </div>

            {/* All Numbers List */}
            <div className={`space-y-1 rounded-xl p-2.5 text-[9px] ${themeClasses.box}`}>
              <div className="font-bold text-[10px] border-b border-slate-700/60 pb-0.5 mb-1 flex items-center justify-between">
                <span className={themeClasses.accent}>أرقام التواصل والبدالة:</span>
                {official.bloodType && (
                  <span className="text-red-400 font-mono font-bold">فصيلة: {official.bloodType}</span>
                )}
              </div>

              {official.mobilePhones.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="opacity-75 truncate max-w-[120px]">
                    {p.label || `محمول ${idx + 1}`}:
                  </span>
                  <span className="font-mono font-bold dir-ltr">
                    {p.number}
                  </span>
                </div>
              ))}

              {official.email && (
                <div className="flex items-center justify-between pt-0.5 border-t border-slate-700/60">
                  <span className="opacity-75 flex items-center gap-1">
                    <Mail className="w-2.5 h-2.5 text-blue-400" />
                    <span>البريد:</span>
                  </span>
                  <span className="font-mono text-[8px] truncate max-w-[150px]">
                    {official.email}
                  </span>
                </div>
              )}
            </div>

            {/* Disclaimer & Return Note */}
            <div className="text-center text-[8px] opacity-75 leading-tight space-y-0.5 border-t border-slate-700/60 pt-1.5">
              <p className={`font-amiri text-[10px] font-bold ${themeClasses.headerText}`}>
                الأمانة العامة للعتبة الحسينية المقدسة
              </p>
              <p>في حال العثور على هذه البطاقة يرجى تسليمها لقسم مجمع سيد الشهداء الخدمي</p>
              <p className="font-mono opacity-60">كربلاء المقدسة - شارع ميثم التمار</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. TEMPLATE: HORIZONTAL SMART ID CARD (CR80 Plastic Card 85.6mm × 54mm)
  // =========================================================================
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 print:gap-4 font-cairo print-break-inside-avoid">
      {/* FRONT */}
      {(side === 'front' || side === 'both') && (
        <div className={`relative w-[430px] h-[260px] rounded-3xl p-4 flex flex-col justify-between overflow-hidden ${themeClasses.card} ${themeClasses.printCard} print:shadow-none print-break-inside-avoid`}>
          {renderCropMarks()}

          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <div className="flex items-center gap-2">
              <Emblem size="sm" variant={theme === 'print_white' ? 'light' : 'gold'} />
              <div>
                <h4 className={`text-[12px] font-bold ${themeClasses.headerText} leading-tight`}>
                  العتبة الحسينية المقدسة
                </h4>
                <p className={`text-[10px] font-medium ${themeClasses.subText}`}>
                  قسم مجمع سيد الشهداء (عليه السلام) الخدمي
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Simulated Smart Microchip */}
              <div className="w-8 h-6 rounded bg-amber-400/80 border border-amber-600 flex items-center justify-center shadow-inner" title="Smart Chip">
                <Cpu className="w-4 h-4 text-slate-900" />
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${themeClasses.tag}`}>
                {official.badgeNumber || 'SSH-000'}
              </span>
            </div>
          </div>

          {/* Middle Content */}
          <div className="flex items-center gap-4 my-auto">
            <div className="w-20 h-20 rounded-2xl p-0.5 bg-gradient-to-br from-amber-400 via-emerald-500 to-amber-600 shrink-0 shadow-md">
              <img
                src={official.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                alt={official.fullName}
                className="w-full h-full object-cover rounded-2xl bg-slate-800"
              />
            </div>

            <div className="flex-1 overflow-hidden">
              <h2 className="text-base font-extrabold font-tajawal truncate">
                {official.fullName}
              </h2>
              <p className={`text-xs font-bold truncate ${themeClasses.accent}`}>{official.title}</p>
              <p className="text-[11px] opacity-80 mt-0.5 truncate">{official.division}</p>

              <div className="mt-2 flex flex-wrap gap-1 text-[9px]">
                <span className={`px-2 py-0.5 rounded border font-mono dir-ltr font-bold ${themeClasses.tag}`}>
                  {official.mobilePhones[0]?.number}
                </span>
                {official.radioDevice && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold truncate max-w-[150px]">
                    {official.radioDevice}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between text-[9px] opacity-75 border-t border-slate-700/50 pt-1.5">
            <span className={themeClasses.accent}>بطاقة هوية ذكية معتمدة (CR80)</span>
            <span className="font-mono">Smart Official ID Card</span>
          </div>
        </div>
      )}

      {/* BACK WITH QR CODE */}
      {(side === 'back' || side === 'both') && (
        <div className={`relative w-[430px] h-[260px] rounded-3xl p-4 flex items-center justify-between overflow-hidden ${themeClasses.card} ${themeClasses.printCard} print:shadow-none print-break-inside-avoid`}>
          {renderCropMarks()}

          {/* QR Code Left Side */}
          <div className="flex flex-col items-center justify-center p-2">
            <div className="p-2.5 bg-white rounded-2xl shadow-md border-2 border-amber-400">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="w-28 h-28 object-contain block" />
              ) : (
                <div className="w-28 h-28 bg-slate-100 flex items-center justify-center text-xs">...</div>
              )}
            </div>
            <span className="text-[9px] font-bold text-amber-400 mt-1 flex items-center gap-1">
              <QrCode className="w-3 h-3" />
              <span>الباركود الحديث</span>
            </span>
          </div>

          {/* Right Details Side */}
          <div className="flex-1 pr-3 flex flex-col justify-between h-full py-1">
            <div>
              <h4 className={`text-[11px] font-bold ${themeClasses.headerText} font-tajawal mb-1`}>
                بيانات التواصل الرسمية:
              </h4>

              <div className="space-y-1 text-[9px]">
                {official.mobilePhones.map((m, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="opacity-75">{m.label}:</span>
                    <span className="font-mono font-bold dir-ltr">{m.number}</span>
                  </div>
                ))}

                {official.internalExtensions && official.internalExtensions.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="opacity-75">البدالة الداخلية:</span>
                    <span className={`font-mono font-bold ${themeClasses.accent}`}>
                      {official.internalExtensions.map((e) => e.number).join(', ')}
                    </span>
                  </div>
                )}

                {official.email && (
                  <div className="flex items-center justify-between">
                    <span className="opacity-75">البريد:</span>
                    <span className="font-mono text-[8px] truncate max-w-[140px]">{official.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-700/60 pt-1 text-[8px] opacity-70 leading-tight">
              العتبة الحسينية المقدسة &bull; قسم مجمع سيد الشهداء الخدمي
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
