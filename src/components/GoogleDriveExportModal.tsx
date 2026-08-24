import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ExternalLink, 
  FileText, 
  Database, 
  HardDrive, 
  RefreshCw,
  FileSpreadsheet,
  Check,
  Key
} from 'lucide-react';
import { GoogleDriveService, DriveUploadResult } from '../services/googleDriveService.ts';
import { ServiceItem, Order, AppSettings, Review, ReportTicket } from '../types.ts';

interface GoogleDriveExportModalProps {
  onClose: () => void;
  services: ServiceItem[];
  settings: AppSettings;
  orders?: Order[];
  reviews?: Review[];
  reports?: ReportTicket[];
}

export const GoogleDriveExportModal: React.FC<GoogleDriveExportModalProps> = ({
  onClose,
  services,
  settings,
  orders = [],
  reviews = [],
  reports = []
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<DriveUploadResult[]>([]);
  const [customToken, setCustomToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);

  useEffect(() => {
    const token = GoogleDriveService.getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleConnectGoogleDrive = async () => {
    setIsAuthenticating(true);
    setErrorMsg(null);
    try {
      await GoogleDriveService.requestAuth();
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setErrorMsg(err.message || 'تعذر تسجيل الدخول التلقائي. يمكنك استخدام إدخال رمز الوصول يدوياً إن رغبت.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleApplyCustomToken = () => {
    if (!customToken.trim()) return;
    GoogleDriveService.setToken(customToken.trim());
    setIsAuthenticated(true);
    setShowTokenInput(false);
    setErrorMsg(null);
  };

  // Generate complete platform backup payload
  const generateBackupData = () => {
    return JSON.stringify({
      appName: 'SudaHub Digital Platform',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      usdToSdgRate: settings.usdToSdgRate,
      settings,
      servicesCount: services.length,
      services,
      ordersCount: orders.length,
      orders,
      reviewsCount: reviews.length,
      reviews,
      reportsCount: reports.length,
      reports
    }, null, 2);
  };

  // Generate CSV for orders
  const generateOrdersCSV = () => {
    const headers = ['رقم الطلب', 'الخدمة', 'الباقة', 'المدة', 'المبلغ', 'العملة', 'البريد الإلكتروني', 'حالة الطلب', 'طريقة الدفع', 'تاريخ الإنشاء'];
    const rows = orders.map(o => [
      o.id,
      `"${o.serviceName.replace(/"/g, '""')}"`,
      `"${o.planName.replace(/"/g, '""')}"`,
      `"${o.duration.replace(/"/g, '""')}"`,
      o.amount,
      o.currency,
      o.customerEmail,
      o.status,
      o.paymentMethod,
      new Date(o.createdAt).toLocaleString('ar-SD')
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  // Generate Services Catalog JSON
  const generateServicesCatalogJSON = () => {
    return JSON.stringify({
      platform: 'SudaHub',
      currencyRate: `1 USD = ${settings.usdToSdgRate} SDG`,
      updatedAt: new Date().toISOString(),
      catalog: services
    }, null, 2);
  };

  // Upload item to Google Drive
  const handleUpload = async (type: 'backup' | 'orders_csv' | 'catalog') => {
    setUploadingType(type);
    setErrorMsg(null);

    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      let filename = '';
      let content = '';
      let mimeType = '';

      if (type === 'backup') {
        filename = `SudaHub_Platform_Backup_${timestamp}.json`;
        content = generateBackupData();
        mimeType = 'application/json';
      } else if (type === 'orders_csv') {
        filename = `SudaHub_Orders_Report_${timestamp}.csv`;
        content = generateOrdersCSV();
        mimeType = 'text/csv';
      } else if (type === 'catalog') {
        filename = `SudaHub_Services_Catalog_${timestamp}.json`;
        content = generateServicesCatalogJSON();
        mimeType = 'application/json';
      }

      const result = await GoogleDriveService.uploadFile(filename, content, mimeType);
      setUploadedFiles(prev => [result, ...prev]);
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'فشل رفع الملف إلى Google Drive.');
    } finally {
      setUploadingType(null);
    }
  };

  // Local download fallback
  const handleLocalDownload = (type: 'backup' | 'orders_csv' | 'catalog') => {
    const timestamp = new Date().toISOString().slice(0, 10);
    let filename = '';
    let content = '';
    let mimeType = '';

    if (type === 'backup') {
      filename = `SudaHub_Platform_Backup_${timestamp}.json`;
      content = generateBackupData();
      mimeType = 'application/json';
    } else if (type === 'orders_csv') {
      filename = `SudaHub_Orders_Report_${timestamp}.csv`;
      content = generateOrdersCSV();
      mimeType = 'text/csv;charset=utf-8;';
    } else if (type === 'catalog') {
      filename = `SudaHub_Services_Catalog_${timestamp}.json`;
      content = generateServicesCatalogJSON();
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>تصدير وحفظ في Google Drive</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  SudaHub Cloud
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                حفظ النسخ الاحتياطية وتقارير المعاملات والكتالوج في حسابك السحابي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">تنبيه:</p>
                <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Authentication Card */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full ${isAuthenticated ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <div>
                  <h4 className="text-sm font-bold text-white">حالة الاتصال بـ Google Drive</h4>
                  <p className="text-xs text-slate-400">
                    {isAuthenticated ? 'الحساب متصل وجاهز لتلقي الملفات المرفوعة' : 'يرجى تسجيل الدخول لمنح إذن حفظ الملفات'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isAuthenticated ? (
                  <button
                    onClick={handleConnectGoogleDrive}
                    disabled={isAuthenticating}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isAuthenticating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري الاتصال...</span>
                      </>
                    ) : (
                      <>
                        <Cloud className="w-4 h-4" />
                        <span>ربط حساب Google Drive</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      GoogleDriveService.clearToken();
                      setIsAuthenticated(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                  >
                    إلغاء الربط
                  </button>
                )}
              </div>
            </div>

            {/* Custom Token Toggle */}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setShowTokenInput(!showTokenInput)}
                  className="text-[11px] text-slate-400 hover:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Key className="w-3 h-3" />
                  <span>{showTokenInput ? 'إخفاء إدخال رمز Access Token' : 'لديك رمز OAuth Access Token جاهز؟ انقر هنا'}</span>
                </button>

                {showTokenInput && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <input
                      type="password"
                      value={customToken}
                      onChange={(e) => setCustomToken(e.target.value)}
                      placeholder="أدخل رمز Google OAuth Access Token..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleApplyCustomToken}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                    >
                      تطبيق
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Export Options Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              الملفات والتقارير المتاحة للتصدير
            </h4>

            <div className="grid grid-cols-1 gap-3">
              
              {/* Option 1: Full Backup */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">النسخة الاحتياطية الكاملة للمنصة (JSON)</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      تتضمن كافة الخدمات، الإعدادات، أسعار الصرف، والطلبات والتقييمات.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleLocalDownload('backup')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    title="تنزيل إلى جهازك"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUpload('backup')}
                    disabled={!isAuthenticated || uploadingType === 'backup'}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {uploadingType === 'backup' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري الرفع...</span>
                      </>
                    ) : (
                      <>
                        <Cloud className="w-4 h-4" />
                        <span>حفظ في Drive</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Option 2: Orders CSV */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">تقرير وجدول المعاملات والطلبات (CSV)</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      جدول متوافق ومجهز لفتحه مباشرة في Google Sheets و Excel.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleLocalDownload('orders_csv')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    title="تنزيل إلى جهازك"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUpload('orders_csv')}
                    disabled={!isAuthenticated || uploadingType === 'orders_csv'}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {uploadingType === 'orders_csv' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري الرفع...</span>
                      </>
                    ) : (
                      <>
                        <Cloud className="w-4 h-4" />
                        <span>حفظ في Drive</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Option 3: Services Catalog */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">كتالوج الباقات والخدمات الحالية (JSON)</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      قائمة بجميع أدوات الذكاء الاصطناعي وباقات Starlink والبرمجيات مع أسعار الصرف.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleLocalDownload('catalog')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    title="تنزيل إلى جهازك"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUpload('catalog')}
                    disabled={!isAuthenticated || uploadingType === 'catalog'}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {uploadingType === 'catalog' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري الرفع...</span>
                      </>
                    ) : (
                      <>
                        <Cloud className="w-4 h-4" />
                        <span>حفظ في Drive</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Uploaded Files History */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>الملفات التي تم حفظها بنجاح في Google Drive:</span>
              </h4>

              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-bold text-white font-mono">{file.name}</span>
                    </div>

                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold transition-colors"
                    >
                      <span>فتح في Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
