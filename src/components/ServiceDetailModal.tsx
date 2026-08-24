import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Zap, 
  ArrowLeft, 
  Tag, 
  AlertCircle,
  CreditCard,
  ChevronLeft
} from 'lucide-react';
import { ServiceItem, ServicePlan, AppSettings, Offer, VIPOffer } from '../types.ts';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  settings: AppSettings;
  onClose: () => void;
  onProceedToCheckout: (service: ServiceItem, plan: ServicePlan, currency: 'SDG' | 'USD') => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  settings,
  onClose,
  onProceedToCheckout
}) => {
  if (!service) return null;

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    service.plans.find(p => p.isPopular)?.id || service.plans[0]?.id || ''
  );
  const [currency, setCurrency] = useState<'SDG' | 'USD'>('SDG');

  const selectedPlan = service.plans.find(p => p.id === selectedPlanId) || service.plans[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="service-detail-modal"
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center p-2.5 shadow-md"
              style={{ backgroundColor: `${service.color}20`, color: service.color }}
            >
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>{service.name}</span>
                {service.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {service.badge}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-mono" dir="ltr">{service.nameEn}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-service-detail-btn"
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* Service Full Description */}
          <div className="rounded-2xl bg-slate-950/40 p-4 border border-slate-800/80">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {service.longDescription}
            </p>
          </div>

          {/* Quick Badges: Delivery, Guarantee, Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">سرعة التفعيل:</span>
                <span className="text-xs font-bold text-white">{service.deliveryTime}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">الضمان المعتمد:</span>
                <span className="text-xs font-bold text-white">{service.warranty}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">المطلوب للتفعيل:</span>
                <span className="text-xs font-bold text-white">{service.requirements}</span>
              </div>
            </div>
          </div>

          {/* Plan Selection Section */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>اختر باقة الاشتراك المناسبة:</span>
              </h4>

              {/* Currency Toggle (SDG / USD) */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setCurrency('SDG')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    currency === 'SDG'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  جنيه سوداني (SDG)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  دولار أمريكي (USD $)
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {service.plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const priceDisplay = currency === 'SDG' 
                  ? `${plan.priceSDG.toLocaleString()} SDG` 
                  : `$${plan.priceUSD}`;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    id={`plan-card-item-${plan.id}`}
                    className={`relative p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/25 border-emerald-400/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Top Row: Plan Name & Radio */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600 bg-transparent'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                        <span className="font-bold text-white text-sm sm:text-base">{plan.name}</span>
                      </div>

                      {plan.isPopular && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          الباقة الشائعة
                        </span>
                      )}
                      {plan.discountPercent ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          وفر {plan.discountPercent}%
                        </span>
                      ) : null}
                    </div>

                    {/* Price */}
                    <div className="my-2">
                      <span className="text-xl sm:text-2xl font-black text-emerald-400 font-['Plus_Jakarta_Sans',sans-serif]">
                        {priceDisplay}
                      </span>
                      <span className="text-xs text-slate-400 mr-2">/ {plan.durationLabel}</span>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/60 mt-2">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How to activate instructions */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h5 className="text-xs font-bold text-slate-300 mb-2">خطوات إتمام الاشتراك:</h5>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-400">
              {service.instructions.map((ins, i) => (
                <li key={i}>{ins}</li>
              ))}
            </ol>
          </div>

        </div>

        {/* Modal Footer (CTA Button) */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-slate-400 block font-medium">المبلغ المطلوب للدفع:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
                {currency === 'SDG' ? selectedPlan?.priceSDG.toLocaleString() : `$${selectedPlan?.priceUSD}`}
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {currency === 'SDG' ? 'جنيه سوداني' : 'دولار'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onProceedToCheckout(service, selectedPlan, currency)}
            id="proceed-to-checkout-btn"
            className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>متابعة الدفع ورفع الإشعار</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
