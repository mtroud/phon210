import React, { useState, useEffect, useMemo } from 'react';
import { 
  Official, 
  ViewMode, 
  QrTargetMode, 
  PrintBatchMode, 
  CardTemplate,
  SortOption,
  ToastNotification 
} from './types';
import { 
  loadOfficials, 
  saveOfficials, 
  resetOfficialsToDefault, 
  exportOfficialsJson,
  exportOfficialsCsv,
  addAuditLog 
} from './utils/storage';
import { getSessionState, clearAdminSession } from './utils/security';
import { Navbar } from './components/Navbar';
import { OfficialCard } from './components/OfficialCard';
import { SmartMobileView } from './components/SmartMobileView';
import { OfficialFormModal } from './components/OfficialFormModal';
import { PrintBadgeModal } from './components/PrintBadgeModal';
import { BatchPrintModal } from './components/BatchPrintModal';
import { PrintStudioModal } from './components/PrintStudioModal';
import { QrScannerModal } from './components/QrScannerModal';
import { UrlSettingsModal } from './components/UrlSettingsModal';
import { OfficialReportModal } from './components/OfficialReportModal';
import { ImportBackupModal } from './components/ImportBackupModal';
import { AuditLogModal } from './components/AuditLogModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/Toast';
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
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  FileSpreadsheet,
  FileText,
  Lock,
  Unlock,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Security & Admin Mode
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Standalone Smart Mobile Card view state (when scanned via QR code or requested)
  const [activeMobileOfficial, setActiveMobileOfficial] = useState<Official | null>(null);

  // Active filters, search & sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('badge_asc');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'table'>('grid');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12); // 12 officials per page

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
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [systemQrMode, setSystemQrMode] = useState<QrTargetMode>('direct_vcard');
  const [urlConfigVersion, setUrlConfigVersion] = useState(0);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info';
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'danger',
    action: () => {},
  });

  // Toasts Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (type: ToastNotification['type'], title: string, message?: string) => {
    const newToast: ToastNotification = {
      id: `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check admin session on start
  useEffect(() => {
    const session = getSessionState();
    if (session.isAdmin) {
      setIsAdmin(true);
    }
  }, []);

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
            hasWhatsapp: true,
          };
        });

        const parsedExts = (urlParams.get('ext') || '').split(';').filter(Boolean).map((item, idx) => {
          const parts = item.split(':');
          return {
            id: String(idx),
            label: parts[0] || 'بدالة',
            number: parts[1] || parts[0],
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
          updatedAt: new Date().toISOString(),
        };

        setActiveMobileOfficial(reconstructed);
      }
    }
  }, []);

  // Reset to page 1 whenever search query or division filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDivision, sortOption, pageSize]);

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

  // CRUD Operations with Audit Logging & Toasts
  const handleSaveOfficial = (officialToSave: Official) => {
    let updated: Official[];
    const exists = officials.some((o) => o.id === officialToSave.id);
    if (exists) {
      updated = officials.map((o) => (o.id === officialToSave.id ? officialToSave : o));
      addAuditLog({
        action: 'edit',
        officialId: officialToSave.id,
        officialName: officialToSave.fullName,
        details: `تعديل بيانات المسؤول (${officialToSave.fullName}) - باجة (${officialToSave.badgeNumber})`,
        performedBy: 'مسؤول النظام',
      });
      addToast('success', 'تم تعديل بيانات المسؤول بنجاح', officialToSave.fullName);
    } else {
      updated = [officialToSave, ...officials];
      addAuditLog({
        action: 'add',
        officialId: officialToSave.id,
        officialName: officialToSave.fullName,
        details: `إضافة مسؤول جديد (${officialToSave.fullName}) - باجة (${officialToSave.badgeNumber})`,
        performedBy: 'مسؤول النظام',
      });
      addToast('success', 'تمت إضافة المسؤول بنجاح', officialToSave.fullName);
    }
    setOfficials(updated);
    saveOfficials(updated);
  };

  const handleDeletePrompt = (official: Official) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'تأكيد حذف المسؤول',
      message: `هل أنت متأكد من حذف (${official.fullName}) ذو الباجة (${official.badgeNumber})؟ سيتم حفظ نسخة استرجاع في الأرشيف قبل الحذف.`,
      variant: 'danger',
      action: () => {
        const updated = officials.filter((o) => o.id !== official.id);
        setOfficials(updated);
        saveOfficials(updated);
        addAuditLog({
          action: 'delete',
          officialId: official.id,
          officialName: official.fullName,
          details: `حذف المسؤول (${official.fullName}) - باجة (${official.badgeNumber})`,
          performedBy: 'مسؤول النظام',
        });
        addToast('info', 'تم حذف المسؤول من المنظومة', official.fullName);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleResetPrompt = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'استعادة بيانات المجمع الأصلية المعتمدة',
      message: 'هل تريد إعادة تعيين كافة البيانات إلى القائمة الافتراضية المعتمدة لقسم مجمع سيد الشهداء؟ سيتم أخذ نسخة احتياطية تلقائية من بياناتك الحالية قبل الاستعادة.',
      variant: 'warning',
      action: () => {
        const reset = resetOfficialsToDefault();
        setOfficials(reset);
        addToast('success', 'تمت استعادة بيانات المجمع الأصلية بنجاح');
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleImportSuccess = (importedList: Official[], mode: 'replace' | 'merge') => {
    let finalOfficials: Official[];
    if (mode === 'replace') {
      finalOfficials = importedList;
    } else {
      // Merge: keep existing, add or overwrite by badge/id
      const existingMap = new Map(officials.map((o) => [o.badgeNumber.toLowerCase(), o]));
      importedList.forEach((item) => {
        existingMap.set(item.badgeNumber.toLowerCase(), item);
      });
      finalOfficials = Array.from(existingMap.values());
    }

    setOfficials(finalOfficials);
    saveOfficials(finalOfficials);
    addToast('success', 'تم استيراد قاعدة البيانات بنجاح', `تم تحميل (${importedList.length}) مسؤول`);
  };

  // Toggle Admin / Viewer lock
  const handleToggleAdmin = () => {
    if (isAdmin) {
      clearAdminSession();
      setIsAdmin(false);
      addToast('info', 'تم قفل وضع الإدارة', 'المنظومة الآن في وضع المشاهدة الآمن');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Divisions list for filters
  const divisions = useMemo(() => {
    const set = new Set<string>();
    officials.forEach((o) => {
      if (o.division) set.add(o.division);
    });
    return Array.from(set);
  }, [officials]);

  // Filtered & Sorted officials list
  const filteredAndSortedOfficials = useMemo(() => {
    const filtered = officials.filter((official) => {
      const matchesDivision = selectedDivision === 'all' || official.division === selectedDivision;
      if (!matchesDivision) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const nameMatch = official.fullName.toLowerCase().includes(q);
      const titleMatch = official.title.toLowerCase().includes(q);
      const badgeMatch = official.badgeNumber.toLowerCase().includes(q);
      const radioMatch = official.radioDevice?.toLowerCase().includes(q);
      const phoneMatch = official.mobilePhones.some((p) => p.number.includes(q) || p.label.toLowerCase().includes(q));
      const extMatch = official.internalExtensions?.some((e) => e.number.includes(q) || e.label.toLowerCase().includes(q));

      return nameMatch || titleMatch || badgeMatch || radioMatch || phoneMatch || extMatch;
    });

    // Multi-criteria sorting
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name_asc':
          return a.fullName.localeCompare(b.fullName, 'ar');
        case 'name_desc':
          return b.fullName.localeCompare(a.fullName, 'ar');
        case 'badge_asc':
          return a.badgeNumber.localeCompare(b.badgeNumber, undefined, { numeric: true });
        case 'badge_desc':
          return b.badgeNumber.localeCompare(a.badgeNumber, undefined, { numeric: true });
        case 'division':
          return a.division.localeCompare(b.division, 'ar');
        case 'date_desc':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });
  }, [officials, selectedDivision, searchQuery, sortOption]);

  // Paginated chunk
  const paginatedOfficials = useMemo(() => {
    if (pageSize === -1) return filteredAndSortedOfficials;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedOfficials.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedOfficials, currentPage, pageSize]);

  const totalPages = pageSize === -1 ? 1 : Math.ceil(filteredAndSortedOfficials.length / pageSize);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalOfficials = officials.length;
    const totalMobiles = officials.reduce((acc, curr) => acc + curr.mobilePhones.length, 0);
    const totalInternal = officials.reduce((acc, curr) => acc + (curr.internalExtensions?.length || 0), 0);
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
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Navbar */}
      <Navbar
        isAdmin={isAdmin}
        onToggleAdminLogin={handleToggleAdmin}
        onAddNew={() => {
          if (!isAdmin) {
            setIsLoginModalOpen(true);
            return;
          }
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
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenImport={() => {
          if (!isAdmin) {
            setIsLoginModalOpen(true);
            return;
          }
          setIsImportModalOpen(true);
        }}
        onExportBackup={() => {
          exportOfficialsJson(officials);
          addToast('success', 'تم تصدير النسخة الاحتياطية بنجاح (JSON)');
        }}
        onExportCsv={() => {
          exportOfficialsCsv(officials);
          addToast('success', 'تم تصدير كشف إكسل بنجاح (CSV)');
        }}
        onOpenAuditLogs={() => setIsAuditModalOpen(true)}
        onResetData={handleResetPrompt}
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

              {/* Prominent Quick Actions */}
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

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>التقرير الإداري الرسمي (A4)</span>
                </button>

                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
                  <span className="text-slate-400 font-semibold">تشفير الباركود:</span>
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
        {/* Search, Sorting, Division Filter & View Toggle */}
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

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs shrink-0 w-full md:w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400 font-medium">الترتيب:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-transparent text-amber-300 font-bold focus:outline-none text-xs"
              >
                <option value="badge_asc">رقم الباجة (تصاعدي)</option>
                <option value="badge_desc">رقم الباجة (تنازلي)</option>
                <option value="name_asc">الاسم (أ - ي)</option>
                <option value="name_desc">الاسم (ي - أ)</option>
                <option value="division">الشعبة</option>
                <option value="date_desc">أحدث إضافة</option>
              </select>
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
                النتائج: <strong className="text-amber-400 font-mono">{filteredAndSortedOfficials.length}</strong> مسؤول
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
        {filteredAndSortedOfficials.length === 0 ? (
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedOfficials.map((official) => (
                <OfficialCard
                  key={`${official.id}_${systemQrMode}_${urlConfigVersion}`}
                  official={official}
                  isAdmin={isAdmin}
                  onOpenMobileView={handleOpenMobilePreview}
                  onOpenPrintModal={(o) => setPrintingOfficial(o)}
                  onEdit={(o) => {
                    setEditingOfficial(o);
                    setIsFormModalOpen(true);
                  }}
                  onDelete={handleDeletePrompt}
                  onRequireAdmin={() => setIsLoginModalOpen(true)}
                />
              ))}
            </div>
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
                  {paginatedOfficials.map((official) => (
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
                          <button
                            onClick={() => {
                              if (!isAdmin) {
                                setIsLoginModalOpen(true);
                              } else {
                                setEditingOfficial(official);
                                setIsFormModalOpen(true);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 transition"
                            title="تعديل بيانات المسؤول"
                          >
                            تعديل
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

        {/* Pagination Bar */}
        {filteredAndSortedOfficials.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
            {/* Page size selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">عدد المسؤولين في الصفحة:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-slate-950 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none"
              >
                <option value={6}>6 مسؤولين</option>
                <option value={12}>12 مسؤول</option>
                <option value={24}>24 مسؤول</option>
                <option value={-1}>عرض الكل ({filteredAndSortedOfficials.length})</option>
              </select>
            </div>

            {/* Page numbers navigation */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 flex items-center gap-1 transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>السابق</span>
                </button>

                <div className="flex items-center gap-1 px-2 font-mono font-bold text-amber-400">
                  <span>{currentPage}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-400">{totalPages}</span>
                </div>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 flex items-center gap-1 transition"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Summary count */}
            <div className="text-slate-400">
              عرض {pageSize === -1 ? filteredAndSortedOfficials.length : Math.min(filteredAndSortedOfficials.length, (currentPage - 1) * pageSize + 1)} إلى {pageSize === -1 ? filteredAndSortedOfficials.length : Math.min(filteredAndSortedOfficials.length, currentPage * pageSize)} من أصل {filteredAndSortedOfficials.length} مسؤول
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
        existingOfficials={officials}
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

      {/* 7. Official Printable Administrative Report Modal */}
      <OfficialReportModal
        isOpen={isReportModalOpen}
        officials={officials}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* 8. Import JSON Backup Modal */}
      <ImportBackupModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* 9. Audit Activity Log Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* 10. Admin PIN Login & Change Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          addToast('success', 'تم تفعيل وضع الإدارة', 'صلاحيات الإضافة والتعديل والحذف متاحة الآن');
        }}
      />

      {/* 11. Interactive Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
