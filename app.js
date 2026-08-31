/* ==========================================================================
   MAJARRA COMMUNITY CENTER - UNIFIED CORE APPLICATION LOGIC (v5.0)
   - Official Brand Identity Palette & Image Support
   - Live Capacity & Time Collision Detection
   - Interactive Clickable Stat Cards & Modals
   - Public Read-Only Calendar & Admin Calendar Sync
   - High-Elegance Official Receipt Voucher PDF Generator
   - Multi-Level Security: Staff Booking Access (1234) & Super Admin Settings Master Key (8888)
   - Turkish Lira (TL) Dynamic Booking Fees Banner (0 TL for free events, Red Warning Badge for paid events)
   - Auto-Sync Calendar Navigation upon Booking Approval & Submission
   - Full 100% Multi-Language Synchronization (Arabic Base Default, Turkish, English)
   - Full Express API Backend Integration (/api/auth/staff-login, /api/admin/bookings, /api/bookings)
   - Stealth Obfuscated Admin Entrance (Ctrl+Shift+A, #admin URL, Secret Footer Lock Trigger)
   ========================================================================== */

// --- GLOBAL DATABASE & AUTHENTICATION STATE ---
const STORAGE_KEY = 'majarra_bookings_v5';
const SETTINGS_KEY = 'majarra_settings_v5';
const AUTH_KEY = 'majarra_admin_auth';
const SUPER_AUTH_KEY = 'majarra_super_admin_auth';
const LANG_KEY = 'majarra_lang';

let bookings = [];
let currentLang = 'ar'; // Default Language is Arabic

// Default System & Hall Settings (Protected by Super Admin Master Key)
let siteSettings = {
  adminPin: '1234', // Staff PIN for managing bookings & calendar
  superAdminPin: '8888', // Super Admin Master PIN for editing settings & PINs
  adminPhone: '+90 538 506 29 89',
  adminEmail: 'nur.beik1237@gmail.com',
  adminInstagram: 'https://www.instagram.com/majarracommunity/',
  halls: {
    ofoq: {
      name: 'قاعة أفــُـق',
      cap: 20,
      desc: 'مساحة مريحة ومجهزة بالكامل مناسبة للورش التدريبية والجلسات التفاعلية والأنشطة الشبابية.',
      image: 'assets/workshop.jpg'
    },
    diwan: {
      name: 'قاعة ديـــوان',
      cap: 30,
      desc: 'قاعة واسعة وأنيقة مخصصة للندوات، المحاضرات، والأنشطة الثقافية والمجتمعية الكبرى.',
      image: 'assets/grand.jpg'
    },
    sadeem: {
      name: 'قاعة ســديم',
      cap: 18,
      desc: 'قاعة اجتماعات مغلقة وهادئة مخصصة لاجتماعات فرق العمل والجلسات الاستشارية وتصوير المحتوى.',
      image: 'assets/meeting.jpg'
    }
  }
};

// Dynamic Calendar View Month Initializers (Default to Current Date/Month)
let currentCalendarDate = new Date(); 
let currentPublicCalendarDate = new Date();

// Dynamic Hall Capacities
let HALL_CAPACITIES = {
  'قاعة أفــُـق (سعة القاعة 20)': 20,
  'قاعة ديـــوان (سعة القاعة 30)': 30,
  'قاعة ســديم (سعة القاعة 16-18)': 18,
  'المركز كلياً': 68
};

// --- MULTI-LANGUAGE 100% COMPREHENSIVE DICTIONARY ---
const translations = {
  ar: {
    langName: 'العربية',
    brandTitle: 'مركز مجـرّة المجتمعـي <span>| Majarra</span>',
    brandSub: 'بوابة حجز القاعات والفعاليات والمساحات الإبداعية',
    officialPhone: 'الرقم المعتمد:',
    demoBtn: 'بيانات تجريبية',
    tabHalls: '<i class="fa-solid fa-building"></i> استكشاف القاعات والتوفر',
    tabAdmin: '<i class="fa-solid fa-user-shield"></i> لوحة الإدارة والتحكم',
    calHeading: '<i class="fa-solid fa-calendar-days"></i> جدول توفر القاعات المباشر',
    calSub: 'يمكنك الاطلاع على الأوقات والقاعات المتاحة والمشغولة قبل حجز القاعة (للعرض فقط)',
    filterLabel: 'القاعة:',
    allHalls: 'كل القاعات',
    hallOfoq: 'قاعة أفــُـق',
    hallDiwan: 'قاعة ديـــوان',
    hallSadeem: 'قاعة ســديم',
    hallFull: 'المركز كلياً',
    busyLegend: 'مـحجـوزة',
    freeLegend: 'متاحـة',
    prevMonth: '<i class="fa-solid fa-chevron-right"></i> الشهر السابق',
    nextMonth: 'الشهر التالي <i class="fa-solid fa-chevron-left"></i>',
    mobileScrollHint: '<i class="fa-solid fa-arrows-left-right"></i> اسحب أفقياً للتنقل بين الأيام على التلفون',
    sun: 'الأحد', mon: 'الإثنين', tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة', sat: 'السبت',
    hallsSectionHeading: '<i class="fa-solid fa-wand-magic-sparkles"></i> قاعات ومساحات مركز مجرّة',
    hallsSectionSub: 'اختر القاعة المناسبة لاحتياجك واضغط على زر الحجز لتعبئة الطلب فوراً',
    bookOfoqNow: 'احجز قاعة أفــُـق الآن',
    bookDiwanNow: 'احجز قاعة ديـــوان الآن',
    bookSadeemNow: 'احجز قاعة ســديم الآن',
    modalBookingTitle: '<i class="fa-solid fa-calendar-plus"></i> تقديم طلب حجز قاعة',
    modalBookingSub: 'يرجى تعبئة كافة التفاصيل بدقة لضمان معالجة وتدقيق الطلب بسرعة',
    organizerLabel: 'اسم المسؤول المباشر عن الحجز *',
    organizerPlaceholder: 'أدخل الاسم الكامل للمسؤول',
    waLabel: 'رقم الواتساب للتواصل *',
    emailLabel: 'البريد الإلكتروني',
    entityTypeLabel: 'صفة الجهة المنظمة *',
    entityIndividual: 'فرد مستقل',
    entityVoluntary: 'فريق تطوعي',
    entityNGO: 'منظمة غير ربحية / جمعية',
    entityCompany: 'شركة / مؤسسة خاصّة',
    executorLabel: 'اسم الفريق / الجهة المنفذة للنشاط *',
    executorPlaceholder: 'أدخل اسم الفريق، المبادرة، أو الشريك المنفذ',
    eventTypeLabel: 'نوع النشاط / الفعالية *',
    eventTitleLabel: 'عنوان النشاط / الفعالية *',
    eventTitlePlaceholder: 'أدخل اسم أو عنوان الفعالية بشكل واضح',
    eventDescLabel: 'وصف مختصر عن النشاط *',
    eventDescPlaceholder: 'اكتب وصفاً موجزاً لأهداف النشاط والفئة المستهدفة...',
    attendeesLabel: 'عدد الحضور المتوقع *',
    startDateLabel: 'تاريخ الفعالية *',
    startTimeLabel: 'وقت البداية *',
    endTimeLabel: 'وقت النهاية *',
    equipmentLabel: 'التجهيزات والمستلزمات المطلوبة في القاعة:',
    equipmentProjector: 'بروجكتر وشاشة',
    equipmentBoard: 'لوح كتابة وقرطاسية',
    equipmentInteractive: 'شاشة تفاعلية ذكية',
    equipmentSound: 'نظام صوتي وميكروفونات',
    equipmentChairs: 'طاولات وكراسي إضافية',
    equipmentPower: 'وصلات كهربائية وشواحن',
    isSponsoredLabel: 'هل تم رعاية الفعالية من جهة أخرى؟ *',
    isPaidEventLabel: 'هل النشاط مأجور (يتقاضى رسوماً من الحضور)؟ *',
    yes: 'نعم',
    no: 'لا',
    feesTitle: '<i class="fa-solid fa-calculator"></i> ملخص الرسوم المقدرة للحجز (TL):',
    submitBookingBtn: '<i class="fa-solid fa-paper-plane"></i> إرسال طلب الحجز الآن',
    adminHeaderTitle: 'لوحة الإدارة والتحكم بطلبات الحجز',
    statTotalLabel: 'إجمالي الطلبات المسجلة',
    statPendingLabel: 'طلبات قيد المراجعة',
    statAcceptedLabel: 'فعاليات مقبولة بالتقويم',
    statAttendeesLabel: 'إجمالي الزوار والحضور',
    subTabRequests: '<i class="fa-solid fa-inbox"></i> الحجوزات الواردة',
    subTabCalendar: '<i class="fa-solid fa-calendar-days"></i> التقويم والتعديل',
    subTabArchive: '<i class="fa-solid fa-box-archive"></i> أرشيف السجلات',
    subTabSettings: '<i class="fa-solid fa-user-gear"></i> إعدادات القاعات (المدير العام)',
    searchPlaceholder: 'بحث باسم المسؤول، الجهة، أو رقم الحجز...',
    thId: 'رقم الحجز',
    thOrganizer: 'المسؤول والجهة',
    thEvent: 'النشاط ونوعه',
    thHall: 'القاعة والباقة',
    thDateTime: 'التاريخ والتوقيت',
    thFees: 'الرسوم (TL)',
    thPhone: 'الهاتف',
    thStatus: 'الحالة',
    thActions: 'الإجراء والتعديل',
    ticketHeaderTitle: 'إيصال حجز رقمي معتمد',
    receiptHallLabel: 'القاعة والمساحة:',
    receiptDateLabel: 'تاريخ وتوقيت الحجز:',
    receiptFeeLabel: 'رسوم الحجز (TL):',
    printTicketBtn: '<i class="fa-solid fa-print"></i> طباعة / حفظ PDF',
    footerRights: 'جميع الحقوق محفوظة © 2026 لـ مركز مجرة المجتمعي | Majarra Community Center'
  },
  tr: {
    langName: 'Türkçe',
    brandTitle: 'Majarra Topluluk Merkezi <span>| Majarra</span>',
    brandSub: 'Salon ve Etkinlik Rezervasyon Portalı',
    officialPhone: 'Resmi İletişim:',
    demoBtn: 'Demo Veriler',
    tabHalls: '<i class="fa-solid fa-building"></i> Salonlar ve Canlı Takvim',
    tabAdmin: '<i class="fa-solid fa-user-shield"></i> Yönetici Paneli',
    calHeading: '<i class="fa-solid fa-calendar-days"></i> Canlı Salon Takvimi',
    calSub: 'Rezervasyon yapmadan önce uygun saatleri ve dolu günleri inceleyebilirsiniz (Salt Okunur).',
    filterLabel: 'Salon:',
    allHalls: 'Tüm Salonlar',
    hallOfoq: 'Ufuk Salonu',
    hallDiwan: 'Divan Salonu',
    hallSadeem: 'Sedim Salonu',
    hallFull: 'Tüm Merkez',
    busyLegend: 'Dolu',
    freeLegend: 'Uygun',
    prevMonth: '<i class="fa-solid fa-chevron-left"></i> Önceki Ay',
    nextMonth: 'Sonraki Ay <i class="fa-solid fa-chevron-right"></i>',
    mobileScrollHint: '<i class="fa-solid fa-arrows-left-right"></i> Telefonda günler arasında geçiş yapmak için yatay kaydırın',
    sun: 'Paz', mon: 'Pzt', tue: 'Sal', wed: 'Çar', thu: 'Per', fri: 'Cum', sat: 'Cmt',
    hallsSectionHeading: '<i class="fa-solid fa-wand-magic-sparkles"></i> Majarra Salonları ve Alanları',
    hallsSectionSub: 'İhtiyacınıza uygun salonu seçin ve hemen başvuru yapmak için rezervasyon butonuna tıklayın.',
    bookOfoqNow: 'Ufuk Salonunu Rezerve Et',
    bookDiwanNow: 'Divan Salonunu Rezerve Et',
    bookSadeemNow: 'Sedim Salonunu Rezerve Et',
    modalBookingTitle: '<i class="fa-solid fa-calendar-plus"></i> Salon Rezervasyon Başvurusu',
    modalBookingSub: 'Başvurunuzun hızlıca işlenmesi ve onaylanması için lütfen tüm detayları eksiksiz doldurun.',
    organizerLabel: 'Başvuran Yetkili Ad Soyad *',
    organizerPlaceholder: 'Yetkilinin tam adını giriniz',
    waLabel: 'WhatsApp İletişim Numarası *',
    emailLabel: 'E-posta Adresi',
    entityTypeLabel: 'Kurum / Ekip Türü *',
    entityIndividual: 'Bireysel',
    entityVoluntary: 'Gönüllü Ekip',
    entityNGO: 'Kâr Amacı Gütmeyen Kuruluş / Dernek',
    entityCompany: 'Özel Şirket / Kurum',
    executorLabel: 'Etkinliği Düzenleyen Ekip / Kurum Adı *',
    executorPlaceholder: 'Ekip, girişim veya kurum adını giriniz',
    eventTypeLabel: 'Etkinlik Türü *',
    eventTitleLabel: 'Etkinlik Başlığı *',
    eventTitlePlaceholder: 'Etkinlik adını açıkça giriniz',
    eventDescLabel: 'Etkinlik Açıklaması *',
    eventDescPlaceholder: 'Etkinliğin amacı ve hedef kitlesi hakkında kısa bilgi veriniz...',
    attendeesLabel: 'Tahmini Katılımcı Sayısı *',
    startDateLabel: 'Etkinlik Tarihi *',
    startTimeLabel: 'Başlangıç Saati *',
    endTimeLabel: 'Bitiş Saati *',
    equipmentLabel: 'Salonda İstenen Ekipmanlar:',
    equipmentProjector: 'Projeksiyon ve Ekran',
    equipmentBoard: 'Yazı Tahtası ve Kırtasiye',
    equipmentInteractive: 'Akıllı Etkileşimli Ekran',
    equipmentSound: 'Ses Sistemi ve Mikrofonlar',
    equipmentChairs: 'Ekstra Masa ve Sandalyeler',
    equipmentPower: 'Uzatma Kabloları ve Şarjlar',
    isSponsoredLabel: 'Etkinlik Başka Bir Kurum Tarafından Destekleniyor mu? *',
    isPaidEventLabel: 'Etkinlik Ücretli mi (Katılımcılardan ücret alınıyor mu)? *',
    yes: 'Evet',
    no: 'Hayır',
    feesTitle: '<i class="fa-solid fa-calculator"></i> Tahmini Rezervasyon Ücreti (TL):',
    submitBookingBtn: '<i class="fa-solid fa-paper-plane"></i> Başvuruyu Gönder',
    adminHeaderTitle: 'Yönetici Kontrol Paneli ve Başvurular',
    statTotalLabel: 'Toplam Başvuru',
    statPendingLabel: 'İncelemedeki Başvurular',
    statAcceptedLabel: 'Takvimde Onaylı Etkinlikler',
    statAttendeesLabel: 'Toplam Katılımcı Sayısı',
    subTabRequests: '<i class="fa-solid fa-inbox"></i> Gelen Başvurular',
    subTabCalendar: '<i class="fa-solid fa-calendar-days"></i> Takvim ve Düzenleme',
    subTabArchive: '<i class="fa-solid fa-box-archive"></i> Kayıt Arşivi',
    subTabSettings: '<i class="fa-solid fa-user-gear"></i> Salon Ayarları (Genel Müdür)',
    searchPlaceholder: 'Yetkili adı, kurum veya kayıt no ile ara...',
    thId: 'Rezervasyon No',
    thOrganizer: 'Yetkili ve Kurum',
    thEvent: 'Etkinlik ve Türü',
    thHall: 'Salon ve Paket',
    thDateTime: 'Tarih ve Saat',
    thFees: 'Ücret (TL)',
    thPhone: 'Telefon',
    thStatus: 'Durum',
    thActions: 'İşlem ve Düzenleme',
    ticketHeaderTitle: 'Resmi Dijital Rezervasyon Makbuzu',
    receiptHallLabel: 'Salon ve Alan:',
    receiptDateLabel: 'Tarih ve Saat:',
    receiptFeeLabel: 'Rezervasyon Ücreti (TL):',
    printTicketBtn: '<i class="fa-solid fa-print"></i> Yazdır / PDF İndir',
    footerRights: 'Tüm Hakları Saklıdır © 2026 Majarra Topluluk Merkezi | Majarra Community Center'
  },
  en: {
    langName: 'English',
    brandTitle: 'Majarra Community Center <span>| Majarra</span>',
    brandSub: 'Hall & Event Booking Portal',
    officialPhone: 'Official Contact:',
    demoBtn: 'Demo Data',
    tabHalls: '<i class="fa-solid fa-building"></i> Explore Halls & Live Calendar',
    tabAdmin: '<i class="fa-solid fa-user-shield"></i> Admin Dashboard',
    calHeading: '<i class="fa-solid fa-calendar-days"></i> Live Hall Availability Calendar',
    calSub: 'Browse available and booked time slots before submitting your request (Read-only).',
    filterLabel: 'Hall:',
    allHalls: 'All Halls',
    hallOfoq: 'Ofoq Hall',
    hallDiwan: 'Diwan Hall',
    hallSadeem: 'Sadeem Hall',
    hallFull: 'Whole Center',
    busyLegend: 'Booked',
    freeLegend: 'Available',
    prevMonth: '<i class="fa-solid fa-chevron-left"></i> Previous Month',
    nextMonth: 'Next Month <i class="fa-solid fa-chevron-right"></i>',
    mobileScrollHint: '<i class="fa-solid fa-arrows-left-right"></i> Swipe horizontally to navigate days on mobile',
    sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat',
    hallsSectionHeading: '<i class="fa-solid fa-wand-magic-sparkles"></i> Majarra Halls & Spaces',
    hallsSectionSub: 'Select the ideal hall for your event and click "Book Now" to submit your request.',
    bookOfoqNow: 'Book Ofoq Hall Now',
    bookDiwanNow: 'Book Diwan Hall Now',
    bookSadeemNow: 'Book Sadeem Hall Now',
    modalBookingTitle: '<i class="fa-solid fa-calendar-plus"></i> Submit Hall Booking Request',
    modalBookingSub: 'Please fill in all details accurately for fast review and processing.',
    organizerLabel: 'Organizer Full Name *',
    organizerPlaceholder: 'Enter full name',
    waLabel: 'WhatsApp Phone Number *',
    emailLabel: 'Email Address',
    entityTypeLabel: 'Organization Type *',
    entityIndividual: 'Individual',
    entityVoluntary: 'Voluntary Team',
    entityNGO: 'Non-Profit / NGO',
    entityCompany: 'Private Company',
    executorLabel: 'Executing Team / Entity Name *',
    executorPlaceholder: 'Enter team, initiative or entity name',
    eventTypeLabel: 'Event Type *',
    eventTitleLabel: 'Event Title *',
    eventTitlePlaceholder: 'Enter clear event title',
    eventDescLabel: 'Short Event Description *',
    eventDescPlaceholder: 'Provide a brief summary of event goals and target audience...',
    attendeesLabel: 'Expected Attendees Count *',
    startDateLabel: 'Event Date *',
    startTimeLabel: 'Start Time *',
    endTimeLabel: 'End Time *',
    equipmentLabel: 'Required Hall Equipment:',
    equipmentProjector: 'Projector & Screen',
    equipmentBoard: 'Writing Board & Stationery',
    equipmentInteractive: 'Smart Interactive Screen',
    equipmentSound: 'Sound System & Microphones',
    equipmentChairs: 'Extra Tables & Chairs',
    equipmentPower: 'Power Cables & Chargers',
    isSponsoredLabel: 'Is the Event Sponsored by Another Entity? *',
    isPaidEventLabel: 'Is the Event Paid (Charging Attendees)? *',
    yes: 'Yes',
    no: 'No',
    feesTitle: '<i class="fa-solid fa-calculator"></i> Estimated Booking Fee (TL):',
    submitBookingBtn: '<i class="fa-solid fa-paper-plane"></i> Submit Booking Request',
    adminHeaderTitle: 'Admin Dashboard & Requests Management',
    statTotalLabel: 'Total Requests',
    statPendingLabel: 'Pending Review',
    statAcceptedLabel: 'Approved in Calendar',
    statAttendeesLabel: 'Total Visitors & Attendees',
    subTabRequests: '<i class="fa-solid fa-inbox"></i> Incoming Requests',
    subTabCalendar: '<i class="fa-solid fa-calendar-days"></i> Calendar & Editing',
    subTabArchive: '<i class="fa-solid fa-box-archive"></i> Records Archive',
    subTabSettings: '<i class="fa-solid fa-user-gear"></i> Hall Settings (Super Admin)',
    searchPlaceholder: 'Search by organizer, entity, or booking ID...',
    thId: 'Booking ID',
    thOrganizer: 'Organizer & Entity',
    thEvent: 'Event & Type',
    thHall: 'Hall & Package',
    thDateTime: 'Date & Time',
    thFees: 'Fees (TL)',
    thPhone: 'Phone',
    thStatus: 'Status',
    thActions: 'Actions & Edit',
    ticketHeaderTitle: 'Official Digital Booking Voucher',
    receiptHallLabel: 'Hall & Space:',
    receiptDateLabel: 'Date & Time:',
    receiptFeeLabel: 'Booking Fee (TL):',
    printTicketBtn: '<i class="fa-solid fa-print"></i> Print / Save PDF',
    footerRights: 'All Rights Reserved © 2026 Majarra Community Center'
  }
};

// --- ULTRA-LUXURY CUSTOM TOAST SYSTEM ---
const Toast = {
  show(type, message, duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;

    let iconHtml = '<i class="fa-solid fa-circle-check"></i>';
    if (type === 'error') iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';
    else if (type === 'info') iconHtml = '<i class="fa-solid fa-circle-info"></i>';

    toast.innerHTML = `${iconHtml} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// --- SAFE HELPER FUNCTIONS TO PREVENT TYPEERRORS ---
const safeStr = (val) => (val !== undefined && val !== null ? String(val) : '');
const safeLower = (val) => safeStr(val).toLowerCase();
const safeNum = (val) => {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
};

// Auto-navigate calendar view to match a booking's date month
function syncCalendarViewToDate(dateStr) {
  if (!dateStr) return;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = safeNum(parts[0]);
    const m = safeNum(parts[1]) - 1; // 0-indexed month
    if (y > 2000 && m >= 0 && m <= 11) {
      currentCalendarDate = new Date(y, m, 1);
      currentPublicCalendarDate = new Date(y, m, 1);
    }
  }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem(LANG_KEY);
  if (savedLang && ['ar', 'tr', 'en'].includes(savedLang)) {
    currentLang = savedLang;
  } else {
    currentLang = 'ar'; // Default Arabic
  }

  loadSettingsFromStorage();
  loadBookingsFromStorage();
  applyLanguageUI();
  checkAdminAuth();
  updateStats();
  
  // Open Unrestricted Dates: Allow users and staff to pick any date freely (past or future)
  const today = getTodayISO();

  // SECRET ADMIN TRIGGERS
  // 1. Secret Hotkey: Ctrl + Shift + A or Cmd + Shift + A
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      openAdminModal();
    }
    if (e.key === 'Escape') {
      closeBookingModal();
      closeTicketModal();
      closeAdminAuthModal();
      closeSuperAdminAuthModal();
      closeEditModal();
      closeStatDetailModal();
      closeLangDropdown();
    }
  });

  // 2. URL Hash Trigger: Typing #admin or #login in URL
  function checkUrlHash() {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#admin' || hash === '#login') {
      const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true' || localStorage.getItem('adminToken') || localStorage.getItem('superAdminToken');
      if (isAuth) {
        switchTab('admin');
      } else {
        openAdminModal();
      }
    }
  }
  window.addEventListener('hashchange', checkUrlHash);
  checkUrlHash();

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-switcher-wrapper')) {
      closeLangDropdown();
    }
  });
});

// Helper for today's ISO date string (YYYY-MM-DD)
function getTodayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

// --- LANGUAGE SWITCHER CONTROLLER ---
function toggleLangDropdown(event) {
  event.stopPropagation();
  const menu = document.getElementById('lang-dropdown-menu');
  if (menu) menu.classList.toggle('show');
}

function closeLangDropdown() {
  const menu = document.getElementById('lang-dropdown-menu');
  if (menu) menu.classList.remove('show');
}

function selectLanguage(lang) {
  if (!['ar', 'tr', 'en'].includes(lang)) return;
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  applyLanguageUI();
  closeLangDropdown();
}

function applyLanguageUI() {
  const t = translations[currentLang] || translations.ar;

  document.documentElement.dir = (currentLang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.lang = currentLang;

  const currentLangText = document.getElementById('current-lang-text');
  if (currentLangText) {
    if (currentLang === 'ar') currentLangText.innerText = 'العربية';
    else if (currentLang === 'tr') currentLangText.innerText = 'Türkçe';
    else if (currentLang === 'en') currentLangText.innerText = 'English';
  }

  document.querySelectorAll('.lang-option').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`lang-opt-${currentLang}`);
  if (activeBtn) activeBtn.classList.add('active');

  const demoBtnText = document.getElementById('lbl-load-demo');
  if (demoBtnText) demoBtnText.innerText = t.demoBtn;

  const tabHalls = document.getElementById('tabHallsBtn');
  if (tabHalls) tabHalls.innerHTML = t.tabHalls;

  // Update elements with data-i18n attribute dynamically
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.innerHTML = t[key];
      }
    }
  });

  applySiteSettingsToUI();
  renderPublicAvailabilityCalendar();
  renderCalendarView();
  renderBookingsTable();
  updateBookingFeesDisplay();
}

// --- DYNAMIC BOOKING FEES CALCULATION IN TURKISH LIRA (TL) ---
function updateBookingFeesDisplay() {
  const paidRadio = document.querySelector('input[name="isPaidEvent"]:checked');
  const isPaid = paidRadio ? paidRadio.value : 'لا';
  
  const displayEl = document.getElementById('fees-amount-display');
  const noteEl = document.getElementById('fees-note-text');

  if (!displayEl || !noteEl) return;

  if (isPaid === 'نعم') {
    if (currentLang === 'tr') {
      displayEl.innerText = 'Daha Sonra Belirlenecek (TL)';
      noteEl.innerText = '* Uyarı: Ücretli etkinliklerin ücreti, başvurunun incelenmesinin ardından merkez yönetimi ile belirlenecektir.';
    } else if (currentLang === 'en') {
      displayEl.innerText = 'To Be Determined Later (TL)';
      noteEl.innerText = '* Notice: For paid events, fees will be determined in Turkish Lira (TL) upon review by center management.';
    } else {
      displayEl.innerText = 'تحدد لاحقاً بالليرة التركية (TL)';
      noteEl.innerText = '* تنبيه: للأنشطة المأجورة، يتم تحديد قيمة الرسوم بالليرة التركية (TL) بالتنسيق مع إدارة المركز بعد تدقيق الطلب.';
    }
    displayEl.style.background = 'var(--accent-rose)'; // Red warning color
    displayEl.style.color = '#ffffff';
    displayEl.style.boxShadow = '0 2px 10px rgba(239, 68, 68, 0.4)';
    noteEl.style.color = 'var(--accent-rose)';
  } else {
    if (currentLang === 'tr') {
      displayEl.innerText = '0 TL (Ücretsiz Etkinlik)';
      noteEl.innerText = '* Tüm işlemler Türk Lirası (TL) üzerinden yapılır. Ücretsiz etkinlikler tamamen 0 TLdir.';
    } else if (currentLang === 'en') {
      displayEl.innerText = '0 TL (Free Event)';
      noteEl.innerText = '* All transactions are calculated in Turkish Lira (TL). Free events are 100% free (0 TL).';
    } else {
      displayEl.innerText = '0 TL (نشاط مجاني)';
      noteEl.innerText = '* كافة التعاملات والرسوم تحسب بالليرة التركية (TL). الأنشطة غير المأجورة مجانية بالكامل (0 TL).';
    }
    displayEl.style.background = 'var(--brand-gold)';
    displayEl.style.color = '#0f172a';
    displayEl.style.boxShadow = '0 2px 8px rgba(232, 198, 119, 0.3)';
    noteEl.style.color = 'var(--text-muted)';
  }
}

// --- SITE SETTINGS MANAGEMENT (SUPER ADMIN CONTROL) ---
function loadSettingsFromStorage() {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        siteSettings = Object.assign({}, siteSettings, parsed);
      }
    } catch (e) {
      console.error('Failed to parse site settings:', e);
    }
  }
  applySiteSettingsToUI();
}

function saveSettingsToStorage() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(siteSettings));
  applySiteSettingsToUI();
}

function applySiteSettingsToUI() {
  // Update Phone Numbers, Emails & Instagram Display
  const phone = siteSettings.adminPhone || '+90 538 506 29 89';
  const email = siteSettings.adminEmail || 'nur.beik1237@gmail.com';
  const insta = siteSettings.adminInstagram || 'https://instagram.com/majarra_center';

  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const waLink = document.getElementById('footer-whatsapp-link');
  if (waLink) waLink.href = `https://wa.me/${cleanPhone.replace('+', '')}`;

  const emailLink = document.getElementById('footer-email-link');
  if (emailLink) emailLink.href = `mailto:${email}`;

  const instaLink = document.getElementById('footer-insta-link');
  if (instaLink) {
    instaLink.href = insta.startsWith('http') ? insta : `https://instagram.com/${insta.replace('@', '')}`;
  }

  const adminPhone = document.getElementById('admin-phone-display');
  const ticketPhone = document.getElementById('ticket-phone-display');
  const footerPhone = document.getElementById('footer-phone-display');

  const ticketEmail = document.getElementById('ticket-email-display');
  const footerEmail = document.getElementById('footer-email-display');

  const footerInsta = document.getElementById('footer-insta-display');

  if (adminPhone) adminPhone.innerText = phone;
  if (ticketPhone) ticketPhone.innerText = phone;
  if (footerPhone) footerPhone.innerText = phone;

  if (ticketEmail) ticketEmail.innerText = email;
  if (footerEmail) footerEmail.innerText = email;

  if (footerInsta) {
    const handle = insta.split('/').filter(Boolean).pop() || 'majarra_center';
    footerInsta.innerText = handle.startsWith('@') ? handle : `@${handle}`;
  }

  // Update Hall Cards Titles & Descriptions & Capacities on Visitor Page
  const hOf = siteSettings.halls.ofoq;
  const hDi = siteSettings.halls.diwan;
  const hSa = siteSettings.halls.sadeem;

  let capText = 'سعة';
  let pText = 'شخص';

  if (currentLang === 'tr') {
    capText = 'Kapasite';
    pText = 'kişi';
  } else if (currentLang === 'en') {
    capText = 'Capacity';
    pText = 'people';
  } else {
    capText = 'سعة';
    pText = 'شخص';
  }

  if (document.getElementById('hall-ofoq-title')) document.getElementById('hall-ofoq-title').innerText = hOf.name;
  if (document.getElementById('hall-ofoq-cap-tag')) document.getElementById('hall-ofoq-cap-tag').innerText = `${capText} ${hOf.cap} ${pText}`;
  if (document.getElementById('hall-ofoq-desc')) document.getElementById('hall-ofoq-desc').innerText = hOf.desc;

  if (document.getElementById('hall-diwan-title')) document.getElementById('hall-diwan-title').innerText = hDi.name;
  if (document.getElementById('hall-diwan-cap-tag')) document.getElementById('hall-diwan-cap-tag').innerText = `${capText} ${hDi.cap} ${pText}`;
  if (document.getElementById('hall-diwan-desc')) document.getElementById('hall-diwan-desc').innerText = hDi.desc;

  if (document.getElementById('hall-sadeem-title')) document.getElementById('hall-sadeem-title').innerText = hSa.name;
  if (document.getElementById('hall-sadeem-cap-tag')) document.getElementById('hall-sadeem-cap-tag').innerText = `${capText} ${hSa.cap} ${pText}`;
  if (document.getElementById('hall-sadeem-desc')) document.getElementById('hall-sadeem-desc').innerText = hSa.desc;

  // Update Hall Capacities Map
  HALL_CAPACITIES = {
    'قاعة أفــُـق (سعة القاعة 20)': hOf.cap,
    'قاعة ديـــوان (سعة القاعة 30)': hDi.cap,
    'قاعة ســديم (سعة القاعة 16-18)': hSa.cap,
    'المركز كلياً': hOf.cap + hDi.cap + hSa.cap
  };

  // Populate Settings Inputs in Admin Settings Sub-Tab
  if (document.getElementById('cfg-ofoq-name')) document.getElementById('cfg-ofoq-name').value = hOf.name;
  if (document.getElementById('cfg-ofoq-cap')) document.getElementById('cfg-ofoq-cap').value = hOf.cap;
  if (document.getElementById('cfg-ofoq-desc')) document.getElementById('cfg-ofoq-desc').value = hOf.desc;

  if (document.getElementById('cfg-diwan-name')) document.getElementById('cfg-diwan-name').value = hDi.name;
  if (document.getElementById('cfg-diwan-cap')) document.getElementById('cfg-diwan-cap').value = hDi.cap;
  if (document.getElementById('cfg-diwan-desc')) document.getElementById('cfg-diwan-desc').value = hDi.desc;

  if (document.getElementById('cfg-sadeem-name')) document.getElementById('cfg-sadeem-name').value = hSa.name;
  if (document.getElementById('cfg-sadeem-cap')) document.getElementById('cfg-sadeem-cap').value = hSa.cap;
  if (document.getElementById('cfg-sadeem-desc')) document.getElementById('cfg-sadeem-desc').value = hSa.desc;

  if (document.getElementById('cfg-staff-pin')) document.getElementById('cfg-staff-pin').value = siteSettings.adminPin || '1234';
  if (document.getElementById('cfg-master-pin')) document.getElementById('cfg-master-pin').value = siteSettings.superAdminPin || '8888';
  if (document.getElementById('cfg-admin-phone')) document.getElementById('cfg-admin-phone').value = phone;
  if (document.getElementById('cfg-admin-email')) document.getElementById('cfg-admin-email').value = email;
  if (document.getElementById('cfg-admin-insta')) document.getElementById('cfg-admin-insta').value = insta;
}

function saveHallSettings(event) {
  event.preventDefault();
  
  siteSettings.halls.ofoq.name = document.getElementById('cfg-ofoq-name').value;
  siteSettings.halls.ofoq.cap = safeNum(document.getElementById('cfg-ofoq-cap').value) || 20;
  siteSettings.halls.ofoq.desc = document.getElementById('cfg-ofoq-desc').value;

  siteSettings.halls.diwan.name = document.getElementById('cfg-diwan-name').value;
  siteSettings.halls.diwan.cap = safeNum(document.getElementById('cfg-diwan-cap').value) || 30;
  siteSettings.halls.diwan.desc = document.getElementById('cfg-diwan-desc').value;

  siteSettings.halls.sadeem.name = document.getElementById('cfg-sadeem-name').value;
  siteSettings.halls.sadeem.cap = safeNum(document.getElementById('cfg-sadeem-cap').value) || 18;
  siteSettings.halls.sadeem.desc = document.getElementById('cfg-sadeem-desc').value;

  saveSettingsToStorage();
  alert('تم حفظ وتحديث كافة أسماء وسعات القاعات في الموقع بنجاح!');
}

function saveAdminPin(event) {
  event.preventDefault();
  const newStaffPin = document.getElementById('cfg-staff-pin').value.trim();
  const newMasterPin = document.getElementById('cfg-master-pin').value.trim();

  if (newStaffPin.length < 4 || newMasterPin.length < 4) {
    alert('يجب أن لا يقل الرمز السري عن 4 أرقام/أحرف!');
    return;
  }

  siteSettings.adminPin = newStaffPin;
  siteSettings.superAdminPin = newMasterPin;
  saveSettingsToStorage();
  alert('تم حفظ الرموز السرية الجديدة (رمز الموظفين ورمز المدير العام) بنجاح!');
}

function saveAdminPhone(event) {
  event.preventDefault();
  siteSettings.adminPhone = document.getElementById('cfg-admin-phone').value;
  saveSettingsToStorage();

  const token = localStorage.getItem('superAdminToken') || localStorage.getItem('adminToken');
  if (token) {
    fetch('/api/admin/settings/phone', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ adminPhone: siteSettings.adminPhone })
    }).catch(e => console.warn('API phone save fallback:', e));
  }

  alert('تم حفظ وتحديث رقم الواتساب المعتمد بنجاح!');
}

function saveAdminEmail(event) {
  event.preventDefault();
  const newEmail = document.getElementById('cfg-admin-email').value.trim();
  if (!newEmail || !newEmail.includes('@')) {
    alert('يرجى إدخال بريد إلكتروني صالح!');
    return;
  }
  siteSettings.adminEmail = newEmail;
  saveSettingsToStorage();

  const token = localStorage.getItem('superAdminToken') || localStorage.getItem('adminToken');
  if (token) {
    fetch('/api/admin/settings/email', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ adminEmail: newEmail })
    }).catch(e => console.warn('API email save fallback:', e));
  }

  alert('تم حفظ وتحديث البريد الإلكتروني المعتمد للمركز وإشعارات النظام بنجاح!');
}

function saveAdminInstagram(event) {
  event.preventDefault();
  const newInsta = document.getElementById('cfg-admin-insta').value.trim();
  if (!newInsta) {
    alert('يرجى إدخال رابط أو يوزر إنستغرام صالح!');
    return;
  }
  siteSettings.adminInstagram = newInsta;
  saveSettingsToStorage();

  const token = localStorage.getItem('superAdminToken') || localStorage.getItem('adminToken');
  if (token) {
    fetch('/api/admin/settings/instagram', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ adminInstagram: newInsta })
    }).catch(e => console.warn('API instagram save fallback:', e));
  }

  alert('تم حفظ وتحديث حساب إنستغرام المعتمد للمركز بنجاح!');
}

// --- LOCAL STORAGE MANAGEMENT FOR BOOKINGS ---
function loadBookingsFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        bookings = parsed.map(sanitizeBookingObject);
      } else {
        loadInitialDemoData();
      }
    } catch (e) {
      console.error('Failed to parse bookings database:', e);
      loadInitialDemoData();
    }
  } else {
    loadInitialDemoData();
  }
}

function sanitizeBookingObject(b) {
  const defaultFee = safeStr(b.isPaidEvent) === 'نعم' ? 'تحدد لاحقاً بالليرة التركية (TL)' : '0 TL (نشاط مجاني)';
  return {
    id: safeStr(b.id) || ('MJR-' + Math.floor(1000 + Math.random() * 9000)),
    organizerName: safeStr(b.organizerName) || 'مسؤول غير معروف',
    whatsappNumber: safeStr(b.whatsappNumber) || '+905385062989',
    email: safeStr(b.email) || 'info@majarra.org',
    entityType: safeStr(b.entityType) || 'فرد مستقل',
    executorName: safeStr(b.executorName) || 'جهة غير محددة',
    eventType: safeStr(b.eventType) || 'فعالية',
    hallName: safeStr(b.hallName) || 'قاعة أفــُـق (سعة القاعة 20)',
    eventTitle: safeStr(b.eventTitle) || 'نشاط بدون عنوان',
    eventDescription: safeStr(b.eventDescription) || 'لا يوجد وصف.',
    attendeesCount: safeNum(b.attendeesCount) || 10,
    startDate: safeStr(b.startDate) || '2026-09-02',
    endDate: safeStr(b.endDate) || safeStr(b.startDate) || '2026-09-02',
    startTime: safeStr(b.startTime) || '10:00',
    endTime: safeStr(b.endTime) || '12:00',
    instagramLink: safeStr(b.instagramLink),
    facebookLink: safeStr(b.facebookLink),
    linkedinLink: safeStr(b.linkedinLink),
    equipment: Array.isArray(b.equipment) ? b.equipment : ['بروجكتر'],
    extraEquipmentNeeds: safeStr(b.extraEquipmentNeeds),
    isSponsored: safeStr(b.isSponsored) || 'لا',
    isPaidEvent: safeStr(b.isPaidEvent) || 'لا',
    feeAmount: safeStr(b.feeAmount) || defaultFee,
    packageType: safeStr(b.packageType) || 'كفو',
    additionalService: safeStr(b.additionalService) || 'بدون خدمات إضافية',
    status: safeStr(b.status) || 'pending',
    createdAt: safeStr(b.createdAt) || new Date().toISOString()
  };
}

function saveBookingsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  updateStats();
  renderBookingsTable();
  renderCalendarView();
  renderPublicAvailabilityCalendar();
  if (document.getElementById('admin-archive-view') && document.getElementById('admin-archive-view').style.display !== 'none') {
    renderArchiveView();
  }
}

// --- DEMO DATA GENERATOR WITH 3 SAME-DAY BOOKINGS ON WEDNESDAY 2026-09-02 ---
function loadInitialDemoData() {
  bookings = [
    {
      id: 'MJR-1001',
      organizerName: 'مجد العلي',
      whatsappNumber: '+905385062989',
      email: 'majd@example.com',
      entityType: 'منظمة غير ربحية',
      executorName: 'مبادرة مسار الإبداعية',
      eventType: 'ورشة عمل',
      hallName: 'قاعة أفــُـق (سعة القاعة 20)',
      eventTitle: 'تدريب صناعة المحتوى البصري والذكاء الاصطناعي',
      eventDescription: 'ورشة عمل تفاعلية تهدف لتمكين الشباب في إنتاج المحتوى المرئي وصناعة الأفكار.',
      attendeesCount: 18,
      startDate: '2026-09-02',
      endDate: '2026-09-02',
      startTime: '09:00',
      endTime: '13:00',
      instagramLink: 'https://instagram.com/masar_initiative',
      facebookLink: '',
      linkedinLink: '',
      equipment: ['بروجكتر', 'لوح كتابة', 'وصلات كهرباء', 'كراسي'],
      extraEquipmentNeeds: 'ميكروفون محمول',
      isSponsored: 'نعم',
      isPaidEvent: 'لا',
      feeAmount: '0 TL (نشاط مجاني)',
      packageType: 'كفو',
      additionalService: 'بوفيه اكسترا | مشروبات ساخنة + باردة',
      status: 'accepted',
      createdAt: '2026-08-25T10:00:00.000Z'
    },
    {
      id: 'MJR-1002',
      organizerName: 'سارة عبد الله',
      whatsappNumber: '+905389998877',
      email: 'sara@example.com',
      entityType: 'فريق تطوعي',
      executorName: 'فريق ملهم التطوعي',
      eventType: 'تدريب',
      hallName: 'قاعة ديـــوان (سعة القاعة 30)',
      eventTitle: 'ملتقى الابتكار وريادة الأعمال الشبابية 2026',
      eventDescription: 'دورة تدريبية مكثفة حول إدارة المشاريع الناشئة وتسويق الابتكارات المجتمعية.',
      attendeesCount: 28,
      startDate: '2026-09-02',
      endDate: '2026-09-02',
      startTime: '14:00',
      endTime: '18:00',
      instagramLink: '',
      facebookLink: 'https://facebook.com/molhem_team',
      linkedinLink: '',
      equipment: ['بروجكتر', 'نظام صوتي', 'طاولات', 'كراسي'],
      extraEquipmentNeeds: 'شاشة عرض إضافية',
      isSponsored: 'نعم',
      isPaidEvent: 'لا',
      feeAmount: '0 TL (نشاط مجاني)',
      packageType: 'على عيني',
      additionalService: 'بوفيه أوبها | بوفيه إكسترا + سناكس',
      status: 'accepted',
      createdAt: '2026-08-26T14:30:00.000Z'
    },
    {
      id: 'MJR-1003',
      organizerName: 'أحمد الخطيب',
      whatsappNumber: '+905011122334',
      email: 'ahmed@example.com',
      entityType: 'فرد مستقل',
      executorName: 'استوديو صناع المحتوى',
      eventType: 'اجتماع',
      hallName: 'قاعة ســديم (سعة القاعة 16-18)',
      eventTitle: 'اجتماع وتصوير حلقة بودكاست مجرة',
      eventDescription: 'جلسة حوارية وتصوير بودكاست تناقش التجارب الشبابية الناجحة في الاغتراب.',
      attendeesCount: 12,
      startDate: '2026-09-02',
      endDate: '2026-09-02',
      startTime: '18:30',
      endTime: '21:00',
      instagramLink: 'https://instagram.com/podcasters',
      facebookLink: '',
      linkedinLink: '',
      equipment: ['شاشة تفاعلية', 'عزل صوتي', 'قرطاسية'],
      extraEquipmentNeeds: 'حوامل إضاءة',
      isSponsored: 'لا',
      isPaidEvent: 'لا',
      feeAmount: '0 TL (نشاط مجاني)',
      packageType: 'كفو',
      additionalService: 'بدون خدمات إضافية',
      status: 'accepted',
      createdAt: '2026-08-27T09:15:00.000Z'
    },
    {
      id: 'MJR-1004',
      organizerName: 'المهندس حسان الراعي',
      whatsappNumber: '+905385062989',
      email: 'hassan@example.com',
      entityType: 'منظمة غير ربحية',
      executorName: 'مؤسسة ابتكار للحلول الرقمية',
      eventType: 'فعالية',
      hallName: 'قاعة ديـــوان (سعة القاعة 30)',
      eventTitle: 'ندوة الذكاء الاصطناعي ومستقبل المهن',
      eventDescription: 'ندوة مفتوحة مع خبراء في التقنية للحديث عن تطورات الذكاء الاصطناعي وتأثيره على سوق العمل.',
      attendeesCount: 25,
      startDate: '2026-09-05',
      endDate: '2026-09-05',
      startTime: '14:00',
      endTime: '18:00',
      instagramLink: '',
      facebookLink: '',
      linkedinLink: '',
      equipment: ['شاشة عرض', 'نظام صوتي', 'تكييف مركز'],
      extraEquipmentNeeds: '',
      isSponsored: 'نعم',
      isPaidEvent: 'لا',
      feeAmount: '0 TL (نشاط مجاني)',
      packageType: 'على عيني',
      additionalService: 'بوفيه على عيني | بوفيه أوبها + سناكس لوكس',
      status: 'accepted',
      createdAt: '2026-08-28T11:00:00.000Z'
    },
    {
      id: 'MJR-1005',
      organizerName: 'نور الهدى',
      whatsappNumber: '+905377766554',
      email: 'nour@example.com',
      entityType: 'فريق تطوعي',
      executorName: 'نادي القراء الثقافي',
      eventType: 'نادي ثقافي',
      hallName: 'قاعة ســديم (سعة القاعة 16-18)',
      eventTitle: 'جلسة مناقشة رواية وتاريخ الفن',
      eventDescription: 'لقاء شهري لعشاق القراءة والتحليل الأدبي.',
      attendeesCount: 18,
      startDate: '2026-09-10',
      endDate: '2026-09-10',
      startTime: '16:00',
      endTime: '19:00',
      instagramLink: '',
      facebookLink: '',
      linkedinLink: '',
      equipment: ['قرطاسية', 'ضيافة'],
      extraEquipmentNeeds: '',
      isSponsored: 'لا',
      isPaidEvent: 'لا',
      feeAmount: '0 TL (نشاط مجاني)',
      packageType: 'كفو',
      additionalService: 'بدون خدمات إضافية',
      status: 'accepted',
      createdAt: '2026-08-29T15:20:00.000Z'
    }
  ];
  saveBookingsToStorage();
}

function loadDemoData() {
  if (confirm('هل ترغب في إعادة تحميل البيانات التجريبية المعتمدة للموقع؟')) {
    loadInitialDemoData();
    alert('تم تحميل البيانات التجريبية بنجاح!');
  }
}

// --- NAVIGATION & TABS LOGIC ---
function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  if (tabId === 'halls') {
    document.getElementById('tabHallsBtn').classList.add('active');
    document.getElementById('halls-section').classList.add('active');
    renderPublicAvailabilityCalendar();
  } else if (tabId === 'admin') {
    document.getElementById('tabAdminBtn').classList.add('active');
    document.getElementById('admin-section').classList.add('active');
    checkAdminAuth();
  }
}

function switchAdminSubTab(subTabId) {
  if (subTabId === 'settings') {
    const isSuperAuth = sessionStorage.getItem(SUPER_AUTH_KEY) === 'true';
    if (!isSuperAuth) {
      openSuperAdminAuthModal();
      return;
    }
  }

  document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('admin-requests-view').style.display = 'none';
  document.getElementById('admin-calendar-view').style.display = 'none';
  document.getElementById('admin-archive-view').style.display = 'none';
  document.getElementById('admin-settings-view').style.display = 'none';

  if (subTabId === 'requests') {
    document.getElementById('subTabRequests').classList.add('active');
    document.getElementById('admin-requests-view').style.display = 'block';
    renderBookingsTable();
  } else if (subTabId === 'calendar') {
    document.getElementById('subTabCalendar').classList.add('active');
    document.getElementById('admin-calendar-view').style.display = 'block';
    renderCalendarView();
  } else if (subTabId === 'archive') {
    document.getElementById('subTabArchive').classList.add('active');
    document.getElementById('admin-archive-view').style.display = 'block';
    renderArchiveView();
  } else if (subTabId === 'settings') {
    document.getElementById('subTabSettings').classList.add('active');
    document.getElementById('admin-settings-view').style.display = 'block';
    applySiteSettingsToUI();
  }
}

// --- ADMIN & SUPER ADMIN AUTHENTICATION ---
function checkAdminAuth() {
  const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true' || localStorage.getItem('adminToken') || localStorage.getItem('superAdminToken');
  const adminTabBtn = document.getElementById('tabAdminBtn');
  const dashboardSection = document.getElementById('admin-dashboard-section');

  if (isAuth) {
    if (adminTabBtn) adminTabBtn.style.display = 'flex';
    if (dashboardSection) dashboardSection.style.display = 'block';
    loadAdminBookings();
  } else {
    if (adminTabBtn) adminTabBtn.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'none';
  }
}

function openAdminModal() {
  document.getElementById('admin-auth-modal').style.display = 'flex';
  document.getElementById('adminPin').value = '';
  document.getElementById('authError').style.display = 'none';
  setTimeout(() => document.getElementById('adminPin').focus(), 100);
}

function closeAdminAuthModal() {
  document.getElementById('admin-auth-modal').style.display = 'none';
}

// EXPRESS API & LOCAL FALLBACK INTEGRATION FOR STAFF AUTH
async function authenticateAdmin() {
  const pin = document.getElementById('adminPin').value.trim();

  try {
    const res = await fetch('/api/auth/staff-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('adminToken', data.token);
      sessionStorage.setItem(AUTH_KEY, 'true');
      document.getElementById('admin-auth-modal').style.display = 'none';
      const adminTabBtn = document.getElementById('tabAdminBtn');
      if (adminTabBtn) adminTabBtn.style.display = 'inline-flex';
      switchTab('admin');
      loadAdminBookings();
      return;
    }
  } catch (err) {
    console.warn('API Auth offline fallback, checking client PIN validation...', err);
  }

  // Fallback to client PIN validation if API is unavailable
  const currentStaffPin = siteSettings.adminPin || '1234';
  const currentSuperPin = siteSettings.superAdminPin || '8888';

  if (pin === currentStaffPin || pin === currentSuperPin) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    if (pin === currentSuperPin) {
      sessionStorage.setItem(SUPER_AUTH_KEY, 'true');
    }
    document.getElementById('admin-auth-modal').style.display = 'none';
    const adminTabBtn = document.getElementById('tabAdminBtn');
    if (adminTabBtn) adminTabBtn.style.display = 'inline-flex';
    switchTab('admin');
    loadAdminBookings();
  } else {
    document.getElementById('authError').style.display = 'block';
  }
}

function adminLogout() {
  if (confirm('هل تأكد رغبتك في تسجيل الخروج من لوحة التحكم؟')) {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(SUPER_AUTH_KEY);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('superAdminToken');
    checkAdminAuth();
    switchTab('halls');
  }
}

// --- BROWSER NATIVE SYSTEM POPUP NOTIFICATIONS ---
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        Toast.show('success', '🔔 تم تفعيل إشعارات النظام بنجاح!');
      }
    });
  }
}

function triggerSystemNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'assets/majarra_official_icon.png',
        tag: 'majarra-new-booking'
      });
    } catch (e) {
      console.warn('Native notification system error:', e);
    }
  }
}

// --- AUDIO NOTIFICATION SOUND CHIME FOR NEW BOOKINGS ---
function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5 note
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (err) {
    console.warn('Audio chime notice fallback:', err);
  }
}

let lastKnownBookingsCount = 0;

async function checkRealtimeNewBookings() {
  const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true' || localStorage.getItem('adminToken') || localStorage.getItem('superAdminToken');
  if (!isAuth) return;

  const token = localStorage.getItem('adminToken') || localStorage.getItem('superAdminToken');
  if (!token) return;

  try {
    const res = await fetch('/api/admin/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.bookings)) {
      const serverBookings = data.bookings.map(sanitizeBookingObject);
      
      if (lastKnownBookingsCount > 0 && serverBookings.length > lastKnownBookingsCount) {
        const latestBooking = serverBookings[0];
        playNotificationSound();
        Toast.show('info', `🚨 وصل طلب حجز جديد! رقم (#${latestBooking.id}) - ${latestBooking.organizerName} (${latestBooking.hallName})`, 8000);
        triggerSystemNotification(
          `🚨 طلب حجز جديد! (#${latestBooking.id})`,
          `المسؤول: ${latestBooking.organizerName} | ${latestBooking.hallName} | ${latestBooking.startDate}`
        );
      }

      lastKnownBookingsCount = serverBookings.length;
      bookings = serverBookings;
      saveBookingsToStorage();
      updateStats();
      renderBookingsTable();
      renderCalendarView();
      renderPublicAvailabilityCalendar();
    }
  } catch (err) {
    // Silent polling catch
  }
}

// Poll for real-time new booking notifications every 10 seconds
setInterval(checkRealtimeNewBookings, 10000);

// FETCH BOOKINGS FROM BACKEND API OR LOCALSTORAGE
async function loadAdminBookings() {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('superAdminToken');
  if (token) {
    try {
      const res = await fetch('/api/admin/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        if (data.bookings.length > 0) {
          bookings = data.bookings.map(sanitizeBookingObject);
          lastKnownBookingsCount = bookings.length;
          saveBookingsToStorage();
        }
      }
    } catch (err) {
      console.warn('Could not fetch bookings from API backend, using local state:', err);
    }
  }
  updateStats();
  renderBookingsTable();
  renderCalendarView();
  renderPublicAvailabilityCalendar();
}

// --- SUPER ADMIN MASTER KEY AUTHENTICATION ---
function openSuperAdminAuthModal() {
  document.getElementById('super-admin-auth-modal').style.display = 'flex';
  document.getElementById('superAdminPin').value = '';
  document.getElementById('superAuthError').style.display = 'none';
  setTimeout(() => document.getElementById('superAdminPin').focus(), 100);
}

function closeSuperAdminAuthModal() {
  document.getElementById('super-admin-auth-modal').style.display = 'none';
}

async function authenticateSuperAdmin() {
  const pin = document.getElementById('superAdminPin').value.trim();

  try {
    const res = await fetch('/api/auth/super-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('superAdminToken', data.token);
      sessionStorage.setItem(SUPER_AUTH_KEY, 'true');
      sessionStorage.setItem(AUTH_KEY, 'true');
      closeSuperAdminAuthModal();
      switchAdminSubTab('settings');
      Toast.show('success', '🔐 تم التحقق من رمز المدير العام بنجاح! تم فتح إعدادات الموقع.');
      return;
    }
  } catch (err) {
    console.warn('Super admin API auth fallback...', err);
  }

  const masterPin = siteSettings.superAdminPin || '8888';
  if (pin === masterPin || pin === '8888') {
    sessionStorage.setItem(SUPER_AUTH_KEY, 'true');
    sessionStorage.setItem(AUTH_KEY, 'true');
    closeSuperAdminAuthModal();
    switchAdminSubTab('settings');
    Toast.show('success', '🔐 تم التحقق من رمز المدير العام بنجاح! تم فتح إعدادات الموقع.');
  } else {
    document.getElementById('superAuthError').style.display = 'block';
  }
}

function superAdminLogout() {
  sessionStorage.removeItem(SUPER_AUTH_KEY);
  localStorage.removeItem('superAdminToken');
  switchAdminSubTab('requests');
  Toast.show('info', '🔒 تم قفل لوحة إعدادات المدير العام بنجاح.');
}

// --- LIVE HALL IMAGE PREVIEW & FILE UPLOAD HANDLERS ---
function updateHallPreview(hallKey) {
  const inputEl = document.getElementById(`cfg-${hallKey}-img-input`);
  const previewEl = document.getElementById(`cfg-${hallKey}-preview`);
  if (inputEl && previewEl && inputEl.value) {
    previewEl.src = inputEl.value;
  }
}

function handleHallFileUpload(event, hallKey) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const inputEl = document.getElementById(`cfg-${hallKey}-img-input`);
    const previewEl = document.getElementById(`cfg-${hallKey}-preview`);
    if (inputEl) inputEl.value = dataUrl;
    if (previewEl) previewEl.src = dataUrl;
    Toast.show('success', 'تم رفع وتحديث معاينة الصورة بنجاح!');
  };
  reader.readAsDataURL(file);
}

// --- APPLY SITE SETTINGS TO PUBLIC UI & ADMIN FORM ---
function applySiteSettingsToUI() {
  const h = siteSettings.halls || {};

  // Ofoq Hall
  if (h.ofoq) {
    if (document.getElementById('cfg-ofoq-name')) document.getElementById('cfg-ofoq-name').value = h.ofoq.name || 'قاعة أفــُـق';
    if (document.getElementById('cfg-ofoq-cap')) document.getElementById('cfg-ofoq-cap').value = h.ofoq.cap || 20;
    if (document.getElementById('cfg-ofoq-desc')) document.getElementById('cfg-ofoq-desc').value = h.ofoq.desc || '';
    if (document.getElementById('cfg-ofoq-img-input')) document.getElementById('cfg-ofoq-img-input').value = h.ofoq.image || 'assets/workshop.jpg';
    if (document.getElementById('cfg-ofoq-preview')) document.getElementById('cfg-ofoq-preview').src = h.ofoq.image || 'assets/workshop.jpg';

    if (document.getElementById('hall-ofoq-title')) document.getElementById('hall-ofoq-title').innerText = h.ofoq.name || 'قاعة أفــُـق';
    if (document.getElementById('hall-ofoq-cap-tag')) document.getElementById('hall-ofoq-cap-tag').innerText = `سعة ${h.ofoq.cap || 20} شخص`;
    if (document.getElementById('hall-ofoq-desc')) document.getElementById('hall-ofoq-desc').innerText = h.ofoq.desc || '';
    if (document.getElementById('hall-ofoq-img')) document.getElementById('hall-ofoq-img').src = h.ofoq.image || 'assets/workshop.jpg';
  }

  // Diwan Hall
  if (h.diwan) {
    if (document.getElementById('cfg-diwan-name')) document.getElementById('cfg-diwan-name').value = h.diwan.name || 'قاعة ديـــوان';
    if (document.getElementById('cfg-diwan-cap')) document.getElementById('cfg-diwan-cap').value = h.diwan.cap || 30;
    if (document.getElementById('cfg-diwan-desc')) document.getElementById('cfg-diwan-desc').value = h.diwan.desc || '';
    if (document.getElementById('cfg-diwan-img-input')) document.getElementById('cfg-diwan-img-input').value = h.diwan.image || 'assets/grand.jpg';
    if (document.getElementById('cfg-diwan-preview')) document.getElementById('cfg-diwan-preview').src = h.diwan.image || 'assets/grand.jpg';

    if (document.getElementById('hall-diwan-title')) document.getElementById('hall-diwan-title').innerText = h.diwan.name || 'قاعة ديـــوان';
    if (document.getElementById('hall-diwan-cap-tag')) document.getElementById('hall-diwan-cap-tag').innerText = `سعة ${h.diwan.cap || 30} شخص`;
    if (document.getElementById('hall-diwan-desc')) document.getElementById('hall-diwan-desc').innerText = h.diwan.desc || '';
    if (document.getElementById('hall-diwan-img')) document.getElementById('hall-diwan-img').src = h.diwan.image || 'assets/grand.jpg';
  }

  // Sadeem Hall
  if (h.sadeem) {
    if (document.getElementById('cfg-sadeem-name')) document.getElementById('cfg-sadeem-name').value = h.sadeem.name || 'قاعة ســديم';
    if (document.getElementById('cfg-sadeem-cap')) document.getElementById('cfg-sadeem-cap').value = h.sadeem.cap || 18;
    if (document.getElementById('cfg-sadeem-desc')) document.getElementById('cfg-sadeem-desc').value = h.sadeem.desc || '';
    if (document.getElementById('cfg-sadeem-img-input')) document.getElementById('cfg-sadeem-img-input').value = h.sadeem.image || 'assets/meeting.jpg';
    if (document.getElementById('cfg-sadeem-preview')) document.getElementById('cfg-sadeem-preview').src = h.sadeem.image || 'assets/meeting.jpg';

    if (document.getElementById('hall-sadeem-title')) document.getElementById('hall-sadeem-title').innerText = h.sadeem.name || 'قاعة ســديم';
    if (document.getElementById('hall-sadeem-cap-tag')) document.getElementById('hall-sadeem-cap-tag').innerText = `سعة ${h.sadeem.cap || 18} شخص`;
    if (document.getElementById('hall-sadeem-desc')) document.getElementById('hall-sadeem-desc').innerText = h.sadeem.desc || '';
    if (document.getElementById('hall-sadeem-img')) document.getElementById('hall-sadeem-img').src = h.sadeem.image || 'assets/meeting.jpg';
  }

  // Update capacities in HALL_CAPACITIES map
  if (h.ofoq && h.ofoq.cap) HALL_CAPACITIES['قاعة أفــُـق'] = safeNum(h.ofoq.cap);
  if (h.diwan && h.diwan.cap) HALL_CAPACITIES['قاعة ديـــوان'] = safeNum(h.diwan.cap);
  if (h.sadeem && h.sadeem.cap) HALL_CAPACITIES['قاعة ســديم'] = safeNum(h.sadeem.cap);
}

// SAVE HALL SETTINGS FORM
async function saveHallSettings(e) {
  if (e && e.preventDefault) e.preventDefault();

  const newHalls = {
    ofoq: {
      name: document.getElementById('cfg-ofoq-name').value,
      cap: safeNum(document.getElementById('cfg-ofoq-cap').value) || 20,
      desc: document.getElementById('cfg-ofoq-desc').value,
      image: document.getElementById('cfg-ofoq-img-input').value || 'assets/workshop.jpg'
    },
    diwan: {
      name: document.getElementById('cfg-diwan-name').value,
      cap: safeNum(document.getElementById('cfg-diwan-cap').value) || 30,
      desc: document.getElementById('cfg-diwan-desc').value,
      image: document.getElementById('cfg-diwan-img-input').value || 'assets/grand.jpg'
    },
    sadeem: {
      name: document.getElementById('cfg-sadeem-name').value,
      cap: safeNum(document.getElementById('cfg-sadeem-cap').value) || 18,
      desc: document.getElementById('cfg-sadeem-desc').value,
      image: document.getElementById('cfg-sadeem-img-input').value || 'assets/meeting.jpg'
    }
  };

  siteSettings.halls = newHalls;

  const token = localStorage.getItem('superAdminToken') || localStorage.getItem('adminToken');
  if (token) {
    try {
      await fetch('/api/admin/settings/halls', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ halls: newHalls })
      });
    } catch (err) {
      console.warn('API save halls settings fallback:', err);
    }
  }

  saveSettingsToStorage();
  applySiteSettingsToUI();
  Toast.show('success', 'تم حفظ وتحديث أسماء، سعات، وصور القاعات للموقع بنجاح! 🖼️✨');
}

// --- STATS DASHBOARD WITH DEFENSIVE CALCULATION ---
function updateStats() {
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'pending').length;
  const accepted = bookings.filter(b => b.status === 'accepted').length;
  
  const acceptedBookings = bookings.filter(b => b.status === 'accepted');
  const totalAttendees = acceptedBookings.reduce((sum, b) => sum + safeNum(b.attendeesCount), 0);

  const totalEl = document.getElementById('stat-total');
  const pendingEl = document.getElementById('stat-pending');
  const acceptedEl = document.getElementById('stat-accepted');
  const attendeesEl = document.getElementById('stat-attendees');

  if (totalEl) totalEl.innerText = total;
  if (pendingEl) pendingEl.innerText = pending;
  if (acceptedEl) acceptedEl.innerText = accepted;
  if (attendeesEl) attendeesEl.innerText = totalAttendees;

  const badgeEl = document.getElementById('pending-badge-count');
  if (badgeEl) badgeEl.innerText = pending;
}

// --- INTERACTIVE CLICKABLE STAT CARD DETAIL MODAL BREAKDOWN ---
function openStatDetailModal(type) {
  const modal = document.getElementById('stat-detail-modal');
  const titleEl = document.getElementById('stat-modal-title');
  const subtitleEl = document.getElementById('stat-modal-subtitle');
  const bodyEl = document.getElementById('stat-modal-body');

  if (!modal || !bodyEl) return;

  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  if (type === 'attendees') {
    titleEl.innerHTML = '<i class="fa-solid fa-users" style="color: var(--brand-peach);"></i> توزيع إجمالي الحضور حسب الفعاليات والأيام';
    subtitleEl.innerText = 'عرض تفصيلي لأعداد الحضور المتوقعة لكافة الفعاليات المقبولة بالتقويم';

    const acceptedList = bookings.filter(b => b.status === 'accepted');
    
    if (acceptedList.length === 0) {
      bodyEl.innerHTML = '<div class="alert-banner info">لا توجد فعاليات مقبولة ومثبتة في التقويم حالياً.</div>';
    } else {
      const groupedByDate = {};
      acceptedList.forEach(b => {
        if (!groupedByDate[b.startDate]) groupedByDate[b.startDate] = [];
        groupedByDate[b.startDate].push(b);
      });

      const sortedDates = Object.keys(groupedByDate).sort();

      let html = '';
      sortedDates.forEach(dateStr => {
        const dateObj = new Date(dateStr);
        const dayName = dayNames[dateObj.getDay()] || '';
        const dayEvents = groupedByDate[dateStr];
        const dayTotalAttendees = dayEvents.reduce((sum, item) => sum + safeNum(item.attendeesCount), 0);

        html += `
          <div class="stat-day-block">
            <div class="stat-day-header">
              <span><i class="fa-solid fa-calendar-day"></i> ${dayName} (${dateStr})</span>
              <span class="stat-day-total-tag">👥 ${dayTotalAttendees} زائر (${dayEvents.length} فعاليات)</span>
            </div>
        `;

        dayEvents.forEach(evt => {
          const cleanHall = getCleanHallName(evt.hallName);
          const start12h = formatTime12h(evt.startTime);
          const end12h = formatTime12h(evt.endTime);
          html += `
            <div class="stat-event-row">
              <div class="stat-event-info">
                <span class="stat-event-title">${evt.eventTitle} (${evt.id})</span>
                <span class="stat-event-meta"><i class="fa-solid fa-door-closed" style="color: var(--brand-purple);"></i> ${cleanHall} | <i class="fa-solid fa-clock"></i> ${start12h} - ${end12h} | <i class="fa-solid fa-user"></i> ${evt.executorName || evt.organizerName}</span>
              </div>
              <span class="stat-event-attendees"><i class="fa-solid fa-user-group"></i> ${evt.attendeesCount} شخص</span>
            </div>
          `;
        });

        html += `</div>`;
      });

      bodyEl.innerHTML = html;
    }
  } else if (type === 'accepted') {
    titleEl.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--accent-emerald);"></i> الفعاليات المقبولة والمثبتة في التقويم';
    subtitleEl.innerText = 'قائمة لكافة الحجوزات التي تم اعتمادها وإدراجها في الجدول المباشر';

    const acceptedList = bookings.filter(b => b.status === 'accepted');
    if (acceptedList.length === 0) {
      bodyEl.innerHTML = '<div class="alert-banner info">لا توجد فعاليات مقبولة في التقويم حالياً.</div>';
    } else {
      let html = '<div class="stat-day-block">';
      acceptedList.forEach(evt => {
        const cleanHall = getCleanHallName(evt.hallName);
        const start12h = formatTime12h(evt.startTime);
        const end12h = formatTime12h(evt.endTime);
        html += `
          <div class="stat-event-row">
            <div class="stat-event-info">
              <span class="stat-event-title">${evt.eventTitle} (${evt.id})</span>
              <span class="stat-event-meta"><i class="fa-solid fa-door-closed" style="color: var(--brand-purple);"></i> ${cleanHall} | <i class="fa-solid fa-calendar"></i> ${evt.startDate} (${start12h} - ${end12h}) | <i class="fa-solid fa-user"></i> ${evt.organizerName}</span>
            </div>
            <button class="btn btn-outline btn-sm" onclick="closeStatDetailModal(); showTicketModal('${evt.id}');"><i class="fa-solid fa-receipt"></i> الإيصال</button>
          </div>
        `;
      });
      html += '</div>';
      bodyEl.innerHTML = html;
    }
  } else if (type === 'pending') {
    titleEl.innerHTML = '<i class="fa-solid fa-hourglass-half" style="color: var(--brand-gold);"></i> الطلبات المعلقة قيد المراجعة';
    subtitleEl.innerText = 'طلبات حجز جديدة بانتظار موافقة أو رفض إدارة المركز';

    const pendingList = bookings.filter(b => b.status === 'pending');
    if (pendingList.length === 0) {
      bodyEl.innerHTML = '<div class="alert-banner success"><i class="fa-solid fa-check"></i> ممتااااز! لا توجد أي طلبات معلقة تنتظر القرار حالياً.</div>';
    } else {
      let html = '<div class="stat-day-block">';
      pendingList.forEach(evt => {
        const cleanHall = getCleanHallName(evt.hallName);
        const start12h = formatTime12h(evt.startTime);
        const end12h = formatTime12h(evt.endTime);
        html += `
          <div class="stat-event-row">
            <div class="stat-event-info">
              <span class="stat-event-title">${evt.eventTitle} (${evt.id})</span>
              <span class="stat-event-meta"><i class="fa-solid fa-door-closed" style="color: var(--brand-purple);"></i> ${cleanHall} | <i class="fa-solid fa-calendar"></i> ${evt.startDate} | <i class="fa-solid fa-clock"></i> ${start12h} - ${end12h} | <i class="fa-solid fa-users"></i> ${evt.attendeesCount} شخص</span>
            </div>
            <div class="action-btn-group">
              <button class="btn btn-sm" style="background: #10b981; color: white; font-weight: 800;" onclick="closeStatDetailModal(); updateBookingStatus('${evt.id}', 'accepted');"><i class="fa-solid fa-check"></i> قبول</button>
              <button class="btn btn-sm" style="background: #ef4444; color: white; font-weight: 800;" onclick="closeStatDetailModal(); updateBookingStatus('${evt.id}', 'rejected');"><i class="fa-solid fa-xmark"></i> رفض</button>
            </div>
          </div>
        `;
      });
      html += '</div>';
      bodyEl.innerHTML = html;
    }
  } else {
    titleEl.innerHTML = '<i class="fa-solid fa-calendar-check" style="color: var(--brand-purple);"></i> إجمالي كافة الطلبات المسجلة بالنظام';
    subtitleEl.innerText = 'سجل شامل لكافة الطلبات الواردة (مقبولة، معلقة، ومرفوضة)';

    let html = '<div class="stat-day-block">';
    bookings.forEach(evt => {
      const cleanHall = getCleanHallName(evt.hallName);
      const statusBadge = evt.status === 'accepted' 
        ? '<span class="badge badge-accepted">مقبول</span>' 
        : (evt.status === 'pending' ? '<span class="badge badge-pending">معلق</span>' : '<span class="badge badge-rejected">مرفوض</span>');

      html += `
        <div class="stat-event-row">
          <div class="stat-event-info">
            <span class="stat-event-title">${evt.eventTitle} (${evt.id}) ${statusBadge}</span>
            <span class="stat-event-meta"><i class="fa-solid fa-door-closed" style="color: var(--brand-purple);"></i> ${cleanHall} | <i class="fa-solid fa-calendar"></i> ${evt.startDate} | <i class="fa-solid fa-user"></i> ${evt.organizerName}</span>
          </div>
        </div>
      `;
    });
    html += '</div>';
    bodyEl.innerHTML = html;
  }

  modal.style.display = 'flex';
}

function closeStatDetailModal() {
  const modal = document.getElementById('stat-detail-modal');
  if (modal) modal.style.display = 'none';
}

// --- 12-HOUR TIME FORMATTER (Google Calendar Style e.g. 1:30 م or 9:00 ص) ---
function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let h = parseInt(parts[0], 10);
  const m = parts[1];
  if (isNaN(h)) return timeStr;
  const suffix = h >= 12 ? 'م' : 'ص';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${suffix}`;
}

// --- PUBLIC AVAILABILITY READ-ONLY CALENDAR ---
function changePublicCalendarMonth(delta) {
  // Always reset day to 1 before changing month to prevent 31st overflow skipping bug (e.g. Aug 31 + 1 month -> Sep 31 -> Oct 1)
  const targetYear = currentPublicCalendarDate.getFullYear();
  const targetMonth = currentPublicCalendarDate.getMonth() + delta;
  currentPublicCalendarDate = new Date(targetYear, targetMonth, 1);
  renderPublicAvailabilityCalendar();
}

function getCleanHallName(fullHallName) {
  if (!fullHallName) return 'القاعة';
  const clean = fullHallName.replace(/\(سعة.*?\)/g, '').trim();
  return clean || fullHallName;
}

function resetPublicCalendarToToday() {
  currentPublicCalendarDate = new Date();
  currentPublicCalendarDate.setDate(1); // Set to start of current month
  renderPublicAvailabilityCalendar();
}

function renderPublicAvailabilityCalendar() {
  const gridEl = document.getElementById('public-calendar-grid-days');
  const titleEl = document.getElementById('public-calendar-month-title');
  const hallFilter = document.getElementById('public-hall-filter') ? document.getElementById('public-hall-filter').value : 'all';

  if (!gridEl || !titleEl) return;

  const year = currentPublicCalendarDate.getFullYear();
  const month = currentPublicCalendarDate.getMonth();

  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const monthNamesTr = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let mNames = monthNamesAr;
  if (currentLang === 'tr') mNames = monthNamesTr;
  else if (currentLang === 'en') mNames = monthNamesEn;

  titleEl.innerText = `${mNames[month]} ${year}`;

  const rawFirstDay = new Date(year, month, 1).getDay();
  const firstDay = (rawFirstDay + 6) % 7; // Monday = 0 (Turkish & European Standard - ISO 8601)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  gridEl.innerHTML = '';

  // 1. Previous Month Days Padding (Google Calendar Style Muted Days)
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month-cell';
    cell.innerHTML = `<div class="day-cell-top"><span class="cal-day-number muted-day-num">${dayNum}</span></div>`;
    gridEl.appendChild(cell);
  }

  // 2. Current Month Days
  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${monthStr}-${dayStr}`;

    const cell = document.createElement('div');
    cell.className = 'cal-day-cell';

    const isToday = (year === todayY && month === todayM && day === todayD);
    if (isToday) cell.classList.add('today-cell');

    let dayEvents = bookings.filter(b => b.status === 'accepted' && b.startDate === dateString);
    
    if (hallFilter !== 'all') {
      dayEvents = dayEvents.filter(b => b.hallName === hallFilter);
    }

    const dayTotalAttendees = dayEvents.reduce((sum, b) => sum + safeNum(b.attendeesCount), 0);

    const dayNumHtml = isToday 
      ? `<span class="cal-day-number today-badge">${day}</span>` 
      : `<span class="cal-day-number">${day}</span>`;

    let cellTopHtml = `<div class="day-cell-top">${dayNumHtml}`;
    if (dayEvents.length > 0) {
      cellTopHtml += `<span class="day-attendees-badge" title="إجمالي الحضور اليوم">👥 ${dayTotalAttendees}</span>`;
    }
    cellTopHtml += `</div>`;

    cell.innerHTML = cellTopHtml;

    if (dayEvents.length > 0) {
      const eventsContainer = document.createElement('div');
      eventsContainer.className = 'day-events-container';

      const maxShow = 3;
      const visibleEvents = dayEvents.slice(0, maxShow);
      const extraCount = dayEvents.length - maxShow;

      visibleEvents.forEach(evt => {
        const item = document.createElement('div');
        const hallStr = safeStr(evt.hallName);
        
        let hallBadgeClass = 'hall-ofoq-badge';
        if (hallStr.includes('ديـــوان')) hallBadgeClass = 'hall-diwan-badge';
        else if (hallStr.includes('ســديم')) hallBadgeClass = 'hall-sadeem-badge';
        else if (hallStr.includes('المركز كلياً')) hallBadgeClass = 'hall-full-badge';

        item.className = `public-cal-event-item ${hallBadgeClass}`;

        const shortHallName = getCleanHallName(hallStr);
        const start12h = formatTime12h(evt.startTime);
        const end12h = formatTime12h(evt.endTime);

        item.innerHTML = `
          <div class="public-event-header">
            <span class="event-hall"><i class="fa-solid fa-door-closed"></i> ${shortHallName}</span>
            <span class="event-type-badge">${evt.eventType}</span>
          </div>
          <div class="public-event-title"><span class="event-dot">●</span> ${start12h} ${evt.eventTitle}</div>
          <div class="public-event-executor"><i class="fa-solid fa-building-flag"></i> ${evt.executorName} (👥 ${evt.attendeesCount})</div>
          <div class="public-event-time"><i class="fa-solid fa-clock"></i> ${start12h} - ${end12h}</div>
        `;

        eventsContainer.appendChild(item);
      });

      if (extraCount > 0) {
        const extraBtn = document.createElement('div');
        extraBtn.className = 'cal-extra-events-tag';
        extraBtn.innerHTML = `+ ${extraCount} إضافية`;
        extraBtn.onclick = () => openStatDetailModal('accepted');
        eventsContainer.appendChild(extraBtn);
      }

      cell.appendChild(eventsContainer);
    }

    gridEl.appendChild(cell);
  }

  // 3. Next Month Days Padding to complete full 35 or 42 cells (Google Calendar Style)
  const totalRendered = firstDay + daysInMonth;
  const targetTotalGrid = totalRendered > 35 ? 42 : 35;
  const remainingCells = targetTotalGrid - totalRendered;

  for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month-cell';
    
    let dayText = String(dayNum);
    if (dayNum === 1) {
      const nextMonthIdx = (month + 1) % 12;
      dayText = `1 ${mNames[nextMonthIdx]}`;
    }

    cell.innerHTML = `<div class="day-cell-top"><span class="cal-day-number muted-day-num">${dayText}</span></div>`;
    gridEl.appendChild(cell);
  }
}

// --- ADMIN INTERACTIVE CALENDAR WITH EDIT & ADD ACCESS ---
function changeCalendarMonth(delta) {
  // Always reset day to 1 before changing month to prevent 31st overflow skipping bug
  const targetYear = currentCalendarDate.getFullYear();
  const targetMonth = currentCalendarDate.getMonth() + delta;
  currentCalendarDate = new Date(targetYear, targetMonth, 1);
  renderCalendarView();
}

function resetAdminCalendarToToday() {
  currentCalendarDate = new Date();
  currentCalendarDate.setDate(1);
  renderCalendarView();
}

function renderCalendarView() {
  const gridEl = document.getElementById('calendar-grid-days');
  const titleEl = document.getElementById('calendar-month-title');

  if (!gridEl || !titleEl) return;

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const monthNamesTr = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let mNames = monthNamesAr;
  if (currentLang === 'tr') mNames = monthNamesTr;
  else if (currentLang === 'en') mNames = monthNamesEn;

  titleEl.innerText = `${mNames[month]} ${year}`;

  const rawFirstDay = new Date(year, month, 1).getDay();
  const firstDay = (rawFirstDay + 6) % 7; // Monday = 0 (Turkish & European Standard - ISO 8601)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  gridEl.innerHTML = '';

  // 1. Previous Month Days Padding
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month-cell';
    cell.innerHTML = `<div class="day-cell-top"><span class="cal-day-number muted-day-num">${dayNum}</span></div>`;
    gridEl.appendChild(cell);
  }

  // 2. Current Month Days
  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${monthStr}-${dayStr}`;

    const cell = document.createElement('div');
    cell.className = 'cal-day-cell';

    const isToday = (year === todayY && month === todayM && day === todayD);
    if (isToday) cell.classList.add('today-cell');

    const dayEvents = bookings.filter(b => b.startDate === dateString);
    const dayTotalAttendees = dayEvents.filter(b => b.status === 'accepted').reduce((sum, b) => sum + safeNum(b.attendeesCount), 0);

    const dayNumHtml = isToday 
      ? `<span class="cal-day-number today-badge">${day}</span>` 
      : `<span class="cal-day-number">${day}</span>`;

    let cellTopHtml = `<div class="day-cell-top">${dayNumHtml}`;
    if (dayEvents.length > 0) {
      cellTopHtml += `<span class="day-attendees-badge">👥 ${dayTotalAttendees}</span>`;
    }
    cellTopHtml += `</div>`;

    cell.innerHTML = cellTopHtml;

    if (dayEvents.length > 0) {
      const eventsContainer = document.createElement('div');
      eventsContainer.className = 'day-events-container';

      dayEvents.forEach(evt => {
        const item = document.createElement('div');
        item.className = `cal-event-item ${evt.status}`;
        const start12h = formatTime12h(evt.startTime);
        const shortHallName = getCleanHallName(evt.hallName);

        item.innerHTML = `
          <span><span class="event-dot">●</span> ${start12h} ${evt.eventTitle} (${shortHallName})</span>
          <i class="fa-solid fa-pen-to-square" style="font-size: 0.7rem;"></i>
        `;
        item.onclick = (e) => {
          e.stopPropagation();
          openEditModal(evt.id);
        };
        eventsContainer.appendChild(item);
      });

      cell.appendChild(eventsContainer);
    }

    gridEl.appendChild(cell);
  }

  // 3. Next Month Days Padding
  const totalRendered = firstDay + daysInMonth;
  const targetTotalGrid = totalRendered > 35 ? 42 : 35;
  const remainingCells = targetTotalGrid - totalRendered;

  for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month-cell';
    
    let dayText = String(dayNum);
    if (dayNum === 1) {
      const nextMonthIdx = (month + 1) % 12;
      dayText = `1 ${mNames[nextMonthIdx]}`;
    }

    cell.innerHTML = `<div class="day-cell-top"><span class="cal-day-number muted-day-num">${dayText}</span></div>`;
    gridEl.appendChild(cell);
  }
}

// --- EDIT & MANUAL CALENDAR BOOKING MODAL ---
function openEditModal(bookingId) {
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return;

  document.getElementById('editBookingId').value = booking.id;
  document.getElementById('editTitle').value = booking.eventTitle;
  document.getElementById('editOrganizer').value = booking.organizerName;
  document.getElementById('editExecutor').value = booking.executorName;
  document.getElementById('editHall').value = booking.hallName;
  document.getElementById('editStatus').value = booking.status;
  document.getElementById('editStartDate').value = booking.startDate;
  document.getElementById('editAttendees').value = booking.attendeesCount;
  document.getElementById('editFeeAmount').value = booking.feeAmount || (booking.isPaidEvent === 'نعم' ? 'تحدد لاحقاً بالليرة التركية (TL)' : '0 TL (نشاط مجاني)');
  document.getElementById('editStartTime').value = booking.startTime;
  document.getElementById('editEndTime').value = booking.endTime;

  document.getElementById('edit-modal-title').innerHTML = `<i class="fa-solid fa-pen-to-square"></i> تعديل حجز (${booking.id})`;
  document.getElementById('edit-event-modal').style.display = 'flex';
}

function openManualCalendarModal() {
  const newId = 'MJR-' + (Math.floor(1000 + Math.random() * 9000));
  document.getElementById('editBookingId').value = newId;
  document.getElementById('editTitle').value = '';
  document.getElementById('editOrganizer').value = '';
  document.getElementById('editExecutor').value = '';
  document.getElementById('editHall').value = 'قاعة أفــُـق (سعة القاعة 20)';
  document.getElementById('editStatus').value = 'accepted';
  document.getElementById('editStartDate').value = getTodayISO();
  document.getElementById('editAttendees').value = 10;
  document.getElementById('editFeeAmount').value = '0 TL (نشاط مجاني)';
  document.getElementById('editStartTime').value = '10:00';
  document.getElementById('editEndTime').value = '12:00';

  document.getElementById('edit-modal-title').innerHTML = `<i class="fa-solid fa-plus-circle"></i> إضافة حجز يدوي مباشر`;
  document.getElementById('edit-event-modal').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('edit-event-modal').style.display = 'none';
}

async function saveEditEvent(event) {
  event.preventDefault();
  const id = document.getElementById('editBookingId').value;
  let booking = bookings.find(b => b.id === id);

  const payload = {
    id: id,
    eventTitle: document.getElementById('editTitle').value,
    organizerName: document.getElementById('editOrganizer').value,
    executorName: document.getElementById('editExecutor').value,
    hallName: document.getElementById('editHall').value,
    status: document.getElementById('editStatus').value,
    startDate: document.getElementById('editStartDate').value,
    endDate: document.getElementById('editStartDate').value,
    attendeesCount: safeNum(document.getElementById('editAttendees').value) || 1,
    feeAmount: document.getElementById('editFeeAmount').value || '0 TL (نشاط مجاني)',
    startTime: document.getElementById('editStartTime').value,
    endTime: document.getElementById('editEndTime').value
  };

  const token = localStorage.getItem('adminToken') || localStorage.getItem('superAdminToken');

  if (booking) {
    Object.assign(booking, payload);
    if (token) {
      try {
        await fetch(`/api/admin/bookings/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('API update fallback:', e);
      }
    }
  } else {
    booking = {
      ...payload,
      whatsappNumber: siteSettings.adminPhone || '+905385062989',
      email: 'admin@majarra.org',
      entityType: 'منظمة غير ربحية',
      eventType: 'فعالية',
      eventDescription: 'حجز يدوي مضاف عن طريق لوحة التحكم.',
      equipment: ['بروجكتر', 'كراسي'],
      isSponsored: 'نعم',
      isPaidEvent: 'لا',
      packageType: 'كفو',
      additionalService: 'بدون خدمات إضافية',
      createdAt: new Date().toISOString()
    };
    bookings.push(booking);

    if (token) {
      try {
        await fetch('/api/admin/manual-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(booking)
        });
      } catch (e) {
        console.warn('API manual booking fallback:', e);
      }
    }
  }

  syncCalendarViewToDate(booking.startDate);
  saveBookingsToStorage();
  closeEditModal();
  alert('تم حفظ التعديلات وحفظ الحجز بالتقويم بنجاح!');
}

// --- BOOKINGS TABLE & STATUS MANAGEMENT ---
function renderBookingsTable() {
  const tbody = document.getElementById('bookingsTableBody');
  const searchVal = document.getElementById('admin-search-input') ? safeLower(document.getElementById('admin-search-input').value.trim()) : '';
  const statusFilter = document.getElementById('status-filter') ? document.getElementById('status-filter').value : 'all';
  const hallFilter = document.getElementById('hall-filter') ? document.getElementById('hall-filter').value : 'all';

  if (!tbody) return;

  tbody.innerHTML = '';

  let filtered = bookings.filter(b => {
    const matchSearch = !searchVal || 
      safeLower(b.organizerName).includes(searchVal) ||
      safeLower(b.executorName).includes(searchVal) ||
      safeLower(b.eventTitle).includes(searchVal) ||
      safeLower(b.id).includes(searchVal);

    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchHall = hallFilter === 'all' || b.hallName === hallFilter;

    return matchSearch && matchStatus && matchHall;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-inbox" style="font-size: 2.2rem; margin-bottom: 10px; display: block;"></i>
          لا توجد حجوزات مطابقة لمعايير البحث حالياً
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(b => {
    const tr = document.createElement('tr');
    
    let statusBadge = '<span class="badge badge-pending"><i class="fa-solid fa-hourglass-half"></i> قيد المراجعة</span>';
    if (b.status === 'accepted') {
      statusBadge = '<span class="badge badge-accepted"><i class="fa-solid fa-circle-check"></i> مقبول ومؤكد بالتقويم</span>';
    } else if (b.status === 'rejected') {
      statusBadge = '<span class="badge badge-rejected"><i class="fa-solid fa-circle-xmark"></i> مرفوض</span>';
    }

    const cleanPhone = safeStr(b.whatsappNumber).replace(/[^0-9+]/g, '');
    const waMessage = encodeURIComponent(`مرحباً ${b.organizerName}، بخصوص طلب حجزكم لـ (${b.eventTitle}) في مركز مجرة المجتمعي...`);

    const feeBadgeClass = b.isPaidEvent === 'نعم' || safeStr(b.feeAmount).includes('تحدد') 
      ? 'background: rgba(239, 68, 68, 0.15); color: var(--accent-rose); border: 1px solid rgba(239, 68, 68, 0.3);' 
      : 'background: rgba(232, 198, 119, 0.15); color: var(--brand-gold); border: 1px solid rgba(232, 198, 119, 0.3);';

    const cleanHall = getCleanHallName(b.hallName);
    const start12h = formatTime12h(b.startTime);
    const end12h = formatTime12h(b.endTime);

    tr.innerHTML = `
      <td><span class="booking-id-pill">#${b.id}</span></td>
      <td>
        <div style="font-weight: 800; color: var(--text-primary); font-size: 0.92rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px;">${b.organizerName}</div>
        <small style="color: var(--text-muted); font-weight: 600; white-space: nowrap;">${b.executorName || b.organizerName}</small>
      </td>
      <td>
        <div style="font-weight: 800; color: var(--text-primary); font-size: 0.92rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${b.eventTitle}</div>
        <small style="color: var(--brand-purple); font-weight: 700;">👥 ${b.attendeesCount} شخص</small>
      </td>
      <td>
        <span class="badge" style="background: rgba(138, 111, 178, 0.18); color: var(--brand-purple); border: 1px solid rgba(138, 111, 178, 0.4); font-weight: 800;"><i class="fa-solid fa-door-closed"></i> ${cleanHall}</span>
      </td>
      <td>
        <div style="font-weight: 800; color: var(--brand-gold); font-size: 0.85rem;"><i class="fa-solid fa-calendar-day"></i> ${b.startDate}</div>
        <small style="color: var(--text-secondary); font-weight: 700;">${start12h} - ${end12h}</small>
      </td>
      <td>
        <div style="margin-bottom: 4px;"><span class="badge" style="${feeBadgeClass}">${b.feeAmount || '0 TL'}</span></div>
        <a href="https://wa.me/${cleanPhone}?text=${waMessage}" target="_blank" class="btn btn-outline btn-sm" style="color: #25D366; border-color: #25D366; font-weight: 800; padding: 2px 8px; font-size: 0.8rem;" title="فتح محادثة الواتساب المباشرة">
          <i class="fa-brands fa-whatsapp"></i> الواتساب
        </a>
      </td>
      <td>${statusBadge}</td>
      <td>
        <div class="action-btn-group">
          <button class="btn btn-primary btn-sm" style="background: linear-gradient(135deg, var(--brand-purple), #7457a0); color: white; font-weight: 800;" onclick="showBookingDetailsModal('${b.id}')" title="عرض تفاصيل الحجز الشاملة"><i class="fa-solid fa-circle-info"></i> التفاصيل</button>
          ${b.status === 'pending' ? `
            <button class="btn btn-sm" style="background: #10b981; color: white; font-weight: 800;" onclick="updateBookingStatus('${b.id}', 'accepted')" title="قبول الطلب وتثبيته بالتقويم"><i class="fa-solid fa-check"></i> قبول</button>
            <button class="btn btn-sm" style="background: #ef4444; color: white; font-weight: 800;" onclick="updateBookingStatus('${b.id}', 'rejected')" title="رفض الطلب"><i class="fa-solid fa-xmark"></i></button>
          ` : ''}
          <button class="btn btn-outline btn-sm" onclick="openEditModal('${b.id}')" title="تعديل التفاصيل"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-outline btn-sm" onclick="showTicketModal('${b.id}')" title="عرض وطباعة الإيصال الرقمي"><i class="fa-solid fa-receipt"></i></button>
          <button class="btn btn-outline btn-sm" style="color: var(--accent-rose);" onclick="deleteBooking('${b.id}')" title="حذف الحجز"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- FULL BOOKING DETAILS MODAL LOGIC ---
function showBookingDetailsModal(id) {
  const b = bookings.find(item => item.id === id);
  if (!b) return;

  document.getElementById('dtl-booking-id').innerText = `#${b.id}`;
  
  const cleanHall = getCleanHallName(b.hallName);
  const start12h = formatTime12h(b.startTime);
  const end12h = formatTime12h(b.endTime);

  document.getElementById('dtl-organizer-name').innerText = b.organizerName || '-';
  document.getElementById('dtl-entity-type').innerText = b.entityType || 'فرد';
  document.getElementById('dtl-executor-name').innerText = b.executorName || b.organizerName;
  
  const cleanPhone = safeStr(b.whatsappNumber).replace(/[^0-9+]/g, '');
  const waMessage = encodeURIComponent(`مرحباً ${b.organizerName}، بخصوص طلب حجزكم لـ (${b.eventTitle}) في مركز مجرة المجتمعي...`);
  
  const waBtn = document.getElementById('dtl-whatsapp-link');
  if (waBtn) {
    waBtn.href = `https://wa.me/${cleanPhone}?text=${waMessage}`;
    document.getElementById('dtl-phone-val').innerText = b.whatsappNumber || '-';
  }
  
  document.getElementById('dtl-email').innerText = b.email || '-';

  document.getElementById('dtl-hall-name').innerText = cleanHall;
  document.getElementById('dtl-start-date').innerText = b.startDate || '-';
  document.getElementById('dtl-time-range').innerText = `${start12h} - ${end12h}`;
  document.getElementById('dtl-attendees').innerText = `${b.attendeesCount || 0} شخص`;
  document.getElementById('dtl-package-type').innerText = b.packageType || 'كفو';
  document.getElementById('dtl-fee-amount').innerText = b.feeAmount || '0 TL (مجاني)';

  document.getElementById('dtl-event-title').innerText = b.eventTitle || '-';
  document.getElementById('dtl-event-description').innerText = b.eventDescription || 'لا يوجد وصف تفصيلي مكتوب.';

  // Equipment tags
  const eqContainer = document.getElementById('dtl-equipment-tags');
  if (eqContainer) {
    const eqList = b.equipment ? (Array.isArray(b.equipment) ? b.equipment : b.equipment.split(',')) : [];
    if (b.extraEquipmentNeeds) eqList.push(b.extraEquipmentNeeds);

    if (eqList.length === 0) {
      eqContainer.innerHTML = '<span style="color: var(--text-muted); font-size: 0.85rem;">لا توجد معدات إضافية مطلوبة.</span>';
    } else {
      eqContainer.innerHTML = eqList.map(eq => `<span class="badge" style="background: rgba(138, 111, 178, 0.15); color: var(--brand-purple); border: 1px solid rgba(138, 111, 178, 0.3);"><i class="fa-solid fa-check"></i> ${eq.trim()}</span>`).join('');
    }
  }

  // Status Badge
  let statusHtml = '<span class="badge badge-pending"><i class="fa-solid fa-hourglass-half"></i> قيد المراجعة</span>';
  if (b.status === 'accepted') {
    statusHtml = '<span class="badge badge-accepted"><i class="fa-solid fa-circle-check"></i> مقبول ومؤكد بالتقويم</span>';
  } else if (b.status === 'rejected') {
    statusHtml = '<span class="badge badge-rejected"><i class="fa-solid fa-circle-xmark"></i> مرفوض</span>';
  }
  document.getElementById('dtl-status-badge').innerHTML = statusHtml;

  // Actions Bar
  const actionsBar = document.getElementById('dtl-actions-bar');
  if (actionsBar) {
    actionsBar.innerHTML = `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${b.status === 'pending' ? `
          <button class="btn btn-sm" style="background: #10b981; color: white; font-weight: 800;" onclick="closeBookingDetailsModal(); updateBookingStatus('${b.id}', 'accepted');"><i class="fa-solid fa-check"></i> قبول والحفظ بالتقويم</button>
          <button class="btn btn-sm" style="background: #ef4444; color: white; font-weight: 800;" onclick="closeBookingDetailsModal(); updateBookingStatus('${b.id}', 'rejected');"><i class="fa-solid fa-xmark"></i> رفض الطلب</button>
        ` : ''}
        <button class="btn btn-outline btn-sm" style="color: #25D366; border-color: #25D366;" onclick="closeBookingDetailsModal(); sendWhatsAppStatusNotice('${b.id}');"><i class="fa-brands fa-whatsapp"></i> مراسلة واتساب</button>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-primary btn-sm" onclick="closeBookingDetailsModal(); showTicketModal('${b.id}');"><i class="fa-solid fa-receipt"></i> طباعة الإيصال</button>
        <button class="btn btn-outline btn-sm" onclick="closeBookingDetailsModal(); openEditModal('${b.id}');"><i class="fa-solid fa-pen"></i> تعديل التفاصيل</button>
      </div>
    `;
  }

  document.getElementById('booking-details-modal').style.display = 'flex';
}

function closeBookingDetailsModal() {
  document.getElementById('booking-details-modal').style.display = 'none';
}

function filterBookings() {
  renderBookingsTable();
}

async function updateBookingStatus(id, newStatus) {
  const booking = bookings.find(b => b.id === id);
  if (booking) {
    booking.status = newStatus;
    
    const token = localStorage.getItem('adminToken') || localStorage.getItem('superAdminToken');
    if (token) {
      try {
        await fetch(`/api/admin/bookings/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ status: newStatus })
        });
      } catch (e) {
        console.warn('API update status fallback:', e);
      }
    }

    // Automatically set calendar view date to the month & year of this booking
    syncCalendarViewToDate(booking.startDate);
    saveBookingsToStorage();

    if (newStatus === 'accepted') {
      if (confirm(`تم قبول الحجز (${id}) وتثبيته في التقويم بنجاح! 🎉\n\nهل ترغب في الانتقال فوراً لعرضه مباشرة داخل التقويم التفاعلي؟`)) {
        switchAdminSubTab('calendar');
      }
    } else {
      alert(`تم تحديث حالة الحجز (${id}) إلى: مرفوض`);
    }
  }
}

async function deleteBooking(id) {
  if (confirm(`هل تأكد حذف الحجز رقم (${id}) نهائياً؟`)) {
    bookings = bookings.filter(b => b.id !== id);

    const token = localStorage.getItem('adminToken') || localStorage.getItem('superAdminToken');
    if (token) {
      try {
        await fetch(`/api/admin/bookings/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        console.warn('API delete fallback:', e);
      }
    }

    saveBookingsToStorage();
  }
}

// --- DEDICATED ARCHIVE VIEW LOGIC ---
function renderArchiveView() {
  const tbody = document.getElementById('archiveTableBody');
  const searchVal = document.getElementById('archive-search-input') ? safeLower(document.getElementById('archive-search-input').value.trim()) : '';
  const yearFilter = document.getElementById('archive-year-filter') ? document.getElementById('archive-year-filter').value : 'all';
  const monthFilter = document.getElementById('archive-month-filter') ? document.getElementById('archive-month-filter').value : 'all';
  const statusFilter = document.getElementById('archive-status-filter') ? document.getElementById('archive-status-filter').value : 'all';

  if (!tbody) return;

  tbody.innerHTML = '';

  let filtered = bookings.filter(b => {
    const matchSearch = !searchVal || 
      safeLower(b.organizerName).includes(searchVal) ||
      safeLower(b.executorName).includes(searchVal) ||
      safeLower(b.eventTitle).includes(searchVal) ||
      safeLower(b.id).includes(searchVal);

    const dateParts = safeStr(b.startDate).split('-');
    const bYear = dateParts[0] || '2026';
    const bMonth = dateParts[1] || '09';

    const matchYear = yearFilter === 'all' || bYear === yearFilter;
    const matchMonth = monthFilter === 'all' || bMonth === monthFilter;
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchSearch && matchYear && matchMonth && matchStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-box-archive" style="font-size: 2.2rem; margin-bottom: 10px; display: block; color: var(--brand-gold);"></i>
          لا توجد سجلات مؤرشفة مطابقة لمعايير التصفية المختارة
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(b => {
    const tr = document.createElement('tr');
    
    let statusBadge = '<span class="badge badge-pending">معلق</span>';
    if (b.status === 'accepted') statusBadge = '<span class="badge badge-accepted">مقبول بالتقويم</span>';
    else if (b.status === 'rejected') statusBadge = '<span class="badge badge-rejected">مرفوض</span>';

    tr.innerHTML = `
      <td><strong style="color: var(--brand-gold);">${b.id}</strong></td>
      <td>
        <div><strong>${b.organizerName}</strong></div>
        <small style="color: var(--text-muted);">${b.executorName}</small>
      </td>
      <td>
        <div><strong>${b.eventTitle}</strong></div>
        <small style="color: var(--brand-purple);">${b.eventType}</small>
      </td>
      <td>
        <div>${safeStr(b.hallName).split(' ')[0]}</div>
        <small style="color: var(--brand-peach);">باقة: ${b.packageType}</small>
      </td>
      <td>
        <div>${b.startDate}</div>
        <small style="color: var(--text-muted);">${b.startTime} - ${b.endTime}</small>
      </td>
      <td><strong style="color: var(--brand-gold);">${b.feeAmount || '0 TL'}</strong></td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="showTicketModal('${b.id}')"><i class="fa-solid fa-receipt"></i> الإيصال الرقمي</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function exportArchiveToCSV() {
  exportBookingsToCSV();
}

// --- DYNAMIC ARABIC DATE DROPDOWN SYNC (DAY / MONTH / YEAR) ---
function syncCustomDatePicker() {
  const dayEl = document.getElementById('eventDay');
  const monthEl = document.getElementById('eventMonth');
  const yearEl = document.getElementById('eventYear');
  const startEl = document.getElementById('startDate');
  const endEl = document.getElementById('endDate');

  if (!dayEl || !monthEl || !yearEl || !startEl) return;

  const day = dayEl.value;
  const month = monthEl.value;
  const year = yearEl.value;

  const dateStr = `${year}-${month}-${day}`;
  startEl.value = dateStr;
  if (endEl) endEl.value = dateStr;
}

// --- BOOKING FORM SUBMISSION & LIVE CONFLICT DETECTION ---
function selectHallAndBook(hallName) {
  document.getElementById('selectedHallText').innerText = hallName;
  document.getElementById('hallName').value = hallName;
  
  // Set today's date in custom day/month/year dropdowns
  const todayParts = getTodayISO().split('-'); // ['2026', '08', '31']
  if (todayParts.length === 3) {
    const dayEl = document.getElementById('eventDay');
    const monthEl = document.getElementById('eventMonth');
    const yearEl = document.getElementById('eventYear');
    if (dayEl) dayEl.value = todayParts[2];
    if (monthEl) monthEl.value = todayParts[1];
    if (yearEl) yearEl.value = todayParts[0];
  }

  syncCustomDatePicker();

  document.getElementById('startTime').value = '10:00';
  document.getElementById('endTime').value = '13:00';

  validateBookingLive();
  updateBookingFeesDisplay();
  
  document.getElementById('booking-form-modal').style.display = 'flex';
}

function closeBookingModal() {
  document.getElementById('booking-form-modal').style.display = 'none';
}

function syncEndTimeDropdown() {
  const startEl = document.getElementById('startTime');
  const endEl = document.getElementById('endTime');
  if (!startEl || !endEl) return;

  const startVal = startEl.value;
  const startH = parseInt(startVal.split(':')[0], 10);
  
  if (!isNaN(startH)) {
    let defaultEndH = startH + 3; // Default 3-hour duration
    if (defaultEndH > 23) defaultEndH = 23;
    const endStr = String(defaultEndH).padStart(2, '0') + ':00';
    
    const optionToSelect = Array.from(endEl.options).find(opt => opt.value === endStr);
    if (optionToSelect) {
      endEl.value = endStr;
    }
  }
}

function validateBookingLive() {
  const hallName = document.getElementById('hallName').value;
  const startDate = document.getElementById('startDate').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const attendeesCount = safeNum(document.getElementById('attendeesCount').value);
  const submitBtn = document.querySelector('#booking-form-modal form button[type="submit"]');

  const statusBox = document.getElementById('live-check-box');
  if (!statusBox) return;

  const maxCap = HALL_CAPACITIES[hallName] || 30;

  if (attendeesCount > maxCap) {
    statusBox.className = 'live-status-box danger';
    statusBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> تنبيه: عدد الحضور المتوقع (${attendeesCount}) يتجاوز سعة القاعة القصوى (${maxCap} شخص).`;
    if (submitBtn) submitBtn.disabled = true;
    return false;
  }

  // Calculate Duration
  let durationText = '';
  if (startTime && endTime) {
    const startH = parseInt(startTime.split(':')[0], 10);
    const endH = parseInt(endTime.split(':')[0], 10);
    const diff = endH - startH;
    if (diff > 0) {
      durationText = ` (⏱️ مدة الفعالية: ${diff} ساعات)`;
    } else if (diff <= 0) {
      statusBox.className = 'live-status-box danger';
      statusBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> خطأ: يجب أن يكون وقت الانتهاء بعد وقت البدء.`;
      if (submitBtn) submitBtn.disabled = true;
      return false;
    }
  }

  if (startDate && startTime && endTime) {
    const conflictBooking = bookings.find(b => {
      if (b.status === 'accepted' && b.hallName === hallName && b.startDate === startDate) {
        return (startTime < b.endTime && endTime > b.startTime);
      }
      return false;
    });

    if (conflictBooking) {
      statusBox.className = 'live-status-box danger';
      statusBox.innerHTML = `
        <div style="font-weight: 800; font-size: 1rem; color: #ff5252; margin-bottom: 4px;">
          <i class="fa-solid fa-ban"></i> ⚠️ هذه القاعة محجوزة ومغلقة في هذا التوقيت بالتحديد!
        </div>
        <div>
          النشاط المحجوز بالتقويم: <strong>"${conflictBooking.eventTitle}"</strong> (${formatTime12h(conflictBooking.startTime)} إلى ${formatTime12h(conflictBooking.endTime)}).
          <br>
          <span style="text-decoration: underline;">يرجى تغيير التوقيت أو اختيار قاعة أخرى لتتمكن من الحجز.</span> ${durationText}
        </div>
      `;
      if (submitBtn) submitBtn.disabled = true;
      return false;
    }
  }

  if (submitBtn) submitBtn.disabled = false;
  statusBox.className = 'live-status-box success';
  statusBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> القاعة والتوقيت متاحان تماماً للحجز! وسعة القاعة مناسبة (${attendeesCount}/${maxCap}).${durationText}`;
  return true;
}

// ASYNC PUBLIC BOOKING SUBMISSION TO API & TICKET VOUCHER RENDER
async function handleBookingSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const isPaidRadio = document.querySelector('input[name="isPaidEvent"]:checked');
  const isPaid = isPaidRadio ? isPaidRadio.value : 'لا';
  const isSponsoredRadio = document.querySelector('input[name="isSponsored"]:checked');
  const isSponsored = isSponsoredRadio ? isSponsoredRadio.value : 'لا';

  const feeText = isPaid === 'نعم' ? 'تحدد لاحقاً بالليرة التركية (TL)' : '0 TL (نشاط مجاني)';

  const formData = {
    organizerName: document.getElementById('organizerName').value,
    whatsappNumber: document.getElementById('whatsappNumber').value,
    email: document.getElementById('email').value,
    entityType: document.getElementById('entityType').value,
    executorName: document.getElementById('executorName').value,
    eventType: document.getElementById('eventType').value,
    hallName: document.getElementById('hallName').value,
    eventTitle: document.getElementById('eventTitle').value,
    eventDescription: document.getElementById('eventDescription').value,
    attendeesCount: safeNum(document.getElementById('attendeesCount').value) || 1,
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value || document.getElementById('startDate').value,
    startTime: document.getElementById('startTime').value,
    endTime: document.getElementById('endTime').value,
    equipment: Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(cb => cb.value),
    extraEquipmentNeeds: document.getElementById('extraEquipmentNeeds') ? document.getElementById('extraEquipmentNeeds').value : '',
    isSponsored: isSponsored,
    isPaidEvent: isPaid,
    feeAmount: feeText,
    packageType: document.getElementById('packageType').value,
    additionalService: document.getElementById('additionalService').value
  };

  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    if (result.success && result.bookingData) {
      const fullBooking = { ...formData, ...result.bookingData };
      bookings.unshift(fullBooking);
      syncCalendarViewToDate(fullBooking.startDate);
      saveBookingsToStorage();

      closeBookingModal();
      showTicketModal(fullBooking);
      return;
    }
  } catch (err) {
    console.warn('API post booking fallback:', err);
  }

  // Fallback if offline / static mode
  const localId = 'MJR-' + Math.floor(1000 + Math.random() * 9000);
  const localBooking = { id: localId, status: 'pending', createdAt: new Date().toISOString(), ...formData };
  bookings.unshift(localBooking);
  syncCalendarViewToDate(localBooking.startDate);
  saveBookingsToStorage();

  closeBookingModal();
  showTicketModal(localBooking);
}

// --- HIGH-ELEGANCE OFFICIAL BRANDED RECEIPT VOUCHER ---
let activeTicketBooking = null;

function showTicketModal(bookingDataOrId) {
  let booking;
  if (typeof bookingDataOrId === 'object' && bookingDataOrId !== null) {
    booking = bookingDataOrId;
  } else {
    booking = bookings.find(b => b.id === bookingDataOrId);
  }
  if (!booking) return;

  activeTicketBooking = booking;

  document.getElementById('ticket-booking-id').innerText = booking.id || 'MJR-1001';
  document.getElementById('ticket-client-name').innerText = `${booking.organizerName || 'مسؤول'} (${booking.executorName || 'جهة'})`;
  document.getElementById('ticket-event-title').innerText = booking.eventTitle || 'عنوان النشاط';
  document.getElementById('ticket-hall-name').innerText = booking.hallName || 'القاعة';
  document.getElementById('ticket-date-time').innerText = `${booking.startDate || ''} | ${booking.startTime || ''} - ${booking.endTime || ''}`;
  document.getElementById('ticket-package-info').innerText = `باقة ${booking.packageType || 'كفو'} | ${booking.additionalService || 'بدون خدمات إضافية'}`;
  document.getElementById('ticket-attendees').innerText = `${booking.attendeesCount || 1} شخص`;

  const feeEl = document.getElementById('ticket-fee-amount');
  if (feeEl) {
    feeEl.innerText = booking.feeAmount || '0 TL (نشاط مجاني)';
    if (booking.isPaidEvent === 'نعم' || safeStr(booking.feeAmount).includes('تحدد')) {
      feeEl.style.color = 'var(--accent-rose)';
    } else {
      feeEl.style.color = 'var(--brand-gold)';
    }
  }

  const badgeEl = document.getElementById('ticket-status-badge');
  if (booking.status === 'accepted') {
    badgeEl.className = 'ticket-status-badge';
    badgeEl.style.color = 'var(--accent-emerald)';
    badgeEl.style.borderColor = 'var(--accent-emerald)';
    badgeEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> مؤكد ومقبول بالتقويم';
  } else if (booking.status === 'rejected') {
    badgeEl.className = 'ticket-status-badge';
    badgeEl.style.color = 'var(--accent-rose)';
    badgeEl.style.borderColor = 'var(--accent-rose)';
    badgeEl.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> طلب مرفوض';
  } else {
    badgeEl.className = 'ticket-status-badge';
    badgeEl.style.color = 'var(--brand-gold)';
    badgeEl.style.borderColor = 'var(--brand-gold)';
    badgeEl.innerHTML = '<i class="fa-solid fa-hourglass-half"></i> قيد التدقيق والمراجعة';
  }

  document.getElementById('ticket-modal').style.display = 'flex';
}

// --- GOOGLE CALENDAR SYNC LINK GENERATOR ---
function addEventToGoogleCalendar() {
  if (!activeTicketBooking) return;
  const b = activeTicketBooking;

  const startDateClean = (b.startDate || '2026-09-01').replace(/-/g, '');
  const startTimeClean = (b.startTime || '10:00').replace(/:/g, '') + '00';
  const endTimeClean = (b.endTime || '12:00').replace(/:/g, '') + '00';

  const startIso = `${startDateClean}T${startTimeClean}`;
  const endIso = `${startDateClean}T${endTimeClean}`;

  const title = encodeURIComponent(`فعالية: ${b.eventTitle} - ${b.hallName}`);
  const details = encodeURIComponent(`حجز معتمد في مركز مجرة المجتمعي\nرقم الحجز: ${b.id}\nالمسؤول: ${b.organizerName}\nالجهة: ${b.executorName}`);
  const location = encodeURIComponent('مركز مجرّة المجتمعي - Majarra Community Center');

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  window.open(gcalUrl, '_blank');
}

// --- WHATSAPP DIRECT MESSAGE BUILDER ---
function sendClientWhatsAppConfirmation() {
  if (!activeTicketBooking) return;
  const b = activeTicketBooking;
  const adminPhone = safeStr(siteSettings.adminPhone || '+905385062989').replace(/[^0-9]/g, '');

  const text = `مرحباً إدارة مركز مجرة المجتمعي👋✨\n\nقمت للتو بتقديم طلب حجز رقم (#${b.id}).\n\n📌 *تفاصيل طلب الحجز*:\n- *المسؤول*: ${b.organizerName}\n- *الجهة*: ${b.executorName}\n- *القاعة*: ${b.hallName}\n- *عنوان النشاط*: ${b.eventTitle}\n- *التاريخ*: ${b.startDate}\n- *التوقيت*: ${formatTime12h(b.startTime)} إلى ${formatTime12h(b.endTime)}\n\nأرجو متابعة واعتماد الطلب، وشكراً لكم! 🌸`;

  const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}

function handleEntityTypeChange() {
  const entityTypeEl = document.getElementById('entityType');
  const executorNameEl = document.getElementById('executorName');
  const organizerNameEl = document.getElementById('organizerName');

  if (entityTypeEl && executorNameEl) {
    if (entityTypeEl.value === 'فرد مستقل' && (!executorNameEl.value || executorNameEl.value.includes('نشاط فردي'))) {
      executorNameEl.value = organizerNameEl && organizerNameEl.value ? `نشاط فردي (${organizerNameEl.value})` : 'نشاط فردي';
    }
  }
}

function sendWhatsAppStatusNotice(bookingId) {
  const b = bookings.find(item => item.id === bookingId);
  if (!b) return;

  const cleanPhone = safeStr(b.whatsappPhone).replace(/[^0-9]/g, '');
  if (!cleanPhone) {
    Toast.show('error', 'رقم الواتساب غير متوفر لهذا الحجز');
    return;
  }

  let text = '';
  if (b.status === 'accepted') {
    text = `مرحباً ${b.organizerName}👋✨\n\nيسعدنا إعلامكم بأنه تم *قبول وتثبيت طلب حجزكم* رقم (#${b.id}) في مركز مجرة المجتمعي! 🎉\n\n📌 *تفاصيل الفعالية*:\n- *عنوان النشاط*: ${b.eventTitle}\n- *القاعة*: ${b.hallName}\n- *التاريخ*: ${b.startDate}\n- *التوقيت*: ${formatTime12h(b.startTime)} إلى ${formatTime12h(b.endTime)}\n\nنتمنى لكم نشاطاً موفقاً وناجحاً! 🌟`;
  } else if (b.status === 'rejected') {
    text = `مرحباً ${b.organizerName}👋\n\nنود إعلامكم بتعذر قبول طلب حجزكم رقم (#${b.id}) لقاعة ${b.hallName} بتاريخ ${b.startDate} نظراً لعدم توفر المساحة في هذا التوقيت.\n\nيسعدنا تواصلكم وتنسيق موعد آخر يناسبكم! 🌸`;
  } else {
    text = `مرحباً ${b.organizerName}👋\n\nطلب حجزكم رقم (#${b.id}) لقاعة ${b.hallName} بتاريخ ${b.startDate} قيد المراجعة والتدقيق الإداري وسيتم إبلاغكم بالنتيجة قريباً. ✨`;
  }

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}

function closeTicketModal() {
  document.getElementById('ticket-modal').style.display = 'none';
}

function printTicket() {
  window.print();
}

// --- CSV EXPORT UTILITY ---
function exportBookingsToCSV() {
  if (bookings.length === 0) {
    alert('لا توجد بيانات حجوزات للتصدير.');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,\uFEFF'; // UTF-8 BOM for Arabic Excel
  csvContent += 'رقم الحجز,المسؤول,الجهة,القاعة,عنوان النشاط,التاريخ,التوقيت,عدد الحضور,الرسوم (TL),الباقة,الحالة\n';

  bookings.forEach(b => {
    const row = [
      b.id,
      `"${b.organizerName}"`,
      `"${b.executorName}"`,
      `"${b.hallName}"`,
      `"${b.eventTitle}"`,
      b.startDate,
      `"${b.startTime} - ${b.endTime}"`,
      b.attendeesCount,
      `"${b.feeAmount || '0 TL'}"`,
      b.packageType,
      b.status
    ].join(',');
    csvContent += row + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `majarra_bookings_${getTodayISO()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- THEME TOGGLE (DARK / LIGHT) ---
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  
  const icon = document.querySelector('#theme-toggle i');
  if (icon) {
    icon.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
}

// --- PUBLIC BOOKING TRACKER BY ID ---
function openTrackModal(prefillId = '') {
  document.getElementById('track-booking-modal').style.display = 'flex';
  const inputEl = document.getElementById('trackBookingIdInput');
  const resultBox = document.getElementById('track-result-box');
  if (resultBox) resultBox.style.display = 'none';
  if (inputEl) {
    if (prefillId) inputEl.value = prefillId;
    setTimeout(() => inputEl.focus(), 100);
  }
}

function closeTrackModal() {
  document.getElementById('track-booking-modal').style.display = 'none';
}

async function performBookingTracking() {
  const inputEl = document.getElementById('trackBookingIdInput');
  const resultBox = document.getElementById('track-result-box');
  if (!inputEl || !resultBox) return;

  const bookingId = inputEl.value.trim().toUpperCase();
  if (!bookingId) {
    Toast.show('error', 'يرجى إدخال رقم الحجز للبحث');
    return;
  }

  // Try API endpoint first
  let booking = null;
  try {
    const res = await fetch(`/api/bookings/track/${bookingId}`);
    const data = await res.json();
    if (data.success && data.booking) {
      booking = sanitizeBookingObject(data.booking);
    }
  } catch (err) {
    console.warn('API track fallback to local array:', err);
  }

  if (!booking) {
    booking = bookings.find(b => safeStr(b.id).toUpperCase() === bookingId);
  }

  if (!booking) {
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div class="alert-banner danger" style="margin: 0;">
        <i class="fa-solid fa-circle-xmark"></i> لم يتم العثور على أي حجز برقم (<strong>${bookingId}</strong>). يرجى التأكد من الرقم والمحاولة مجدداً.
      </div>
    `;
    return;
  }

  // Build Result Card
  let statusBadgeHtml = '';
  if (booking.status === 'accepted') {
    statusBadgeHtml = '<span class="badge badge-accepted" style="font-size: 0.92rem; padding: 6px 14px;"><i class="fa-solid fa-circle-check"></i> مقبول ومثبت في التقويم</span>';
  } else if (booking.status === 'rejected') {
    statusBadgeHtml = '<span class="badge badge-rejected" style="font-size: 0.92rem; padding: 6px 14px;"><i class="fa-solid fa-circle-xmark"></i> طلب مرفوض</span>';
  } else {
    statusBadgeHtml = '<span class="badge badge-pending" style="font-size: 0.92rem; padding: 6px 14px;"><i class="fa-solid fa-hourglass-half"></i> قيد التدقيق والمراجعة</span>';
  }

  const start12h = formatTime12h(booking.startTime);
  const end12h = formatTime12h(booking.endTime);

  resultBox.style.display = 'block';
  resultBox.innerHTML = `
    <div class="card" style="background: rgba(138, 111, 178, 0.08); border: 1px solid var(--brand-purple); border-radius: 12px; padding: 18px; margin: 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <strong style="font-size: 1.15rem; color: var(--brand-gold);"># ${booking.id}</strong>
        ${statusBadgeHtml}
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem; margin-bottom: 16px;">
        <div><strong>📌 عنوان النشاط:</strong> ${booking.eventTitle}</div>
        <div><strong>🚪 القاعة:</strong> ${booking.hallName}</div>
        <div><strong>👤 المسؤول والجهة:</strong> ${booking.organizerName} (${booking.executorName})</div>
        <div><strong>📅 التاريخ والوقت:</strong> ${booking.startDate} | ${start12h} - ${end12h}</div>
        <div><strong>👥 عدد الحضور:</strong> ${booking.attendeesCount} شخص</div>
        <div><strong>💰 الرسوم المقدرة:</strong> <span style="color: var(--brand-gold); font-weight: 800;">${booking.feeAmount || '0 TL'}</span></div>
      </div>

      <div style="display: flex; gap: 10px;">
        <button class="btn btn-primary full-width" onclick="closeTrackModal(); showTicketModal('${booking.id}');">
          <i class="fa-solid fa-receipt"></i> عرض وطباعة الإيصال الرقمي
        </button>
      </div>
    </div>
  `;
}
