import { Official, AuditLog } from '../types';
import { INITIAL_OFFICIALS } from '../data/initialOfficials';

const STORAGE_KEY = 'mogma_shuhada_officials_v1';
const SNAPSHOTS_KEY = 'mogma_shuhada_snapshots_v1';
const AUDIT_LOGS_KEY = 'mogma_shuhada_audit_logs_v1';

export function loadOfficials(): Official[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveOfficials(INITIAL_OFFICIALS, false);
      return INITIAL_OFFICIALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_OFFICIALS;
  } catch (e) {
    console.error('Failed to load officials from localStorage:', e);
    return INITIAL_OFFICIALS;
  }
}

export function saveOfficials(officials: Official[], createSnapshot = true): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(officials));
    if (createSnapshot) {
      saveAutoSnapshot(officials);
    }
  } catch (e) {
    console.error('Failed to save officials to localStorage:', e);
  }
}

export function resetOfficialsToDefault(): Official[] {
  saveOfficials(INITIAL_OFFICIALS);
  addAuditLog({
    action: 'reset',
    details: 'إعادة تعيين قاعدة البيانات إلى الحالة الافتراضية المعتمدة للمجمع',
    performedBy: 'مسؤول النظام',
  });
  return INITIAL_OFFICIALS;
}

// ============================================================================
// Snapshots History (النسخ الاحتياطي التلقائي المتراكم)
// ============================================================================
export interface DataSnapshot {
  id: string;
  timestamp: string;
  count: number;
  data: Official[];
  reason: string;
}

export function getSnapshots(): DataSnapshot[] {
  try {
    const raw = localStorage.getItem(SNAPSHOTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAutoSnapshot(officials: Official[]): void {
  try {
    const list = getSnapshots();
    const newSnapshot: DataSnapshot = {
      id: `SNP-${Date.now()}`,
      timestamp: new Date().toISOString(),
      count: officials.length,
      data: officials,
      reason: `حفظ تلقائي دوري (${officials.length} مسؤول)`,
    };
    // Keep last 10 snapshots max to avoid filling localStorage
    const updated = [newSnapshot, ...list.slice(0, 9)];
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Snapshot save warning:', e);
  }
}

export function restoreSnapshot(snapshotId: string): Official[] | null {
  const list = getSnapshots();
  const match = list.find((s) => s.id === snapshotId);
  if (match && Array.isArray(match.data)) {
    saveOfficials(match.data, false);
    addAuditLog({
      action: 'reset',
      details: `استعادة نسخة احتياطية من نقطة استرجاع سابقة (${new Date(match.timestamp).toLocaleString('ar-IQ')})`,
      performedBy: 'مسؤول النظام',
    });
    return match.data;
  }
  return null;
}

// ============================================================================
// Audit Logging (سجل العمليات والنشاط الإداري)
// ============================================================================
export function getAuditLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
  try {
    const logs = getAuditLogs();
    const newEntry: AuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    // Keep last 50 audit logs
    const updated = [newEntry, ...logs.slice(0, 49)];
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Audit log write error:', e);
  }
}

export function clearAuditLogs(): void {
  try {
    localStorage.removeItem(AUDIT_LOGS_KEY);
  } catch {
    // ignore
  }
}

// ============================================================================
// Export & Import Tools (تصدير واستيراد متوافق مع إكسل وJSON)
// ============================================================================
export function exportOfficialsJson(officials: Official[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(officials, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('download', `دليل_مسؤولي_مجمع_سيد_الشهداء_نسخة_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  addAuditLog({
    action: 'export_backup',
    details: `تصدير نسخة احتياطية JSON تحتوي على (${officials.length}) مسؤول`,
    performedBy: 'مسؤول النظام',
  });
}

export function exportOfficialsCsv(officials: Official[]): void {
  // UTF-8 BOM (\uFEFF) ensures Excel opens Arabic correctly
  const headers = [
    'رقم الباجة',
    'الاسم الكامل',
    'المسمى الوظيفي',
    'الشعبة',
    'الوحدة',
    'الهواتف المحمولة',
    'الهاتف الداخلي (البدالة)',
    'جهاز النداء اللاسلكي',
    'البريد الإلكتروني',
    'فصيلة الدم',
    'موقع التواجد بالمجمع',
    'المناوبة / الدوام',
    'ملاحظات',
  ];

  const rows = officials.map((o) => {
    const mobiles = o.mobilePhones.map((m) => `${m.label}: ${m.number}`).join(' | ');
    const extensions = o.internalExtensions?.map((e) => `${e.label}: ${e.number}`).join(' | ') || '';

    return [
      `"${(o.badgeNumber || '').replace(/"/g, '""')}"`,
      `"${(o.fullName || '').replace(/"/g, '""')}"`,
      `"${(o.title || '').replace(/"/g, '""')}"`,
      `"${(o.division || '').replace(/"/g, '""')}"`,
      `"${(o.subUnit || '').replace(/"/g, '""')}"`,
      `"${mobiles.replace(/"/g, '""')}"`,
      `"${extensions.replace(/"/g, '""')}"`,
      `"${(o.radioDevice || '').replace(/"/g, '""')}"`,
      `"${(o.email || '').replace(/"/g, '""')}"`,
      `"${(o.bloodType || '').replace(/"/g, '""')}"`,
      `"${(o.dutyLocation || '').replace(/"/g, '""')}"`,
      `"${(o.shift || '').replace(/"/g, '""')}"`,
      `"${(o.notes || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `كشف_مسؤولي_مجمع_سيد_الشهداء_الخدمي_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  addAuditLog({
    action: 'export_csv',
    details: `تصدير كشف إكسل (CSV) باللغة العربية لـ (${officials.length}) مسؤول`,
    performedBy: 'مسؤول النظام',
  });
}

export function validateImportedOfficials(data: unknown): { valid: boolean; count: number; error?: string; list?: Official[] } {
  if (!Array.isArray(data)) {
    return { valid: false, count: 0, error: 'الملف لا يحتوي على مصفوفة بيانات صالحة' };
  }
  if (data.length === 0) {
    return { valid: false, count: 0, error: 'الملف فارغ ولا يحتوي على أي سجلات' };
  }

  // Validate at least one item looks like an Official
  const sample = data[0];
  if (!sample || typeof sample !== 'object' || !('fullName' in sample)) {
    return { valid: false, count: 0, error: 'هيكل البيانات غير متوافق مع نظام مسؤولي المجمع' };
  }

  // Sanitize each item to ensure it has required structure
  const sanitizedList: Official[] = data.map((item, index) => {
    const raw = item as Record<string, unknown>;
    return {
      id: String(raw.id || `OFF-${Date.now()}-${index}`),
      badgeNumber: String(raw.badgeNumber || `SSH-${index + 100}`),
      fullName: String(raw.fullName || 'مسؤول بدون اسم'),
      title: String(raw.title || 'مسؤول في مجمع سيد الشهداء الخدمي'),
      department: String(raw.department || 'قسم مجمع سيد الشهداء عليه السلام الخدمي'),
      division: String(raw.division || 'شعبة المجمع الخدمي'),
      subUnit: typeof raw.subUnit === 'string' ? raw.subUnit : '',
      mobilePhones: Array.isArray(raw.mobilePhones)
        ? raw.mobilePhones.map((p, pIdx) => ({
            id: String(p?.id || pIdx),
            label: String(p?.label || 'محمول'),
            number: String(p?.number || ''),
            isPrimary: Boolean(p?.isPrimary),
            hasWhatsapp: Boolean(p?.hasWhatsapp),
          }))
        : [{ id: '1', label: 'محمول', number: String(raw.mobile || ''), isPrimary: true, hasWhatsapp: true }],
      internalExtensions: Array.isArray(raw.internalExtensions)
        ? raw.internalExtensions.map((e, eIdx) => ({
            id: String(e?.id || eIdx),
            label: String(e?.label || 'بدالة'),
            number: String(e?.number || ''),
          }))
        : [],
      email: typeof raw.email === 'string' ? raw.email : '',
      radioDevice: typeof raw.radioDevice === 'string' ? raw.radioDevice : '',
      avatarUrl: typeof raw.avatarUrl === 'string' && raw.avatarUrl ? raw.avatarUrl : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      bloodType: typeof raw.bloodType === 'string' ? raw.bloodType : 'O+',
      dutyLocation: typeof raw.dutyLocation === 'string' ? raw.dutyLocation : '',
      shift: typeof raw.shift === 'string' ? raw.shift : '',
      notes: typeof raw.notes === 'string' ? raw.notes : '',
      active: true,
      createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  return { valid: true, count: sanitizedList.length, list: sanitizedList };
}
