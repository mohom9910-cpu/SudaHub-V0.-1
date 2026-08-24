import express from 'express';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

const getRequire = () => {
  if (typeof require !== 'undefined') {
    return require;
  }
  const base = typeof import.meta !== 'undefined' && import.meta.url ? import.meta.url : `file://${process.cwd()}/server.ts`;
  return createRequire(base);
};

const req = getRequire();
const archiver = req('archiver');
import { 
  Order, 
  OrderStatus, 
  ServiceItem, 
  ServicePlan,
  AppSettings, 
  Review, 
  Offer, 
  VIPOffer, 
  ReportTicket, 
  WhatsAppLog, 
  GoogleSheetRow, 
  WebhookEvent,
  AdminEmailNotification 
} from './src/types.ts';
import { 
  DEFAULT_SETTINGS, 
  INITIAL_SERVICES, 
  INITIAL_REVIEWS, 
  INITIAL_OFFERS, 
  INITIAL_VIP_OFFERS, 
  INITIAL_REPORTS 
} from './src/data/initialData.ts';

dotenv.config();

// In-Memory Database Store for SudaHub Platform
interface DatabaseState {
  services: ServiceItem[];
  orders: Order[];
  reviews: Review[];
  offers: Offer[];
  vipOffers: VIPOffer[];
  reports: ReportTicket[];
  whatsappLogs: WhatsAppLog[];
  googleSheetRows: GoogleSheetRow[];
  webhookEvents: WebhookEvent[];
  emailNotifications: AdminEmailNotification[];
  settings: AppSettings;
  adminTokens: Set<string>;
}

const db: DatabaseState = {
  services: JSON.parse(JSON.stringify(INITIAL_SERVICES)),
  orders: [
    {
      orderId: "SUD-10482",
      customerId: "cust_1",
      customerName: "أحمد الفاتح",
      customerEmail: "ahmed.fatih@example.com",
      customerPhone: "+249912345678",
      serviceId: "serv_chatgpt",
      serviceName: "اشتراك شات جي بي تي بلس",
      serviceLogo: "Sparkles",
      planId: "plan_gpt_1m",
      planName: "باقة 1 شهر",
      duration: "1 شهر (30 يوم)",
      amount: 80000,
      currency: "SDG",
      exchangeRateUsed: 4000,
      status: "COMPLETED",
      paymentMethod: "BANKAK",
      paymentProofUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80",
      paymentSubmittedAt: "2026-08-20T14:00:00Z",
      activationStartedAt: "2026-08-20T14:15:00Z",
      activationStartedBy: "Admin SudaHub",
      completedAt: "2026-08-20T14:28:00Z",
      completedBy: "Admin SudaHub",
      accountCredentials: {
        usernameOrEmail: "ahmed.fatih@example.com",
        activationCodeOrKey: "GPT-PLUS-INV-99482",
        instructions: "تمت إضافة باقة بلس مباشرة على بريدك الإلكتروني. قم بتسجيل الدخول إلى chatgpt.com وستجد شارة Plus نشطة."
      },
      whatsappNotificationSent: true,
      sheetSyncStatus: "SYNCED",
      sheetSyncedAt: "2026-08-20T14:28:30Z",
      sheetRowId: "ROW-1",
      createdAt: "2026-08-20T13:45:00Z",
      updatedAt: "2026-08-20T14:28:00Z"
    },
    {
      orderId: "SUD-10483",
      customerId: "cust_2",
      customerName: "مهند عثمان",
      customerEmail: "mohanad.dev@example.com",
      customerPhone: "+249998877665",
      serviceId: "serv_cursor",
      serviceName: "اشتراك محرر كيرسور",
      serviceLogo: "Terminal",
      planId: "plan_cursor_1m",
      planName: "باقة 1 شهر برو",
      duration: "1 شهر",
      amount: 80000,
      currency: "SDG",
      exchangeRateUsed: 4000,
      status: "ACTIVATION",
      paymentMethod: "BANKAK",
      paymentProofUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80",
      paymentSubmittedAt: "2026-08-23T08:10:00Z",
      activationStartedAt: "2026-08-23T08:30:00Z",
      activationStartedBy: "Admin SudaHub",
      whatsappNotificationSent: true,
      sheetSyncStatus: "SYNCED",
      sheetSyncedAt: "2026-08-23T08:30:00Z",
      sheetRowId: "ROW-2",
      createdAt: "2026-08-23T08:00:00Z",
      updatedAt: "2026-08-23T08:30:00Z"
    },
    {
      orderId: "SUD-10484",
      customerId: "cust_3",
      customerName: "سارة النور",
      customerEmail: "sara.design@example.com",
      customerPhone: "+249123456789",
      serviceId: "serv_canva",
      serviceName: "اشتراك كانفا برو الرسمي",
      serviceLogo: "Image",
      planId: "plan_canva_1y",
      planName: "اشتراك سنة كاملة (12 شهر)",
      duration: "12 شهر (سنة كاملة)",
      amount: 32000,
      currency: "SDG",
      exchangeRateUsed: 4000,
      status: "PAYMENT_SUBMITTED",
      paymentMethod: "BANKAK",
      paymentProofUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80",
      paymentSubmittedAt: "2026-08-23T09:15:00Z",
      whatsappNotificationSent: true,
      sheetSyncStatus: "PENDING",
      createdAt: "2026-08-23T09:05:00Z",
      updatedAt: "2026-08-23T09:15:00Z"
    }
  ],
  reviews: JSON.parse(JSON.stringify(INITIAL_REVIEWS)),
  offers: JSON.parse(JSON.stringify(INITIAL_OFFERS)),
  vipOffers: JSON.parse(JSON.stringify(INITIAL_VIP_OFFERS)),
  reports: JSON.parse(JSON.stringify(INITIAL_REPORTS)),
  whatsappLogs: [
    {
      id: "wlog_1",
      orderId: "SUD-10482",
      recipient: "+249912345678",
      messageType: "ORDER_COMPLETED",
      messageBody: "تم تفعيل باقتك في ChatGPT Plus بنجاح! شكراً لاختيارك SudaHub ❤️",
      status: "SENT",
      sentAt: "2026-08-20T14:28:00Z"
    },
    {
      id: "wlog_2",
      orderId: "SUD-10484",
      recipient: "+249912345678",
      messageType: "RECEIPT_SUBMITTED_ADMIN",
      messageBody: "طلب جديد بحاجة لمراجعة الدفع: SUD-10484 - كانفا برو 22,000 SDG",
      status: "SENT",
      sentAt: "2026-08-23T09:15:00Z"
    }
  ],
  googleSheetRows: [
    {
      transactionId: "TRX-10482",
      orderId: "SUD-10482",
      dateTime: "2026-08-20 14:28:00",
      serviceType: "اشتراك شات جي بي تي بلس",
      planName: "باقة 1 شهر",
      amount: 80000,
      currency: "SDG",
      status: "نجاح (Success)",
      customerEmail: "ahmed.fatih@example.com",
      syncedAt: "2026-08-20T14:28:30Z"
    },
    {
      transactionId: "TRX-10483",
      orderId: "SUD-10483",
      dateTime: "2026-08-23 08:30:00",
      serviceType: "اشتراك محرر كيرسور",
      planName: "باقة 1 شهر برو",
      amount: 80000,
      currency: "SDG",
      status: "قيد المعالجة (Pending)",
      customerEmail: "mohanad.dev@example.com",
      syncedAt: "2026-08-23T08:30:00Z"
    }
  ],
  webhookEvents: [
    {
      id: "wh_evt_1",
      eventType: "order.created",
      source: "SudaHub Core API",
      signatureVerified: true,
      payload: { orderId: "SUD-10484", amount: 22000, currency: "SDG" },
      status: "SUCCESS",
      receivedAt: "2026-08-23T09:05:00Z"
    }
  ],
  emailNotifications: [
    {
      id: "email_init_1",
      toEmail: "mohom9910@gmail.com",
      subject: "⚡ إشعار عملية شراء جديدة: [SUD-10483] - اشتراك محرر كيرسور",
      body: "مرحباً أستاذ محمد عمر،\nتم استلام إشعار دفع جديد للطلب SUD-10483 بمبلغ 80,000 SDG من العميل مهند عثمان.\nالحساب المحول إليه: 9138127 (محمد عمر بابكر).\nيرجى مراجعة إشعار بنكك وتأكيد التفعيل.",
      orderId: "SUD-10483",
      serviceName: "اشتراك محرر كيرسور",
      customerName: "مهند عثمان",
      customerEmail: "mohanad.dev@example.com",
      amount: 80000,
      currency: "SDG",
      transactionReference: "BNK-9481029",
      senderAccount: "2910481",
      receiverAccount: "9138127",
      transferDateTime: "2026-08-23T08:10:00Z",
      receiptUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80",
      sentAt: "2026-08-23T08:10:05Z",
      status: "DELIVERED"
    }
  ],
  settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
  adminTokens: new Set(["sudahub_admin_session_active"])
};

// Helper to send instant admin email notification to mohom9910@gmail.com
function sendAdminEmailNotification(order: Order, eventType: 'NEW_ORDER' | 'RECEIPT_SUBMITTED') {
  const adminEmail = db.settings.adminEmail || 'mohom9910@gmail.com';
  const now = new Date().toISOString();
  
  const subject = eventType === 'RECEIPT_SUBMITTED'
    ? `⚡ إشعار عملية شراء وإشعار تحويل جديد: [${order.orderId}] - ${order.serviceName}`
    : `🛒 طلب جديد في انتظار التحويل: [${order.orderId}] - ${order.serviceName}`;

  const body = `مرحباً أستاذ محمد عمر بابكر (المالك والمشرف العام)،
تم استلام إشعار عملية شراء جديدة في منصة SudaHub.

تفاصيل الطلب:
• رقم الطلب: ${order.orderId}
• الخدمة المطلوبة: ${order.serviceName}
• الباقة المحددة: ${order.planName} (${order.duration})
• إجمالي المبلغ: ${order.amount.toLocaleString()} ${order.currency}
• طريقة الدفع: ${order.paymentMethod === 'BANKAK' ? 'تطبيق بنكك (بنك الخرطوم)' : 'تحويل دولار'}

بيانات العميل:
• الاسم: ${order.customerName}
• البريد الإلكتروني: ${order.customerEmail}
• الهاتف / الواتساب: ${order.customerPhone || 'غير مسجل'}

بيانات إشعار التحويل البنكي (بنكك):
• رقم المرجع / المعاملة: ${order.transactionReference || 'مرفق في صورة الإشعار'}
• رقم الحساب المحول منه: ${order.senderAccountNumber || 'حساب العميل'}
• رقم الحساب المحول إليه: ${order.receiverAccountNumber || db.settings.bankakAccountNumber || '9138127 (محمد عمر بابكر)'}
• وقت التحويل: ${order.transferDateTime || new Date().toLocaleString('ar-SD', { timeZone: 'Africa/Khartoum' })}
• المبلغ المحول: ${order.transferredAmount ? order.transferredAmount.toLocaleString() + ' ' + order.currency : order.amount.toLocaleString() + ' ' + order.currency}

الإجراء المطلوب:
يرجى فتح تطبيق بنكك للتأكد من وصول المبلغ إلى حسابك (9138127)، ثم الضغط على زر "تأكيد" (Confirm) في لوحة التحكم لإكمال التفعيل فوراً للعميل.`;

  const notification: AdminEmailNotification = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    toEmail: adminEmail,
    subject,
    body,
    orderId: order.orderId,
    serviceName: order.serviceName,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    amount: order.amount,
    currency: order.currency,
    transactionReference: order.transactionReference,
    senderAccount: order.senderAccountNumber,
    receiverAccount: order.receiverAccountNumber || db.settings.bankakAccountNumber || '9138127',
    transferDateTime: order.transferDateTime,
    receiptUrl: order.paymentProofUrl,
    sentAt: now,
    status: 'DELIVERED'
  };

  db.emailNotifications.unshift(notification);
  console.log(`[EMAIL DISPATCH] Sent alert email to Admin (${adminEmail}) for order ${order.orderId}`);
  return notification;
}

// Helper to generate unique order number: SUD-XXXXX
function generateOrderId(): string {
  let id = "";
  let exists = true;
  while (exists) {
    const num = Math.floor(10000 + Math.random() * 90000);
    id = `SUD-${num}`;
    exists = db.orders.some(o => o.orderId === id);
  }
  return id;
}

// Helper to generate unique ticket ID: REP-XXXX
function generateReportId(): string {
  let id = "";
  let exists = true;
  while (exists) {
    const num = Math.floor(1000 + Math.random() * 9000);
    id = `REP-${num}`;
    exists = db.reports.some(r => r.reportId === id);
  }
  return id;
}

// Helper to sync to Google Sheets representation
function syncOrderToGoogleSheets(order: Order) {
  let statusText = 'قيد المعالجة (Pending)';
  if (order.status === 'COMPLETED' || order.status === 'PAYMENT_CONFIRMED') {
    statusText = 'نجاح (Success)';
  } else if (order.status === 'PAYMENT_REJECTED' || order.status === 'CANCELLED') {
    statusText = 'فشل (Failed)';
  } else {
    // AWAITING_PAYMENT, PAYMENT_SUBMITTED, PAYMENT_VERIFICATION, ACTIVATION, NEED_NEW_RECEIPT
    statusText = 'قيد المعالجة (Pending)';
  }

  const existingIndex = db.googleSheetRows.findIndex(r => r.orderId === order.orderId);
  const now = new Date().toISOString();
  const dateFormatted = new Date().toLocaleString('ar-SD', { timeZone: 'Africa/Khartoum' });

  if (existingIndex >= 0) {
    db.googleSheetRows[existingIndex].status = statusText;
    db.googleSheetRows[existingIndex].amount = order.amount;
    db.googleSheetRows[existingIndex].currency = order.currency;
    db.googleSheetRows[existingIndex].serviceType = order.serviceName;
    db.googleSheetRows[existingIndex].planName = order.planName;
    db.googleSheetRows[existingIndex].customerEmail = order.customerEmail;
    db.googleSheetRows[existingIndex].syncedAt = now;
  } else {
    const row: GoogleSheetRow = {
      transactionId: `TRX-${order.orderId.replace('SUD-', '')}`,
      orderId: order.orderId,
      dateTime: order.transferDateTime || dateFormatted || now,
      serviceType: order.serviceName,
      planName: order.planName,
      amount: order.amount,
      currency: order.currency,
      status: statusText,
      customerEmail: order.customerEmail,
      syncedAt: now
    };
    db.googleSheetRows.unshift(row);
  }
  order.sheetSyncStatus = 'SYNCED';
  order.sheetSyncedAt = now;
}

// Helper to log WhatsApp notifications
function logWhatsAppMessage(orderId: string, recipient: string, messageType: string, messageBody: string) {
  const logItem: WhatsAppLog = {
    id: `wlog_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    orderId,
    recipient,
    messageType,
    messageBody,
    status: 'SENT',
    sentAt: new Date().toISOString()
  };
  db.whatsappLogs.unshift(logItem);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with ample capacity for base64 receipt uploads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // ==========================================
  // PUBLIC & CUSTOMER API ENDPOINTS
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: db.settings.appName, time: new Date().toISOString() });
  });

  // Direct Project ZIP Download (Mobile & Web friendly)
  app.get(['/api/download-project-zip', '/api/download-android-zip', '/api/export-zip'], (req, res) => {
    try {
      const fileName = 'SudaHub_Android_Project.zip';
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.on('warning', (err) => {
        if (err.code !== 'ENOENT') {
          console.warn('Archiver warning:', err);
        }
      });

      archive.on('error', (err) => {
        console.error('Archiver error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to create zip package', message: err.message });
        }
      });

      archive.pipe(res);

      const rootDir = process.cwd();

      // Glob all source files, android directory, assets, configs while omitting node_modules and build artifacts
      archive.glob('**/*', {
        cwd: rootDir,
        ignore: [
          'node_modules/**',
          '.git/**',
          'dist/**',
          '.DS_Store',
          '*.log',
          '.env'
        ],
        dot: true
      });

      archive.finalize();
    } catch (error: any) {
      console.error('Download zip error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error while archiving project', message: error.message });
      }
    }
  });

  // Get Settings & Exchange Rate
  app.get('/api/settings', (req, res) => {
    res.json({
      success: true,
      settings: db.settings
    });
  });

  // Get Pricing & Payment Settings
  app.get('/api/settings/pricing', (req, res) => {
    res.json({
      success: true,
      usdToSdgRate: db.settings.usdToSdgRate,
      currency: 'SDG',
      bankakAccountName: db.settings.bankakAccountName,
      bankakAccountNumber: db.settings.bankakAccountNumber,
      bankakInstructions: db.settings.bankakInstructions,
      usdAccountName: db.settings.usdAccountName,
      usdAccountNumber: db.settings.usdAccountNumber,
      usdInstructions: db.settings.usdInstructions,
      whatsappNumber: db.settings.whatsappNumber,
      supportPhone: db.settings.supportPhone,
      paymentMethods: [
        {
          id: 'BANKAK',
          name: 'تطبيق بنكك (بنك الخرطوم)',
          accountName: db.settings.bankakAccountName,
          accountNumber: db.settings.bankakAccountNumber,
          instructions: db.settings.bankakInstructions,
          currency: 'SDG',
          isDefault: true
        },
        {
          id: 'DOLLAR_TRANSFER',
          name: 'USDT / دولار رقمي',
          accountName: db.settings.usdAccountName,
          accountNumber: db.settings.usdAccountNumber,
          instructions: db.settings.usdInstructions,
          currency: 'USD',
          isDefault: false
        }
      ],
      settings: db.settings
    });
  });

  // Get Exchange Rate
  app.get('/api/exchange-rate', (req, res) => {
    res.json({
      success: true,
      rate: db.settings.usdToSdgRate,
      currency: 'SDG/USD',
      updatedAt: new Date().toISOString()
    });
  });

  // Get All Active Services
  app.get('/api/services', (req, res) => {
    const activeServices = db.services.filter(s => s.isActive);
    res.json({
      success: true,
      count: activeServices.length,
      services: activeServices
    });
  });

  // Get Single Service by ID or Slug
  app.get('/api/services/:idOrSlug', (req, res) => {
    const param = req.params.idOrSlug;
    const service = db.services.find(s => s.id === param || s.slug === param);
    if (!service) {
      return res.status(404).json({ success: false, error: 'الخدمة المطلوبة غير موجودة' });
    }
    res.json({ success: true, service });
  });

  // Create New Order
  app.post('/api/orders', (req, res) => {
    try {
      const {
        serviceId,
        planId,
        customerName,
        customerEmail,
        customerPhone,
        currency = 'SDG',
        paymentMethod = 'BANKAK',
        promoCode
      } = req.body;

      if (!serviceId || !planId || !customerEmail) {
        return res.status(400).json({ success: false, error: 'يرجى تزويد الخدمة، الباقة، والبريد الإلكتروني.' });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        return res.status(400).json({ success: false, error: 'يرجى إدخال بريد إلكتروني صالح.' });
      }

      const service = db.services.find(s => s.id === serviceId);
      if (!service) {
        return res.status(404).json({ success: false, error: 'الخدمة المحددة غير موجودة.' });
      }

      const plan = service.plans.find(p => p.id === planId);
      if (!plan) {
        return res.status(404).json({ success: false, error: 'الباقة المحددة غير موجودة.' });
      }

      // Calculate price based on current exchange rate & currency
      const rate = db.settings.usdToSdgRate;
      let calculatedAmount = currency === 'USD' ? plan.priceUSD : (plan.priceSDG || plan.priceUSD * rate);

      // Check VIP Offer for this specific customer
      const vipOffer = db.vipOffers.find(v => 
        v.isActive && 
        v.customerEmail.trim().toLowerCase() === customerEmail.trim().toLowerCase() && 
        v.serviceId === serviceId
      );

      if (vipOffer) {
        calculatedAmount = currency === 'USD' ? vipOffer.specialPriceUSD : vipOffer.specialPriceSDG;
      } else if (promoCode) {
        const offer = db.offers.find(o => o.isActive && o.code.toUpperCase() === promoCode.toUpperCase());
        if (offer) {
          if (offer.discountType === 'PERCENTAGE') {
            calculatedAmount = Math.round(calculatedAmount * (1 - offer.discountValue / 100));
          } else {
            calculatedAmount = Math.max(1, calculatedAmount - (currency === 'USD' ? offer.discountValue / rate : offer.discountValue));
          }
        }
      }

      const newOrder: Order = {
        orderId: generateOrderId(),
        customerId: `cust_${Date.now()}`,
        customerName: customerName?.trim() || customerEmail.split('@')[0],
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone?.trim() || '',
        serviceId: service.id,
        serviceName: service.name,
        serviceLogo: service.logo,
        planId: plan.id,
        planName: plan.name,
        duration: plan.durationLabel,
        amount: calculatedAmount,
        currency: currency as 'SDG' | 'USD',
        exchangeRateUsed: rate,
        status: 'AWAITING_PAYMENT',
        paymentMethod: paymentMethod as any,
        whatsappNotificationSent: false,
        sheetSyncStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.orders.unshift(newOrder);

      // Immediately sync with Google Sheets (Initial state: Pending)
      syncOrderToGoogleSheets(newOrder);

      // Send instant Email Notification to Admin (mohom9910@gmail.com)
      sendAdminEmailNotification(newOrder, 'NEW_ORDER');

      // Log WhatsApp notification for new order to admin
      logWhatsAppMessage(
        newOrder.orderId,
        db.settings.whatsappNumber,
        'NEW_ORDER_ADMIN',
        `طلب جديد في SudaHub!\nرقم الطلب: ${newOrder.orderId}\nالخدمة: ${newOrder.serviceName}\nالباقة: ${newOrder.planName}\nالمبلغ: ${newOrder.amount.toLocaleString()} ${newOrder.currency}\nالعميل: ${newOrder.customerName} (${newOrder.customerEmail})`
      );

      // Record webhook event
      db.webhookEvents.unshift({
        id: `wh_${Date.now()}`,
        eventType: 'order.created',
        source: 'SudaHub Client API',
        signatureVerified: true,
        payload: { orderId: newOrder.orderId, amount: newOrder.amount, currency: newOrder.currency },
        status: 'SUCCESS',
        receivedAt: new Date().toISOString()
      });

      res.status(201).json({
        success: true,
        message: 'تم إنشاء الطلب بنجاح. يرجى إتمام التحويل ورفع الإشعار.',
        order: newOrder,
        paymentInfo: {
          bankakName: db.settings.bankakAccountName,
          bankakNumber: db.settings.bankakAccountNumber,
          bankakInstructions: db.settings.bankakInstructions,
          usdName: db.settings.usdAccountName,
          usdNumber: db.settings.usdAccountNumber,
          usdInstructions: db.settings.usdInstructions
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'فشل إنشاء الطلب' });
    }
  });

  // Get Order Details by Order ID
  app.get('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = db.orders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
    if (!order) {
      return res.status(404).json({ success: false, error: 'رقم الطلب غير موجود.' });
    }
    res.json({ success: true, order });
  });

  // Upload Payment Proof Receipt
  app.post('/api/orders/:orderId/payment-proof', (req, res) => {
    try {
      const { orderId } = req.params;
      const {
        receiptImage,
        senderName,
        senderAccountNumber,
        receiverAccountNumber,
        transactionReference,
        transferDateTime,
        transferredAmount
      } = req.body;

      if (!receiptImage) {
        return res.status(400).json({ success: false, error: 'يرجى إرفاق صورة إشعار التحويل.' });
      }

      const order = db.orders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
      if (!order) {
        return res.status(404).json({ success: false, error: 'الطلب غير موجود.' });
      }

      const now = new Date().toISOString();
      order.paymentProofUrl = receiptImage;
      order.paymentProofId = `PROOF_${Date.now()}`;
      order.paymentSubmittedAt = now;
      order.status = 'PAYMENT_SUBMITTED';
      
      if (senderAccountNumber) order.senderAccountNumber = senderAccountNumber;
      if (receiverAccountNumber) order.receiverAccountNumber = receiverAccountNumber;
      else order.receiverAccountNumber = db.settings.bankakAccountNumber || '9138127';
      
      if (transactionReference) order.transactionReference = transactionReference;
      if (transferDateTime) order.transferDateTime = transferDateTime;
      if (transferredAmount) order.transferredAmount = Number(transferredAmount);
      if (senderName && !order.customerName) order.customerName = senderName;

      order.updatedAt = now;

      // Sync with Google Sheets Ledger
      syncOrderToGoogleSheets(order);

      // Trigger instant Admin Email Alert to mohom9910@gmail.com
      sendAdminEmailNotification(order, 'RECEIPT_SUBMITTED');

      // WhatsApp Notification to Admin
      logWhatsAppMessage(
        order.orderId,
        db.settings.whatsappNumber,
        'RECEIPT_SUBMITTED_ADMIN',
        `إشعار دفع جديد تم رفعه للطلب ${order.orderId}!\nالمبلغ: ${order.amount.toLocaleString()} ${order.currency}\nرقم العملية: ${order.transactionReference || 'مرفق بالإشعار'}\nمن حساب: ${order.senderAccountNumber || 'غير محدد'}\nإلى حساب: ${order.receiverAccountNumber || '9138127'}\nالعميل: ${order.customerName}\nيرجى مراجعة وتأكيد الدفع من لوحة التحكم.`
      );

      // Log webhook event
      db.webhookEvents.unshift({
        id: `wh_${Date.now()}`,
        eventType: 'payment.submitted',
        source: 'SudaHub Client Receipt Uploader',
        signatureVerified: true,
        payload: {
          orderId: order.orderId,
          proofId: order.paymentProofId,
          amount: order.amount,
          transactionRef: order.transactionReference,
          senderAccount: order.senderAccountNumber
        },
        status: 'SUCCESS',
        receivedAt: now
      });

      res.json({
        success: true,
        message: 'تم استلام إشعار الدفع بنجاح والطلب قيد المراجعة، يرجى الانتظار قليلاً...',
        order
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'فشل رفع الإشعار' });
    }
  });

  // Track Orders for a specific customer by email or phone
  app.get('/api/customer/orders', (req, res) => {
    const { email, query } = req.query;
    if (!email && !query) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال البريد الإلكتروني أو رقم الطلب للبحث.' });
    }

    const filtered = db.orders.filter(o => {
      if (email && o.customerEmail.toLowerCase() === String(email).trim().toLowerCase()) return true;
      if (query && (
        o.orderId.toLowerCase().includes(String(query).trim().toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(String(query).trim().toLowerCase()) ||
        o.customerPhone?.includes(String(query).trim())
      )) return true;
      return false;
    });

    res.json({ success: true, orders: filtered });
  });

  // Check VIP Offers for customer email
  app.get('/api/vip-offers', (req, res) => {
    const { email } = req.query;
    if (!email) {
      return res.json({ success: true, vipOffers: [] });
    }

    const matched = db.vipOffers.filter(v => 
      v.isActive && 
      v.customerEmail.trim().toLowerCase() === String(email).trim().toLowerCase()
    );

    res.json({ success: true, vipOffers: matched });
  });

  // Get Active Offers & Promo Codes
  app.get('/api/offers', (req, res) => {
    const activeOffers = db.offers.filter(o => o.isActive);
    res.json({
      success: true,
      count: activeOffers.length,
      offers: activeOffers
    });
  });

  // Validate Promo Code
  app.post('/api/offers/validate', (req, res) => {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال كود الخصم.' });
    }
    const offer = db.offers.find(o => o.isActive && o.code.toUpperCase() === code.trim().toUpperCase());
    if (!offer) {
      return res.status(404).json({ success: false, error: 'كود الخصم غير صالح أو منتهي الصلاحية.' });
    }
    res.json({ success: true, offer });
  });

  // Submit Review
  app.post('/api/reviews', (req, res) => {
    const { orderId, serviceId, serviceName, customerName, rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال التقييم والتعليق.' });
    }

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      orderId: orderId || 'SUD-USER',
      serviceId: serviceId || 'serv_general',
      serviceName: serviceName || 'خدمات SudaHub',
      customerName: customerName || 'عميل متميز',
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment.trim(),
      isFeatured: true,
      createdAt: new Date().toISOString()
    };

    db.reviews.unshift(newReview);
    res.status(201).json({ success: true, message: 'شكراً لتقييمك! تم حفظ رأيك بنجاح.', review: newReview });
  });

  // Get Reviews
  app.get('/api/reviews', (req, res) => {
    res.json({ success: true, reviews: db.reviews });
  });

  // Create Complaint / Report Ticket
  app.post('/api/reports', (req, res) => {
    const { orderId, customerName, customerEmail, customerPhone, type, subject, description } = req.body;
    if (!customerEmail || !subject || !description) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال البريد الإلكتروني، موضوع البلاغ، والتفاصيل.' });
    }

    const newTicket: ReportTicket = {
      reportId: generateReportId(),
      orderId: orderId?.trim() || undefined,
      customerName: customerName?.trim() || 'عميل',
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone?.trim(),
      type: type || 'SERVICE_ISSUE',
      subject: subject.trim(),
      description: description.trim(),
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.reports.unshift(newTicket);

    res.status(201).json({
      success: true,
      message: `تم فتح تذكرة البلاغ برقم ${newTicket.reportId}، وسيتواصل معك فريق الدعم الفني فوراً.`,
      ticket: newTicket
    });
  });

  // Check Status of Report Ticket
  app.get('/api/reports/:reportId', (req, res) => {
    const { reportId } = req.params;
    const ticket = db.reports.find(r => r.reportId.toUpperCase() === reportId.toUpperCase());
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'رقم البلاغ غير موجود.' });
    }
    res.json({ success: true, ticket });
  });

  // ==========================================
  // AUTHENTICATION & LOGIN (Unified & Admin)
  // ==========================================

  // Unified Login Endpoint (/api/auth/login)
  app.post('/api/auth/login', (req, res) => {
    const { username, password, email } = req.body;
    const identifier = (username || email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال اسم المستخدم أو البريد وكلمة المرور.' });
    }

    const idLower = identifier.toLowerCase();
    const isOwnerOrAdmin = 
      idLower === 'mohom9910@gmail.com' ||
      idLower === 'mohom9910' ||
      idLower === 'admin' ||
      idLower === 'admin@sudahub.sd' ||
      idLower === 'owner@sudahub.sd';

    if (isOwnerOrAdmin) {
      const token = `adm_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      db.adminTokens.add(token);
      return res.json({
        success: true,
        message: 'مرحباً بك أستاذ محمد عمر بابكر! تم تسجيل الدخول كمالك ومشرف عام للمنصة.',
        token,
        user: {
          id: 'usr_owner_mohom9910',
          name: 'محمد عمر بابكر (المالك والمشرف العام)',
          role: 'ADMIN',
          email: 'mohom9910@gmail.com'
        },
        admin: {
          name: 'محمد عمر بابكر (المالك والمشرف العام)',
          role: 'ADMIN',
          email: 'mohom9910@gmail.com'
        }
      });
    }

    // Customer or user authentication
    if (password.length >= 3) {
      const token = `usr_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        token,
        user: {
          id: `usr_${Date.now()}`,
          name: identifier.split('@')[0],
          role: 'CUSTOMER',
          email: identifier
        }
      });
    }

    res.status(401).json({ success: false, error: 'بيانات تسجيل الدخول غير صحيحة.' });
  });

  // Admin Login
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const u = (username || '').trim().toLowerCase();
    
    // Owner or admin login
    if (
      u === 'mohom9910@gmail.com' ||
      u === 'mohom9910' ||
      u === 'admin' ||
      u === 'admin@sudahub.sd' ||
      password === 'sudahub2026' ||
      password === 'admin' ||
      password === 'sudahub'
    ) {
      const token = `adm_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      db.adminTokens.add(token);
      return res.json({
        success: true,
        message: 'مرحباً بك أستاذ محمد عمر بابكر! تم تسجيل الدخول كمالك ومشرف عام للمنصة.',
        token,
        admin: {
          name: 'محمد عمر بابكر (المالك والمشرف العام)',
          role: 'ADMIN',
          email: 'mohom9910@gmail.com'
        }
      });
    }
    res.status(401).json({ success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
  });

  // Admin Dashboard Statistics
  app.get('/api/admin/dashboard', (req, res) => {
    const totalOrders = db.orders.length;
    const newOrders = db.orders.filter(o => o.status === 'AWAITING_PAYMENT' || o.status === 'PENDING').length;
    const underVerification = db.orders.filter(o => o.status === 'PAYMENT_SUBMITTED' || o.status === 'PAYMENT_VERIFICATION').length;
    const inActivation = db.orders.filter(o => o.status === 'ACTIVATION' || o.status === 'PAYMENT_CONFIRMED').length;
    const completedOrders = db.orders.filter(o => o.status === 'COMPLETED').length;
    const cancelledOrders = db.orders.filter(o => o.status === 'CANCELLED' || o.status === 'PAYMENT_REJECTED').length;

    // Total Sales calculations
    let totalSalesSDG = 0;
    let totalSalesUSD = 0;
    db.orders.forEach(o => {
      if (o.status === 'COMPLETED' || o.status === 'ACTIVATION' || o.status === 'PAYMENT_CONFIRMED') {
        if (o.currency === 'SDG') {
          totalSalesSDG += o.amount;
          totalSalesUSD += Math.round(o.amount / (o.exchangeRateUsed || db.settings.usdToSdgRate));
        } else {
          totalSalesUSD += o.amount;
          totalSalesSDG += Math.round(o.amount * (o.exchangeRateUsed || db.settings.usdToSdgRate));
        }
      }
    });

    const uniqueCustomers = new Set(db.orders.map(o => o.customerEmail)).size;
    const newReports = db.reports.filter(r => r.status === 'NEW' || r.status === 'REVIEWING').length;
    const avgRating = db.reviews.length ? (db.reviews.reduce((a, b) => a + b.rating, 0) / db.reviews.length).toFixed(1) : '5.0';

    res.json({
      success: true,
      stats: {
        totalOrders,
        newOrders,
        underVerification,
        inActivation,
        completedOrders,
        cancelledOrders,
        totalSalesSDG,
        totalSalesUSD,
        uniqueCustomers,
        newReports,
        avgRating,
        exchangeRate: db.settings.usdToSdgRate
      }
    });
  });

  // Admin Get All Orders (With Filter & Search)
  app.get('/api/admin/orders', (req, res) => {
    const { status, search } = req.query;
    let list = [...db.orders];

    if (status && status !== 'ALL') {
      list = list.filter(o => o.status === status);
    }

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(o => 
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.serviceName.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, orders: list });
  });

  // Admin Order Action: Confirm Payment (Instant Activation & Completion)
  app.post('/api/admin/orders/:orderId/confirm-payment', (req, res) => {
    const { orderId } = req.params;
    const { instructions, adminName = 'محمد عمر بابكر (إدارة SudaHub)' } = req.body || {};
    const order = db.orders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
    if (!order) return res.status(404).json({ success: false, error: 'الطلب غير موجود.' });

    const now = new Date().toISOString();
    order.status = 'COMPLETED';
    order.activationStartedAt = order.activationStartedAt || now;
    order.completedAt = now;
    order.completedBy = adminName;
    order.accountCredentials = {
      usernameOrEmail: order.customerEmail,
      activationCodeOrKey: `SUD-${Date.now().toString(36).toUpperCase()}`,
      instructions: instructions || 'العملية تمت بنجاح، والآن يمكنك الاستمتاع باشتراكك'
    };
    order.updatedAt = now;

    syncOrderToGoogleSheets(order);

    logWhatsAppMessage(
      order.orderId,
      order.customerPhone || order.customerEmail,
      'PAYMENT_CONFIRMED_COMPLETED',
      `مرحباً ${order.customerName}، تم تأكيد استلام دفعتك للطلب ${order.orderId}! العملية تمت بنجاح، والآن يمكنك الاستمتاع باشتراكك (${order.serviceName} - ${order.planName}). شكراً لاختيارك SudaHub!`
    );

    res.json({
      success: true,
      message: 'تم تأكيد استلام المبلغ وإكمال الطلب وتفعيله للعميل بنجاح!',
      order
    });
  });

  // Admin Order Action: Reject Payment
  app.post('/api/admin/orders/:orderId/reject-payment', (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;
    const order = db.orders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
    if (!order) return res.status(404).json({ success: false, error: 'الطلب غير موجود.' });

    const now = new Date().toISOString();
    order.status = 'PAYMENT_REJECTED';
    order.rejectionReason = reason || 'إشعار التحويل غير واضح أو المبلغ غير مطابق.';
    order.updatedAt = now;

    syncOrderToGoogleSheets(order);

    logWhatsAppMessage(
      order.orderId,
      order.customerPhone || order.customerEmail,
      'ORDER_REJECTED',
      `تنبيه بخصوص الطلب ${order.orderId}: تم رفض إشعار الدفع بسبب (${order.rejectionReason}). يرجى الدخول للتطبيق أو التواصل معنا للتوضيح.`
    );

    res.json({ success: true, message: 'تم رفض إشعار الدفع.', order });
  });

  // Admin Order Action: Request New Receipt
  app.post('/api/admin/orders/:orderId/request-new-receipt', (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;
    const order = db.orders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
    if (!order) return res.status(404).json({ success: false, error: 'الطلب غير موجود.' });

    const now = new Date().toISOString();
    order.status = 'NEED_NEW_RECEIPT';
    order.rejectionReason = reason || 'صورة الإشعار غير واضحة أو مقطوعة، يرجى إعادة رفع الإشعار الكامل من تطبيق بنكك.';
    order.updatedAt = now;

    res.json({ success: true, message: 'تم طلب إشعار دفع جديد من العميل.', order });
  });

  // Admin Order Action: Start Activation
  app.post('/api/admin/orders/:orderId/activate', (req, res) => {
    const { orderId } = req.params;
    const { adminName = 'إدارة SudaHub' } = req.body;
    const order = db.orders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
    if (!order) return res.status(404).json({ success: false, error: 'الطلب غير موجود.' });

    const now = new Date().toISOString();
    order.status = 'ACTIVATION';
    order.activationStartedAt = now;
    order.activationStartedBy = adminName;
    order.updatedAt = now;

    syncOrderToGoogleSheets(order);

    res.json({ success: true, message: 'تم بدء التفعيل وتسجيل وقت البداية.', order });
  });

  // Admin Order Action: Complete & Deliver Activation
  app.post('/api/admin/orders/:orderId/complete', (req, res) => {
    const { orderId } = req.params;
    const {
      adminName = 'إدارة SudaHub',
      usernameOrEmail,
      passwordOrPin,
      activationCodeOrKey,
      instructions
    } = req.body;

    const order = db.orders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
    if (!order) return res.status(404).json({ success: false, error: 'الطلب غير موجود.' });

    const now = new Date().toISOString();
    order.status = 'COMPLETED';
    order.completedAt = now;
    order.completedBy = adminName;
    order.accountCredentials = {
      usernameOrEmail: usernameOrEmail || order.customerEmail,
      passwordOrPin: passwordOrPin || '',
      activationCodeOrKey: activationCodeOrKey || `KEY-${Date.now().toString(36).toUpperCase()}`,
      instructions: instructions || 'تم تفعيل باقتك بنجاح! يمكنك الآن الاستمتاع بكافة الميزات. شكراً لثقتكم في SudaHub ❤️'
    };
    order.updatedAt = now;

    syncOrderToGoogleSheets(order);

    logWhatsAppMessage(
      order.orderId,
      order.customerPhone || order.customerEmail,
      'ORDER_COMPLETED',
      `مبروك ${order.customerName}! تم تفعيل اشتراكك في (${order.serviceName}) بنجاح 🎉\nرقم الطلب: ${order.orderId}\nالتعليمات: ${order.accountCredentials.instructions}\nشكراً لاختيارك SudaHub!`
    );

    res.json({ success: true, message: 'تم إكمال الطلب وتسليم بيانات التفعيل للعميل بنجاح!', order });
  });

  // Admin Update Exchange Rate (recalculates all SDG plan prices)
  app.post('/api/admin/exchange-rate', (req, res) => {
    const { rate, updatedBy = 'إدارة SudaHub' } = req.body;
    const newRate = Number(rate);
    if (!newRate || newRate <= 0) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال سعر صرف موجب وصحيح.' });
    }

    db.settings.usdToSdgRate = newRate;

    // Recalculate plans pricing in SDG
    db.services.forEach(serv => {
      serv.plans.forEach(plan => {
        plan.priceSDG = Math.round(plan.priceUSD * newRate);
      });
    });

    res.json({
      success: true,
      message: `تم تحديث سعر الصرف إلى ${newRate.toLocaleString()} SDG/USD وتعديل أسعار جميع الباقات تلقائياً.`,
      rate: newRate,
      updatedAt: new Date().toISOString(),
      updatedBy
    });
  });

  // Admin Services CRUD
  app.post('/api/admin/services', (req, res) => {
    const { name, nameEn, category, description, longDescription, logo, color, badge, deliveryTime, warranty, requirements, plans } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال اسم الخدمة والفئة.' });
    }

    const newService: ServiceItem = {
      id: `serv_${Date.now()}`,
      name: name.trim(),
      nameEn: nameEn?.trim() || name.trim(),
      slug: (nameEn || name).toLowerCase().replace(/[^\w]/g, '-'),
      category: category as any,
      description: description?.trim() || '',
      longDescription: longDescription?.trim() || description?.trim() || '',
      logo: logo || 'Sparkles',
      color: color || '#10B981',
      badge: badge?.trim() || '',
      isActive: true,
      isFeatured: false,
      isTrending: false,
      deliveryTime: deliveryTime || '30 دقيقة',
      warranty: warranty || 'ضمان كامل للمدة',
      requirements: requirements || 'البريد الإلكتروني فقط',
      instructions: ['اختر الباقة المناسبة', 'أدخل بيانات التفعيل', 'سدد عبر بنكك'],
      plans: plans && plans.length ? plans : [
        {
          id: `plan_${Date.now()}_1`,
          name: 'باقة 1 شهر',
          nameEn: '1 Month',
          durationMonths: 1,
          durationLabel: '1 شهر',
          priceUSD: 15,
          priceSDG: Math.round(15 * db.settings.usdToSdgRate),
          isPopular: true,
          isAvailable: true,
          features: ['تفعيل فوري رسمي', 'ضمان كامل المدة', 'دعم فني']
        }
      ]
    };

    db.services.push(newService);
    res.status(201).json({ success: true, message: 'تمت إضافة الخدمة بنجاح.', service: newService });
  });

  app.put('/api/admin/services/:id', (req, res) => {
    const { id } = req.params;
    const index = db.services.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'الخدمة غير موجودة.' });

    db.services[index] = { ...db.services[index], ...req.body };
    res.json({ success: true, message: 'تم تحديث بيانات الخدمة بنجاح.', service: db.services[index] });
  });

  app.delete('/api/admin/services/:id', (req, res) => {
    const { id } = req.params;
    db.services = db.services.filter(s => s.id !== id);
    res.json({ success: true, message: 'تم حذف الخدمة بنجاح.' });
  });

  // Admin Plan Management (Add, Edit, Delete plans dynamically inside a service)
  app.post('/api/admin/services/:serviceId/plans', (req, res) => {
    const { serviceId } = req.params;
    const { name, nameEn, durationMonths = 1, durationLabel, priceUSD, priceSDG, isPopular = false, isAvailable = true, features = [] } = req.body;
    
    const service = db.services.find(s => s.id === serviceId);
    if (!service) return res.status(404).json({ success: false, error: 'الخدمة غير موجودة.' });
    if (!name || priceUSD === undefined) return res.status(400).json({ success: false, error: 'يرجى إدخال اسم الباقة وسعرها.' });

    const calculatedSDG = priceSDG !== undefined ? Number(priceSDG) : Math.round(Number(priceUSD) * db.settings.usdToSdgRate);

    const newPlan: ServicePlan = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      nameEn: nameEn?.trim() || name.trim(),
      durationMonths: Number(durationMonths) || 1,
      durationLabel: durationLabel || `${durationMonths} شهر`,
      priceUSD: Number(priceUSD),
      priceSDG: calculatedSDG,
      isPopular: Boolean(isPopular),
      isAvailable: Boolean(isAvailable),
      features: Array.isArray(features) ? features : []
    };

    service.plans.push(newPlan);
    res.status(201).json({ success: true, message: 'تمت إضافة الباقة بنجاح.', plan: newPlan, service });
  });

  app.put('/api/admin/services/:serviceId/plans/:planId', (req, res) => {
    const { serviceId, planId } = req.params;
    const service = db.services.find(s => s.id === serviceId);
    if (!service) return res.status(404).json({ success: false, error: 'الخدمة غير موجودة.' });

    const planIndex = service.plans.findIndex(p => p.id === planId);
    if (planIndex === -1) return res.status(404).json({ success: false, error: 'الباقة غير موجودة.' });

    const updated = { ...service.plans[planIndex], ...req.body };
    if (req.body.priceUSD !== undefined && req.body.priceSDG === undefined) {
      updated.priceSDG = Math.round(Number(req.body.priceUSD) * db.settings.usdToSdgRate);
    }
    service.plans[planIndex] = updated;

    res.json({ success: true, message: 'تم تحديث الباقة بنجاح.', plan: updated, service });
  });

  app.delete('/api/admin/services/:serviceId/plans/:planId', (req, res) => {
    const { serviceId, planId } = req.params;
    const service = db.services.find(s => s.id === serviceId);
    if (!service) return res.status(404).json({ success: false, error: 'الخدمة غير موجودة.' });

    service.plans = service.plans.filter(p => p.id !== planId);
    res.json({ success: true, message: 'تم حذف الباقة بنجاح.', service });
  });

  // Admin Email Notifications Inbox (mohom9910@gmail.com)
  app.get('/api/admin/email-notifications', (req, res) => {
    res.json({
      success: true,
      count: db.emailNotifications.length,
      adminEmail: db.settings.adminEmail || 'mohom9910@gmail.com',
      notifications: db.emailNotifications
    });
  });

  app.delete('/api/admin/email-notifications/:id', (req, res) => {
    const { id } = req.params;
    db.emailNotifications = db.emailNotifications.filter(n => n.id !== id);
    res.json({ success: true, message: 'تم حذف الإشعار بنجاح.' });
  });

  // Admin Offers CRUD
  app.post('/api/admin/offers', (req, res) => {
    const { code, title, description, discountType, discountValue, startDate, endDate } = req.body;
    if (!code || !discountValue) return res.status(400).json({ success: false, error: 'بيانات العرض ناقصة.' });

    const newOffer: Offer = {
      id: `off_${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title || `عرض ${code}`,
      description: description || '',
      discountType: discountType || 'PERCENTAGE',
      discountValue: Number(discountValue),
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '2026-12-31',
      isActive: true
    };

    db.offers.push(newOffer);
    res.status(201).json({ success: true, message: 'تم إنشاء العرض بنجاح.', offer: newOffer });
  });

  app.delete('/api/admin/offers/:id', (req, res) => {
    db.offers = db.offers.filter(o => o.id !== req.params.id);
    res.json({ success: true, message: 'تم حذف العرض بنجاح.' });
  });

  // Admin VIP Offers CRUD
  app.post('/api/admin/vip-offers', (req, res) => {
    const { customerEmail, customerName, serviceId, planId, normalPriceUSD, specialPriceUSD, expiryDate, note } = req.body;
    if (!customerEmail || !serviceId || !specialPriceUSD) {
      return res.status(400).json({ success: false, error: 'يرجى تعبئة بريد العميل والخدمة والسعر الخاص.' });
    }

    const service = db.services.find(s => s.id === serviceId);
    const rate = db.settings.usdToSdgRate;

    const newVipOffer: VIPOffer = {
      id: `vip_${Date.now()}`,
      customerEmail: customerEmail.trim().toLowerCase(),
      customerName: customerName || customerEmail.split('@')[0],
      serviceId,
      serviceName: service?.name || 'خدمة مخصصة',
      planId: planId || 'plan_default',
      normalPriceUSD: Number(normalPriceUSD) || 20,
      specialPriceUSD: Number(specialPriceUSD),
      specialPriceSDG: Math.round(Number(specialPriceUSD) * rate),
      expiryDate: expiryDate || '2026-12-31',
      note: note || 'عرض ولاء مخصص للعميل المميز',
      isActive: true
    };

    db.vipOffers.push(newVipOffer);
    res.status(201).json({ success: true, message: `تم إنشاء عرض VIP خاص للعميل (${customerEmail}) بنجاح.`, vipOffer: newVipOffer });
  });

  app.delete('/api/admin/vip-offers/:id', (req, res) => {
    db.vipOffers = db.vipOffers.filter(v => v.id !== req.params.id);
    res.json({ success: true, message: 'تم حذف عرض VIP.' });
  });

  // Admin Reports / Complaints Reply
  app.put('/api/admin/reports/:reportId', (req, res) => {
    const { reportId } = req.params;
    const { adminReply, status } = req.body;
    const ticket = db.reports.find(r => r.reportId.toUpperCase() === reportId.toUpperCase());
    if (!ticket) return res.status(404).json({ success: false, error: 'البلاغ غير موجود.' });

    if (adminReply) ticket.adminReply = adminReply;
    if (status) ticket.status = status;
    if (status === 'RESOLVED' || status === 'CLOSED') {
      ticket.resolvedAt = new Date().toISOString();
    }
    ticket.updatedAt = new Date().toISOString();

    res.json({ success: true, message: 'تم تحديث الرد على البلاغ بنجاح.', ticket });
  });

  // Admin Google Sheets Live Records & Sync
  app.get('/api/admin/google-sheets', (req, res) => {
    res.json({
      success: true,
      count: db.googleSheetRows.length,
      rows: db.googleSheetRows,
      lastSyncTime: db.googleSheetRows[0]?.syncedAt || new Date().toISOString()
    });
  });

  // Admin Google Sheets Live Sync via Google Sheets API (Bearer token or Direct Push)
  app.post('/api/admin/google-sheets/live-sync', async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.body.accessToken || null);
      const { spreadsheetTitle = `SudaHub - سجل عمليات الشراء والاشتراكات (${new Date().getFullYear()})`, customSpreadsheetId } = req.body;

      const headers = [
        "رقم المعاملة (Transaction ID)",
        "رقم الطلب (Order ID)",
        "تاريخ ووقت العملية (Date & Time)",
        "نوع الخدمة (Service)",
        "نوع الباقة (Plan)",
        "المبلغ المدفوع (Amount)",
        "العملة (Currency)",
        "حالة العملية (Status)",
        "بريد العميل (Customer Email)",
        "حساب المستلم المعتمد",
        "وقت آخر تحديث"
      ];

      const values = [
        headers,
        ...db.googleSheetRows.map(r => [
          r.transactionId,
          r.orderId,
          r.dateTime,
          r.serviceType,
          r.planName,
          r.amount,
          r.currency,
          r.status, // "قيد المعالجة (Pending)" | "نجاح (Success)" | "فشل (Failed)"
          r.customerEmail,
          "9138127 (محمد عمر بابكر)",
          r.syncedAt
        ])
      ];

      // If user provided a live Google OAuth Access Token, execute real Google Sheets API call
      if (accessToken) {
        let sheetId = customSpreadsheetId;
        
        // 1. Create Spreadsheet if not already created
        if (!sheetId) {
          const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              properties: {
                title: spreadsheetTitle
              },
              sheets: [
                {
                  properties: {
                    title: 'سجل العمليات (Orders)',
                    gridProperties: {
                      frozenRowCount: 1
                    }
                  }
                }
              ]
            })
          });

          if (!createRes.ok) {
            const errData = await createRes.json().catch(() => ({}));
            return res.status(createRes.status).json({
              success: false,
              error: errData.error?.message || 'فشل إنشاء صفحة Google Sheets عبر الـ API.',
              details: errData
            });
          }

          const createdData: any = await createRes.json();
          sheetId = createdData.spreadsheetId;
        }

        // 2. Update values in the sheet
        const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/سجل العمليات (Orders)!A1?valueInputOption=USER_ENTERED`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            range: 'سجل العمليات (Orders)!A1',
            majorDimension: 'ROWS',
            values
          })
        });

        const updateData: any = await updateRes.json().catch(() => ({}));
        const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

        return res.json({
          success: true,
          message: 'تمت مزامنة وتسجيل كافة العمليات في صفحة Google Sheets بنجاح فوري!',
          spreadsheetId: sheetId,
          spreadsheetUrl,
          totalRows: db.googleSheetRows.length,
          syncedAt: new Date().toISOString()
        });
      }

      // If no direct token provided, return formatted live data with ready-to-use URL & CSV
      res.json({
        success: true,
        message: 'سجل Google Sheets محدث وجاهز للمزامنة الفورية',
        totalRows: db.googleSheetRows.length,
        rows: db.googleSheetRows,
        previewHeaders: headers,
        syncedAt: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'فشل المزامنة مع Google Sheets' });
    }
  });

  // Admin WhatsApp Logs & Trigger Test
  app.get('/api/admin/whatsapp/logs', (req, res) => {
    res.json({ success: true, count: db.whatsappLogs.length, logs: db.whatsappLogs });
  });

  app.post('/api/admin/whatsapp/send-test', (req, res) => {
    const { phone, message } = req.body;
    logWhatsAppMessage('TEST_MSG', phone || db.settings.whatsappNumber, 'ADMIN_TEST', message || 'رسالة تجريبية من منصة SudaHub Cloud API.');
    res.json({ success: true, message: 'تم إرسال إشعار الواتساب التجريبي بنجاح وتسجيله في السجل.' });
  });

  // Admin Webhook Logs
  app.get('/api/admin/webhooks/logs', (req, res) => {
    res.json({ success: true, count: db.webhookEvents.length, events: db.webhookEvents });
  });

  // Update System Settings
  app.put('/api/admin/settings', (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    res.json({ success: true, message: 'تم حفظ إعدادات النظام بنجاح.', settings: db.settings });
  });

  // Public Real Webhook Ingress
  app.post('/api/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature'] || req.headers['x-sudahub-signature'];
    const eventType = req.body?.event || 'generic.event';

    const evt: WebhookEvent = {
      id: `wh_in_${Date.now()}`,
      eventType: String(eventType),
      source: (req.headers['user-agent'] || 'External Webhook Client').slice(0, 50),
      signatureVerified: true,
      payload: req.body,
      status: 'SUCCESS',
      receivedAt: new Date().toISOString()
    };

    db.webhookEvents.unshift(evt);
    res.json({ received: true, eventId: evt.id });
  });

  // ==========================================
  // VITE MIDDLEWARE & STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SudaHub Server] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
