import React, { useState } from 'react';
import { Official, PhoneNumber, InternalExtension } from '../types';
import { 
  X, 
  Plus, 
  Trash2, 
  User, 
  Phone, 
  Radio, 
  Mail, 
  Building2, 
  MapPin, 
  Clock, 
  Droplet, 
  Camera, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface OfficialFormModalProps {
  initialOfficial?: Official | null;
  existingOfficials?: Official[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (official: Official) => void;
}

const DEFAULT_DIVISIONS = [
  'إدارة القسم ورئاسته',
  'شعبة السيطرة والمتابعة',
  'شعبة الصيانة الفنية',
  'شعبة الفندقة والضيافة',
  'شعبة السلامة والأمن الصناعي',
  'شعبة الخدمات العامة',
  'شعبة الشؤون الإدارية والذاتية',
  'شعبة المخازن والتجهيز',
];

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
];

export const OfficialFormModal: React.FC<OfficialFormModalProps> = ({
  initialOfficial,
  existingOfficials = [],
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialOfficial);

  const [fullName, setFullName] = useState(initialOfficial?.fullName || '');
  const [title, setTitle] = useState(initialOfficial?.title || '');
  const [division, setDivision] = useState(initialOfficial?.division || DEFAULT_DIVISIONS[0]);
  const [customDivision, setCustomDivision] = useState('');
  const [subUnit, setSubUnit] = useState(initialOfficial?.subUnit || '');
  const [badgeNumber, setBadgeNumber] = useState(initialOfficial?.badgeNumber || `SSH-${Math.floor(100 + Math.random() * 900)}`);
  const [email, setEmail] = useState(initialOfficial?.email || '');
  const [radioDevice, setRadioDevice] = useState(initialOfficial?.radioDevice || 'قناة 02 - نداء ');
  const [avatarUrl, setAvatarUrl] = useState(initialOfficial?.avatarUrl || SAMPLE_AVATARS[0]);
  const [dutyLocation, setDutyLocation] = useState(initialOfficial?.dutyLocation || '');
  const [shift, setShift] = useState(initialOfficial?.shift || 'صباحي (07:00 - 15:00)');
  const [bloodType, setBloodType] = useState(initialOfficial?.bloodType || 'O+');
  const [notes, setNotes] = useState(initialOfficial?.notes || '');
  const [formError, setFormError] = useState('');

  // Multiple Mobile Phones state
  const [mobilePhones, setMobilePhones] = useState<PhoneNumber[]>(
    initialOfficial?.mobilePhones?.length
      ? initialOfficial.mobilePhones
      : [
          { id: '1', label: 'آسياسيل (شخصي)', number: '', isPrimary: true, hasWhatsapp: true },
        ]
  );

  // Internal Extensions state
  const [internalExtensions, setInternalExtensions] = useState<InternalExtension[]>(
    initialOfficial?.internalExtensions?.length
      ? initialOfficial.internalExtensions
      : [{ id: '1', label: 'مكتب الشعبة', number: '' }]
  );

  const handleAddMobile = () => {
    setMobilePhones([
      ...mobilePhones,
      {
        id: String(Date.now()),
        label: mobilePhones.length === 1 ? 'زين العراق (طوارئ)' : `هاتف إضافي ${mobilePhones.length + 1}`,
        number: '',
        isPrimary: false,
        hasWhatsapp: true,
      },
    ]);
  };

  const handleRemoveMobile = (id: string) => {
    if (mobilePhones.length === 1) return;
    setMobilePhones(mobilePhones.filter((p) => p.id !== id));
  };

  const handleUpdateMobile = (id: string, updates: Partial<PhoneNumber>) => {
    setMobilePhones(
      mobilePhones.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleAddExt = () => {
    setInternalExtensions([
      ...internalExtensions,
      {
        id: String(Date.now()),
        label: `موقع إضافي ${internalExtensions.length + 1}`,
        number: '',
      },
    ]);
  };

  const handleRemoveExt = (id: string) => {
    setInternalExtensions(internalExtensions.filter((e) => e.id !== id));
  };

  const handleUpdateExt = (id: string, updates: Partial<InternalExtension>) => {
    setInternalExtensions(
      internalExtensions.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('يرجى إدخال اسم المسؤول الكامل');
      return;
    }

    const trimmedBadge = badgeNumber.trim();
    if (!trimmedBadge) {
      setFormError('يرجى تحديد رقم الباجة');
      return;
    }

    // Check duplicate badge number
    const isDuplicate = existingOfficials.some(
      (o) => o.id !== initialOfficial?.id && o.badgeNumber.toLowerCase().trim() === trimmedBadge.toLowerCase()
    );
    if (isDuplicate) {
      setFormError(`رقم الباجة (${trimmedBadge}) مستخدم مسبقاً لمسؤول آخر. يرجى اختيار رقم باجة مختلف.`);
      return;
    }

    const validMobiles = mobilePhones.filter((m) => m.number.trim().length > 0);
    if (validMobiles.length === 0) {
      setFormError('يرجى إدخال رقم هاتف محمول واحد على الأقل للمسؤول');
      return;
    }

    const finalDivision = division === 'custom' ? customDivision.trim() || 'شعبة أخرى' : division;

    const officialToSave: Official = {
      id: initialOfficial?.id || `OFF-${Date.now()}`,
      badgeNumber: trimmedBadge,
      fullName: fullName.trim(),
      title: title.trim() || 'مسؤول في مجمع سيد الشهداء الخدمي',
      department: 'قسم مجمع سيد الشهداء عليه السلام الخدمي',
      division: finalDivision,
      subUnit: subUnit.trim(),
      mobilePhones: validMobiles,
      internalExtensions: internalExtensions.filter((e) => e.number.trim().length > 0),
      email: email.trim(),
      radioDevice: radioDevice.trim(),
      avatarUrl: avatarUrl.trim(),
      bloodType: bloodType.trim(),
      dutyLocation: dutyLocation.trim(),
      shift: shift.trim(),
      notes: notes.trim(),
      active: true,
      createdAt: initialOfficial?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(officialToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto font-cairo">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/60 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-tajawal">
                {isEditing ? 'تعديل بيانات المسؤول' : 'إضافة مسؤول جديد للبطاقات الذكية'}
              </h3>
              <p className="text-xs text-emerald-300/90">
                قسم مجمع سيد الشهداء (عليه السلام) الخدمي
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Avatar & Photo selection */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={avatarUrl}
                alt="الصورة الشخصية"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/80 bg-slate-800"
              />
              <label
                className="absolute -bottom-2 -left-2 p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-md transition"
                title="رفع صورة من الجهاز"
              >
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 w-full text-center sm:text-right">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                الصورة الرسمية للمسؤول
              </label>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                {SAMPLE_AVATARS.map((url, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setAvatarUrl(url)}
                    className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition ${
                      avatarUrl === url ? 'border-amber-400 scale-110' : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="أو ضع رابط صورة مباشر (URL)"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="mt-2 w-full text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 focus:border-amber-400 focus:outline-none dir-ltr"
              />
            </div>
          </div>

          {/* Basic Info: Name, Title, Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                اسم المسؤول الكامل <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: المهندس علي حسين الكربلائي"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-sm font-semibold px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                المسمى الوظيفي
              </label>
              <input
                type="text"
                placeholder="مثال: مسؤول شعبة السيطرة والاتصالات"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                رقم الباجة
              </label>
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                className="w-full text-sm font-mono font-bold px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Division & Sub-unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                الشعبة التابعة في المجمع
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              >
                {DEFAULT_DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
                <option value="custom">+ كتابة شعبة أخرى...</option>
              </select>
              {division === 'custom' && (
                <input
                  type="text"
                  placeholder="اكتب اسم الشعبة..."
                  value={customDivision}
                  onChange={(e) => setCustomDivision(e.target.value)}
                  className="mt-2 w-full text-sm px-3 py-2 rounded-xl bg-slate-800 border border-amber-500/50 text-white focus:outline-none"
                />
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                الوحدة أو القسم الفرعي (اختياري)
              </label>
              <input
                type="text"
                placeholder="مثال: وحدة منظومة الاتصالات والمراقبة"
                value={subUnit}
                onChange={(e) => setSubUnit(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* MULTIPLE MOBILE PHONE NUMBERS (Dynamic Repeater) */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">
                  أرقام الهواتف المحمولة (إمكانية إضافة أكثر من رقم)
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddMobile}
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة رقم هاتف آخر</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {mobilePhones.map((phone, idx) => (
                <div
                  key={phone.id}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-2"
                >
                  <div className="w-full sm:w-1/3">
                    <input
                      type="text"
                      placeholder="تسمية الرقم (مثال: آسياسيل، زين)"
                      value={phone.label}
                      onChange={(e) => handleUpdateMobile(phone.id, { label: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="w-full sm:flex-1">
                    <input
                      type="tel"
                      required={idx === 0}
                      placeholder="رقم الهاتف (مثال: 07701234567)"
                      value={phone.number}
                      onChange={(e) => handleUpdateMobile(phone.id, { number: e.target.value })}
                      className="w-full text-sm font-mono font-bold px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none dir-ltr"
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    <label className="flex items-center gap-1 cursor-pointer text-slate-300 text-[11px]">
                      <input
                        type="checkbox"
                        checked={phone.hasWhatsapp}
                        onChange={(e) => handleUpdateMobile(phone.id, { hasWhatsapp: e.target.checked })}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                      />
                      <span>واتساب</span>
                    </label>

                    <label className="flex items-center gap-1 cursor-pointer text-slate-300 text-[11px]">
                      <input
                        type="radio"
                        name="primaryMobile"
                        checked={phone.isPrimary}
                        onChange={() => {
                          setMobilePhones(
                            mobilePhones.map((p) => ({
                              ...p,
                              isPrimary: p.id === phone.id,
                            }))
                          );
                        }}
                        className="text-amber-500 focus:ring-0"
                      />
                      <span>رئيسي</span>
                    </label>

                    {mobilePhones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMobile(phone.id)}
                        className="p-1 rounded-md text-rose-400 hover:bg-rose-500/20 transition"
                        title="حذف الرقم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INTERNAL EXTENSIONS & RADIO DEVICE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Internal extensions */}
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>الهاتف الداخلي (البدالة)</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddExt}
                  className="text-[11px] font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  + إضافة بدالة
                </button>
              </div>

              {internalExtensions.map((ext) => (
                <div key={ext.id} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="الموقع (مكتب، غرفة)"
                    value={ext.label}
                    onChange={(e) => handleUpdateExt(ext.id, { label: e.target.value })}
                    className="w-1/2 text-xs px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="رقم الداخلي (102)"
                    value={ext.number}
                    onChange={(e) => handleUpdateExt(ext.id, { number: e.target.value })}
                    className="w-1/2 text-xs font-mono font-bold px-2 py-1 rounded bg-slate-900 border border-slate-700 text-amber-300 focus:outline-none"
                  />
                  {internalExtensions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExt(ext.id)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Radio device (جهاز النداء) */}
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" />
                <span>جهاز النداء اللاسلكي</span>
              </label>
              <input
                type="text"
                placeholder="مثال: قناة 02 - نداء 205"
                value={radioDevice}
                onChange={(e) => setRadioDevice(e.target.value)}
                className="w-full text-sm font-semibold px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 leading-tight">
                يظهر هذا النداء على الباجة وشاشة الهاتف عند مسح الكود
              </p>
            </div>
          </div>

          {/* Email, Location, Shift, Blood Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                البريد الإلكتروني الرسمي
              </label>
              <input
                type="email"
                placeholder="official@imamhussain.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-400 focus:outline-none dir-ltr"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                فصيلة الدم للطوارئ
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold focus:outline-none"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                موقع التواجد بالمجمع (المكتب / القاعة)
              </label>
              <input
                type="text"
                placeholder="مثال: المبنى الرئيسي - الطابق الثاني"
                value={dutyLocation}
                onChange={(e) => setDutyLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                أوقات الدوام / المناوبة
              </label>
              <input
                type="text"
                placeholder="مثال: صباحي (07:00 - 15:00) أو مناوبة 24/48"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              ملاحظات وواجبات إضافية
            </label>
            <textarea
              rows={2}
              placeholder="أي تفاصيل أو مهام إضافية تظهر في البطاقة الذكية..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none resize-none"
            />
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span className="font-bold">تنبيه:</span>
              <span>{formError}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'حفظ التعديلات' : 'إضافة المسؤول وتوليد الباركود'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
