import { 
  ServiceItem, 
  AppSettings, 
  Order, 
  Offer, 
  VIPOffer, 
  Review, 
  ReportTicket 
} from '../types.ts';

// Configured Primary Backend API Base URL from user request
export const PRIMARY_API_BASE_URL = 'https://ais-dev-crcrhby2psfduphfw4xo7h-180640004892.europe-west1.run.app/api';
export const LOCAL_API_BASE_URL = '/api';

// Support direct custom WhatsApp URL
export const WHATSAPP_SUPPORT_URL = 'https://wa.me/249907756261?text=' + encodeURIComponent('مرحباً، أود الاستفسار عن خدمات SudaHub');
export const WHATSAPP_PHONE_NUMBER = '+249907756261';

/**
 * Smart fetch wrapper that prioritizes the configured backend API URL
 * and gracefully falls back to local API if cross-origin or network constraints occur.
 */
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const primaryUrl = `${PRIMARY_API_BASE_URL}${cleanEndpoint}`;
  const localUrl = `${LOCAL_API_BASE_URL}${cleanEndpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(primaryUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
    
    // If not OK on primary, try local fallback
    console.warn(`Primary API returned status ${res.status}, attempting fallback to local API.`);
  } catch (primaryError) {
    // Expected in cross-container or iframe CORS environments; fallback smoothly
    console.warn(`Primary API fetch failed for ${primaryUrl}, falling back to ${localUrl}`, primaryError);
  }

  // Fallback to local server endpoint
  const localRes = await fetch(localUrl, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  });

  if (!localRes.ok) {
    const errorData = await localRes.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${localRes.status}`);
  }

  return await localRes.json();
}

export const apiClient = {
  /**
   * Fetch all active services (/services)
   */
  async getServices(): Promise<{ success: boolean; services: ServiceItem[] }> {
    return apiRequest<{ success: boolean; services: ServiceItem[] }>('/services');
  },

  /**
   * Fetch pricing, exchange rate & payment settings (/settings/pricing)
   */
  async getPricingSettings(): Promise<{ 
    success: boolean; 
    usdToSdgRate: number; 
    currency: string; 
    paymentMethods?: any[]; 
    settings: AppSettings 
  }> {
    return apiRequest<{ 
      success: boolean; 
      usdToSdgRate: number; 
      currency: string; 
      paymentMethods?: any[]; 
      settings: AppSettings 
    }>('/settings/pricing');
  },

  /**
   * Fetch all active promotional offers (/offers)
   */
  async getOffers(): Promise<{ success: boolean; count: number; offers: Offer[] }> {
    return apiRequest<{ success: boolean; count: number; offers: Offer[] }>('/offers');
  },

  /**
   * Create a new subscription or service order (/orders)
   */
  async createOrder(orderPayload: {
    serviceId: string;
    planId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    currency: 'SDG' | 'USD';
    paymentMethod: string;
    promoCode?: string;
  }): Promise<{ success: boolean; message: string; order: Order; paymentInfo?: any }> {
    return apiRequest<{ success: boolean; message: string; order: Order; paymentInfo?: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
  },

  /**
   * Submit payment proof receipt image & details for an existing order (/orders/:orderId/payment-proof)
   */
  async submitPaymentProof(orderId: string, payload: {
    receiptImage: string;
    senderName?: string;
    senderAccountNumber?: string;
    receiverAccountNumber?: string;
    transactionReference?: string;
    transferDateTime?: string;
    transferredAmount?: number;
    transactionRef?: string;
  }): Promise<{ success: boolean; message: string; order: Order }> {
    return apiRequest<{ success: boolean; message: string; order: Order }>(`/orders/${orderId}/payment-proof`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  /**
   * Unified Authentication Login (/auth/login)
   */
  async loginAuth(credentials: {
    username?: string;
    email?: string;
    password: string;
  }): Promise<{
    success: boolean;
    message: string;
    token: string;
    user: { id: string; name: string; role: string; email: string };
    admin?: { name: string; role: string; email: string };
  }> {
    return apiRequest<{
      success: boolean;
      message: string;
      token: string;
      user: { id: string; name: string; role: string; email: string };
      admin?: { name: string; role: string; email: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  /**
   * Track order by Order ID (/orders/:orderId)
   */
  async getOrder(orderId: string): Promise<{ success: boolean; order: Order }> {
    return apiRequest<{ success: boolean; order: Order }>(`/orders/${orderId}`);
  },

  /**
   * Search customer orders by query or email (/customer/orders)
   */
  async getCustomerOrders(query: string): Promise<{ success: boolean; orders: Order[] }> {
    return apiRequest<{ success: boolean; orders: Order[] }>(`/customer/orders?query=${encodeURIComponent(query)}`);
  },

  /**
   * Get VIP Offers by customer email (/vip-offers)
   */
  async getVIPOffers(email: string): Promise<{ success: boolean; vipOffers: VIPOffer[] }> {
    return apiRequest<{ success: boolean; vipOffers: VIPOffer[] }>(`/vip-offers?email=${encodeURIComponent(email)}`);
  },

  /**
   * Validate Promo Code (/offers/validate)
   */
  async validateOfferCode(code: string): Promise<{ success: boolean; offer: Offer }> {
    return apiRequest<{ success: boolean; offer: Offer }>('/offers/validate', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  },

  /**
   * Fetch customer reviews (/reviews)
   */
  async getReviews(): Promise<{ success: boolean; reviews: Review[] }> {
    return apiRequest<{ success: boolean; reviews: Review[] }>('/reviews');
  },

  /**
   * Submit a new customer review (/reviews)
   */
  async submitReview(reviewPayload: {
    orderId?: string;
    serviceId?: string;
    serviceName?: string;
    customerName: string;
    rating: number;
    comment: string;
  }): Promise<{ success: boolean; message: string; review: Review }> {
    return apiRequest<{ success: boolean; message: string; review: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewPayload)
    });
  },

  /**
   * Submit Support or Complaint Ticket (/reports)
   */
  async submitReportTicket(reportPayload: {
    orderId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    type?: string;
    subject: string;
    description: string;
  }): Promise<{ success: boolean; message: string; ticket: ReportTicket }> {
    return apiRequest<{ success: boolean; message: string; ticket: ReportTicket }>('/reports', {
      method: 'POST',
      body: JSON.stringify(reportPayload)
    });
  },

  /**
   * Check Report Ticket Status (/reports/:reportId)
   */
  async getReportTicket(reportId: string): Promise<{ success: boolean; ticket: ReportTicket }> {
    return apiRequest<{ success: boolean; ticket: ReportTicket }>(`/reports/${reportId}`);
  }
};
