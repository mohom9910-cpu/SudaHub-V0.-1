import React, { useState } from 'react';
import { ArrowLeftRight, Calculator, Check, Copy, DollarSign, Info } from 'lucide-react';
import { AppSettings } from '../types.ts';

interface ExchangeRateWidgetProps {
  settings: AppSettings;
}

export const ExchangeRateWidget: React.FC<ExchangeRateWidgetProps> = ({ settings }) => {
  const [usdInput, setUsdInput] = useState<number | string>(20);
  const [sdgInput, setSdgInput] = useState<number | string>(
    Math.round(20 * settings.usdToSdgRate)
  );
  const [copied, setCopied] = useState(false);

  const handleUsdChange = (val: string) => {
    setUsdInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setSdgInput(Math.round(num * settings.usdToSdgRate));
    } else {
      setSdgInput('');
    }
  };

  const handleSdgChange = (val: string) => {
    setSdgInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && settings.usdToSdgRate > 0) {
      setUsdInput((num / settings.usdToSdgRate).toFixed(2));
    } else {
      setUsdInput('');
    }
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0E172A] to-slate-900 border border-slate-800 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Rate Info & Bankak Accounts */}
        <div className="flex-1 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>سعر الصرف المعتمد والمحدث لحظياً</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-4xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
              1 USD = {settings.usdToSdgRate.toLocaleString()} SDG
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
            يتم تسعير جميع الباقات في SudaHub بالجنيه السوداني وفق سعر الصرف أعلاه، مما يتيح لك الشراء والدفع المباشر عبر تطبيق بنكك أو بنك الخرطوم دون الحاجة لأي بطاقات فيزا دولية.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-slate-400">حساب بنكك المعتمد:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono font-bold text-white text-sm">
              {settings.bankakAccountNumber}
            </span>
            <button
              onClick={() => handleCopyAccount(settings.bankakAccountNumber)}
              id="copy-bankak-number-widget-btn"
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرقم'}</span>
            </button>
            <span className="text-slate-500 text-[11px]">({settings.bankakAccountName})</span>
          </div>
        </div>

        {/* Quick Calculator Box */}
        <div className="w-full lg:w-96 bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-inner">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-300">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>حاسبة تحويل العملات السريعة (USD ⇄ SDG)</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                المبلغ بالدولار الأمريكي (USD $)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  id="calc-usd-input"
                  value={usdInput}
                  onChange={(e) => handleUsdChange(e.target.value)}
                  className="w-full px-3 py-2 pl-8 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="20"
                />
                <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">$</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="p-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                المعادل بالجنيه السوداني (SDG ج.س)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  id="calc-sdg-input"
                  value={sdgInput}
                  onChange={(e) => handleSdgChange(e.target.value)}
                  className="w-full px-3 py-2 pl-12 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="55000"
                />
                <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">ج.س</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
