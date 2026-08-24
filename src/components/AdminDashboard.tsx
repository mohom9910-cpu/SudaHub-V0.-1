import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  ArrowLeftRight, 
  Tag, 
  Crown, 
  Table, 
  MessageSquare, 
  Webhook, 
  HelpCircle, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  Send, 
  Download, 
  RefreshCw, 
  Check, 
  Copy, 
  ShieldCheck, 
  DollarSign, 
  ExternalLink,
  ChevronRight,
  LogOut,
  Maximize2,
  Cloud,
  Smartphone,
  Mail,
  Inbox,
  FileCheck,
  CreditCard,
  UserCheck,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Code2,
  Terminal,
  GitBranch,
  FolderGit2
} from 'lucide-react';
import { 
  Order, 
  OrderStatus, 
  ServiceItem, 
  ServicePlan, 
  AppSettings, 
  Offer, 
  VIPOffer, 
  ReportTicket, 
  WhatsAppLog, 
  GoogleSheetRow, 
  WebhookEvent,
  AdminEmailNotification 
} from '../types.ts';
import { GoogleDriveExportModal } from './GoogleDriveExportModal.tsx';
import { AndroidAPKModal } from './AndroidAPKModal.tsx';
import { apiClient } from '../services/apiClient.ts';
import { GoogleDriveService } from '../services/googleDriveService.ts';

interface AdminDashboardProps {
  onCloseAdmin: () => void;
}

type AdminTab = 
  | 'DASHBOARD'
  | 'ORDERS'
  | 'EMAIL_ALERTS'
  | 'SERVICES'
  | 'EXCHANGE_RATE'
  | 'OFFERS'
  | 'VIP_OFFERS'
  | 'GOOGLE_SHEETS'
  | 'GITHUB_EXPORT'
  | 'WHATSAPP'
  | 'WEBHOOKS'
  | 'REPORTS'
  | 'SETTINGS';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onCloseAdmin }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  
  // Auth state
  const [adminToken, setAdminToken] = useState<string>(
    localStorage.getItem('sudahub_admin_token') || 'sudahub_admin_session_active'
  );
  const [loginUser, setLoginUser] = useState('mohom9910@gmail.com');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [vipOffers, setVipOffers] = useState<VIPOffer[]>([]);
  const [reports, setReports] = useState<ReportTicket[]>([]);
  const [whatsappLogs, setWhatsappLogs] = useState<WhatsAppLog[]>([]);
  const [googleSheetRows, setGoogleSheetRows] = useState<GoogleSheetRow[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [emailNotifications, setEmailNotifications] = useState<AdminEmailNotification[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [showAPKModal, setShowAPKModal] = useState<boolean>(false);

  // Google Sheets Live Sync States
  const [isSyncingSheets, setIsSyncingSheets] = useState<boolean>(false);
  const [sheetsLiveUrl, setSheetsLiveUrl] = useState<string>(
    localStorage.getItem('sudahub_sheet_url') || ''
  );
  const [sheetsSyncSuccess, setSheetsSyncSuccess] = useState<string | null>(null);
  const [sheetsSyncError, setSheetsSyncError] = useState<string | null>(null);
  const [sheetStatusFilter, setSheetStatusFilter] = useState<string>('ALL');

  // Filters & Selected State
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [receiptModalUrl, setReceiptModalUrl] = useState<string | null>(null);

  // Action Modals & Dialogs
  const [actionType, setActionType] = useState<'COMPLETE' | 'REJECT' | 'NEED_RECEIPT' | 'REPLY_REPORT' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [completeCreds, setCompleteCreds] = useState({ usernameOrEmail: '', passwordOrPin: '', activationCodeOrKey: '', instructions: '' });
  const [replyTicketText, setReplyTicketText] = useState('');
  const [selectedReportTicket, setSelectedReportTicket] = useState<ReportTicket | null>(null);

  // Plan Management Modal State
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [targetServiceForPlan, setTargetServiceForPlan] = useState<ServiceItem | null>(null);
  const [editingPlan, setEditingPlan] = useState<ServicePlan | null>(null);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    nameEn: '',
    durationMonths: 1,
    durationLabel: '1 شهر',
    priceUSD: 10,
    priceSDG: 40000,
    isPopular: false,
    isAvailable: true,
    featuresText: 'تفعيل فوري رسمي\nضمان كامل المدة\nدعم فني متميز'
  });

  // Service Management Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    nameEn: '',
    category: 'AI_SUBSCRIPTIONS',
    description: '',
    longDescription: '',
    logo: 'Sparkles',
    color: '#10B981',
    badge: 'الأكثر طلباً',
    deliveryTime: '15 - 30 دقيقة',
    warranty: 'ضمان كامل المدة الرسمية',
    requirements: 'البريد الإلكتروني فقط',
    isActive: true
  });

  // Offer Creation State
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState<number>(10);
  const [newOfferType, setNewOfferType] = useState<'PERCENTAGE' | 'FIXED_SDG'>('PERCENTAGE');

  // VIP Offer Creation State
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [vipEmail, setVipEmail] = useState('');
  const [vipCustomerName, setVipCustomerName] = useState('');
  const [vipServiceId, setVipServiceId] = useState('');
  const [vipSpecialPriceUSD, setVipSpecialPriceUSD] = useState<number>(15);
  const [vipNote, setVipNote] = useState('');

  // Exchange rate form
  const [newExchangeRate, setNewExchangeRate] = useState<number>(4000);
  const [rateSuccessMsg, setRateSuccessMsg] = useState('');

  // WhatsApp test form
  const [waTestPhone, setWaTestPhone] = useState('');
  const [waTestMsg, setWaTestMsg] = useState('');
  const [waSuccessMsg, setWaSuccessMsg] = useState('');

  // Load Admin Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashRes, ordRes, servRes, setRes, sheetsRes, waRes, whRes, emailRes, offRes] = await Promise.all([
          fetch('/api/admin/dashboard'),
          fetch(`/api/admin/orders?status=${orderStatusFilter}&search=${encodeURIComponent(orderSearch)}`),
          fetch('/api/services'),
          fetch('/api/settings'),
          fetch('/api/admin/google-sheets'),
          fetch('/api/admin/whatsapp/logs'),
          fetch('/api/admin/webhooks/logs'),
          fetch('/api/admin/email-notifications'),
          fetch('/api/offers')
        ]);

        const [dashData, ordData, servData, setData, sheetsData, waData, whData, emailData, offData] = await Promise.all([
          dashRes.json(),
          ordRes.json(),
          servRes.json(),
          setRes.json(),
          sheetsRes.json(),
          waRes.json(),
          whRes.json(),
          emailRes.json().catch(() => ({ success: false, notifications: [] })),
          offRes.json().catch(() => ({ success: false, offers: [] }))
        ]);

        if (dashData.success) {
          setStats(dashData.stats);
          setNewExchangeRate(dashData.stats.exchangeRate || 4000);
        }
        if (ordData.success) setOrders(ordData.orders || []);
        if (servData.success) setServices(servData.services || []);
        if (setData.success) setSettings(setData.settings);
        if (sheetsData.success) setGoogleSheetRows(sheetsData.rows || []);
        if (waData.success) setWhatsappLogs(waData.logs || []);
        if (whData.success) setWebhookEvents(whData.events || []);
        if (emailData.success) setEmailNotifications(emailData.notifications || []);
        if (offData.success) setOffers(offData.offers || []);

        // Also fetch reports
        const repRes = await fetch('/api/reports/REP-1024').catch(() => null);
        if (repRes && repRes.ok) {
          const repData = await repRes.json();
          if (repData.success && repData.ticket) setReports([repData.ticket]);
        }
      } catch (e) {
        console.error('Error loading admin data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey, orderStatusFilter, orderSearch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await apiClient.loginAuth({ username: loginUser, password: loginPass });
      if (data.success && data.token) {
        setAdminToken(data.token);
        localStorage.setItem('sudahub_admin_token', data.token);
      } else {
        setLoginError('بيانات الدخول غير صحيحة.');
      }
    } catch (e: any) {
      setLoginError(e.message || 'فشل الاتصال بالسيرفر');
    }
  };

  // Order Actions API Calls
  const handleConfirmPayment = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminName: 'محمد عمر بابكر (إدارة SudaHub)',
          instructions: 'العملية تمت بنجاح، والآن يمكنك الاستمتاع باشتراكك'
        })
      });
      const data = await res.json();
      if (data.success) {
        setRefreshKey(k => k + 1);
        if (selectedOrder?.orderId === orderId) setSelectedOrder(data.order);
      } else {
        alert(data.error || 'فشل تأكيد الدفع');
      }
    } catch (e) {
      alert('فشل تأكيد الدفع');
    }
  };

  const handleActivateOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminName: 'محمد عمر بابكر' })
      });
      const data = await res.json();
      if (data.success) {
        setRefreshKey(k => k + 1);
        if (selectedOrder?.orderId === orderId) setSelectedOrder(data.order);
      }
    } catch (e) {
      alert('فشل بدء التفعيل');
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminName: 'محمد عمر بابكر',
          ...completeCreds
        })
      });
      const data = await res.json();
      if (data.success) {
        setRefreshKey(k => k + 1);
        setActionType(null);
        if (selectedOrder?.orderId === orderId) setSelectedOrder(data.order);
      }
    } catch (e) {
      alert('فشل إكمال الطلب');
    }
  };

  const handleRejectPayment = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/reject-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: actionReason })
      });
      const data = await res.json();
      if (data.success) {
        setRefreshKey(k => k + 1);
        setActionType(null);
        if (selectedOrder?.orderId === orderId) setSelectedOrder(data.order);
      }
    } catch (e) {
      alert('فشل رفض الدفع');
    }
  };

  const handleRequestNewReceipt = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/request-new-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: actionReason })
      });
      const data = await res.json();
      if (data.success) {
        setRefreshKey(k => k + 1);
        setActionType(null);
        if (selectedOrder?.orderId === orderId) setSelectedOrder(data.order);
      }
    } catch (e) {
      alert('فشل إرسال الطلب');
    }
  };

  const handleUpdateExchangeRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateSuccessMsg('');
    try {
      const res = await fetch('/api/admin/exchange-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: newExchangeRate, updatedBy: 'محمد عمر بابكر' })
      });
      const data = await res.json();
      if (data.success) {
        setRateSuccessMsg(data.message);
        setRefreshKey(k => k + 1);
      }
    } catch (e) {
      alert('فشل تحديث سعر الصرف');
    }
  };

  const handleSendTestWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaSuccessMsg('');
    try {
      const res = await fetch('/api/admin/whatsapp/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: waTestPhone, message: waTestMsg })
      });
      const data = await res.json();
      if (data.success) {
        setWaSuccessMsg('تم إرسال الرسالة وتسجيلها في السجل بنجاح!');
        setRefreshKey(k => k + 1);
      }
    } catch (e) {
      alert('فشل إرسال إشعار واتساب');
    }
  };

  // Plan Management Handlers
  const handleOpenAddPlan = (service: ServiceItem) => {
    setTargetServiceForPlan(service);
    setEditingPlan(null);
    const rate = settings?.usdToSdgRate || 4000;
    setPlanFormData({
      name: 'باقة شهرية',
      nameEn: '1 Month Plan',
      durationMonths: 1,
      durationLabel: '1 شهر',
      priceUSD: 10,
      priceSDG: 10 * rate,
      isPopular: false,
      isAvailable: true,
      featuresText: 'تفعيل فوري رسمي\nضمان كامل المدة\nدعم فني مباشر'
    });
    setPlanModalOpen(true);
  };

  const handleOpenEditPlan = (service: ServiceItem, plan: ServicePlan) => {
    setTargetServiceForPlan(service);
    setEditingPlan(plan);
    setPlanFormData({
      name: plan.name,
      nameEn: plan.nameEn,
      durationMonths: plan.durationMonths,
      durationLabel: plan.durationLabel,
      priceUSD: plan.priceUSD,
      priceSDG: plan.priceSDG,
      isPopular: Boolean(plan.isPopular),
      isAvailable: plan.isAvailable,
      featuresText: plan.features.join('\n')
    });
    setPlanModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetServiceForPlan) return;

    const payload = {
      name: planFormData.name,
      nameEn: planFormData.nameEn,
      durationMonths: Number(planFormData.durationMonths),
      durationLabel: planFormData.durationLabel,
      priceUSD: Number(planFormData.priceUSD),
      priceSDG: Number(planFormData.priceSDG),
      isPopular: planFormData.isPopular,
      isAvailable: planFormData.isAvailable,
      features: planFormData.featuresText.split('\n').map(f => f.trim()).filter(Boolean)
    };

    try {
      let res;
      if (editingPlan) {
        res = await fetch(`/api/admin/services/${targetServiceForPlan.id}/plans/${editingPlan.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/admin/services/${targetServiceForPlan.id}/plans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (data.success) {
        setPlanModalOpen(false);
        setRefreshKey(k => k + 1);
      } else {
        alert(data.error || 'فشل حفظ الباقة');
      }
    } catch (e) {
      alert('حدث خطأ أثناء حفظ الباقة');
    }
  };

  const handleDeletePlan = async (serviceId: string, planId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;
    try {
      const res = await fetch(`/api/admin/services/${serviceId}/plans/${planId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setRefreshKey(k => k + 1);
      }
    } catch (e) {
      alert('فشل حذف الباقة');
    }
  };

  // Service Management Handlers
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceFormData({
      name: '',
      nameEn: '',
      category: 'AI_SUBSCRIPTIONS',
      description: '',
      longDescription: '',
      logo: 'Sparkles',
      color: '#10B981',
      badge: 'جديد',
      deliveryTime: '15 - 30 دقيقة',
      warranty: 'ضمان كامل المدة الرسمية',
      requirements: 'البريد الإلكتروني فقط',
      isActive: true
    });
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (service: ServiceItem) => {
    setEditingService(service);
    setServiceFormData({
      name: service.name,
      nameEn: service.nameEn,
      category: service.category,
      description: service.description,
      longDescription: service.longDescription || service.description,
      logo: service.logo || 'Sparkles',
      color: service.color || '#10B981',
      badge: service.badge || '',
      deliveryTime: service.deliveryTime || '30 دقيقة',
      warranty: service.warranty || 'ضمان كامل المدة',
      requirements: service.requirements || 'البريد الإلكتروني فقط',
      isActive: service.isActive
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (editingService) {
        res = await fetch(`/api/admin/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceFormData)
        });
      } else {
        res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceFormData)
        });
      }
      const data = await res.json();
      if (data.success) {
        setServiceModalOpen(false);
        setRefreshKey(k => k + 1);
      } else {
        alert(data.error || 'فشل حفظ الخدمة');
      }
    } catch (e) {
      alert('حدث خطأ أثناء حفظ الخدمة');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة وجميع باقاتها؟')) return;
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRefreshKey(k => k + 1);
      }
    } catch (e) {
      alert('فشل حذف الخدمة');
    }
  };

  // Google Sheets Real-Time Synchronizer via Google Sheets API
  const handleLiveSyncGoogleSheets = async () => {
    setIsSyncingSheets(true);
    setSheetsSyncSuccess(null);
    setSheetsSyncError(null);
    try {
      // 1. Get or request auth token
      let token = GoogleDriveService.getToken();
      if (!token) {
        token = await GoogleDriveService.requestAuth();
      }

      // 2. Sync directly to Google Sheets
      const result = await GoogleDriveService.syncGoogleSheetOrders(googleSheetRows);
      setSheetsLiveUrl(result.spreadsheetUrl);
      localStorage.setItem('sudahub_sheet_url', result.spreadsheetUrl);
      setSheetsSyncSuccess(`تمت المزامنة بنجاح! تم إنشاء وتسطير (${result.rowCount}) عملية شراء في صفحة Google Sheets وتحديث الحالات فوراً.`);
    } catch (err: any) {
      console.warn('Direct Google Client sync issue, trying Server Proxy sync:', err);
      try {
        const res = await fetch('/api/admin/google-sheets/live-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: GoogleDriveService.getToken() })
        });
        const data = await res.json();
        if (data.success && data.spreadsheetUrl) {
          setSheetsLiveUrl(data.spreadsheetUrl);
          localStorage.setItem('sudahub_sheet_url', data.spreadsheetUrl);
          setSheetsSyncSuccess(`تمت المزامنة بنجاح مع Google Sheets! (${data.totalRows} عملية مسجلة).`);
          return;
        } else if (data.success) {
          setSheetsSyncSuccess('سجل المعاملات محدث وجاهز للمزامنة الفورية مع Google Sheets.');
          return;
        }
      } catch (innerErr) {}
      setSheetsSyncError(err.message || 'فشلت المزامنة مع Google Sheets API.');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
      case 'AWAITING_PAYMENT':
        return { label: 'في انتظار الدفع', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'PAYMENT_SUBMITTED':
      case 'PAYMENT_VERIFICATION':
        return { label: 'إشعار مرفوع (راجع الآن)', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse font-bold' };
      case 'PAYMENT_CONFIRMED':
        return { label: 'تم تأكيد الدفع', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
      case 'ACTIVATION':
        return { label: 'جاري التفعيل ⚡', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' };
      case 'COMPLETED':
        return { label: 'مكتمل ومسلّم ✅', color: 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold' };
      case 'NEED_NEW_RECEIPT':
        return { label: 'مطلوب إشعار جديد ⚠️', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' };
      case 'PAYMENT_REJECTED':
        return { label: 'إشعار مرفوض ❌', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'CANCELLED':
        return { label: 'ملغي', color: 'bg-slate-700 text-slate-400 border-slate-600' };
      default:
        return { label: status, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  // Nav Items
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'DASHBOARD', label: 'لوحة القيادة', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      id: 'ORDERS', 
      label: 'إدارة الطلبات', 
      icon: <ShoppingBag className="w-4 h-4" />, 
      badge: orders.filter(o => o.status === 'PAYMENT_SUBMITTED' || o.status === 'ACTIVATION').length 
    },
    { 
      id: 'EMAIL_ALERTS', 
      label: 'إشعارات الإيميل (mohom9910)', 
      icon: <Mail className="w-4 h-4" />, 
      badge: emailNotifications.length 
    },
    { id: 'SERVICES', label: 'الخدمات والباقات (CRUD)', icon: <Layers className="w-4 h-4" /> },
    { id: 'EXCHANGE_RATE', label: 'سعر الصرف (SDG/USD)', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'OFFERS', label: 'العروض وأكواد الخصم', icon: <Tag className="w-4 h-4" /> },
    { id: 'VIP_OFFERS', label: 'العملاء المميزون (VIP)', icon: <Crown className="w-4 h-4" /> },
    { id: 'GOOGLE_SHEETS', label: 'مزامنة Google Sheets', icon: <Table className="w-4 h-4" /> },
    { id: 'GITHUB_EXPORT', label: 'ربط وتصدير GitHub', icon: <Code2 className="w-4 h-4" /> },
    { id: 'WHATSAPP', label: 'واتساب Cloud API', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'WEBHOOKS', label: 'الويبهوك والأحداث', icon: <Webhook className="w-4 h-4" /> },
    { id: 'REPORTS', label: 'البلاغات والشكاوى', icon: <HelpCircle className="w-4 h-4" />, badge: reports.filter(r => r.status === 'NEW').length },
    { id: 'SETTINGS', label: 'الإعدادات والحسابات', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      
      {/* Admin Top Header */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>SudaHub Admin</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                المالك: محمد عمر بابكر
              </span>
            </h1>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
              <span className="text-emerald-400 font-bold">1 USD = {stats?.exchangeRate?.toLocaleString() || '4,000'} SDG</span>
              <span>•</span>
              <span className="text-slate-300">حساب بنكك: 9138127</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAPKModal(true)}
            id="admin-apk-btn"
            className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="تنزيل المشروع كاملاً ZIP وتطبيق Android"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">ZIP / Android</span>
          </button>

          <button
            onClick={() => setShowDriveModal(true)}
            id="admin-gdrive-export-btn"
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="حفظ وتصدير إلى Google Drive"
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Drive Sync</span>
          </button>

          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onCloseAdmin}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>واجهة العميل</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Admin Main Layout with Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 bg-slate-950/70 border-b lg:border-b-0 lg:border-l border-slate-800 p-3 sm:p-4 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  id={`admin-nav-${item.id.toLowerCase()}`}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isSelected ? 'text-slate-950' : 'text-emerald-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isSelected ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Workspace View */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'DASHBOARD' && stats && (
            <div className="space-y-6">
              
              {/* Owner Welcome Notice Banner */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/40 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/30 shrink-0">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">
                      مرحباً بك أستاذ محمد عمر بابكر (المالك والمشرف العام)
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      لوحة التحكم تتيح لك إدارة باقات الخدمات، تأكيد الدفع الفوري، متابعة إشعارات البريد إلى <code className="text-emerald-300 font-mono">mohom9910@gmail.com</code> وضبط الأسعار مباشرة.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-400 font-mono font-bold">
                    حساب بنكك: 9138127
                  </span>
                </div>
              </div>

              {/* Stats KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 block font-medium">إجمالي المبيعات (SDG)</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1 block">
                    {stats.totalSalesSDG?.toLocaleString()} SDG
                  </span>
                  <span className="text-[10px] text-slate-500">يعادل ≈ ${stats.totalSalesUSD?.toLocaleString()} USD</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 block font-medium">طلبات بإشعار مرفوع (مراجعة)</span>
                  <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono mt-1 block">
                    {stats.underVerification || 0}
                  </span>
                  <span className="text-[10px] text-cyan-500">تتطلب التأكيد والتسليم</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 block font-medium">الطلبات المكتملة</span>
                  <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">
                    {stats.completedOrders || 0}
                  </span>
                  <span className="text-[10px] text-emerald-500">تم التفعيل والتسليم بنجاح</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <span className="text-xs text-slate-400 block font-medium">العملاء الفريدين</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-1 block">
                    {stats.uniqueCustomers || 0}
                  </span>
                  <span className="text-[10px] text-slate-500">متوسط التقييم: {stats.avgRating || '5.0'} ⭐</span>
                </div>
              </div>

              {/* Quick Pending Verification Orders Action Banner */}
              {orders.filter(o => o.status === 'PAYMENT_SUBMITTED').length > 0 && (
                <div className="p-5 rounded-3xl bg-cyan-950/30 border border-cyan-500/40 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-cyan-400" />
                      <span>طلبات بانتظار المراجعة والتأكيد الفوري ({orders.filter(o => o.status === 'PAYMENT_SUBMITTED').length})</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('ORDERS')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>عرض الكل</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {orders.filter(o => o.status === 'PAYMENT_SUBMITTED').slice(0, 4).map(ord => (
                      <div key={ord.orderId} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-400 text-xs">{ord.orderId}</span>
                            <span className="text-xs font-bold text-white truncate">{ord.customerName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{ord.serviceName} • {ord.planName}</p>
                          <span className="text-xs font-mono font-bold text-white block mt-0.5">
                            {ord.amount.toLocaleString()} {ord.currency}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {ord.paymentProofUrl && (
                            <button
                              onClick={() => setReceiptModalUrl(ord.paymentProofUrl || null)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                              title="معاينة الإشعار"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleConfirmPayment(ord.orderId)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                          >
                            تأكيد الدفع والتفعيل
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'ORDERS' && (
            <div className="space-y-4">
              
              {/* Header & Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">إدارة ومتابعة طلبات الاشتراكات</h3>
                  <p className="text-xs text-slate-400">تأكيد الدفع اليدوي، مراجعة إشعارات بنكك، وتسليم بيانات التفعيل للعميل</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="بحث برقم الطلب أو البريد..."
                      className="px-3 py-1.5 pl-8 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">جميع الحالات ({orders.length})</option>
                    <option value="PAYMENT_SUBMITTED">إشعار مرفوع (يحتاج مراجعة)</option>
                    <option value="ACTIVATION">جاري التفعيل</option>
                    <option value="COMPLETED">مكتمل</option>
                    <option value="AWAITING_PAYMENT">بانتظار الدفع</option>
                    <option value="PAYMENT_REJECTED">مرفوض</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">رقم الطلب</th>
                        <th className="p-3.5">العميل والتواصل</th>
                        <th className="p-3.5">الخدمة والباقة</th>
                        <th className="p-3.5">المبلغ المطلوب</th>
                        <th className="p-3.5">بيانات التحويل والإشعار</th>
                        <th className="p-3.5">الحالة</th>
                        <th className="p-3.5">الإجراءات المباشرة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {orders.map(o => (
                        <tr key={o.orderId} className={`hover:bg-slate-800/40 transition-colors ${o.status === 'PAYMENT_SUBMITTED' ? 'bg-cyan-950/15' : ''}`}>
                          <td className="p-3.5 font-mono font-bold text-emerald-400">
                            {o.orderId}
                            <span className="block text-[10px] text-slate-500 font-sans">{new Date(o.createdAt).toLocaleTimeString('ar-SD', { hour: '2-digit', minute: '2-digit' })}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-white block">{o.customerName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{o.customerEmail}</span>
                            {o.customerPhone && <span className="text-[10px] text-slate-500 block font-mono">{o.customerPhone}</span>}
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-white block">{o.serviceName}</span>
                            <span className="text-[11px] text-slate-400">{o.planName} ({o.duration})</span>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-white text-sm">
                            {o.amount.toLocaleString()} {o.currency}
                          </td>
                          <td className="p-3.5">
                            <div className="space-y-1">
                              {o.senderAccountNumber && (
                                <span className="text-[10px] text-slate-300 block font-mono">
                                  حساب المرسل: {o.senderAccountNumber}
                                </span>
                              )}
                              {o.transactionReference && (
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  المرجع: {o.transactionReference}
                                </span>
                              )}
                              {o.paymentProofUrl ? (
                                <button
                                  onClick={() => setReceiptModalUrl(o.paymentProofUrl || null)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>معاينة صورة الإشعار</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-500">لم يُرفع إشعار بعد</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusBadge(o.status).color}`}>
                              {getStatusBadge(o.status).label}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              
                              {/* If Payment Submitted: One-Click Confirm or Reject */}
                              {o.status === 'PAYMENT_SUBMITTED' && (
                                <>
                                  <button
                                    onClick={() => handleConfirmPayment(o.orderId)}
                                    className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                                  >
                                    تأكيد الدفع
                                  </button>
                                  <button
                                    onClick={() => { setSelectedOrder(o); setActionType('REJECT'); }}
                                    className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer"
                                  >
                                    رفض
                                  </button>
                                  <button
                                    onClick={() => { setSelectedOrder(o); setActionType('NEED_RECEIPT'); }}
                                    className="px-2 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold cursor-pointer"
                                  >
                                    طلب جديد
                                  </button>
                                </>
                              )}

                              {/* If in Activation: Manual Credentials delivery */}
                              {o.status === 'ACTIVATION' && (
                                <button
                                  onClick={() => {
                                    setSelectedOrder(o);
                                    setCompleteCreds({
                                      usernameOrEmail: o.customerEmail,
                                      passwordOrPin: '',
                                      activationCodeOrKey: `SUD-${Date.now().toString(36).toUpperCase()}`,
                                      instructions: 'العملية تمت بنجاح، والآن يمكنك الاستمتاع باشتراكك'
                                    });
                                    setActionType('COMPLETE');
                                  }}
                                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                                >
                                  تسليم التفعيل ⚡
                                </button>
                              )}

                              {/* View full details */}
                              <button
                                onClick={() => setSelectedOrder(o)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                                title="تفاصيل كاملة"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB: EMAIL NOTIFICATIONS INBOX (mohom9910@gmail.com) */}
          {activeTab === 'EMAIL_ALERTS' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    <span>صندوق إشعارات البريد الإلكتروني الموجهة إلى mohom9910@gmail.com</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    توثيق كامل لكافة الإشعارات اللحظية عند قيام أي عميل برفع إشعار تحويل بنكك أو إنشاء طلب جديد
                  </p>
                </div>

                <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-emerald-400 font-bold">
                  {emailNotifications.length} إشعار مسجل
                </span>
              </div>

              {emailNotifications.length === 0 ? (
                <div className="p-8 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 space-y-2">
                  <Inbox className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm font-bold">لا توجد إشعارات جديدة حالياً</p>
                  <p className="text-xs text-slate-500">ستظهر هنا تلقائياً جميع الرسائل الموجهة لإيميلك عند قيام العملاء بإنشاء طلبات أو رفع إشعارات بنكك.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {emailNotifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{notif.subject}</h4>
                            <span className="text-[11px] text-slate-400 font-mono">
                              إلى: {notif.toEmail} • طلب: <span className="text-emerald-400 font-bold">{notif.orderId}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(notif.sentAt).toLocaleString('ar-SD')}
                          </span>
                          <button
                            onClick={async () => {
                              await fetch(`/api/admin/email-notifications/${notif.id}`, { method: 'DELETE' });
                              setEmailNotifications(prev => prev.filter(n => n.id !== notif.id));
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                            title="حذف الإشعار"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Notification Body Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-slate-950 p-3.5 rounded-2xl border border-slate-800/60">
                        <div>
                          <span className="text-slate-400 block text-[11px]">العميل:</span>
                          <span className="font-bold text-white">{notif.customerName}</span>
                          <span className="text-[10px] text-slate-500 block font-mono">{notif.customerEmail}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[11px]">الخدمة والمبلغ:</span>
                          <span className="font-bold text-emerald-400">{notif.serviceName}</span>
                          <span className="text-xs font-mono font-bold text-white block">{notif.amount?.toLocaleString()} {notif.currency}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[11px]">بيانات الحساب والمرجع:</span>
                          <span className="font-mono text-slate-300 block text-[11px]">حساب المرسل: {notif.senderAccount || 'غير محدد'}</span>
                          <span className="font-mono text-slate-300 block text-[11px]">حساب المستلم: {notif.receiverAccount || '9138127'}</span>
                          {notif.transactionReference && (
                            <span className="font-mono text-slate-400 block text-[10px]">المرجع: {notif.transactionReference}</span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons on notification */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          {notif.receiptUrl && (
                            <button
                              onClick={() => setReceiptModalUrl(notif.receiptUrl || null)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>معاينة صورة الإشعار</span>
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => handleConfirmPayment(notif.orderId)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تأكيد استلام المبلغ وتفعيل الطلب</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SERVICES & PLANS MANAGEMENT (FULL DYNAMIC CRUD) */}
          {activeTab === 'SERVICES' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">إدارة الخدمات الرقمية والباقات (Dynamic CRUD)</h3>
                  <p className="text-xs text-slate-400">
                    يمكنك إضافة وتعديل وحذف الباقات وتغيير الأسعار بالدولار والجنيه مباشرة دون الحاجة لأي تعديل برمجي.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddService}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة خدمة جديدة</span>
                </button>
              </div>

              {/* Services List with their plans */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {services.map(serv => (
                  <div key={serv.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
                    
                    <div>
                      {/* Service Card Header */}
                      <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                            <Layers className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-base">{serv.name}</h4>
                            <span className="text-xs text-slate-400 font-mono" dir="ltr">{serv.nameEn}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditService(serv)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                            title="تعديل بيانات الخدمة"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(serv.id)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-pointer"
                            title="حذف الخدمة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Service metadata badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-3 text-[11px] text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                          الفئة: {serv.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                          التسليم: {serv.deliveryTime}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                          الضمان: {serv.warranty}
                        </span>
                      </div>

                      {/* Plans List in this service */}
                      <div className="space-y-2.5 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-300">
                            الباقات المتاحة ({serv.plans?.length || 0}):
                          </span>
                          <button
                            onClick={() => handleOpenAddPlan(serv)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30"
                          >
                            <Plus className="w-3 h-3" />
                            <span>إضافة باقة جديدة</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {serv.plans?.map(p => (
                            <div 
                              key={p.id} 
                              className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-colors"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">{p.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">({p.durationLabel})</span>
                                  {p.isPopular && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                      الأكثر طلباً
                                    </span>
                                  )}
                                </div>
                                <div className="text-slate-400 text-[11px] font-mono mt-0.5 flex items-center gap-2">
                                  <span>${p.priceUSD} USD</span>
                                  <span>•</span>
                                  <span className="font-bold text-emerald-400">{p.priceSDG?.toLocaleString()} SDG</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleOpenEditPlan(serv, p)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                                  title="تعديل الباقة والأسعار"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePlan(serv.id, p.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-pointer"
                                  title="حذف الباقة"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: EXCHANGE RATE CONTROL */}
          {activeTab === 'EXCHANGE_RATE' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <ArrowLeftRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">تعديل سعر صرف الدولار مقابل الجنيه (USD ➔ SDG)</h3>
                    <p className="text-xs text-slate-400">يقوم السيرفر فوراً بإعادة حساب أسعار جميع باقات الخدمات بالجنيه وتحديث المنصة</p>
                  </div>
                </div>

                {rateSuccessMsg && (
                  <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{rateSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateExchangeRate} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      سعر الصرف الجديد (1 USD بالجنيه السوداني):
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        required
                        id="admin-exchange-rate-input"
                        value={newExchangeRate} 
                        onChange={(e) => setNewExchangeRate(Number(e.target.value))}
                        className="w-full px-4 py-3 pl-14 rounded-2xl bg-slate-950 border border-slate-700 text-lg font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                        min="1"
                      />
                      <span className="absolute left-4 top-3.5 text-xs font-mono font-bold text-slate-400">
                        SDG
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="save-exchange-rate-btn"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-black text-sm cursor-pointer shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>تحديث السعر وتعديل أسعار جميع الباقات تلقائياً</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: OFFERS & PROMOS */}
          {activeTab === 'OFFERS' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">العروض الترويجية وأكواد الخصم</h3>
                  <p className="text-xs text-slate-400">إنشاء وتفعيل أكواد الخصم للعملاء</p>
                </div>
                <button
                  onClick={() => setOfferModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>كود خصم جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {offers.map(o => (
                  <div key={o.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-extrabold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                          {o.code}
                        </span>
                        <h4 className="font-bold text-white text-sm mt-2">{o.title}</h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        {o.discountType === 'PERCENTAGE' ? `${o.discountValue}% خصم` : `${o.discountValue} SDG`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{o.description || 'خصم مباشر لجميع الباقات'}</p>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
                      <span>صالح حتى: {o.endDate}</span>
                      <button
                        onClick={async () => {
                          await fetch(`/api/admin/offers/${o.id}`, { method: 'DELETE' });
                          setRefreshKey(k => k + 1);
                        }}
                        className="text-rose-400 hover:text-rose-300 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: VIP OFFERS */}
          {activeTab === 'VIP_OFFERS' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">عروض ولاء العملاء المميزين (VIP)</h3>
                  <p className="text-xs text-slate-400">أسعار خاصة تظهر تلقائياً للعميل عند إدخال بريده في شاشة الدفع</p>
                </div>
                <button
                  onClick={() => setVipModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>تخصيص سعر VIP لعميل</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vipOffers.map(v => (
                  <div key={v.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-white block text-sm">{v.customerName}</span>
                        <span className="text-xs text-slate-400 font-mono">{v.customerEmail}</span>
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-mono font-bold text-emerald-400 block">${v.specialPriceUSD} USD</span>
                        <span className="text-[10px] text-slate-500">بدلاً من ${v.normalPriceUSD}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">الخدمة: {v.serviceName} • ملاحظة: {v.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GOOGLE SHEETS LIVE LEDGER */}
          {activeTab === 'GOOGLE_SHEETS' && (
            <div className="space-y-5">
              {/* Header and Live Sync Controls */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <Table className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <span>مزامنة سجل المعاملات مع Google Sheets API</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                          Live Sync • فوري
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        تسجيل وإنشاء صفحة Google Sheet تلقائياً لكافة عمليات الشراء وتحديث الحالات فورياً: [قيد المعالجة (Pending) | نجاح (Success) | فشل (Failed)].
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleLiveSyncGoogleSheets}
                      disabled={isSyncingSheets}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncingSheets ? 'animate-spin' : ''}`} />
                      <span>{isSyncingSheets ? 'جاري المزامنة...' : 'مزامنة مع Google Sheets API'}</span>
                    </button>

                    {sheetsLiveUrl && (
                      <a
                        href={sheetsLiveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>فتح الجدول في Google Sheets ↗</span>
                      </a>
                    )}

                    <button
                      onClick={() => setShowDriveModal(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Cloud className="w-4 h-4 text-cyan-400" />
                      <span>حفظ في Google Drive</span>
                    </button>

                    <button
                      onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8," + 
                          "رقم المعاملة,رقم الطلب,التاريخ والزمن,نوع الخدمة,الباقة,المبلغ,العملة,الحالة,البريد,حساب المستلم المعتمد\n" +
                          googleSheetRows.map(r => `"${r.transactionId}","${r.orderId}","${r.dateTime}","${r.serviceType}","${r.planName}",${r.amount},"${r.currency}","${r.status}","${r.customerEmail}","9138127 (محمد عمر بابكر)"`).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `sudahub_transactions_${Date.now()}.csv`);
                        document.body.appendChild(link);
                        link.click();
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>تصدير CSV</span>
                    </button>
                  </div>
                </div>

                {sheetsSyncSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{sheetsSyncSuccess}</span>
                  </div>
                )}

                {sheetsSyncError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{sheetsSyncError}</span>
                  </div>
                )}

                {/* Summary Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block mb-1">إجمالي العمليات الموثقة</span>
                    <span className="text-lg font-black text-white font-mono">{googleSheetRows.length}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
                    <span className="text-[11px] text-emerald-400 block mb-1">نجاح (Success)</span>
                    <span className="text-lg font-black text-emerald-300 font-mono">
                      {googleSheetRows.filter(r => r.status.includes('Success') || r.status.includes('نجاح')).length}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20">
                    <span className="text-[11px] text-amber-400 block mb-1">قيد المعالجة (Pending)</span>
                    <span className="text-lg font-black text-amber-300 font-mono">
                      {googleSheetRows.filter(r => r.status.includes('Pending') || r.status.includes('المعالجة')).length}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/20">
                    <span className="text-[11px] text-rose-400 block mb-1">فشل (Failed)</span>
                    <span className="text-lg font-black text-rose-300 font-mono">
                      {googleSheetRows.filter(r => r.status.includes('Failed') || r.status.includes('فشل')).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table Filter & Live Rows */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold">تصفية حسب الحالة:</span>
                    {['ALL', 'نجاح (Success)', 'قيد المعالجة (Pending)', 'فشل (Failed)'].map(st => (
                      <button
                        key={st}
                        onClick={() => setSheetStatusFilter(st)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          sheetStatusFilter === st
                            ? 'bg-emerald-500 text-slate-950 font-extrabold'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {st === 'ALL' ? 'الكل' : st}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-slate-500 font-mono">
                    حساب المستلم المعتمد لجميع العمليات: 9138127 (محمد عمر بابكر)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">رقم المعاملة</th>
                        <th className="p-3.5">رقم الطلب</th>
                        <th className="p-3.5">التاريخ والزمن</th>
                        <th className="p-3.5">نوع الخدمة والباقة</th>
                        <th className="p-3.5">المبلغ</th>
                        <th className="p-3.5">العملة</th>
                        <th className="p-3.5">حالة العملية</th>
                        <th className="p-3.5">البريد الإلكتروني</th>
                        <th className="p-3.5">حساب المستلم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                      {googleSheetRows
                        .filter(r => sheetStatusFilter === 'ALL' || r.status === sheetStatusFilter)
                        .map((r, i) => {
                          const isSuccess = r.status.includes('Success') || r.status.includes('نجاح');
                          const isPending = r.status.includes('Pending') || r.status.includes('المعالجة');
                          const isFailed = r.status.includes('Failed') || r.status.includes('فشل');

                          return (
                            <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                              <td className="p-3.5 font-bold text-emerald-400">{r.transactionId}</td>
                              <td className="p-3.5 text-cyan-400 font-semibold">{r.orderId}</td>
                              <td className="p-3.5 text-slate-400">{r.dateTime}</td>
                              <td className="p-3.5 font-sans font-medium text-white">{r.serviceType} ({r.planName})</td>
                              <td className="p-3.5 font-bold text-white">{r.amount.toLocaleString()}</td>
                              <td className="p-3.5 font-bold text-emerald-300">{r.currency}</td>
                              <td className="p-3.5 font-sans">
                                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border inline-block ${
                                  isSuccess
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : isPending
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                    : isFailed
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}>
                                  {r.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-slate-400 font-sans">{r.customerEmail}</td>
                              <td className="p-3.5 text-slate-400 text-[11px] font-sans">9138127 (محمد عمر بابكر)</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB GITHUB: GITHUB INTEGRATION & CODE REPO */}
          {activeTab === 'GITHUB_EXPORT' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>ربط ورفع المشروع إلى مستودع GitHub</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                        Build Verified ✅
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      مستودع المشروع مجهز ومعتمد للإيميل الأساسي للأدمن: <span className="text-emerald-400 font-mono">mohom9910@gmail.com</span>
                    </p>
                  </div>
                </div>

                {/* Git Instructions Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>أوامر الرفع المباشر إلى مستودع GitHub:</span>
                    </span>
                    <button
                      onClick={() => {
                        const commands = `git init\ngit config user.name "mohom9910"\ngit config user.email "mohom9910@gmail.com"\ngit remote add origin https://github.com/mohom9910/sudahub.git\ngit branch -M main\ngit add .\ngit commit -m "SudaHub - Complete Platform with Google Sheets API, Bankak 9138127 & CRUD"\ngit push -u origin main`;
                        navigator.clipboard.writeText(commands);
                        alert('تم نسخ أوامر Git إلى الحافظة بنجاح!');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      <span>نسخ كافة الأوامر</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 space-y-1.5 overflow-x-auto leading-relaxed">
                    <p className="text-slate-500"># 1. إعداد هوية الحساب</p>
                    <p>git config user.name "mohom9910"</p>
                    <p>git config user.email "mohom9910@gmail.com"</p>
                    <p className="text-slate-500 pt-2"># 2. ربط المستودع وإضافة كافة الملفات المنقحة</p>
                    <p>git remote add origin https://github.com/mohom9910/sudahub.git</p>
                    <p>git branch -M main</p>
                    <p>git add .</p>
                    <p>git commit -m "SudaHub - Production Release with Google Sheets Sync, Bankak 9138127, Admin CRUD & Test Plan"</p>
                    <p className="text-slate-500 pt-2"># 3. الرفع إلى GitHub</p>
                    <p>git push -u origin main</p>
                  </div>
                </div>

                {/* Features & Architecture Compliance Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">صلاحيات الأدمن الكاملة (CRUD)</span>
                      <span className="text-[11px] text-slate-400">إضافة وتعديل وحذف الباقات والخدمات مباشرة دون إعادة برمجة (mohom9910@gmail.com).</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">بيانات الدفع المعتمدة</span>
                      <span className="text-[11px] text-slate-400">عرض نافذة الدفع باسم (محمد عمر بابكر) ورقم الحساب (9138127).</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">الباقة التجريبية (1 قرش)</span>
                      <span className="text-[11px] text-slate-400">باقة تجريبية رمزية للاختبار بقيمة 1 قرش سوداني لتجربة النظام كاملاً.</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">مزامنة Google Sheets الحظية</span>
                      <span className="text-[11px] text-slate-400">تسجيل وتوثيق المعاملات مع الحالات: [قيد المعالجة (Pending) | نجاح (Success) | فشل (Failed)].</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: WHATSAPP CLOUD API */}
          {activeTab === 'WHATSAPP' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">تكامل WhatsApp Business Platform / Cloud API</h3>
                    <p className="text-xs text-slate-400">إرسال إشعارات فورية للإدارة عند كل طلب جديد، وتنبيه العميل عند تأكيد الدفع والتفعيل</p>
                  </div>
                </div>

                {waSuccessMsg && (
                  <p className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                    {waSuccessMsg}
                  </p>
                )}

                <form onSubmit={handleSendTestWhatsApp} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">رقم الهاتف المستلم:</label>
                    <input 
                      type="tel"
                      value={waTestPhone}
                      onChange={(e) => setWaTestPhone(e.target.value)}
                      placeholder="+249912345678"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">نص الرسالة التجريبية:</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={waTestMsg}
                        onChange={(e) => setWaTestMsg(e.target.value)}
                        placeholder="إشعار تجريبي من منصة SudaHub..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                      >
                        إرسال الآن
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* WhatsApp Notification Log */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">سجل الإشعارات المرسلة عبر WhatsApp</h4>
                  <span className="text-xs text-slate-400">إجمالي الرسائل: {whatsappLogs.length}</span>
                </div>

                <div className="divide-y divide-slate-800 text-xs">
                  {whatsappLogs.map(log => (
                    <div key={log.id} className="p-4 hover:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            {log.messageType}
                          </span>
                          <span className="font-mono text-slate-400">إلى: {log.recipient}</span>
                        </div>
                        <p className="text-slate-300 whitespace-pre-line font-sans">{log.messageBody}</p>
                      </div>

                      <span className="text-[11px] text-slate-500 font-mono shrink-0">
                        {new Date(log.sentAt).toLocaleString('ar-SD')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: WEBHOOKS & EVENTS */}
          {activeTab === 'WEBHOOKS' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Webhook className="w-5 h-5 text-cyan-400" />
                  <span>إدارة الويبهوك والأحداث (Webhook Events Ingress)</span>
                </h3>
                <p className="text-xs text-slate-400">نقطة النهاية: <code className="font-mono text-emerald-400">/api/webhook</code> مع التحقق من التوقيع وتسجيل الحمولات</p>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">سجل أحداث Webhook المستقبلة</h4>
                  <span className="text-xs text-slate-400">الأحداث: {webhookEvents.length}</span>
                </div>

                <div className="divide-y divide-slate-800 text-xs font-mono">
                  {webhookEvents.map(evt => (
                    <div key={evt.id} className="p-4 hover:bg-slate-800/40 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-cyan-400">{evt.eventType}</span>
                        <span className="text-slate-500 text-[11px]">{new Date(evt.receivedAt).toLocaleString('ar-SD')}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">المصدر: {evt.source}</p>
                      <pre className="p-2.5 rounded-xl bg-slate-950 text-emerald-400 text-[11px] overflow-x-auto">
                        {JSON.stringify(evt.payload, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: REPORTS & COMPLAINTS */}
          {activeTab === 'REPORTS' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">تذاكر البلاغات والشكاوى الواردة</h3>
                <p className="text-xs text-slate-400">مراجعة والرد على استفسارات وبلاغات العملاء</p>
              </div>

              <div className="space-y-3">
                {reports.map(rep => (
                  <div key={rep.reportId} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-emerald-400 text-xs">{rep.reportId}</span>
                        <h4 className="font-bold text-white text-sm sm:text-base mt-0.5">{rep.subject}</h4>
                        <p className="text-xs text-slate-400">
                          العميل: {rep.customerName} ({rep.customerEmail}) {rep.orderId && `• طلب: ${rep.orderId}`}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${rep.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {rep.status === 'RESOLVED' ? 'تم الحل' : 'قيد المراجعة'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      {rep.description}
                    </p>

                    {rep.adminReply ? (
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
                        <span className="font-bold block">رد الإدارة:</span>
                        <p>{rep.adminReply}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setSelectedReportTicket(rep); setReplyTicketText(''); setActionType('REPLY_REPORT'); }}
                        className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                      >
                        الرد على التذكرة وإغلاقها
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS */}
          {activeTab === 'SETTINGS' && settings && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white">إعدادات المنصة والحسابات البنكية المعتمدة</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">اسم التطبيق:</label>
                    <input 
                      type="text" 
                      value={settings.appName} 
                      onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">البريد الإلكتروني للإدارة (Admin Email):</label>
                    <input 
                      type="email" 
                      value={settings.adminEmail || 'mohom9910@gmail.com'} 
                      onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">اسم المالك والمشرف العام:</label>
                    <input 
                      type="text" 
                      value={settings.ownerName || 'محمد عمر بابكر'} 
                      onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">رقم واتساب الدعم والإشعارات:</label>
                    <input 
                      type="text" 
                      value={settings.whatsappNumber} 
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">رقم حساب بنكك المعتمد للاستلام:</label>
                    <input 
                      type="text" 
                      value={settings.bankakAccountNumber} 
                      onChange={(e) => setSettings({ ...settings, bankakAccountNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-black text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">اسم صاحب حساب بنكك:</label>
                    <input 
                      type="text" 
                      value={settings.bankakAccountName} 
                      onChange={(e) => setSettings({ ...settings, bankakAccountName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={async () => {
                      await fetch('/api/admin/settings', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(settings)
                      });
                      alert('تم حفظ إعدادات النظام وبيانات الحسابات بنجاح!');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODALS & DIALOGS */}
      {/* ========================================================================= */}

      {/* MODAL: ADD / EDIT SERVICE PLAN */}
      {planModalOpen && targetServiceForPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-slate-900 rounded-3xl p-6 border border-emerald-500/50 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <span>{editingPlan ? 'تعديل بيانات الباقة' : 'إضافة باقة جديدة'}</span>
                </h4>
                <p className="text-xs text-slate-400">الخدمة: {targetServiceForPlan.name}</p>
              </div>
              <button onClick={() => setPlanModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">اسم الباقة (عربي):</label>
                  <input
                    type="text"
                    required
                    value={planFormData.name}
                    onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                    placeholder="مثال: باقة 1 شهر"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">اسم الباقة (إنجليزي):</label>
                  <input
                    type="text"
                    required
                    value={planFormData.nameEn}
                    onChange={(e) => setPlanFormData({ ...planFormData, nameEn: e.target.value })}
                    placeholder="مثال: 1 Month Plan"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">المدة بالأشهر:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={planFormData.durationMonths}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      setPlanFormData({ 
                        ...planFormData, 
                        durationMonths: m,
                        durationLabel: `${m} شهر`
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">تسمية المدة للعميل:</label>
                  <input
                    type="text"
                    value={planFormData.durationLabel}
                    onChange={(e) => setPlanFormData({ ...planFormData, durationLabel: e.target.value })}
                    placeholder="مثال: 1 شهر"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">السعر بالدولار ($ USD):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.5"
                    value={planFormData.priceUSD}
                    onChange={(e) => {
                      const usd = Number(e.target.value);
                      const rate = settings?.usdToSdgRate || 4000;
                      setPlanFormData({ 
                        ...planFormData, 
                        priceUSD: usd,
                        priceSDG: Math.round(usd * rate)
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">السعر بالجنيه السوداني (SDG):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={planFormData.priceSDG}
                    onChange={(e) => setPlanFormData({ ...planFormData, priceSDG: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">مزايا الباقة (سطر لكل ميزة):</label>
                <textarea
                  rows={3}
                  value={planFormData.featuresText}
                  onChange={(e) => setPlanFormData({ ...planFormData, featuresText: e.target.value })}
                  placeholder="تفعيل فوري رسمي&#10;ضمان كامل المدة&#10;دعم فني"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={planFormData.isPopular}
                    onChange={(e) => setPlanFormData({ ...planFormData, isPopular: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-slate-300 font-medium">تمييز كباقة (الأكثر طلباً ⭐)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={planFormData.isAvailable}
                    onChange={(e) => setPlanFormData({ ...planFormData, isAvailable: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-slate-300 font-medium">متاحة للشراء حالياً</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm cursor-pointer shadow-lg"
                >
                  {editingPlan ? 'حفظ تعديلات الباقة' : 'إضافة الباقة للخدمة الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SERVICE */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-xl w-full bg-slate-900 rounded-3xl p-6 border border-emerald-500/50 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>{editingService ? 'تعديل بيانات الخدمة' : 'إضافة خدمة رقمية جديدة'}</span>
              </h4>
              <button onClick={() => setServiceModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">اسم الخدمة (عربي):</label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.name}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                    placeholder="مثال: ChatGPT Plus"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">اسم الخدمة (إنجليزي):</label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.nameEn}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, nameEn: e.target.value })}
                    placeholder="مثال: ChatGPT Plus"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">فئة الخدمة:</label>
                  <select
                    value={serviceFormData.category}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="AI_SUBSCRIPTIONS">ذكاء اصطناعي (AI)</option>
                    <option value="SOFTWARE">برمجيات وأدوات إنتاجية</option>
                    <option value="STARLINK">إنترنت وستارلينك Starlink</option>
                    <option value="STREAMING_CREATIVE">تصميم وترفيه</option>
                    <option value="VIP_SERVICES">خدمات خاصة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">شارة التمييز (Badge):</label>
                  <input
                    type="text"
                    value={serviceFormData.badge}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, badge: e.target.value })}
                    placeholder="مثال: الأكثر طلباً"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">وقت التسليم المتوقع:</label>
                  <input
                    type="text"
                    value={serviceFormData.deliveryTime}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, deliveryTime: e.target.value })}
                    placeholder="مثال: 15 - 30 دقيقة"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">مدة الضمان:</label>
                  <input
                    type="text"
                    value={serviceFormData.warranty}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, warranty: e.target.value })}
                    placeholder="مثال: ضمان كامل المدة"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">وصف مختصر للخدمة:</label>
                <input
                  type="text"
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  placeholder="وصف تسويقي يظهر على البطاقة"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">الوصف التفصيلي والتعليمات:</label>
                <textarea
                  rows={3}
                  value={serviceFormData.longDescription}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, longDescription: e.target.value })}
                  placeholder="شرح كامل لميزات الخدمة وشروط الاستخدام..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm cursor-pointer shadow-lg"
                >
                  {editingService ? 'حفظ تعديلات الخدمة' : 'إنشاء الخدمة الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW RECEIPT IMAGE */}
      {receiptModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-3xl p-4 border border-slate-700 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-white">صورة إشعار التحويل المرفوع من العميل</h4>
              <button onClick={() => setReceiptModalUrl(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto rounded-2xl bg-black flex items-center justify-center p-2">
              <img src={receiptModalUrl} alt="إشعار بنكك" className="max-h-[70vh] object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: COMPLETE ACTIVATION DIALOG */}
      {actionType === 'COMPLETE' && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-slate-900 rounded-3xl p-6 border border-emerald-500/50 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>إكمال وتفعيل طلب {selectedOrder.orderId}</span>
              </h4>
              <button onClick={() => setActionType(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="text-xs text-slate-300 space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">البريد الإلكتروني المفعّل عليه:</label>
                <input
                  type="text"
                  value={completeCreds.usernameOrEmail}
                  onChange={(e) => setCompleteCreds({ ...completeCreds, usernameOrEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">كود التفعيل / مفتاح الترخيص أو الدعوة:</label>
                <input
                  type="text"
                  value={completeCreds.activationCodeOrKey}
                  onChange={(e) => setCompleteCreds({ ...completeCreds, activationCodeOrKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">تعليمات الاستخدام المسلّمة للعميل:</label>
                <textarea
                  rows={3}
                  value={completeCreds.instructions}
                  onChange={(e) => setCompleteCreds({ ...completeCreds, instructions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                />
              </div>
            </div>

            <button
              onClick={() => handleCompleteOrder(selectedOrder.orderId)}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm cursor-pointer shadow-lg"
            >
              تأكيد التسليم وإرسال التنبيه للعميل 🎉
            </button>
          </div>
        </div>
      )}

      {/* MODAL: REJECT OR REQUEST RECEIPT DIALOG */}
      {(actionType === 'REJECT' || actionType === 'NEED_RECEIPT') && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-slate-900 rounded-3xl p-6 border border-rose-500/40 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-bold text-white">
                {actionType === 'REJECT' ? 'رفض إشعار الدفع' : 'طلب إشعار دفع جديد'}
              </h4>
              <button onClick={() => setActionType(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="text-xs space-y-2">
              <label className="block text-slate-300 font-semibold">سبب الرفض أو الملاحظة للعميل:</label>
              <textarea
                rows={3}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="مثال: الإشعار غير واضح أو المبلغ المحول غير مطابق لقيمة الباقة..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none text-xs"
              />
            </div>

            <button
              onClick={() => {
                if (actionType === 'REJECT') handleRejectPayment(selectedOrder.orderId);
                else handleRequestNewReceipt(selectedOrder.orderId);
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
            >
              تأكيد وإرسال التنبيه
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS */}
      {selectedOrder && !actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-slate-900 rounded-3xl p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400">{selectedOrder.orderId}</span>
                <h4 className="text-base font-bold text-white">{selectedOrder.serviceName} - {selectedOrder.planName}</h4>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">العميل:</span>
                  <span className="font-bold text-white">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">البريد:</span>
                  <span className="font-mono text-slate-300">{selectedOrder.customerEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">المبلغ:</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedOrder.amount.toLocaleString()} {selectedOrder.currency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">الحالة:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(selectedOrder.status).color}`}>
                    {getStatusBadge(selectedOrder.status).label}
                  </span>
                </div>
              </div>

              {selectedOrder.senderAccountNumber && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
                  <span className="text-slate-400 block font-sans">بيانات التحويل من بنكك:</span>
                  <span className="text-slate-200 block">حساب المرسل: {selectedOrder.senderAccountNumber}</span>
                  <span className="text-slate-200 block">حساب المستلم: {selectedOrder.receiverAccountNumber || '9138127'}</span>
                  {selectedOrder.transactionReference && (
                    <span className="text-slate-300 block">الرقم المرجعي: {selectedOrder.transactionReference}</span>
                  )}
                </div>
              )}

              {selectedOrder.accountCredentials && (
                <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30 text-[11px] space-y-1">
                  <span className="font-bold text-emerald-300 block">بيانات التفعيل المسلّمة:</span>
                  <span className="font-mono text-emerald-400 block">{selectedOrder.accountCredentials.activationCodeOrKey}</span>
                  <p className="text-slate-300">{selectedOrder.accountCredentials.instructions}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              {selectedOrder.paymentProofUrl && (
                <button
                  onClick={() => setReceiptModalUrl(selectedOrder.paymentProofUrl || null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة الإشعار</span>
                </button>
              )}
              {selectedOrder.status === 'PAYMENT_SUBMITTED' && (
                <button
                  onClick={() => handleConfirmPayment(selectedOrder.orderId)}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                >
                  تأكيد الدفع والتفعيل
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE DRIVE EXPORT MODAL */}
      {showDriveModal && settings && (
        <GoogleDriveExportModal
          onClose={() => setShowDriveModal(false)}
          services={services}
          settings={settings}
          orders={orders}
          reports={reports}
        />
      )}

      {/* ANDROID APK & INSTALLATION MODAL */}
      {showAPKModal && (
        <AndroidAPKModal
          onClose={() => setShowAPKModal(false)}
        />
      )}

    </div>
  );
};
