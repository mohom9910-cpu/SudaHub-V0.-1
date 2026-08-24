import React, { useState } from 'react';
import { Crown, Search, X, CheckCircle2, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { VIPOffer, ServiceItem } from '../types.ts';

interface VIPOfferModalProps {
  services: ServiceItem[];
  onClose: () => void;
  onSelectVIPOffer: (service: ServiceItem, vipOffer: VIPOffer) => void;
}

export const VIPOfferModal: React.FC<VIPOfferModalProps> = ({
  services,
  onClose,
  onSelectVIPOffer
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [vipOffers, setVipOffers] = useState<VIPOffer[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/vip-offers?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (data.success) {
        setVipOffers(data.vipOffers || []);
        if (!data.vipOffers || data.vipOffers.length === 0) {
          setErrorMsg('لم يتم العثور على عروض VIP مخصصة لهذا البريد حالياً. يمكنك تصفح العروض العامة على المنصة أو التواصل مع الإدارة.');
        }
      } else {
        setErrorMsg('فشل البحث عن عروض VIP.');
      }
    } catch (err: any) {
      setErrorMsg('حدث خطأ في الاتصال بالسيرفر.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="vip-lookup-modal"
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>بوابة العروض الخاصة للعملاء المميزين (VIP)</span>
              </h3>
              <p className="text-xs text-amber-300/80">أسعار وتخفيضات سرية مخصصة لبريدك الإلكتروني</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              أدخل بريدك الإلكتروني المعتمد للتحقق من عروضك الخاصة:
            </label>

            <div className="flex gap-2">
              <input
                type="email"
                required
                id="vip-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mohom9910@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
              />

              <button
                type="submit"
                disabled={loading}
                id="search-vip-offers-btn"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
              >
                {loading ? 'جاري الفحص...' : 'فحص العروض'}
              </button>
            </div>
          </form>

          {/* Error / Not Found */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Matching Offers List */}
          {vipOffers && vipOffers.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>تم العثور على {vipOffers.length} عرض VIP خاص بك:</span>
              </span>

              {vipOffers.map(offer => {
                const service = services.find(s => s.id === offer.serviceId);

                return (
                  <div 
                    key={offer.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-950 border border-amber-500/40 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{offer.serviceName}</h4>
                        <p className="text-xs text-amber-300 font-medium mt-0.5">{offer.note}</p>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        سعر خاص مفعّل
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block line-through">
                          السعر الأصلي: ${offer.normalPriceUSD}
                        </span>
                        <span className="text-lg font-black text-amber-400 font-['Plus_Jakarta_Sans',sans-serif]">
                          ${offer.specialPriceUSD} <span className="text-xs font-bold text-white">({offer.specialPriceSDG.toLocaleString()} SDG)</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      صالح لغاية: {offer.expiryDate}
                    </p>

                    {service && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectVIPOffer(service, offer);
                          onClose();
                        }}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                      >
                        <span>الاشتراك بهذا السعر الخاص الآن</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
