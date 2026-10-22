import React, { useState } from 'react';
import { verifyAdminPin, setAdminPin, startAdminSession } from '../utils/security';
import { addAuditLog } from '../utils/storage';
import { ShieldCheck, Lock, KeyRound, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pin)) {
      startAdminSession();
      addAuditLog({
        action: 'edit',
        details: 'تسجيل دخول ناجح إلى وضع الإدارة والتحكم',
        performedBy: 'المسؤول الإداري',
      });
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('رمز الأمان غير صحيح. الرمز الافتراضي هو 1234.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAdminPin(pin)) {
      setError('رمز الأمان الحالي غير صحيح');
      return;
    }
    if (newPin.length < 4) {
      setError('يجب أن يتكون الرمز الجديد من 4 أرقام على الأقل');
      return;
    }
    if (newPin !== confirmNewPin) {
      setError('الرمز الجديد وتأكيده غير متطابقين');
      return;
    }

    if (setAdminPin(newPin)) {
      addAuditLog({
        action: 'edit',
        details: 'تم تغيير رمز الأمان الإداري للنظام بنجاح',
        performedBy: 'المسؤول الإداري',
      });
      setSuccessMessage('تم تغيير رمز الأمان بنجاح');
      setError('');
      setTimeout(() => {
        setIsChangingPin(false);
        setSuccessMessage('');
        setPin('');
        setNewPin('');
        setConfirmNewPin('');
      }, 1500);
    } else {
      setError('فشل في حفظ الرمز الجديد');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-cairo">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-tajawal">
                {isChangingPin ? 'تغيير رمز الأمان الإداري' : 'تسجيل دخول الإدارة (Admin Lock)'}
              </h3>
              <p className="text-xs text-slate-400">
                حماية العمليات الإدارية الحساسة
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

        {/* Form */}
        {!isChangingPin ? (
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              يرجى إدخال رمز الأمان الإداري لتفعيل صلاحيات الإضافة، التعديل، والحذف.
              <span className="block text-amber-400/80 font-mono text-[11px] mt-1">
                (الرمز الافتراضي الأولي للنظام: 1234)
              </span>
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                رمز المرور (PIN)
              </label>
              <input
                type="password"
                maxLength={10}
                required
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="••••"
                className="w-full text-center text-xl font-mono tracking-widest py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(true);
                  setError('');
                }}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>تغيير رمز المرور</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                تأكيد الدخول
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="space-y-3.5 pt-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                رمز المرور الحالي
              </label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="الرمز الحالي (1234 افتراضياً)"
                className="w-full text-center font-mono py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                رمز المرور الجديد
              </label>
              <input
                type="password"
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="الرمز الجديد (4 أرقام أو أكثر)"
                className="w-full text-center font-mono py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                تأكيد رمز المرور الجديد
              </label>
              <input
                type="password"
                required
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value)}
                placeholder="أعد إدخال الرمز الجديد"
                className="w-full text-center font-mono py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(false);
                  setError('');
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                العودة لتسجيل الدخول
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
              >
                حفظ الرمز الجديد
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
