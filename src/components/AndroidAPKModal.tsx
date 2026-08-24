import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  FolderDown, 
  Layers, 
  Sparkles,
  ArrowRight,
  FileCode,
  ShieldCheck,
  Zap,
  HelpCircle,
  FolderArchive,
  Loader2
} from 'lucide-react';

interface AndroidAPKModalProps {
  onClose: () => void;
}

export const AndroidAPKModal: React.FC<AndroidAPKModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'download' | 'quick' | 'capacitor'>('download');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadZip = () => {
    setIsDownloading(true);
    // Trigger download
    const link = document.createElement('a');
    link.href = '/api/download-project-zip';
    link.download = 'SudaHub_Android_Project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  const capacitorCommands = `# 1. بعد فك ضغط ملف SudaHub_Android_Project.zip
cd SudaHub_Android_Project

# 2. بناء ملفات الواجهة
npm install
npm run build

# 3. فتح المشروع في Android Studio لتوليد الـ APK
# المجلد android جاهز ومُعد مسبقاً بكامل ملفات Kotlin و Gradle!
# افتح مجلد /android في Android Studio واضغط:
# Build > Build Bundle(s) / APK(s) > Build APK(s)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>تنزيل مشروع SudaHub وتطبيق Android</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                  SudaHub_Android_Project.zip
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تنزيل مباشر لحزمة المشروع الكاملة المجهزة للبناء والتجربة على الهاتف
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('download')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'download'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>تنزيل ملف ZIP المباشر</span>
          </button>

          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>التثبيت الفوري (WebAPK على الهاتف)</span>
          </button>

          <button
            onClick={() => setActiveTab('capacitor')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'capacitor'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>بناء APK في Android Studio</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* TAB 1: DIRECT ZIP DOWNLOAD */}
          {activeTab === 'download' && (
            <div className="space-y-5">
              
              {/* Primary Download Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-2 border-emerald-500/40 shadow-xl space-y-4 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                  <FolderArchive className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    حزمة مشروع SudaHub و Android الكاملة
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono text-emerald-400 font-semibold">
                    SudaHub_Android_Project.zip
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleDownloadZip}
                    disabled={isDownloading}
                    id="download-project-zip-btn"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري تحضير وتنزيل الملف...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>تنزيل ملف SudaHub_Android_Project.zip الآن</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Package Content Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">محتويات ملف الـ ZIP المضغوط:</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">مجلد android الأصيل</p>
                      <p className="text-slate-400 text-[11px]">يحتوي على إعدادات Android Studio وملف MainActivity.kt وملفات Manifest و Layout.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">ملفات Gradle والبناء</p>
                      <p className="text-slate-400 text-[11px]">ملفات build.gradle و settings.gradle و gradle.properties الجاهزة للتجميع.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">الكود المصدري للواجهات</p>
                      <p className="text-slate-400 text-[11px]">مجلد src كاملاً بجميع لوحات التحكم وكتالوج الخدمات ومتتبع الطلبات وبوابة VIP.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">الخادم والإعدادات والأصول</p>
                      <p className="text-slate-400 text-[11px]">خادم server.ts وملفات manifest.json و Service Worker وحزم الإعدادات.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: QUICK INSTALLATION */}
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white text-sm">التثبيت المباشر على الهاتف في 10 ثوانٍ:</p>
                  <p className="leading-relaxed text-emerald-200/90">
                    تم تزويد التطبيق بملف <code className="bg-emerald-950/80 px-1 py-0.5 rounded font-mono">manifest.json</code> و <code className="bg-emerald-950/80 px-1 py-0.5 rounded font-mono">Service Worker</code> لتثبيت التطبيق على هاتف أندرويد ليعمل بكامل الشاشة وبدون متصفح.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">خطوات التثبيت على هاتف أندرويد:</h4>
                
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white">افتح الرابط المباشر من متصفح Chrome على هاتفك:</p>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value="https://ais-pre-hwobwc6ypycplndrn4miky-180640004892.europe-west1.run.app"
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-mono"
                        />
                        <button
                          onClick={() => copyToClipboard('https://ais-pre-hwobwc6ypycplndrn4miky-180640004892.europe-west1.run.app', 'url')}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors shrink-0"
                        >
                          {copiedCmd === 'url' ? 'تم النسخ ✓' : 'نسخ الرابط'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-white">اضغط على القائمة (الثلاث نقاط ⋮) في أعلى المتصفح.</p>
                      <p className="text-slate-400 mt-0.5">اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية» (Install App)</strong>.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-bold text-white">سيظهر لك أيقونة SudaHub كتطبيق مستقل على شاشة هاتفك.</p>
                      <p className="text-slate-400 mt-0.5">يعمل التطبيق بدون إطار المتصفح (Standalone Fullscreen) ويدعم التخزين المحلي والإشعارات.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAPACITOR / ANDROID STUDIO APK BUILD */}
          {activeTab === 'capacitor' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-3">
                <FileCode className="w-5 h-5 shrink-0 text-cyan-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white text-sm">بناء ملف Debug APK في Android Studio:</p>
                  <p className="leading-relaxed text-cyan-200/90">
                    بعد تنزيل ملف <code className="bg-cyan-950/80 px-1 py-0.5 rounded font-mono">SudaHub_Android_Project.zip</code> وفك ضغطه:
                  </p>
                </div>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                <pre className="whitespace-pre">{capacitorCommands}</pre>
                <button
                  onClick={() => copyToClipboard(capacitorCommands, 'cap_cmd')}
                  className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  {copiedCmd === 'cap_cmd' ? 'تم نسخ التعليمات ✓' : 'نسخ التعليمات'}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مكان ملف الـ APK بعد البناء: <code className="text-emerald-400 font-mono">android/app/build/outputs/apk/debug/app-debug.apk</code></span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={handleDownloadZip}
            className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل SudaHub_Android_Project.zip</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
