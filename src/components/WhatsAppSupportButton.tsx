import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Headphones, 
  ExternalLink,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { WHATSAPP_SUPPORT_URL, WHATSAPP_PHONE_NUMBER } from '../services/apiClient.ts';

interface WhatsAppSupportButtonProps {
  customNumber?: string;
}

export const WhatsAppSupportButton: React.FC<WhatsAppSupportButtonProps> = ({ 
  customNumber = WHATSAPP_PHONE_NUMBER 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('مرحباً، أود الاستفسار عن خدمات SudaHub');

  const presetMessages = [
    'مرحباً، أود الاستفسار عن خدمات SudaHub',
    'أريد المساعدة في تفعيل اشتراك ChatGPT Plus أو AI',
    'استفسار عن أسعار وتجديد باقات إنترنت Starlink',
    'متابعة حالة طلبي والمساعدة في التحويل عبر بنكك'
  ];

  const getWhatsAppLink = (text: string) => {
    const cleanNumber = customNumber.replace(/[^0-9]/g, '') || '249907756261';
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <aside 
      aria-label="خدمة عملاء واتساب"
      className="fixed bottom-5 left-5 z-50 flex flex-col items-start font-['Tajawal',sans-serif] pointer-events-auto"
    >
      
      {/* Expandable Chat Card */}
      {isOpen && (
        <div 
          className="mb-3 w-80 sm:w-96 rounded-3xl bg-[#0D1527] border border-emerald-500/40 shadow-2xl shadow-emerald-950/80 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <MessageSquare className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-300 border-2 border-[#0D1527] rounded-full animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm leading-tight">خدمة عملاء SudaHub</h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/20 text-white">رسمي</span>
                </div>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
                  <span>متواجدون الآن للرد الفوري</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3.5 text-slate-200 text-xs">
            {/* Agent Welcome Note */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-emerald-400">فريق الدعم الفني</span>
                <span>الآن</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                أهلاً بك في سوداهب! 👋 اختر موضوع استفسارك أو اضغط لبدء المحادثة المباشرة معنا عبر WhatsApp Business.
              </p>
            </div>

            {/* Quick Prompt Selectors */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 block">اختر رسالة سريعة:</span>
              <div className="space-y-1.5">
                {presetMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full text-right p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                      selectedMessage === msg
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                        : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="truncate">{msg}</span>
                    {selectedMessage === msg && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Phone Info */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>رقم الدعم المعتمد:</span>
              </span>
              <span className="font-mono font-bold text-emerald-400" dir="ltr">{customNumber}</span>
            </div>

            {/* CTA Launch Button */}
            <a
              href={getWhatsAppLink(selectedMessage)}
              target="_blank"
              rel="noreferrer"
              id="whatsapp-widget-launch-btn"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 cursor-pointer text-center"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>محادثة واتساب مباشرة الآن</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="whatsapp-floating-trigger"
          aria-expanded={isOpen}
          title="تواصل مع خدمة عملاء SudaHub عبر واتساب"
          className="flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#25D366] via-emerald-500 to-teal-600 hover:from-[#20bd5a] hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/30"
        >
          {/* Animated WhatsApp Icon */}
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          </div>

          <div className="flex flex-col text-right">
            <span className="leading-tight text-xs sm:text-sm font-black">واتساب خدمة العملاء</span>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-950/90 leading-tight">متصل الآن 24/7</span>
          </div>

          <span className="w-2 h-2 rounded-full bg-emerald-950" />
        </button>

        {/* Pulse Ripple Effect behind button */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 -z-10 animate-ping pointer-events-none" />
      </div>

    </aside>
  );
};
