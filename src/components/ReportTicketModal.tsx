import React, { useState } from 'react';
import { HelpCircle, X, AlertCircle, CheckCircle2, Search, Clock, FileText, Send } from 'lucide-react';
import { ReportTicket, ReportType } from '../types.ts';
import { apiClient } from '../services/apiClient.ts';

interface ReportTicketModalProps {
  onClose: () => void;
}

export const ReportTicketModal: React.FC<ReportTicketModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'NEW' | 'TRACK'>('NEW');
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [type, setType] = useState<ReportType>('SERVICE_ISSUE');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const [searchReportId, setSearchReportId] = useState('');
  const [trackedTicket, setTrackedTicket] = useState<ReportTicket | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState<ReportTicket | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim() || !subject.trim() || !description.trim()) {
      setErrorMsg('يرجى تعبئة البريد الإلكتروني، الموضوع، والتفاصيل.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await apiClient.submitReportTicket({
        orderId: orderId.trim() || undefined,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        type,
        subject: subject.trim(),
        description: description.trim()
      });

      if (data.success && data.ticket) {
        setSuccessTicket(data.ticket);
      } else {
        setErrorMsg('فشل إرسال البلاغ');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'حدث خطأ في الاتصال بالسيرفر.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchReportId.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await apiClient.getReportTicket(searchReportId.trim().toUpperCase());
      if (data.success && data.ticket) {
        setTrackedTicket(data.ticket);
      } else {
        setErrorMsg('رقم البلاغ غير موجود. يرجى التأكد من الرمز (مثال: REP-1024).');
        setTrackedTicket(null);
      }
    } catch (e) {
      setErrorMsg('فشل الاستعلام عن البلاغ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="report-ticket-modal"
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">مركز البلاغات والدعم الفني</h3>
              <p className="text-xs text-slate-400">فريق SudaHub متواجد دائماً لمساعدتك</p>
            </div>
          </div>

          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-2 border-b border-slate-800 bg-slate-950/30 flex gap-2">
          <button
            type="button"
            onClick={() => { setTab('NEW'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'NEW' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            تقديم بلاغ أو استفسار جديد
          </button>
          <button
            type="button"
            onClick={() => { setTab('TRACK'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'TRACK' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            متابعة حالة تذكرة سابقة
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: NEW TICKET */}
          {tab === 'NEW' && (
            <>
              {successTicket ? (
                <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white">تم فتح تذكرة البلاغ بنجاح!</h4>
                  <p className="text-xs text-slate-300">
                    رقم التذكرة الخاص بك هو:
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono font-black text-emerald-400 text-lg">
                    {successTicket.reportId}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    تم إشعار فريق الدعم الفني، وسيتواصل معك موظف المتابعة عبر البريد الإلكتروني أو الواتساب فوراً.
                  </p>
                  <button
                    onClick={() => { setSuccessTicket(null); onClose(); }}
                    className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    إغلاق النافذة
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateReport} className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">
                      نوع المشكلة أو الاستفسار:
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as ReportType)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="SERVICE_ISSUE">مشكلة في الخدمة أو الاشتراك</option>
                      <option value="PAYMENT_ISSUE">مشكلة في الدفع أو التحويل</option>
                      <option value="SERVICE_NOT_WORKING">الخدمة لم تعمل بعد التفعيل</option>
                      <option value="APP_ISSUE">مشكلة في التطبيق أو الموقع</option>
                      <option value="DUPLICATE_CHARGE">عملية تحويل مكررة</option>
                      <option value="OTHER">استفسار أو بلاغ آخر</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        البريد الإلكتروني <span className="text-rose-400">*</span>
                      </label>
                      <input 
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">رقم الطلب (إن وجد)</label>
                      <input 
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="SUD-10482"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      موضوع البلاغ <span className="text-rose-400">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="عنوان مختصر للمشكلة"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      تفاصيل البلاغ <span className="text-rose-400">*</span>
                    </label>
                    <textarea 
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="اشرح المشكلة بالتفصيل لمساعدتك بأسرع وقت..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    {isLoading ? 'جاري إرسال البلاغ...' : 'إرسال البلاغ واستلام رقم التذكرة'}
                  </button>
                </form>
              )}
            </>
          )}

          {/* TAB 2: TRACK TICKET */}
          {tab === 'TRACK' && (
            <div className="space-y-4">
              <form onSubmit={handleTrackReport} className="flex gap-2">
                <input 
                  type="text"
                  required
                  value={searchReportId}
                  onChange={(e) => setSearchReportId(e.target.value)}
                  placeholder="أدخل رقم البلاغ (مثل: REP-1024)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-emerald-500 uppercase"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                >
                  استعلام
                </button>
              </form>

              {trackedTicket && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-emerald-400">{trackedTicket.reportId}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300">
                      الحالة: {trackedTicket.status === 'RESOLVED' ? 'تم الحل ✅' : 'قيد المراجعة ⏳'}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-white">{trackedTicket.subject}</h5>
                  <p className="text-xs text-slate-400">{trackedTicket.description}</p>

                  {trackedTicket.adminReply && (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                      <span className="font-bold block">رد الإدارة:</span>
                      <p>{trackedTicket.adminReply}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
