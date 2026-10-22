import React from 'react';

interface EmblemProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'emerald' | 'light' | 'dark';
}

export const Emblem: React.FC<EmblemProps> = ({
  className = '',
  size = 'md',
  variant = 'gold',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  const variantStyles = {
    gold: 'border-amber-400/80 bg-gradient-to-br from-amber-950/80 via-slate-900 to-amber-900/60 text-amber-300 shadow-amber-500/10',
    emerald: 'border-emerald-500/80 bg-gradient-to-br from-emerald-950/80 via-slate-900 to-emerald-900/60 text-emerald-300 shadow-emerald-500/10',
    light: 'border-amber-500/60 bg-amber-50 text-amber-900 shadow-slate-200',
    dark: 'border-slate-700 bg-slate-800 text-slate-200 shadow-black/20',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl border p-1 font-bold shadow-md select-none transition-all ${sizeMap[size]} ${variantStyles[variant]} ${className}`}
      title="العتبة الحسينية المقدسة - مجمع سيد الشهداء الخدمي"
    >
      {/* Decorative Islamic arch geometric lines */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Islamic Eight-point star / ornamental contour */}
        <path
          d="M50 2 
             C55 18 68 18 78 22 
             C82 32 82 45 98 50 
             C82 55 82 68 78 78 
             C68 82 55 82 50 98 
             C45 82 32 82 22 78 
             C18 68 18 55 2 50 
             C18 45 18 32 22 22 
             C32 18 45 18 50 2 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="round"
          className="opacity-90"
        />
        {/* Inner circle */}
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" opacity="0.75" />
        {/* Dome & Minaret stylized silhouette */}
        <path
          d="M50 26 C43 32 40 40 40 47 L60 47 C60 40 57 32 50 26 Z"
          fill="currentColor"
          opacity="0.95"
        />
        {/* Minarets on sides */}
        <rect x="33" y="34" width="3.5" height="18" rx="1.5" fill="currentColor" opacity="0.8" />
        <rect x="63.5" y="34" width="3.5" height="18" rx="1.5" fill="currentColor" opacity="0.8" />
        {/* Base line */}
        <rect x="30" y="52" width="40" height="4" rx="2" fill="currentColor" />
        {/* Calligraphic crescent / decorative lower curve */}
        <path
          d="M36 60 Q50 72 64 60 Q50 67 36 60 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
