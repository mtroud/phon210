/**
 * Types for Sayyid al-Shuhada Service Complex - Smart Card & Badge System
 * العتبة الحسينية المقدسة - قسم مجمع سيد الشهداء عليه السلام الخدمي
 */

export interface PhoneNumber {
  id: string;
  label: string; // e.g. "آسياسيل (شخصي)", "زين العراق (طوارئ)", "كورك", "هاتف العمل"
  number: string;
  isPrimary?: boolean;
  hasWhatsapp?: boolean;
}

export interface InternalExtension {
  id: string;
  label: string; // e.g. "مكتب الإدارة", "غرفة المراقبة والسيطرة", "الاستعلامات المركزية"
  number: string;
}

export interface Official {
  id: string;
  badgeNumber: string; // e.g. "SSH-1042"
  fullName: string; // e.g. "المهندس علي حسين الكربلائي"
  title: string; // e.g. "مسؤول الشعبة", "معاون رئيس القسم", "مسؤول وحدة"
  department: string; // Default: "قسم مجمع سيد الشهداء عليه السلام الخدمي"
  division: string; // e.g. "شعبة السيطرة والمتابعة", "شعبة الصيانة الفنية", "شعبة الفندقة والضيافة"
  subUnit?: string; // e.g. "وحدة الكاميرات والاتصالات", "وحدة التكييف والتبريد"
  mobilePhones: PhoneNumber[];
  internalExtensions: InternalExtension[];
  email: string;
  radioDevice: string; // e.g. "قناة 04 - نداء 208" or "CH-4 / ID-208"
  avatarUrl: string;
  bloodType?: string; // e.g. "O+", "A+", "B+", "AB+"
  dutyLocation?: string; // e.g. "المبنى الرئيسي - الطابق الثاني - غرفة السيطرة"
  shift?: string; // e.g. "صباحي (07:00 - 15:00)", "مسائي", "مناوبة 24/48"
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'directory' | 'print_studio' | 'mobile_preview' | 'batch_print';
export type CardTemplate = 'vertical_badge' | 'horizontal_id' | 'minimal_qr';
export type QrTargetMode = 'direct_vcard' | 'smart_profile' | 'quick_call';
export type PrintBatchMode = 'vertical_badges' | 'horizontal_cards' | 'quick_directory_sheet' | 'qr_stickers';
export type CardTheme = 'royal_emerald' | 'print_white' | 'obsidian_gold';
export type PaperType = 'a4_sheet' | 'pvc_card' | 'qr_stickers';
export type DuplexLayout = 'side_by_side' | 'faces_first' | 'backs_first';
