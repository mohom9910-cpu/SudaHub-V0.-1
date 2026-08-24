import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Copy, 
  Check, 
  MessageSquare, 
  Search, 
  Sparkles, 
  Star, 
  RefreshCw,
  Eye,
  FileCheck,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, OrderStatus, AppSettings } from '../types.ts';
import { apiClient } from '../services/apiClient.ts';

interface OrderStatusTrackerProps {
  initialOrder?: Order | null;
  settings: AppSettings;
  onClose?: () => void;
  onOpenReviewModal: (order: Order) => void;
}

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  initialOrder,
  settings,
  onClose,
  onOpenReviewModal
}) => {
  const [searchQuery, setSearchQuery] = useState(initialOrder?.orderId || '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(initialOrder || null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Trigger confetti if order is COMPLETED
  useEffect(() => {
    if (currentOrder?.status === 'COMPLETED') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [currentOrder?.status]);

  // Periodic polling for live status update if not completed/cancelled
  useEffect(() => {
    if (!currentOrder || currentOrder.status === 'COMPLETED' || currentOrder.status === 'CANCELLED') return;

    const interval = setInterval(async () => {
      try {
        const data = await apiClient.getOrder(currentOrder.orderId);
        if (data.success && data.order) {
          setCurrentOrder(data.order);
        }
      } catch (e) {
        // ignore
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentOrder?.orderId, currentOrder?.status]);

  // Search order handler
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      const q = searchQuery.trim();
      // Try by single order id first
      if (q.toUpperCase().startsWith('SUD-')) {
        const data = await apiClient.getOrder(q);
        if (data.success && data.order) {
          setCurrentOrder(data.order);
          setCustomerOrders([]);
          return;
        }
      }

      // Try searching all matching customer orders
      const data = await apiClient.getCustomerOrders(q);
      if (data.success && data.orders && data.orders.length > 0) {
        if (data.orders.length === 1) {
          setCurrentOrder(data.orders[0]);
          setCustomerOrders([]);
        } else {
          setCustomerOrders(data.orders);
          setCurrentOrder(data.orders[0]);
        }
      } else {
        setErrorMsg('لم يتم العثور على طلبات مطابقة لهذا البحث. يرجى التأكد من رقم الطلب (مثال: SUD-10482) أو البريد الإلكتروني.');
      }
    } catch (err: any) {
      setErrorMsg('فشل البحث عن الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
      case 'AWAITING_PAYMENT':
        return { label: 'في انتظار الدفع', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: <Clock className="w-4 h-4" /> };
      case 'PAYMENT_SUBMITTED':
      case 'PAYMENT_VERIFICATION':
        return { label: 'تم رفع الإشعار (جاري المراجعة)', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', icon: <FileCheck className="w-4 h-4" /> };
      case 'PAYMENT_CONFIRMED':
        return { label: 'تم تأكيد الدفع', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'ACTIVATION':
        return { label: 'جاري تفعيل خدمتك الآن ⚡', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse', icon: <Sparkles className="w-4 h-4" /> };
      case 'COMPLETED':
        return { label: 'مكتمل وتم التفعيل بنجاح 🎉', color: 'bg-emerald-500 text-slate-950 border-emerald-400 font-black', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'NEED_NEW_RECEIPT':
        return { label: 'مطلوب إشعار دفع جديد', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40', icon: <AlertCircle className="w-4 h-4" /> };
      case 'PAYMENT_REJECTED':
        return { label: 'إشعار الدفع مرفوض', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: <XCircle className="w-4 h-4" /> };
      case 'CANCELLED':
        return { label: 'الطلب ملغي', color: 'bg-slate-700/50 text-slate-400 border-slate-600', icon: <XCircle className="w-4 h-4" /> };
      default:
        return { label: status, color: 'bg-slate-800 text-slate-300 border-slate-700', icon: <Clock className="w-4 h-4" /> };
    }
  };

  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
      case 'AWAITING_PAYMENT':
        return 1;
      case 'PAYMENT_SUBMITTED':
      case 'PAYMENT_VERIFICATION':
        return 2;
      case 'PAYMENT_CONFIRMED':
      case 'ACTIVATION':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return 1;
    }
  };

  const handleCopyCredentials = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-7 shadow-2xl space-y-6">
      
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            <span>متابعة حالة الطلبات والتفعيل</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            أدخل رقم طلبك (مثل: SUD-10482) أو بريدك الإلكتروني لمعرفة حالة تفعيل اشتراكك لحظياً.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center self-end sm:self-auto cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            id="order-tracker-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="أدخل رقم الطلب SUD-XXXXX أو البريد الإلكتروني..."
            className="w-full px-4 py-3 pl-10 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 font-mono"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        </div>

        <button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          id="order-tracker-search-btn"
          className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>بحث</span>
          )}
        </button>
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Customer Orders List if Multiple */}
      {customerOrders.length > 1 && (
        <div className="space-y-2">
          <span className="text-xs text-slate-400 font-semibold block">تم العثور على {customerOrders.length} طلبات:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {customerOrders.map(ord => (
              <button
                key={ord.orderId}
                onClick={() => setCurrentOrder(ord)}
                className={`p-3 rounded-xl text-right border transition-all cursor-pointer ${
                  currentOrder?.orderId === ord.orderId 
                    ? 'bg-emerald-950/30 border-emerald-500/60 text-white' 
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-mono font-bold text-emerald-400">{ord.orderId}</span>
                  <span className="text-[10px] text-slate-500">{new Date(ord.createdAt).toLocaleDateString('ar-SD')}</span>
                </div>
                <p className="text-xs font-bold truncate">{ord.serviceName} - {ord.planName}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Active Order Display */}
      {currentOrder && (
        <div className="space-y-6 pt-2">
          
          {/* Order Meta Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-400">رقم الطلب الفريد:</span>
                <span className="font-mono font-black text-white text-base tracking-wider">{currentOrder.orderId}</span>
              </div>
              <p className="text-sm font-bold text-emerald-400">
                {currentOrder.serviceName} • {currentOrder.planName}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                البريد الإلكتروني: <span className="font-mono text-slate-300">{currentOrder.customerEmail}</span>
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5">
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 ${getStatusBadge(currentOrder.status).color}`}>
                {getStatusBadge(currentOrder.status).icon}
                <span>{getStatusBadge(currentOrder.status).label}</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">
                المبلغ: {currentOrder.amount.toLocaleString()} {currentOrder.currency}
              </span>
            </div>
          </div>

          {/* Visual Progress Stepper (4 Steps) */}
          {currentOrder.status !== 'CANCELLED' && currentOrder.status !== 'PAYMENT_REJECTED' && (
            <div className="py-2">
              <div className="grid grid-cols-4 gap-2 relative">
                
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                    getStepProgress(currentOrder.status) >= 1
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    1
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-300">إنشاء الطلب</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                    getStepProgress(currentOrder.status) >= 2
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    2
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-300">رفع الإشعار</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                    getStepProgress(currentOrder.status) >= 3
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    3
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-300">تأكيد وتفعيل</span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                    getStepProgress(currentOrder.status) >= 4
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    4
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-300">اكتمال الباقة</span>
                </div>

              </div>
            </div>
          )}

          {/* Conditional Workflow States */}

          {/* 1. ACTIVATION STATE */}
          {(currentOrder.status === 'ACTIVATION' || currentOrder.status === 'PAYMENT_CONFIRMED') && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">جاري تفعيل خدمتك الآن...</h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                تم تأكيد دفعتك بنجاح من الإدارة، وجاري تفعيل حسابك الرسمي على بريدك الإلكتروني ({currentOrder.customerEmail}). ستصلك بيانات الدخول أو دعوة التفعيل خلال دقائق.
              </p>
            </div>
          )}

          {/* 2. COMPLETED STATE */}
          {currentOrder.status === 'COMPLETED' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-slate-900 to-teal-950/50 border border-emerald-400/50 shadow-2xl space-y-4">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white">تم تفعيل باقتك بنجاح!</h4>
                <p className="text-sm font-bold text-emerald-300">
                  شكرًا لاستخدامك SudaHub ❤️
                </p>
              </div>

              {/* Delivered Credentials & Keys */}
              {currentOrder.accountCredentials && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
                  <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>بيانات الاشتراك والتفعيل المسلّمة:</span>
                  </h5>

                  {currentOrder.accountCredentials.activationCodeOrKey && (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">كود التفعيل / مفتاح الترخيص:</span>
                        <span className="font-mono font-black text-emerald-400 text-sm tracking-wider">
                          {currentOrder.accountCredentials.activationCodeOrKey}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyCredentials(currentOrder.accountCredentials?.activationCodeOrKey || '')}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="نسخ الكود"
                      >
                        {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {currentOrder.accountCredentials.instructions && (
                    <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      <span className="font-bold text-emerald-400 block mb-1">تعليمات الدخول والتشغيل:</span>
                      <p>{currentOrder.accountCredentials.instructions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Review CTA Button */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onOpenReviewModal(currentOrder)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Star className="w-4 h-4 fill-slate-950" />
                  <span>تقييم تجربتك مع SudaHub</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً سوداهب، استلمت طلبي ${currentOrder.orderId} بنجاح وأود تقديم الشكر.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>مشاركة الرأي على الواتساب</span>
                </a>
              </div>
            </div>
          )}

          {/* 3. REJECTION OR NEED RECEIPT STATE */}
          {(currentOrder.status === 'NEED_NEW_RECEIPT' || currentOrder.status === 'PAYMENT_REJECTED') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-200 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-300">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>ملاحظة من إدارة المنصة:</span>
              </div>
              <p className="leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-rose-500/20">
                {currentOrder.rejectionReason || 'يرجى مراجعة إشعار التحويل والتواصل مع فريق الدعم.'}
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً سوداهب، بخصوص طلبي ${currentOrder.orderId} الذي يحتاج لإشعار جديد.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>تواصل مع الدعم الفني عبر الواتساب لحل المشكلة</span>
                </a>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
