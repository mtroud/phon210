import React, { useState, useEffect, useMemo } from 'react';
import { Official, ViewMode, QrTargetMode, PrintBatchMode, CardTemplate } from './types';
import { loadOfficials, saveOfficials, resetOfficialsToDefault, exportOfficialsJson } from './utils/storage';
import { Navbar } from './components/Navbar';
import { OfficialCard } from './components/OfficialCard';
import { SmartMobileView } from './components/SmartMobileView';
import { OfficialFormModal } from './components/OfficialFormModal';
import { PrintBadgeModal } from './components/PrintBadgeModal';
import { BatchPrintModal } from './components/BatchPrintModal';
import { PrintStudioModal } from './components/PrintStudioModal';
import { QrScannerModal } from './components/QrScannerModal';
import { UrlSettingsModal } from './components/UrlSettingsModal';
import { Emblem } from './components/Emblem';
import { 
  Search, 
  Filter, 
  Users, 
  Phone, 
  Radio, 
  Building2, 
  QrCode, 
  Printer, 
  Sparkles,
  LayoutGrid,
  List,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Globe
} from 'lucide-react';

export default function App() {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Standalone Smart Mobile Card view state (when scanned via QR code or requested)
  const [activeMobileOfficial, setActiveMobileOfficial] = useState<Official | null>(null);

  // Active filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
  const [printingOfficial, setPrintingOfficial] = useState<Official | null>(null);
  const [isBatchPrintOpen, setIsBatchPrintOpen] = useState(false);
  const [batchPrintMode, setBatchPrintMode] = useState<PrintBatchMode>('qr_stickers');
  const [isPrintStudioOpen, setIsPrintStudioOpen] = useState(false);
  const [printStudioTemplate, setPrintStudioTemplate] = useState<CardTemplate>('minimal_qr');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isUrlSettingsOpen, setIsUrlSettingsOpen] = useState(false);
  const [systemQrMode, setSystemQrMode] = useState<QrTargetMode>('direct_vcard');
  const [urlConfigVersion, setUrlConfigVersion] = useState(0);

  // Load officials on start & check query parameters
  useEffect(() => {
    const list = loadOfficials();
    setOfficials(list);
    setIsLoaded(true);

    // Check if URL has ?card=<id> or self-contained URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('card');
    const paramName = urlParams.get('n');

    if (cardId) {
      const match = list.find((o) => o.id === cardId || o.badgeNumber.toLowerCase() === cardId.toLowerCase());
      if (match) {
        setActiveMobileOfficial(match);
      } else if (paramName) {
        // Reconstruct official from URL parameters for any external mobile phone!
        const parsedPhones = (urlParams.get('p') || '').split(';').filter(Boolean).map((item, idx) => {
          const parts = item.split(':');
          return {
            id: String(idx),
            label: parts[0] || 'محمول',
            number: parts[1] || parts[0],
            isPrimary: idx === 0,
            hasWhatsapp: true
          };
        });

        const parsedExts = (urlParams.get('ext') || '').split(';').filter(Boolean).map((item, idx) => {
          const parts = item.split(':');
          return {
            id: String(idx),
            label: parts[0] || 'بدالة',
            number: parts[1] || parts[0]
          };
        });

        const reconstructed: Official = {
          id: cardId,
          badgeNumber: urlParams.get('b') || 'SSH-000',
          fullName: paramName,
          title: urlParams.get('t') || 'مسؤول في مجمع سيد الشهداء الخدمي',
          department: 'قسم مجمع سيد الشهداء عليه السلام الخدمي',
          division: urlParams.get('d') || 'شعبة المجمع الخدمي',
          mobilePhones: parsedPhones.length > 0 ? parsedPhones : [{ id: '1', label: 'محمول', number: '', isPrimary: true, hasWhatsapp: true }],
          internalExtensions: parsedExts,
          radioDevice: urlParams.get('r') || '',
          email: urlParams.get('e') || '',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setActiveMobileOfficial(reconstructed);
      }
    }
  }, []);

  // Update URL parameter when opening mobile preview
  const handleOpenMobilePreview = (official: Official) => {
    setActiveMobileOfficial(official);
    const newUrl = `${window.location.pathname}?card=${encodeURIComponent(official.id)}`;
    window.history.pushState({ cardId: official.id }, '', newUrl);
  };

  const handleCloseMobilePreview = () => {
    setActiveMobileOfficial(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  // CRUD Operations
  const handleSaveOfficial = (officialToSave: Official) => {
    let updated: Official[];
    const exists = officials.some((o) => o.id === officialToSave.id);
    if (exists) {
      updated = officials.map((o) => (o.id === officialToSave.id ? officialToSave : o));
    } else {
      updated = [officialToSave, ...officials];
    }
    setOfficials(updated);
    saveOfficials(updated);
  };

  const handleDeleteOfficial = (id: string) => {
    const updated = officials.filter((o) => o.id !== id);
    setOfficials(updated);
    saveOfficials(updated);
  };

  const handleResetData = () => {
    const reset = resetOfficialsToDefault();
    setOfficials(reset);
  };

  // Divisions list for filters
  const divisions = useMemo(() => {
    const set = new Set<string>();
    officials.forEach((o) => {
      if (o.division) set.add(o.division);
    });
    return Array.from(set);
  }, [officials]);

  // Filtered officials list
  const filteredOfficials = useMemo(() => {
    return officials.filter((official) => {
      const matchesDivision = selectedDivision === 'all' || official.division === selectedDivision;
      if (!matchesDivision) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const nameMatch = official.fullName.toLowerCase().includes(q);
      const titleMatch = official.title.toLowerCase().includes(q);
      const badgeMatch = official.badgeNumber.toLowerCase().includes(q);
      const radioMatch = official.radioDevice?.toLowerCase().includes(q);
      const phoneMatch = official.mobilePhones.some((p) => p.number.includes(q) || p.label.toLowerCase().includes(q));
      const extMatch = official.internalExtensions.some((e) => e.number.includes(q) || e.label.toLowerCase().includes(q));

      return nameMatch || titleMatch || badgeMatch || radioMatch || phoneMatch || extMatch;
    });
  }, [officials, selectedDivision, searchQuery]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalOfficials = officials.length;
    const totalMobiles = officials.reduce((acc, curr) => acc + curr.mobilePhones.length, 0);
    const totalInternal = officials.reduce((acc, curr) => acc + curr.internalExtensions.length, 0);
    const totalRadios = officials.filter((o) => Boolean(o.radioDevice)).length;
    return { totalOfficials, totalMobiles, totalInternal, totalRadios };
  }, [officials]);

  // If directly opened as a smart mobile card via QR code scan
  if (activeMobileOfficial) {
    return (
      <SmartMobileView
        official={activeMobileOfficial}
        onBack={handleCloseMobilePreview}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-cairo selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        onAddNew={() => {
          setEditingOfficial(null);
          setIsFormModalOpen(true);
        }}
        onOpenBatchPrint={() => {
          setPrintStudioTemplate('vertical_badge');
          setIsPrintStudioOpen(true);
        }}
        onOpenPrintStudio={(tmpl) => {
          if (tmpl) setPrintStudioTemplate(tmpl);
          setIsPrintStudioOpen(true);
        }}
        onOpenScanner={() => setIsScannerOpen(true)}
        onExportBackup={() => exportOfficialsJson(officials)}
        onResetData={handleResetData}
      />

      {/* Hero / Department Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-amber-500/15 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 no-print">
        <div className="absolute inset-0 bg-islamic-pattern opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>المنظومة الرقمية للبطاقات الذكية والباجات الحديثة</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-tajawal tracking-tight">
                دليل مسؤولي قسم مجمع سيد الشهداء الخدمي
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                بطاقات ذكية مزودة بباركود استعراض فوري مربع (QR Code)، تتيح للزائرين والوفود والجهات الإدارية الوصول المباشر لكافة أرقام الهواتف المحمولة والبدالة الداخلية وجهاز النداء بمجرد مسح الكود بكاميرا الموبايل.
              </p>

              {/* Prominent Quick Actions: Print Studio & Modern Barcode */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setPrintStudioTemplate('minimal_qr');
                    setIsPrintStudioOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 active:scale-95 transition"
                >
                  <QrCode className="w-4 h-4 stroke-[3]" />
                  <span>الباركود الحديث فقط (استوديو الطباعة والملصقات)</span>
                </button>

                <button
                  onClick={() => {
                    setPrintStudioTemplate('vertical_badge');
                    setIsPrintStudioOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs sm:text-sm border border-slate-700 active:scale-95 transition"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>استوديو طباعة الباجات وبطاقات الهوية</span>
                </button>

                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
                  <span className="text-slate-400 font-semibold">نوع الباركود:</span>
                  <select
                    value={systemQrMode}
                    onChange={(e) => setSystemQrMode(e.target.value as QrTargetMode)}
                    className="bg-slate-900 text-amber-300 font-bold px-2 py-1 rounded-lg border border-amber-500/40 focus:outline-none text-xs"
                  >
                    <option value="direct_vcard">📱 حفظ مباشر بالهاتف (vCard - أسرع قراءة وبدون نت)</option>
                    <option value="smart_profile">🌐 صفحة البطاقة الرقمية على الويب</option>
                    <option value="quick_call">📞 اتصال فوري بالرقم الرئيسي</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsUrlSettingsOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition"
                  title="فحص وضبط رابط النظام للموبايل والشبكات الخارجية"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>فحص رابط الموبايل</span>
                </button>
              </div>
            </div>

            {/* Quick KPI stats counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto shrink-0">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">المسؤولين</span>
                <span className="text-xl font-extrabold text-amber-400 font-mono">{stats.totalOfficials}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">أرقام المحمول</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">{stats.totalMobiles}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">الهواتف الداخلية</span>
                <span className="text-xl font-extrabold text-blue-400 font-mono">{stats.totalInternal}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">أجهزة النداء</span>
                <span className="text-xl font-extrabold text-purple-400 font-mono">{stats.totalRadios}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search & Division Filter Controls */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-3 no-print">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث باسم المسؤول، الشعبة، رقم الهاتف، البدالة الداخلية، أو جهاز النداء..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm pr-10 pl-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  مسح
                </button>
              )}
            </div>

            {/* View Layout Toggle */}
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-start">
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    layoutMode === 'grid' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                  title="عرض البطاقات الشبكية"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('table')}
                  className={`p-1.5 rounded-lg transition ${
                    layoutMode === 'table' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                  title="عرض الجدول التنسيقي"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-slate-400 font-medium">
                النتائج: <strong className="text-amber-400 font-mono">{filteredOfficials.length}</strong> مسؤول
              </span>
            </div>
          </div>

          {/* Division Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
            <span className="text-slate-400 shrink-0 flex items-center gap-1 font-semibold ml-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>الشعبة:</span>
            </span>

            <button
              onClick={() => setSelectedDivision('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedDivision === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              جميع الشعب ({officials.length})
            </button>

            {divisions.map((div) => {
              const count = officials.filter((o) => o.division === div).length;
              return (
                <button
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedDivision === div
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  {div} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Output */}
        {filteredOfficials.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">لم يتم العثور على أي مسؤول</h3>
            <p className="text-xs text-slate-400">
              جرب تغيير عبارة البحث أو اختيار شعبة أخرى
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDivision('all');
              }}
              className="px-4 py-1.5 rounded-xl bg-slate-800 text-amber-400 text-xs font-semibold hover:bg-slate-750 transition"
            >
              إلغاء التصفية
            </button>
          </div>
        ) : layoutMode === 'grid' ? (
          /* Grid View of Officials */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOfficials.map((official) => (
              <OfficialCard
                key={`${official.id}_${systemQrMode}_${urlConfigVersion}`}
                official={official}
                onOpenMobileView={handleOpenMobilePreview}
                onOpenPrintModal={(o) => setPrintingOfficial(o)}
                onEdit={(o) => {
                  setEditingOfficial(o);
                  setIsFormModalOpen(true);
                }}
                onDelete={handleDeleteOfficial}
              />
            ))}
          </div>
        ) : (
          /* Table View of Officials */
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-slate-200">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">المسؤول</th>
                    <th className="py-3 px-4">الشعبة والوحدة</th>
                    <th className="py-3 px-4">أرقام الهواتف المحمولة</th>
                    <th className="py-3 px-4">الهاتف الداخلي</th>
                    <th className="py-3 px-4">جهاز النداء</th>
                    <th className="py-3 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredOfficials.map((official) => (
                    <tr key={official.id} className="hover:bg-slate-800/40 transition">
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={official.avatarUrl}
                            alt=""
                            className="w-9 h-9 rounded-xl object-cover border border-amber-400/60"
                          />
                          <div>
                            <span className="font-bold text-white text-xs block">{official.fullName}</span>
                            <span className="text-[10px] text-amber-400">{official.title}</span>
                          </div>
                        </div>
                      </td>

                      {/* Division */}
                      <td className="py-3 px-4">
                        <span className="font-semibold block">{official.division}</span>
                        {official.subUnit && (
                          <span className="text-[10px] text-slate-400">{official.subUnit}</span>
                        )}
                      </td>

                      {/* Mobile Phones */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {official.mobilePhones.map((p, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <span className="text-[10px] text-amber-300">{p.label}:</span>
                              <span className="font-mono font-bold text-white dir-ltr">{p.number}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Internal Extension */}
                      <td className="py-3 px-4 font-mono font-bold text-amber-300">
                        {official.internalExtensions?.map((e) => `${e.label}: ${e.number}`).join(' | ') || '-'}
                      </td>

                      {/* Radio */}
                      <td className="py-3 px-4 text-emerald-300 font-semibold">
                        {official.radioDevice || '-'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenMobilePreview(official)}
                            className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 transition"
                            title="معاينة بطاقة الموبايل"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setPrintingOfficial(official)}
                            className="p-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition"
                            title="طباعة الباجة"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500 space-y-1.5 no-print">
        <div className="flex items-center justify-center gap-2">
          <Emblem size="sm" variant="gold" />
          <p className="font-amiri text-sm font-bold text-amber-400">
            العتبة الحسينية المقدسة &bull; قسم مجمع سيد الشهداء (عليه السلام) الخدمي
          </p>
        </div>
        <p className="text-[11px] text-slate-400">
          منظومة البطاقات الذكية والباجات التعريفية الحديثة لمسؤولي الشعب والوحدات
        </p>
        <p className="text-[10px] text-slate-600 font-mono">
          Al-Ataba Al-Husayniya Al-Muqaddasa &bull; Sayyid al-Shuhada Complex Smart Card System &copy; {new Date().getFullYear()}
        </p>
      </footer>

      {/* MODALS */}
      {/* 1. Add / Edit Official Form Modal */}
      <OfficialFormModal
        isOpen={isFormModalOpen}
        initialOfficial={editingOfficial}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingOfficial(null);
        }}
        onSave={handleSaveOfficial}
      />

      {/* 2. Print Single Badge Modal */}
      {printingOfficial && (
        <PrintBadgeModal
          isOpen={Boolean(printingOfficial)}
          official={printingOfficial}
          onClose={() => setPrintingOfficial(null)}
          onOpenMobileView={(o) => {
            setPrintingOfficial(null);
            handleOpenMobilePreview(o);
          }}
        />
      )}

      {/* 3. Batch Print Modal */}
      <BatchPrintModal
        isOpen={isBatchPrintOpen}
        officials={officials}
        defaultQrMode={systemQrMode}
        initialBatchMode={batchPrintMode}
        onClose={() => setIsBatchPrintOpen(false)}
      />

      {/* 4. QR Simulator & Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        officials={officials}
        onClose={() => setIsScannerOpen(false)}
        onSelectOfficial={(o) => {
          setIsScannerOpen(false);
          handleOpenMobilePreview(o);
        }}
      />

      {/* 5. URL Settings Modal for Mobile Links */}
      <UrlSettingsModal
        isOpen={isUrlSettingsOpen}
        onClose={() => setIsUrlSettingsOpen(false)}
        onSaved={() => setUrlConfigVersion((v) => v + 1)}
      />

      {/* 6. Professional Print Studio Modal */}
      <PrintStudioModal
        isOpen={isPrintStudioOpen}
        officials={officials}
        defaultQrMode={systemQrMode}
        initialTemplate={printStudioTemplate}
        onClose={() => setIsPrintStudioOpen(false)}
      />
    </div>
  );
}
