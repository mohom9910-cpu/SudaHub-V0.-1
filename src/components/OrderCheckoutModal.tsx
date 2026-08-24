import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  Upload, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  Crown,
  Lock,
  Tag
} from 'lucide-react';
import { ServiceItem, ServicePlan, AppSettings, Order, VIPOffer, Offer } from '../types.ts';
import { apiClient } from '../services/apiClient.ts';

interface OrderCheckoutModalProps {
  service: ServiceItem;
  plan: ServicePlan;
  currency: 'SDG' | 'USD';
  settings: AppSettings;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const OrderCheckoutModal: React.FC<OrderCheckoutModalProps> = ({
  service,
  plan,
  currency: initialCurrency,
  settings,
  onClose,
  onOrderCreated
}) => {
  const [currency, setCurrency] = useState<'SDG' | 'USD'>(initialCurrency);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [vipOffer, setVipOffer] = useState<VIPOffer | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const [senderAccountNumber, setSenderAccountNumber] = useState('');
  const [transactionReference, setTransactionReference] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [copiedBankak, setCopiedBankak] = useState(false);
  const [copiedUsd, setCopiedUsd] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Check VIP Offers when email changes
  useEffect(() => {
    if (!customerEmail || !customerEmail.includes('@')) {
      setVipOffer(null);
      return;
    }
    const checkVip = async () => {
      try {
        const data = await apiClient.getVIPOffers(customerEmail.trim());
        if (data.success && data.vipOffers && data.vipOffers.length > 0) {
          const match = data.vipOffers.find((v: VIPOffer) => v.serviceId === service.id);
          if (match) {
            setVipOffer(match);
          } else {
            setVipOffer(null);
          }
        } else {
          setVipOffer(null);
        }
      } catch (e) {
        // ignore
      }
    };
    const timer = setTimeout(checkVip, 500);
    return () => clearTimeout(timer);
  }, [customerEmail, service.id]);

  // Calculate final amount
  const rate = settings.usdToSdgRate;
  let baseAmount = currency === 'USD' ? plan.priceUSD : (plan.priceSDG || plan.priceUSD * rate);

  if (vipOffer) {
    baseAmount = currency === 'USD' ? vipOffer.specialPriceUSD : vipOffer.specialPriceSDG;
  } else if (appliedOffer) {
    if (appliedOffer.discountType === 'PERCENTAGE') {
      baseAmount = Math.round(baseAmount * (1 - appliedOffer.discountValue / 100));
    } else {
      const discount = currency === 'USD' ? appliedOffer.discountValue / rate : appliedOffer.discountValue;
      baseAmount = Math.max(1, Math.round(baseAmount - discount));
    }
  }

  // Handle promo code apply
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const data = await apiClient.validateOfferCode(promoCode.trim());
      if (data.success && data.offer) {
        setAppliedOffer(data.offer);
      } else {
        setPromoError('كود الخصم غير صحيح');
      }
    } catch (e: any) {
      setPromoError(e.message || 'فشل التحقق من كود الخصم');
    } finally {
      setPromoLoading(false);
    }
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('حجم الملف كبير جداً (الحد الأقصى 8 ميجابايت).');
      return;
    }

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptImage(event.target?.result as string);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  // Copy helpers
  const handleCopy = (text: string, type: 'bankak' | 'usd') => {
    navigator.clipboard?.writeText(text);
    if (type === 'bankak') {
      setCopiedBankak(true);
      setTimeout(() => setCopiedBankak(false), 2000);
    } else {
      setCopiedUsd(true);
      setTimeout(() => setCopiedUsd(false), 2000);
    }
  };

  // Submit Order & Receipt
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMsg('يرجى إدخال بريد إلكتروني صالح لاستلام التفعيل.');
      return;
    }

    if (!receiptImage) {
      setErrorMsg('يرجى رفع صورة إشعار التحويل من تطبيق بنكك لتأكيد الدفع.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Create Order via centralized apiClient
      const createData = await apiClient.createOrder({
        serviceId: service.id,
        planId: plan.id,
        customerName: customerName.trim() || customerEmail.split('@')[0],
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        currency,
        paymentMethod: currency === 'SDG' ? 'BANKAK' : 'DOLLAR_TRANSFER',
        promoCode: appliedOffer?.code
      });

      if (!createData.success || !createData.order) {
        throw new Error('فشل إنشاء الطلب.');
      }

      const order: Order = createData.order;

      // Step 2: Upload Payment Proof Receipt & Details
      const proofData = await apiClient.submitPaymentProof(order.orderId, {
        receiptImage,
        senderName: customerName.trim() || 'العميل',
        senderAccountNumber: senderAccountNumber.trim(),
        receiverAccountNumber: settings.bankakAccountNumber,
        transactionReference: transactionReference.trim(),
        transferredAmount: baseAmount
      }).catch(() => null);

      if (proofData && proofData.success && proofData.order) {
        onOrderCreated(proofData.order);
      } else {
        onOrderCreated(order);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="order-checkout-modal"
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>تأكيد الاشتراك والدفع: {service.name}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {plan.name} ({plan.durationLabel})
            </p>
          </div>

          <button
            onClick={onClose}
            id="close-checkout-modal-btn"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* VIP Offer Matched Notice */}
          {vipOffer && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2.5 shadow-sm">
              <Crown className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold block">مرحباً {vipOffer.customerName}! لديك سعر خاص مفعّل:</span>
                <span>تم تطبيق سعر VIP الخاص بك ({currency === 'USD' ? `$${vipOffer.specialPriceUSD}` : `${vipOffer.specialPriceSDG.toLocaleString()} SDG`}) بدلاً من السعر العادي.</span>
              </div>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
              <span>بيانات التفعيل والتواصل</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  البريد الإلكتروني للتفعيل <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  id="checkout-email-input"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  سيصلك رابط أو دعوة التفعيل على هذا البريد
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  اسمك الكريم (اختياري)
                </label>
                <input
                  type="text"
                  id="checkout-name-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: محمد أحمد"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  رقم الواتساب للتواصل وإشعار التفعيل
                </label>
                <input
                  type="tel"
                  id="checkout-phone-input"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+249 912 345 678"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Promo Code Input */}
            {!vipOffer && (
              <div className="pt-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      id="checkout-promo-input"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="كود الخصم (مثال: SUDA2026)"
                      className="w-full px-3 py-2 pl-8 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoCode}
                    id="apply-promo-btn"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {promoLoading ? 'جاري التحقق...' : 'تطبيق'}
                  </button>
                </div>

                {appliedOffer && (
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>تم تطبيق: {appliedOffer.title}</span>
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{promoError}</p>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Bankak Transfer Details */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">2</span>
              <span>بيانات الدفع عبر بنكك (بنك الخرطوم)</span>
            </h4>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-950 border border-emerald-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">رقم حساب بنكك للتحويل:</span>
                  <span className="text-lg sm:text-xl font-mono font-black text-emerald-400 tracking-wider">
                    {settings.bankakAccountNumber}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(settings.bankakAccountNumber, 'bankak')}
                  id="copy-bankak-number-checkout-btn"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  {copiedBankak ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBankak ? 'تم نسخ الحساب' : 'نسخ رقم الحساب'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-300 flex items-center gap-1.5">
                <span className="text-slate-400">اسم صاحب الحساب:</span>
                <span className="font-bold text-white">{settings.bankakAccountName}</span>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-semibold block mb-0.5">المبلغ المطلوب تحويله بالضبط:</span>
                <span className="text-base font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  {currency === 'SDG' ? `${baseAmount.toLocaleString()} SDG` : `$${baseAmount}`}
                </span>
                <span className="text-[11px] text-slate-400 mr-2">
                  (شامل التفعيل والضمان الرسمي)
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Upload Payment Receipt */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">3</span>
              <span>إرفاق صورة إشعار التحويل من بنكك <span className="text-rose-400">*</span></span>
            </h4>

            {receiptImage ? (
              <div className="relative rounded-2xl border border-emerald-500/50 bg-slate-950 p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img 
                    src={receiptImage} 
                    alt="إشعار التحويل" 
                    className="w-14 h-14 object-cover rounded-xl border border-slate-700 shrink-0" 
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>تم إرفاق الإشعار بنجاح</span>
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{receiptFileName || 'receipt_image.png'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { setReceiptImage(null); setReceiptFileName(''); }}
                  className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/30 transition-colors cursor-pointer"
                >
                  تغيير الصورة
                </button>
              </div>
            ) : (
              <label 
                htmlFor="receipt-upload-input"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl bg-slate-950/50 hover:bg-slate-950 cursor-pointer transition-colors text-center"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white mb-1">
                  اضغط هنا لاختيار أو تصوير إشعار التحويل
                </span>
                <span className="text-[11px] text-slate-500">
                  يقبل صور JPG, PNG أو مستند PDF (الحد الأقصى 8MB)
                </span>
                <input
                  type="file"
                  id="receipt-upload-input"
                  accept="image/png, image/jpeg, image/jpg, application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
            {/* Optional transfer metadata for faster verification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  رقم حسابك في بنكك (اختياري لتسهيل المطابقة)
                </label>
                <input
                  type="text"
                  id="checkout-sender-account-input"
                  value={senderAccountNumber}
                  onChange={(e) => setSenderAccountNumber(e.target.value)}
                  placeholder="مثال: 1234567"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  الرقم المرجعي للإشعار (اختياري)
                </label>
                <input
                  type="text"
                  id="checkout-transaction-ref-input"
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder="مثال: FT26084920..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Bottom Summary & Submit CTA */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-right w-full sm:w-auto">
              <span className="text-[11px] text-slate-400 block font-medium">الإجمالي المستحق للدفع:</span>
              <span className="text-2xl font-black text-emerald-400 font-['Plus_Jakarta_Sans',sans-serif]">
                {currency === 'SDG' ? `${baseAmount.toLocaleString()} SDG` : `$${baseAmount}`}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="submit-order-receipt-btn"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري إرسال الطلب والإشعار...</span>
                </>
              ) : (
                <>
                  <span>تأكيد الطلب ورفع الإشعار للإدارة</span>
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
