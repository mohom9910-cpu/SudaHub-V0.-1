import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  HelpCircle, 
  Lock, 
  ExternalLink,
  Crown,
  Heart,
  Cloud,
  Smartphone
} from 'lucide-react';
import { AppSettings } from '../types.ts';

interface FooterProps {
  settings: AppSettings;
  onOpenAdmin: () => void;
  onOpenReportModal: () => void;
  onOpenVIPModal: () => void;
  onOpenTrackOrders: () => void;
  onOpenGoogleDriveModal?: () => void;
  onOpenAndroidAPKModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onOpenReportModal,
  onOpenVIPModal,
  onOpenTrackOrders,
  onOpenGoogleDriveModal,
  onOpenAndroidAPKModal
}) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
              </div>
              <span className="text-lg font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Suda<span className="text-emerald-400">Hub</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              المنصة السودانية الأولى لتفعيل وتجديد اشتراكات الذكاء الاصطناعي، البرمجيات، وخدمات ستارلينك الفضائية بالدفع المحلي عبر تطبيق بنكك.
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>تفعيل رسمي وضمان 100% طوال مدة الاشتراك</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={onOpenTrackOrders} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-right"
                >
                  متابعة حالة الطلبات والتفعيل
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenVIPModal} 
                  className="hover:text-amber-400 text-amber-300/90 transition-colors cursor-pointer text-right flex items-center gap-1"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>بوابة العملاء المميزين (VIP)</span>
                </button>
              </li>
              {onOpenAndroidAPKModal && (
                <li>
                  <button 
                    onClick={onOpenAndroidAPKModal} 
                    className="hover:text-emerald-400 text-emerald-300 transition-colors cursor-pointer text-right flex items-center gap-1.5 font-bold"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تنزيل المشروع كاملاً (ZIP) وتطبيق Android</span>
                  </button>
                </li>
              )}
              {onOpenGoogleDriveModal && (
                <li>
                  <button 
                    onClick={onOpenGoogleDriveModal} 
                    className="hover:text-cyan-400 text-cyan-400/90 transition-colors cursor-pointer text-right flex items-center gap-1.5 font-medium"
                  >
                    <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                    <span>تصدير في Google Drive</span>
                  </button>
                </li>
              )}
              <li>
                <button 
                  onClick={onOpenReportModal} 
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-right"
                >
                  مركز البلاغات والدعم الفني
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Bankak & Payment Guarantee */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm">بيانات الدفع المعتمدة</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
              <span className="text-slate-400 block">حساب بنكك (بنك الخرطوم):</span>
              <span className="font-mono font-bold text-emerald-400 block text-xs">{settings.bankakAccountNumber}</span>
              <span className="text-slate-300 font-semibold block">{settings.bankakAccountName}</span>
            </div>
          </div>

          {/* Col 4: Customer Support & WhatsApp */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm">خدمة العملاء على مدار الساعة</h4>
            <p className="text-[11px] text-slate-400">
              فريقنا متواجد 24/7 لمساعدتك في استفسارات التفعيل وخدمات ستارلينك.
            </p>

            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً سوداهب، لدي استفسار بخصوص الاشتراكات.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>محادثة فورية على الواتساب</span>
            </a>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-slate-600 hover:text-slate-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>دخول لوحة الإدارة (Admin Portal)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} SudaHub. جميع الحقوق محفوظة لرواد التقنية في السودان 🇸🇩</p>
          <div className="flex items-center gap-1">
            <span>صُنع بشغف لخدمة الشباب والمطورين في السودان</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
};
