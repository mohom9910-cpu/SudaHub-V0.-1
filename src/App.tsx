import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { ExchangeRateWidget } from './components/ExchangeRateWidget.tsx';
import { ServiceCategories } from './components/ServiceCategories.tsx';
import { ServiceCard } from './components/ServiceCard.tsx';
import { ServiceDetailModal } from './components/ServiceDetailModal.tsx';
import { OrderCheckoutModal } from './components/OrderCheckoutModal.tsx';
import { OrderStatusTracker } from './components/OrderStatusTracker.tsx';
import { ReviewsSection, ReviewModal } from './components/ReviewsSection.tsx';
import { ReportTicketModal } from './components/ReportTicketModal.tsx';
import { VIPOfferModal } from './components/VIPOfferModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { Footer } from './components/Footer.tsx';
import { GoogleDriveExportModal } from './components/GoogleDriveExportModal.tsx';
import { AndroidAPKModal } from './components/AndroidAPKModal.tsx';
import { WhatsAppSupportButton } from './components/WhatsAppSupportButton.tsx';
import { apiClient } from './services/apiClient.ts';

import { 
  ServiceItem, 
  ServicePlan, 
  ServiceCategory, 
  Order, 
  AppSettings, 
  Review, 
  VIPOffer 
} from './types.ts';
import { 
  INITIAL_SERVICES, 
  DEFAULT_SETTINGS, 
  INITIAL_REVIEWS 
} from './data/initialData.ts';

export default function App() {
  // Navigation & View Mode
  const [isAdminView, setIsAdminView] = useState(
    window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')
  );

  // Global App Data
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [detailService, setDetailService] = useState<ServiceItem | null>(null);
  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean;
    service: ServiceItem | null;
    plan: ServicePlan | null;
    currency: 'SDG' | 'USD';
  }>({
    isOpen: false,
    service: null,
    plan: null,
    currency: 'SDG'
  });

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [showTrackerSection, setShowTrackerSection] = useState<boolean>(false);
  const [showVIPModal, setShowVIPModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showGoogleDriveModal, setShowGoogleDriveModal] = useState<boolean>(false);
  const [showAndroidAPKModal, setShowAndroidAPKModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<{ isOpen: boolean; order: Order | null }>({
    isOpen: false,
    order: null
  });

  // Check URL Hash on load & hashchange
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminView(true);
      } else if (window.location.hash === '#track') {
        setShowTrackerSection(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch initial data from server APIs
  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const [servData, pricingData, revData] = await Promise.all([
          apiClient.getServices().catch(() => ({ success: false, services: [] })),
          apiClient.getPricingSettings().catch(() => ({ success: false, usdToSdgRate: 2750, currency: 'SDG', settings: DEFAULT_SETTINGS })),
          apiClient.getReviews().catch(() => ({ success: false, reviews: [] }))
        ]);

        if (servData.success && servData.services && servData.services.length > 0) {
          setServices(servData.services);
        }
        if (pricingData.success && pricingData.settings) {
          setSettings(pricingData.settings);
        }
        if (revData.success && revData.reviews && revData.reviews.length > 0) {
          setReviews(revData.reviews);
        }
      } catch (err) {
        console.error('Failed to load live data from backend', err);
      }
    };

    fetchAppData();
  }, []);

  // Category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<ServiceCategory, number> = {
      ALL: services.length,
      AI_SUBSCRIPTIONS: 0,
      SOFTWARE: 0,
      STARLINK: 0,
      STREAMING_CREATIVE: 0,
      VIP_SERVICES: 0,
    };
    services.forEach((s) => {
      if (counts[s.category] !== undefined) {
        counts[s.category]++;
      }
    });
    return counts;
  }, [services]);

  // Filtered Services
  const filteredServices = React.useMemo(() => {
    return services.filter((s) => {
      if (!s.isActive) return false;
      const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  // Handlers for checkout flow
  const handleSelectService = (service: ServiceItem) => {
    setDetailService(service);
  };

  const handleProceedToCheckout = (service: ServiceItem, plan: ServicePlan, currency: 'SDG' | 'USD') => {
    setDetailService(null);
    setCheckoutModal({
      isOpen: true,
      service,
      plan,
      currency
    });
  };

  const handleSelectVIPOffer = (service: ServiceItem, vipOffer: VIPOffer) => {
    const targetPlan = service.plans[0];
    setCheckoutModal({
      isOpen: true,
      service,
      plan: targetPlan,
      currency: 'SDG'
    });
  };

  const handleOrderCreated = (order: Order) => {
    setCheckoutModal({ isOpen: false, service: null, plan: null, currency: 'SDG' });
    setActiveTrackingOrder(order);
    setShowTrackerSection(true);

    // Scroll to tracker
    setTimeout(() => {
      document.getElementById('live-tracker-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  // If Admin View is active, render the full admin dashboard
  if (isAdminView) {
    return (
      <AdminDashboard 
        onCloseAdmin={() => {
          setIsAdminView(false);
          window.location.hash = '';
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col font-['Tajawal',sans-serif] selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Global Navigation */}
      <Navbar
        settings={settings}
        activeOrdersCount={activeTrackingOrder ? 1 : 0}
        onOpenAdmin={() => setIsAdminView(true)}
        onOpenVIPLookup={() => setShowVIPModal(true)}
        onOpenReport={() => setShowReportModal(true)}
        onOpenGoogleDrive={() => setShowGoogleDriveModal(true)}
        onOpenAndroidAPK={() => setShowAndroidAPKModal(true)}
        onOpenTrackOrder={() => {
          setShowTrackerSection(true);
          setTimeout(() => {
            document.getElementById('live-tracker-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        isAdminOpen={isAdminView}
        onScrollToServices={() => document.getElementById('services-catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
        onScrollToExchangeRate={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
        onScrollToReviews={() => window.scrollTo({ top: 1200, behavior: 'smooth' })}
      />

      {/* Main Content Body */}
      <main className="flex-1 space-y-10 sm:space-y-14">
        
        {/* 2. Hero Presentation Banner */}
        <HeroBanner
          settings={settings}
          onExploreServices={() => {
            document.getElementById('services-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenVIPModal={() => setShowVIPModal(true)}
          onTrackOrder={() => {
            setShowTrackerSection(true);
            setTimeout(() => {
              document.getElementById('live-tracker-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />

        {/* 3. Live Exchange Rate & Bankak Info Widget */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExchangeRateWidget settings={settings} />
        </section>

        {/* 4. Live Order Status Tracker (Interactive Section) */}
        {(showTrackerSection || activeTrackingOrder) && (
          <section id="live-tracker-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <OrderStatusTracker
              initialOrder={activeTrackingOrder}
              settings={settings}
              onClose={() => setShowTrackerSection(false)}
              onOpenReviewModal={(order) => setShowReviewModal({ isOpen: true, order })}
            />
          </section>
        )}

        {/* 5. Services & AI Subscriptions Catalog */}
        <section id="services-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                <span>تفعيل رسمي • سرعة فائقة • ضمان مستمر</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                دليل باقات واشتراكات <span className="text-emerald-400">SudaHub</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                اختر الخدمة المطلوبة، ادفع ببنكك مباشرة، واستلم بياناتك أو تفعيلك خلال دقائق.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن أداة أو خدمة (ChatGPT, Starlink...)"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Categories Selector */}
          <ServiceCategories
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={categoryCounts}
          />

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-2">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelectService={handleSelectService}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
              <p className="text-base font-bold text-slate-300">لم يتم العثور على خدمات مطابقة للبحث أو التصنيف.</p>
              <p className="text-xs text-slate-500">جرب البحث بكلمة أخرى أو تصفح جميع الأقسام.</p>
            </div>
          )}

        </section>

        {/* 6. Customer Testimonials & Reviews */}
        <ReviewsSection
          reviews={reviews}
          onOpenReviewModal={() => setShowReviewModal({ isOpen: true, order: null })}
        />

      </main>

      {/* 7. Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminView(true)}
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenVIPModal={() => setShowVIPModal(true)}
        onOpenGoogleDriveModal={() => setShowGoogleDriveModal(true)}
        onOpenAndroidAPKModal={() => setShowAndroidAPKModal(true)}
        onOpenTrackOrders={() => {
          setShowTrackerSection(true);
          setTimeout(() => {
            document.getElementById('live-tracker-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* --- ALL INTERACTIVE MODALS --- */}

      {/* 1. Service Detail Modal */}
      {detailService && (
        <ServiceDetailModal
          service={detailService}
          settings={settings}
          onClose={() => setDetailService(null)}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* 2. Order Checkout & Receipt Upload Modal */}
      {checkoutModal.isOpen && checkoutModal.service && checkoutModal.plan && (
        <OrderCheckoutModal
          service={checkoutModal.service}
          plan={checkoutModal.plan}
          currency={checkoutModal.currency}
          settings={settings}
          onClose={() => setCheckoutModal({ isOpen: false, service: null, plan: null, currency: 'SDG' })}
          onOrderCreated={handleOrderCreated}
        />
      )}

      {/* 3. VIP Private Pricing Modal */}
      {showVIPModal && (
        <VIPOfferModal
          services={services}
          onClose={() => setShowVIPModal(false)}
          onSelectVIPOffer={handleSelectVIPOffer}
        />
      )}

      {/* 4. Support & Complaints Ticket Modal */}
      {showReportModal && (
        <ReportTicketModal
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* 5. Review Submission Modal */}
      {showReviewModal.isOpen && (
        <ReviewModal
          order={showReviewModal.order}
          onClose={() => setShowReviewModal({ isOpen: false, order: null })}
          onSubmitted={(newRev) => setReviews(prev => [newRev, ...prev])}
        />
      )}

      {/* 6. Google Drive Export Modal */}
      {showGoogleDriveModal && (
        <GoogleDriveExportModal
          onClose={() => setShowGoogleDriveModal(false)}
          services={services}
          settings={settings}
          orders={activeTrackingOrder ? [activeTrackingOrder] : []}
          reviews={reviews}
        />
      )}

      {/* 7. Android APK & PWA Installation Modal */}
      {showAndroidAPKModal && (
        <AndroidAPKModal
          onClose={() => setShowAndroidAPKModal(false)}
        />
      )}

      {/* 8. Interactive WhatsApp Business Floating Widget */}
      <WhatsAppSupportButton customNumber={settings.whatsappNumber || "+249907756261"} />

    </div>
  );
}
