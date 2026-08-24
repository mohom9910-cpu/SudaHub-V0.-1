import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Satellite, 
  ArrowDownLeft, 
  Headphones, 
  CheckCircle,
  TrendingUp,
  Percent
} from 'lucide-react';
import { AppSettings } from '../types.ts';

interface HeroBannerProps {
  settings: AppSettings;
  onExploreServices: () => void;
  onOpenTrackOrder: () => void;
  onOpenVIPLookup: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  settings,
  onExploreServices,
  onOpenTrackOrder,
  onOpenVIPLookup
}) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-10 sm:pt-10 sm:pb-16 bg-gradient-to-b from-[#0F172A]/80 via-[#0A0F1D] to-[#0A0F1D]">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Announcement Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs sm:text-sm font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>متوفر الآن: تفعيل فوري لـ ChatGPT 4.o و Cursor Pro وباقات Starlink السودان</span>
          </div>
        </div>

        {/* Hero Headline & Intro */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-4 sm:mb-6">
            اشتراكاتك الرقمية والذكاء الاصطناعي في السودان{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              بالجنيه السوداني
            </span>
          </h1>
          
          <p className="text-sm sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-8">
            ودّع مشاكل بطاقات الدفع الدولية. منصة <strong className="text-white">SudaHub</strong> توفر لك اشتراكات ChatGPT Plus، Claude Pro، Cursor AI، كانفا، وخدمات إنترنت Starlink بتفعيل رسمي وضمان كامل عبر تطبيق <strong className="text-emerald-400 font-semibold">بنكك (بنك الخرطوم)</strong> والدولار.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14">
            <button
              onClick={onExploreServices}
              id="hero-explore-services-btn"
              className="px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span>تصفح الباقات والاشتراكات</span>
              <ArrowDownLeft className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenTrackOrder}
              id="hero-track-order-btn"
              className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>متابعة حالة طلبك برقم الطلب</span>
            </button>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mb-1">دفع فوري عبر بنكك</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              ادفع بالجنيه السوداني بسعر صرف عادل ومعتمد ومحدث لحظياً.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mb-1">تفعيل خلال 15 دقيقة</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              سرعة فائقة في معالجة الإشعارات وإرسال دعوات التفعيل لحسابك.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mb-1">ضمان كامل 100%</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              اشتراكات رسمية مضمونة طوال مدة الباقة مع تعويض فوري واستبدال.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
              <Satellite className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mb-1">خدمات Starlink السودان</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              تجديد باقات الروم وتوفير أطقم أجهزة ستارلينك الأصلية في كل الولايات.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
