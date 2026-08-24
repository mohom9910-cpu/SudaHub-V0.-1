import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Crown, 
  MessageSquare, 
  LayoutDashboard, 
  ArrowLeftRight, 
  CheckCircle2, 
  RefreshCw,
  Phone,
  HelpCircle,
  ShoppingBag,
  Cloud,
  Smartphone
} from 'lucide-react';
import { AppSettings, Order } from '../types.ts';

interface NavbarProps {
  settings: AppSettings;
  activeOrdersCount: number;
  onOpenTrackOrder: () => void;
  onOpenVIPLookup: () => void;
  onOpenReport: () => void;
  onOpenAdmin: () => void;
  onOpenGoogleDrive?: () => void;
  onOpenAndroidAPK?: () => void;
  isAdminOpen: boolean;
  onScrollToServices: () => void;
  onScrollToExchangeRate: () => void;
  onScrollToReviews: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeOrdersCount,
  onOpenTrackOrder,
  onOpenVIPLookup,
  onOpenReport,
  onOpenAdmin,
  onOpenGoogleDrive,
  onOpenAndroidAPK,
  isAdminOpen,
  onScrollToServices,
  onScrollToExchangeRate,
  onScrollToReviews
}) => {
  const [copiedRate, setCopiedRate] = useState(false);

  const handleCopyRate = () => {
    navigator.clipboard?.writeText(`1 USD = ${settings.usdToSdgRate.toLocaleString()} SDG`);
    setCopiedRate(true);
    setTimeout(() => setCopiedRate(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A0F1D]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 text-right group cursor-pointer focus:outline-none"
              id="brand-logo-btn"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-[#0A0F1D] rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-lg sm:text-xl bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                    S
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                    Suda<span className="text-emerald-400">Hub</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                    سوداهب
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  بوابة الاشتراكات والحلول الرقمية في السودان
                </p>
              </div>
            </button>
          </div>

          {/* Quick Exchange Rate Chip */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={handleCopyRate}
              id="exchange-rate-pill"
              title="انقر لنسخ سعر الصرف المعتمد"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-300 transition-all cursor-pointer shadow-inner"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-slate-400">سعر الصرف:</span>
              <span className="font-bold text-white tracking-wide">1 USD = {settings.usdToSdgRate.toLocaleString()} SDG</span>
              {copiedRate ? (
                <span className="text-emerald-400 font-medium">✓ تم النسخ</span>
              ) : (
                <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          </div>

          {/* Navigation Links & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Track Orders Button */}
            <button
              onClick={onOpenTrackOrder}
              id="nav-track-order-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>متابعة طلبي</span>
              {activeOrdersCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center text-[11px] font-bold bg-emerald-500 text-slate-950 rounded-full">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* VIP Offers Button */}
            <button
              onClick={onOpenVIPLookup}
              id="nav-vip-lookup-btn"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs sm:text-sm font-semibold text-amber-300 transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>عروض VIP</span>
            </button>

            {/* Report Complaint Button */}
            <button
              onClick={onOpenReport}
              id="nav-report-btn"
              title="تقديم بلاغ أو استفسار"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-rose-400" />
              <span>بلاغ / مساعدة</span>
            </button>

            {/* Android APK & ZIP Download Button */}
            {onOpenAndroidAPK && (
              <button
                onClick={onOpenAndroidAPK}
                id="nav-android-apk-btn"
                title="تنزيل المشروع وتثبيت تطبيق Android"
                className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-xs sm:text-sm font-bold text-emerald-300 transition-all cursor-pointer shadow-sm shadow-emerald-500/10"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">تنزيل ZIP / تطبيق Android</span>
                <span className="sm:hidden">ZIP / APK</span>
              </button>
            )}

            {/* Google Drive Export Button */}
            {onOpenGoogleDrive && (
              <button
                onClick={onOpenGoogleDrive}
                id="nav-gdrive-export-btn"
                title="تصدير وحفظ في Google Drive"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs sm:text-sm font-semibold text-cyan-300 transition-all cursor-pointer"
              >
                <Cloud className="w-4 h-4 text-cyan-400" />
                <span>Google Drive</span>
              </button>
            )}

            {/* Direct WhatsApp Support */}
            <a
              href="https://wa.me/249907756261?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20SudaHub"
              target="_blank"
              rel="noreferrer"
              id="nav-whatsapp-direct"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-xs sm:text-sm font-bold text-emerald-300 transition-all shadow-sm"
              title="تواصل معنا عبر واتساب بزنس (+249907756261)"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span className="hidden md:inline">خدمة العملاء WhatsApp</span>
              <span className="md:hidden">واتساب</span>
            </a>

            {/* Admin Switch Button */}
            <button
              onClick={onOpenAdmin}
              id="nav-admin-toggle-btn"
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isAdminOpen 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/30' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{isAdminOpen ? 'واجهة العميل' : 'لوحة الإدارة'}</span>
              <span className="sm:hidden">{isAdminOpen ? 'الرئيسية' : 'الإدارة'}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
