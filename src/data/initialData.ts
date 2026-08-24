import { ServiceItem, AppSettings, Review, Offer, VIPOffer, ReportTicket } from '../types.ts';

export const DEFAULT_SETTINGS: AppSettings = {
  appName: "SudaHub | سوداهب",
  adminEmail: "mohom9910@gmail.com",
  ownerName: "محمد عمر بابكر",
  supportPhone: "+249907756261",
  whatsappNumber: "+249907756261",
  bankakAccountName: "محمد عمر بابكر",
  bankakAccountNumber: "9138127",
  bankakInstructions: "يرجى تحويل المبلغ بالجنيه السوداني بدقة إلى حساب (محمد عمر بابكر - 9138127)، ثم رفع إشعار التحويل المباشر مع رقم العملية للتحقق الفوري.",
  usdAccountName: "SudaHub Tech Pay Global (محمد عمر بابكر)",
  usdAccountNumber: "USDT / Binance Pay: 94810284",
  usdInstructions: "للدفع بالدولار أو العملات الرقمية يرجى إرسال المبلغ الصافي والتأكد من رقم المعاملة Transaction Hash.",
  usdToSdgRate: 4000, // 1 USD = 4000 SDG
  whatsappEnabled: true,
  googleSheetsEnabled: true,
  webhookSecret: "sudahub_sec_94827103984",
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "serv_system_trial",
    name: "باقة تجربة النظام الرمزية (1 قرش)",
    nameEn: "System Trial & Verification (1 Penny)",
    slug: "system-trial",
    category: "AI_SUBSCRIPTIONS",
    description: "باقة مخصصة لتجربة واختبار منظومة الدفع الفوري عبر بنكك، والتحقق، والمزامنة اللحظية مع Google Sheets.",
    longDescription: "تتيح لك هذه الباقة الرمزية بقيمة قرش واحد تجربة دورة الطلب كاملة: إنشاء الطلب، رفع إشعار التحويل لحساب بنكك 9138127 (محمد عمر بابكر)، وتأكيد العملية من لوحة الأدمن، وتحديث الحالة إلى نجاح (Success) في صفحة Google Sheets المربوطة.",
    logo: "Sparkles",
    color: "#10B981",
    badge: "تجربة النظام (1 قرش) ⚡",
    isActive: true,
    isFeatured: true,
    isTrending: false,
    deliveryTime: "فوري (للتجربة)",
    warranty: "ضمان كامل",
    requirements: "البريد الإلكتروني فقط",
    instructions: [
      "اختر باقة التجربة الرمزية بقيمة قرش واحد",
      "أدخل بريدك للتجربة",
      "ارفع إشعار التحويل التجريبي",
      "انتقل للوحة الأدمن واضغط 'تأكيد' لترى تحديث الحالة لـ نجاح (Success) فوراً في Google Sheets"
    ],
    plans: [
      {
        id: "plan_trial_1penny",
        name: "باقة تجربة النظام الرمزية (1 قرش)",
        nameEn: "System Trial Plan (1 Penny)",
        durationMonths: 1,
        durationLabel: "تجربة فورية",
        priceUSD: 0.0001,
        priceSDG: 1,
        discountPercent: 0,
        isPopular: true,
        isAvailable: true,
        features: ["قيمة رمزية للاختبار (1 قرش / 1 SDG)", "اختبار شاشة الدفع باسم محمد عمر بابكر", "اختبار التحديث التلقائي في Google Sheets", "اختبار إشعار الأدمن في mohom9910@gmail.com"]
      }
    ]
  },
  {
    id: "serv_chatgpt",
    name: "اشتراك شات جي بي تي بلس",
    nameEn: "ChatGPT Plus (GPT-4o / o1)",
    slug: "chatgpt-plus",
    category: "AI_SUBSCRIPTIONS",
    description: "الوصول غير المحدود لأحدث نماذج OpenAI الذكية GPT-4o والقدرة على توليد الصور وتحليل البيانات المتقدم.",
    longDescription: "احصل على حساب ChatGPT Plus رسمي ومفعل بالكامل على بريدك الإلكتروني الخاص أو حساب جاهز مع أولوية الوصول وقت الذروة، وسرعة استجابة فائقة واستخدام روبوت DALL-E 3 لتوليد الصور وميزات Canvas التفاعلية.",
    logo: "Sparkles",
    color: "#10B981",
    badge: "الأكثر طلباً 🔥",
    isActive: true,
    isFeatured: true,
    isTrending: true,
    deliveryTime: "15 - 30 دقيقة",
    warranty: "ضمان كامل طوال مدة الاشتراك (30 يوم / 90 يوم)",
    requirements: "البريد الإلكتروني فقط (لا نطلب كلمة المرور الخاصة بك أبداً)",
    instructions: [
      "اختر الباقة المناسبة والمدة المطلوبة",
      "أدخل بريدك الإلكتروني الذي تود التفعيل عليه",
      "أتمم الدفع عبر بنكك وارفع الإشعار",
      "ستصلك دعوة التفعيل الرسمية أو بيانات الحساب الفورية عبر الواتساب والإيميل"
    ],
    plans: [
      {
        id: "plan_test_penny",
        name: "باقة تجربة النظام الرمزية (1 قرش)",
        nameEn: "System Test Plan (1 Penny)",
        durationMonths: 1,
        durationLabel: "تجربة فورية",
        priceUSD: 0.0001,
        priceSDG: 1, // 1 SDG / قرش رمزي لتجربة النظام
        discountPercent: 99,
        isPopular: false,
        isAvailable: true,
        features: ["باقة مخصصة لتجربة النظام واختبار دورة الدفع والتأكيد", "تأكيد فوري عبر حساب بنكك 9138127", "مزامنة مباشرة مع Google Sheets"]
      },
      {
        id: "plan_gpt_1m",
        name: "باقة 1 شهر",
        nameEn: "1 Month Plan",
        durationMonths: 1,
        durationLabel: "1 شهر (30 يوم)",
        priceUSD: 20,
        priceSDG: 80000,
        discountPercent: 0,
        isPopular: true,
        isAvailable: true,
        features: ["الوصول لنموذج GPT-4o و o1", "توليد الصور بدقة فائقة DALL-E 3", "تحليل الملفات ومحرر الأكواد المتقدم", "استخدام مخصص للـ Custom GPTs", "ضمان استبدال واستقرار 100%"]
      },
      {
        id: "plan_gpt_3m",
        name: "باقة 3 أشهر",
        nameEn: "3 Months Plan",
        durationMonths: 3,
        durationLabel: "3 أشهر (90 يوم)",
        priceUSD: 55,
        priceSDG: 220000,
        discountPercent: 10,
        isPopular: false,
        isAvailable: true,
        features: ["توفير 10% مقارنة بالدفع الشهري", "تجديد دوري ومستمر", "دعم فني مباشر VIP", "استخدام كامل لكل الميزات الحصرية"]
      },
      {
        id: "plan_gpt_6m",
        name: "باقة 6 أشهر",
        nameEn: "6 Months Plan",
        durationMonths: 6,
        durationLabel: "6 أشهر",
        priceUSD: 105,
        priceSDG: 420000,
        discountPercent: 15,
        isPopular: false,
        isAvailable: true,
        features: ["توفير 15% عالي القيمة", "ثبات واستقرار كامل", "أولوية التفعيل الفوري", "دعم مخصص 24/7"]
      }
    ]
  },
  {
    id: "serv_claude",
    name: "اشتراك كلود برو",
    nameEn: "Claude 3.5 Sonnet Pro",
    slug: "claude-pro",
    category: "AI_SUBSCRIPTIONS",
    description: "أقوى نموذج ذكاء اصطناعي للمبرمجين والكتاب والباحثين من شركة Anthropic.",
    longDescription: "يقدم Claude 3.5 Sonnet سياقاً ضخماً يتجاوز 200,000 رمز، وميزة Artifacts التفاعلية لتطوير واجهات وتطبيقات تفاعلية في ثوانٍ، ودقة لا تضاهى في كتابة الأكواد واللغة العربية.",
    logo: "Cpu",
    color: "#D97706",
    badge: "خيار المطورين ⚡",
    isActive: true,
    isFeatured: true,
    isTrending: true,
    deliveryTime: "20 - 45 دقيقة",
    warranty: "ضمان استقرار كامل 100%",
    requirements: "البريد الإلكتروني للعميل",
    instructions: [
      "اختر باقة Claude Pro المناسبة",
      "أدخل بريدك الإلكتروني",
      "سدد عبر بنكك وارفع الإشعار",
      "سيتم تفعيل الاشتراك رسمياً على حسابك"
    ],
    plans: [
      {
        id: "plan_claude_1m",
        name: "باقة 1 شهر",
        nameEn: "1 Month Pro",
        durationMonths: 1,
        durationLabel: "1 شهر",
        priceUSD: 20,
        priceSDG: 80000,
        discountPercent: 0,
        isPopular: true,
        isAvailable: true,
        features: ["وصول كامل لـ Claude 3.5 Sonnet & Opus", "سعة استخدام أكبر 5 أضعاف", "دعم ميزة Artifacts التفاعلية", "معالجة المستندات والملفات الضخمة"]
      },
      {
        id: "plan_claude_3m",
        name: "باقة 3 أشهر",
        nameEn: "3 Months Pro",
        durationMonths: 3,
        durationLabel: "3 أشهر",
        priceUSD: 56,
        priceSDG: 224000,
        discountPercent: 8,
        isPopular: false,
        isAvailable: true,
        features: ["خصم خاص للتجديد", "ثبات عالي", "أولوية دعم فني"]
      }
    ]
  },
  {
    id: "serv_cursor",
    name: "اشتراك محرر كيرسور",
    nameEn: "Cursor AI Code Editor Pro",
    slug: "cursor-pro",
    category: "SOFTWARE",
    description: "محرر الأكواد الذكي الأقوى في العالم المدعوم بنماذج Claude 3.5 و GPT-4o.",
    longDescription: "أداة المبرمجين الأساسية في 2026. يمنحك Cursor Pro إمكانية إنشاء تطبيقات ومواقع كاملة بضغطة زر وتعديل المشاريع الضخمة، مع سياق كامل لمستودع الكود واستجابة سريعة جداً.",
    logo: "Terminal",
    color: "#6366F1",
    badge: "موصى به للمبرمجين 💻",
    isActive: true,
    isFeatured: true,
    isTrending: true,
    deliveryTime: "15 - 30 دقيقة",
    warranty: "ضمان رسمي كامل طوال الفترة",
    requirements: "البريد الإلكتروني فقط",
    instructions: [
      "اختر الباقة المناسبة",
      "أدخل البريد الإلكتروني الخاص بك في Cursor",
      "حول عبر بنكك وارفع الإشعار لتفعيل Pro فوراً"
    ],
    plans: [
      {
        id: "plan_cursor_1m",
        name: "باقة 1 شهر برو",
        nameEn: "1 Month Pro",
        durationMonths: 1,
        durationLabel: "1 شهر",
        priceUSD: 20,
        priceSDG: 80000,
        discountPercent: 0,
        isPopular: true,
        isAvailable: true,
        features: ["500 طلب سريع لـ Claude 3.5 Sonnet شهرياً", "طلبات غير محدودة للـ Slow Requests", "ميزة Cursor Tab الذكية لإكمال الكود التلقائي", "فهم كامل لمستودع الكود الكامل Codebase Indexing"]
      },
      {
        id: "plan_cursor_3m",
        name: "باقة 3 أشهر برو",
        nameEn: "3 Months Pro",
        durationMonths: 3,
        durationLabel: "3 أشهر",
        priceUSD: 57,
        priceSDG: 228000,
        discountPercent: 5,
        isPopular: false,
        isAvailable: true,
        features: ["وفر مع باقة 3 أشهر", "حساب Pro مستمر ومستقر", "دعم فني وتوجيه المطورين"]
      }
    ]
  },
  {
    id: "serv_midjourney",
    name: "اشتراك ميدجورني لتوليد الصور",
    nameEn: "Midjourney v6.1",
    slug: "midjourney",
    category: "AI_SUBSCRIPTIONS",
    description: "الأداة الأولى عالمياً لتوليد الصور والتصاميم الإبداعية الواقعية والسينمائية.",
    longDescription: "اشتراك رسمي في Midjourney v6.1 يمنحك توليد سريع للصور بدون حدود، واستخدام خاص مع الحفاظ على سرية الصور والاستفادة من أفضل خوارزميات التصميم البصري والفني.",
    logo: "Palette",
    color: "#EC4899",
    badge: "للمصممين 🎨",
    isActive: true,
    isFeatured: false,
    isTrending: true,
    deliveryTime: "30 دقيقة",
    warranty: "ضمان كامل وسرعة التفعيل",
    requirements: "بريد حساب Discord أو البريد الإلكتروني",
    instructions: [
      "اختر الخطة المطلوبة",
      "أدخل حسابك لتفعيل البوت أو استلام الحساب الخاص",
      "سدد المبلغ وسنبدأ التفعيل فوراً"
    ],
    plans: [
      {
        id: "plan_mj_basic",
        name: "الخطة الأساسية (Basic)",
        nameEn: "Basic Plan - 200 Gens",
        durationMonths: 1,
        durationLabel: "1 شهر",
        priceUSD: 12,
        priceSDG: 48000,
        discountPercent: 0,
        isPopular: false,
        isAvailable: true,
        features: ["أكثر من 200 عملية توليد صور سريعة", "معرض صور شخصي كامل", "حقوق الاستخدام التجاري للصور"]
      },
      {
        id: "plan_mj_standard",
        name: "الخطة القياسية (Standard)",
        nameEn: "Standard - Unlimited Relax",
        durationMonths: 1,
        durationLabel: "1 شهر",
        priceUSD: 30,
        priceSDG: 120000,
        discountPercent: 0,
        isPopular: true,
        isAvailable: true,
        features: ["15 ساعة توليد سريع Fast Hours", "توليد صور غير محدود Relaxed Mode", "حقوق تجارية كاملة", "أولوية وسرعة أعلى"]
      }
    ]
  },
  {
    id: "serv_starlink",
    name: "خدمات وإنترنت ستارلينك في السودان",
    nameEn: "Starlink Sudan Services",
    slug: "starlink-sudan",
    category: "STARLINK",
    description: "توفير أجهزة Starlink V4 ومستلزماتها وتجديد اشتراكات الباقات الإقليمية Roam في السودان.",
    longDescription: "توفير حلول الاتصال بالإنترنت الفضائي عالي السرعة عبر شبكة Starlink لتغطية كافة ولايات ومناطق السودان مع دعم كامل للدفع بالجنيه السوداني وخدمة التجديد وتفعيل الباقات الإقليمية والدولية.",
    logo: "Satellite",
    color: "#0284C7",
    badge: "خدمة حيوية 📡",
    isActive: true,
    isFeatured: true,
    isTrending: true,
    deliveryTime: "تجديد الباقة (1-3 ساعات) | الجهاز (شحن فوري)",
    warranty: "ضمان التفعيل الرسمي والمتابعة المستمرة",
    requirements: "رقم حساب Starlink أو بريد الحساب / طلب جهاز جديد",
    instructions: [
      "حدد الخدمة (تجديد باقة شهرية أو شراء كيت كامل)",
      "أدخل تفاصيل الحساب أو موقع الاستلام",
      "أتمم الدفع عبر بنكك",
      "يتم التواصل معك عبر الواتساب لإكمال التفعيل والتسليم"
    ],
    plans: [
      {
        id: "plan_starlink_sub_1m",
        name: "تجديد باقة شهرية (Regional Roam)",
        nameEn: "Monthly Roam Subscription",
        durationMonths: 1,
        durationLabel: "1 شهر تجديد",
        priceUSD: 75,
        priceSDG: 300000,
        discountPercent: 0,
        isPopular: true,
        isAvailable: true,
        features: ["تجديد باقة الإنترنت الفضائي غير المحدود", "سرعات تصل إلى 200 ميجابت/ثانية", "تغطية كافة أرجاء السودان", "دعم فني مباشر وتأكيد فوري للتجديد"]
      },
      {
        id: "plan_starlink_kit",
        name: "طقم جهاز Starlink V4 Standard كامل",
        nameEn: "Complete Starlink Kit V4",
        durationMonths: 1,
        durationLabel: "جهاز كامل + ملحقات",
        priceUSD: 650,
        priceSDG: 2600000,
        discountPercent: 5,
        isPopular: false,
        isAvailable: true,
        features: ["طبق الاستقبال الفضائي مع الراوتر والكابلات الأصلية", "جديد بالكرتونة ومختبر", "جاهز للربط والتشغيل المباشر", "توصيل آمن لجميع الولايات المتاحة"]
      }
    ]
  },
  {
    id: "serv_canva",
    name: "اشتراك كانفا برو الرسمي",
    nameEn: "Canva Pro Educational & Premium",
    slug: "canva-pro",
    category: "STREAMING_CREATIVE",
    description: "الوصول الكامل لملايين القوالب والصور وميزات الذكاء الاصطناعي في Canva.",
    longDescription: "تفعيل رسمي على إيميلك الشخصي في كانفا يتيح لك إزالة الخلفيات بضغطة زر، تحميل الصور بجودة عالية وفكتور، استخدام جميع الخطوط والأيقونات الحصرية وميزات Magic Studio.",
    logo: "Image",
    color: "#8B5CF6",
    badge: "الأكثر اقتصادية ⭐",
    isActive: true,
    isFeatured: false,
    isTrending: false,
    deliveryTime: "10 دقائق",
    warranty: "ضمان سنة كاملة",
    requirements: "البريد الإلكتروني الخاص بك في Canva",
    instructions: [
      "اختر مدة الاشتراك (سنة كاملة)",
      "أدخل بريدك في كانفا",
      "ادفع المبلغ واستقبل دعوة الانضمام الرسمية فوراً"
    ],
    plans: [
      {
        id: "plan_canva_1y",
        name: "اشتراك سنة كاملة (12 شهر)",
        nameEn: "1 Year Pro Lifetime Warranty",
        durationMonths: 12,
        durationLabel: "12 شهر (سنة كاملة)",
        priceUSD: 8,
        priceSDG: 32000,
        discountPercent: 50,
        isPopular: true,
        isAvailable: true,
        features: ["تفعيل رسمي على بريدك الشخصي", "وصول لأكثر من 100 مليون قالب وتصميم", "ميزة إزالة خلفية الصور والفيديوهات Magic Background Remover", "حجم تخزين 100 جيجابايت سحابي", "ضمان 365 يوم"]
      }
    ]
  },
  {
    id: "serv_gemini",
    name: "اشتراك جيميني أدفانسد",
    nameEn: "Google Gemini Advanced",
    slug: "gemini-advanced",
    category: "AI_SUBSCRIPTIONS",
    description: "الوصول لنموذج Google 1.5 Pro مع نافذة سياق 1 مليون توكن ومساحة 2TB في Google Drive.",
    longDescription: "استمتع بأحدث ابتكارات جوجل في الذكاء الاصطناعي مع Gemini Advanced المدمج في تطبيقات جوجل ومساحة تخزين سحابية ضخمة 2 تيرابايت في Google One.",
    logo: "Bot",
    color: "#3B82F6",
    badge: "مساحة 2TB ☁️",
    isActive: true,
    isFeatured: false,
    isTrending: false,
    deliveryTime: "30 دقيقة",
    warranty: "ضمان كامل للمدة",
    requirements: "البريد الإلكتروني (Gmail)",
    instructions: [
      "اختر الباقة المطلوبة",
      "أدخل حساب Gmail",
      "سدد القيمة ويتم تفعيل الباقة والحجم السحابي فوراً"
    ],
    plans: [
      {
        id: "plan_gemini_1m",
        name: "باقة 1 شهر",
        nameEn: "1 Month Advanced",
        durationMonths: 1,
        durationLabel: "1 شهر",
        priceUSD: 19,
        priceSDG: 76000,
        discountPercent: 0,
        isPopular: true,
        isAvailable: true,
        features: ["نموذج Gemini 1.5 Pro عالي الدقة", "نافذة سياق ضخمة 1,000,000 Token", "مساحة 2TB في Google Drive / Photos", "تكامل مباشر مع Gmail و Docs"]
      }
    ]
  },
  {
    id: "serv_telegram",
    name: "اشتراك تليجرام بريميوم",
    nameEn: "Telegram Premium Gift",
    slug: "telegram-premium",
    category: "STREAMING_CREATIVE",
    description: "ميزات حصرية، سرعة تحميل مضاعفة، تحويل الصوت إلى نصوص وشارة التوثيق النجمية.",
    longDescription: "تفعيل تليجرام بريميوم رسمي ومضمون عبر نظام الهدايا الرسمية Gift على رقمك أو يوزرك بدون طلب كود الدخول أو كلمة السر.",
    logo: "Send",
    color: "#22D3EE",
    badge: "تفعيل هدية 🎁",
    isActive: true,
    isFeatured: false,
    isTrending: false,
    deliveryTime: "10 - 20 دقيقة",
    warranty: "ضمان كامل 100%",
    requirements: "اسم المستخدم (Username) في تليجرام",
    instructions: [
      "اختر مدة الاشتراك (3 أو 6 أو 12 شهر)",
      "أدخل اسم المستخدم @username",
      "ادفع عبر بنكك وستصلك الهدية مباشرة داخل التطبيق"
    ],
    plans: [
      {
        id: "plan_tg_3m",
        name: "اشتراك 3 أشهر",
        nameEn: "3 Months Gift",
        durationMonths: 3,
        durationLabel: "3 أشهر",
        priceUSD: 14,
        priceSDG: 56000,
        discountPercent: 0,
        isPopular: false,
        isAvailable: true,
        features: ["تحميل ملفات بسرعة قصوى", "رفع ملفات حتى 4 جيجابايت", "تحويل الرسائل الصوتية لنصوص مكتوبة", "شارة النجمة المميزة بجانب اسمك", "إيموجيات وتفاعلات حصرية"]
      },
      {
        id: "plan_tg_6m",
        name: "اشتراك 6 أشهر",
        nameEn: "6 Months Gift",
        durationMonths: 6,
        durationLabel: "6 أشهر",
        priceUSD: 24,
        priceSDG: 96000,
        discountPercent: 10,
        isPopular: true,
        isAvailable: true,
        features: ["توفير مميز", "شارة بريميوم مستمرة", "تفعيل عبر Gift رسمي بدون مشاركة الحساب"]
      },
      {
        id: "plan_tg_12m",
        name: "اشتراك سنة كاملة (12 شهر)",
        nameEn: "12 Months Gift",
        durationMonths: 12,
        durationLabel: "12 شهر",
        priceUSD: 40,
        priceSDG: 160000,
        discountPercent: 20,
        isPopular: false,
        isAvailable: true,
        features: ["أكبر نسبة توفير 20%", "تفعيل فوري لسنة كاملة", "أمان تام 100%"]
      }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev_1",
    orderId: "SUD-10482",
    serviceId: "serv_chatgpt",
    serviceName: "ChatGPT Plus",
    customerName: "د. أحمد الفاتح",
    rating: 5,
    comment: "خدمة ممتازة جداً وسريعة! تم تفعيل اشتراك ChatGPT Plus في أقل من 20 دقيقة بعد التحويل عبر تطبيق بنكك. شكراً سوداهب على المصداقية.",
    isFeatured: true,
    createdAt: "2026-08-20T14:30:00Z"
  },
  {
    id: "rev_2",
    orderId: "SUD-10483",
    serviceId: "serv_cursor",
    serviceName: "Cursor AI Pro",
    customerName: "مهند عثمان (مطور برمجيات)",
    rating: 5,
    comment: "كيرسور برو غير طريقة برمجتي بالكامل. الدفع بالجنيه السوداني حل لي مشكلة الفيزا الدولية التي كانت تمنعني من الاشتراك. أنصح به بشدة.",
    isFeatured: true,
    createdAt: "2026-08-21T18:15:00Z"
  },
  {
    id: "rev_3",
    orderId: "SUD-10484",
    serviceId: "serv_starlink",
    serviceName: "Starlink Sudan",
    customerName: "عمر الطيب (بورتسودان)",
    rating: 5,
    comment: "تم تجديد باقة ستارلينك الإقليمية في نفس اليوم وعاد الإنترنت للعمل بكفاءة عالية في شركتنا. دعم فني متجاوب ومحترف.",
    isFeatured: true,
    createdAt: "2026-08-22T09:45:00Z"
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: "off_welcome",
    code: "SUDA2026",
    title: "خصم الترحيب 10%",
    description: "خصم فوري 10% على جميع اشتراكات الذكاء الاصطناعي للعملاء الجدد.",
    discountType: "PERCENTAGE",
    discountValue: 10,
    startDate: "2026-08-01",
    endDate: "2026-12-31",
    isActive: true
  },
  {
    id: "off_devs",
    code: "DEVPRO",
    title: "عرض المطورين على Cursor & Claude",
    description: "خصم 5,000 جنيه سوداني عند الاشتراك في أي باقة مطورين.",
    discountType: "FIXED",
    discountValue: 5000,
    startDate: "2026-08-15",
    endDate: "2026-09-30",
    isActive: true
  }
];

export const INITIAL_VIP_OFFERS: VIPOffer[] = [
  {
    id: "vip_1",
    customerEmail: "mohom9910@gmail.com",
    customerName: "محمد الفاضل (VIP)",
    serviceId: "serv_chatgpt",
    serviceName: "ChatGPT Plus",
    planId: "plan_gpt_1m",
    normalPriceUSD: 20,
    specialPriceUSD: 15,
    specialPriceSDG: 60000,
    expiryDate: "2026-09-30",
    note: "عرض ولاء مخصص كعميل مميز لمنصة SudaHub",
    isActive: true
  }
];

export const INITIAL_REPORTS: ReportTicket[] = [
  {
    reportId: "REP-1024",
    orderId: "SUD-10450",
    customerName: "إبراهيم خالد",
    customerEmail: "ibrahim@example.com",
    customerPhone: "+249912000111",
    type: "SERVICE_ISSUE",
    subject: "استفسار بخصوص تجديد الشهر القادم",
    description: "أريد معرفة هل يتم التجديد تلقائياً بنفس سعر الصرف الحالي أم يتغير؟",
    status: "RESOLVED",
    adminReply: "مرحباً إبراهيم، يتم التجديد حسب سعر الصرف المعتمد في يوم التجديد ويمكنك تثبيت السعر بالاشتراك في باقة 3 أو 6 أشهر.",
    resolvedAt: "2026-08-21T12:00:00Z",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-21T12:00:00Z"
  }
];
