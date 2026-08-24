export type Role = 'CUSTOMER' | 'ADMIN' | 'VIP';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  createdAt: string;
}

export type ServiceCategory = 
  | 'ALL'
  | 'AI_SUBSCRIPTIONS'
  | 'SOFTWARE'
  | 'STARLINK'
  | 'VIP_SERVICES'
  | 'STREAMING_CREATIVE';

export interface ServicePlan {
  id: string;
  name: string;
  nameEn: string;
  durationMonths: number;
  durationLabel: string;
  priceUSD: number;
  priceSDG: number;
  discountPercent?: number;
  isPopular?: boolean;
  isAvailable: boolean;
  features: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  longDescription: string;
  logo: string;
  color: string;
  badge?: string;
  isActive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  plans: ServicePlan[];
  deliveryTime: string;
  warranty: string;
  requirements: string;
  instructions: string[];
}

export type OrderStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_SUBMITTED'
  | 'PAYMENT_VERIFICATION'
  | 'PAYMENT_CONFIRMED'
  | 'ACTIVATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'PAYMENT_REJECTED'
  | 'NEED_NEW_RECEIPT';

export interface AccountCredentials {
  usernameOrEmail?: string;
  passwordOrPin?: string;
  activationCodeOrKey?: string;
  instructions?: string;
  additionalInfo?: string;
}

export interface Order {
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceId: string;
  serviceName: string;
  serviceLogo: string;
  planId: string;
  planName: string;
  duration: string;
  amount: number;
  currency: 'SDG' | 'USD';
  exchangeRateUsed: number;
  status: OrderStatus;
  paymentMethod: 'BANKAK' | 'DOLLAR_TRANSFER' | 'OTHER';
  paymentProofUrl?: string;
  paymentProofId?: string;
  paymentSubmittedAt?: string;
  senderAccountNumber?: string;
  receiverAccountNumber?: string;
  transactionReference?: string;
  transferDateTime?: string;
  transferredAmount?: number;
  activationStartedAt?: string;
  activationStartedBy?: string;
  completedAt?: string;
  completedBy?: string;
  accountCredentials?: AccountCredentials;
  rejectionReason?: string;
  whatsappNotificationSent: boolean;
  sheetSyncStatus: 'SYNCED' | 'PENDING' | 'FAILED';
  sheetSyncedAt?: string;
  sheetRowId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeRate {
  rate: number;
  updatedAt: string;
  updatedBy: string;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  serviceId?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface VIPOffer {
  id: string;
  customerEmail: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  planId: string;
  normalPriceUSD: number;
  specialPriceUSD: number;
  specialPriceSDG: number;
  expiryDate: string;
  note: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  orderId: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  isFeatured: boolean;
  createdAt: string;
}

export type ReportType = 
  | 'SERVICE_ISSUE' 
  | 'PAYMENT_ISSUE' 
  | 'APP_ISSUE' 
  | 'SERVICE_NOT_WORKING' 
  | 'DUPLICATE_CHARGE' 
  | 'OTHER';

export type ReportStatus = 'NEW' | 'REVIEWING' | 'PROCESSING' | 'RESOLVED' | 'CLOSED';

export interface ReportTicket {
  reportId: string;
  orderId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  type: ReportType;
  subject: string;
  description: string;
  status: ReportStatus;
  adminReply?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppLog {
  id: string;
  orderId: string;
  recipient: string;
  messageType: string;
  messageBody: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  sentAt: string;
}

export interface GoogleSheetRow {
  transactionId: string;
  orderId: string;
  dateTime: string;
  serviceType: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'قيد المعالجة (Pending)' | 'نجاح (Success)' | 'فشل (Failed)' | string;
  customerEmail: string;
  syncedAt: string;
}

export interface WebhookEvent {
  id: string;
  eventType: string;
  source: string;
  signatureVerified: boolean;
  payload: any;
  status: 'SUCCESS' | 'FAILED';
  receivedAt: string;
}

export interface AdminEmailNotification {
  id: string;
  toEmail: string;
  subject: string;
  body: string;
  orderId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  transactionReference?: string;
  senderAccount?: string;
  receiverAccount?: string;
  transferDateTime?: string;
  receiptUrl?: string;
  sentAt: string;
  status: 'SENT' | 'DELIVERED';
}

export interface AppSettings {
  appName: string;
  adminEmail: string;
  ownerName: string;
  supportPhone: string;
  whatsappNumber: string;
  bankakAccountName: string;
  bankakAccountNumber: string;
  bankakInstructions: string;
  usdAccountName: string;
  usdAccountNumber: string;
  usdInstructions: string;
  usdToSdgRate: number;
  whatsappEnabled: boolean;
  googleSheetsEnabled: boolean;
  webhookSecret: string;
}
