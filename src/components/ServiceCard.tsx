import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Terminal, 
  Palette, 
  Satellite, 
  Image as ImageIcon, 
  Bot, 
  Send, 
  ShieldCheck, 
  Clock, 
  Zap, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { ServiceItem } from '../types.ts';

interface ServiceCardProps {
  service: ServiceItem;
  onSelectService: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelectService }) => {
  // Render appropriate Icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      case 'Terminal': return <Terminal className="w-6 h-6" />;
      case 'Palette': return <Palette className="w-6 h-6" />;
      case 'Satellite': return <Satellite className="w-6 h-6" />;
      case 'Image': return <ImageIcon className="w-6 h-6" />;
      case 'Bot': return <Bot className="w-6 h-6" />;
      case 'Send': return <Send className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  // Find lowest price or popular plan for preview
  const primaryPlan = service.plans.find(p => p.isPopular) || service.plans[0];

  return (
    <div 
      id={`service-card-${service.slug}`}
      className="group relative flex flex-col justify-between rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/40 p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
    >
      {/* Top Badge & Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          
          {/* Logo Avatar */}
          <div 
            className="w-13 h-13 rounded-2xl flex items-center justify-center p-3 shadow-lg transition-transform group-hover:scale-105"
            style={{ 
              backgroundColor: `${service.color}15`, 
              borderColor: `${service.color}35`,
              borderWidth: '1px',
              color: service.color 
            }}
          >
            {getIcon(service.logo)}
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end gap-1.5">
            {service.badge && (
              <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {service.badge}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{service.deliveryTime}</span>
            </span>
          </div>

        </div>

        {/* Title and English Name */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
          {service.name}
        </h3>
        <p className="text-xs font-mono font-medium text-slate-400 mb-3 tracking-wide" dir="ltr">
          {service.nameEn}
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Features Preview (Top 2 items) */}
        <div className="space-y-1.5 mb-5">
          {primaryPlan?.features.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Pricing & Subscription CTA */}
      <div className="pt-4 border-t border-slate-800/80 mt-auto">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">يبدأ من</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
                {primaryPlan?.priceSDG.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-400">ج.س</span>
              <span className="text-xs text-slate-500">(${primaryPlan?.priceUSD})</span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-semibold text-slate-300">
            {primaryPlan?.durationLabel}
          </span>
        </div>

        <button
          onClick={() => onSelectService(service)}
          id={`service-subscribe-btn-${service.slug}`}
          className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-emerald-400 font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-400"
        >
          <span>اختيار الباقة والاشتراك</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
