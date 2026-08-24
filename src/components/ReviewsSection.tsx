import React, { useState } from 'react';
import { Star, MessageSquare, ShieldCheck, ThumbsUp, Quote, Check } from 'lucide-react';
import { Review, Order } from '../types.ts';

interface ReviewsSectionProps {
  reviews: Review[];
  onOpenReviewModal: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onOpenReviewModal
}) => {
  return (
    <section className="py-12 sm:py-16 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>تجارب وآراء العملاء الموثقة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              ماذا يقول مشتركو <span className="text-emerald-400">SudaHub</span> في السودان؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              تقييمات حقيقية من مبرمجين، باحثين، وأصحاب أعمال يعتمدون على خدماتنا يومياً.
            </p>
          </div>

          <button
            onClick={onOpenReviewModal}
            id="open-add-review-btn"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>كتابة تقييم لتجربتك</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 mr-2 font-mono">({rev.rating}.0)</span>
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Service Badge */}
              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between gap-2 mt-auto">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                    <span>{rev.customerName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <span className="text-[11px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString('ar-SD')}</span>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-emerald-300">
                  {rev.serviceName}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

interface ReviewModalProps {
  order?: Order | null;
  onClose: () => void;
  onSubmitted: (review: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  order,
  onClose,
  onSubmitted
}) => {
  const [customerName, setCustomerName] = useState(order?.customerName || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('يرجى كتابة تعليقك حول الخدمة.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order?.orderId || 'SUD-GEN',
          serviceId: order?.serviceId || 'serv_general',
          serviceName: order?.serviceName || 'خدمات SudaHub',
          customerName: customerName.trim() || 'عميل متميز',
          rating,
          comment: comment.trim()
        })
      });

      const data = await res.json();
      if (data.success && data.review) {
        onSubmitted(data.review);
        onClose();
      } else {
        setErrorMsg(data.error || 'فشل إرسال التقييم');
      }
    } catch (e) {
      setErrorMsg('حدث خطأ أثناء الإرسال.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-6 my-4">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>تقييم تجربة الاشتراك في SudaHub</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-400 mb-3 p-2 bg-rose-500/10 rounded-lg">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">اسمك الكريم:</label>
            <input 
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="مثال: أحمد الفاتح"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-2">تقييمك (من 1 إلى 5 نجوم):</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-400 mr-2">{rating} / 5</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">تعليقك ورأيك في الخدمة:</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب تجربتك مع سرعة التفعيل وسهولة الدفع..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </button>
        </form>

      </div>
    </div>
  );
};
