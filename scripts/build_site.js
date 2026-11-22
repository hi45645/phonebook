const fs = require('fs');
const path = require('path');
const utils = require('./build_utils.js');
const {
  DEFAULT_LISTINGS,
  SITE_URL,
  ADMIN_WHATSAPP,
  escapeHtml,
  formatTelHref,
  getWhatsAppUrl,
  getGoogleMapsUrl,
  formatSmsHref,
  getCityBadgeClasses,
  getCategoryBadgeClasses,
  generateCardHtml,
  generateJsonLd,
  generateOgImagePng,
  generateRobotsTxt,
  generateSitemapXml,
  generateNetlifyConfig,
  generateFirestoreRules
} = utils;

const FIREBASE_CONFIG_LITERAL = `{
      apiKey: "AIzaSyB0slPHF3q-eGa-0lkrF4M0OrTVp716QPk",
      authDomain: "phonebook-fbf5f.firebaseapp.com",
      projectId: "phonebook-fbf5f",
      storageBucket: "phonebook-fbf5f.firebasestorage.app",
      messagingSenderId: "799496474816",
      appId: "1:799496474816:web:367b6787f479c1160e5d25"
    }`;

// ---------------------------------------------------------------------------
// 1. BUILD PUBLIC index.html
// ---------------------------------------------------------------------------
function buildIndexHtml() {
  const preRenderedCards = DEFAULT_LISTINGS.map((item) => generateCardHtml(item)).join('\n');
  const jsonLd = generateJsonLd(DEFAULT_LISTINGS);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kolar &amp; Chintamani Service Phonebook | Local Plumbers, Electricians &amp; Technicians</title>
  <meta name="description" content="Local service numbers for plumbers, electricians, painters, carpenters, AC repair and welders in Kolar and Chintamani, Karnataka. Quick callable contacts, WhatsApp links, and phone numbers." />
  <meta name="keywords" content="Kolar phonebook, Chintamani phonebook, plumbers in Kolar, electricians in Chintamani, carpenters Kolar, painters Kolar, AC repair Chintamani, welding Kolar" />
  <link rel="canonical" href="${SITE_URL}/" />

  <!-- Open Graph / Facebook / WhatsApp Preview -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${SITE_URL}/" />
  <meta property="og:title" content="Kolar &amp; Chintamani Service Phonebook" />
  <meta property="og:description" content="Local service numbers for plumbers, electricians, painters, carpenters, AC repair and welders in Kolar and Chintamani, Karnataka." />
  <meta property="og:image" content="${SITE_URL}/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${SITE_URL}/" />
  <meta name="twitter:title" content="Kolar &amp; Chintamani Service Phonebook" />
  <meta name="twitter:description" content="Local service numbers for plumbers, electricians, painters, carpenters, AC repair and welders in Kolar and Chintamani, Karnataka." />
  <meta name="twitter:image" content="${SITE_URL}/og-image.png" />

  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="google7f7b6a163f07bb14" />

  <!-- JSON-LD Structured Data for Local Businesses -->
  <script type="application/ld+json">
${jsonLd}
  </script>

  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900">

  <!-- ==================== HEADER ==================== -->
  <header class="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-lg shadow-slate-900/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <!-- Brand & Live Sync Status -->
        <div class="flex items-start sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-lg sm:text-xl font-extrabold tracking-tight text-white">Kolar &amp; Chintamani Phonebook</h1>
                <span id="syncStatusPill" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  <span id="syncStatusDot" class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span id="syncStatusText">Connecting...</span>
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-400 mt-0.5">Local service numbers for plumbers, electricians, painters, carpenters &amp; technicians</p>
            </div>
          </div>
        </div>

        <!-- Live Stats & Action Buttons -->
        <div class="flex flex-wrap items-center justify-between lg:justify-end gap-2.5">
          <!-- Stats Pills -->
          <div class="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
            <span class="text-slate-400">Total:</span>
            <span id="statTotal" class="font-bold text-white">36</span>
            <span class="text-slate-600 mx-1">|</span>
            <span class="text-slate-400">Kolar:</span>
            <span id="statKolar" class="font-bold text-indigo-300">22</span>
            <span class="text-slate-600 mx-1">|</span>
            <span class="text-slate-400">Chintamani:</span>
            <span id="statChintamani" class="font-bold text-emerald-300">14</span>
          </div>

          <!-- Action Buttons: WhatsApp Share & Suggest Contact -->
          <div class="flex flex-wrap items-center gap-2">
            <a
              id="shareSiteWhatsAppBtn"
              href="https://api.whatsapp.com/send?text=Find%20local%20service%20numbers%20for%20plumbers%2C%20electricians%2C%20painters%2C%20carpenters%2C%20AC%20repair%20and%20welders%20in%20Kolar%20%26%20Chintamani%3A%20${encodeURIComponent(SITE_URL + '/')}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-green-600/20 transition-all cursor-pointer"
              title="Share directory with friends on WhatsApp"
            >
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.47 0 .11 5.36.11 11.95c0 2.1.55 4.15 1.59 5.96L0 24l6.26-1.64a11.93 11.93 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.5-8.41zm-8.46 18.35h-.01a9.92 9.92 0 0 1-5.06-1.39l-.36-.22-3.71.97.99-3.62-.24-.37a9.91 9.91 0 0 1-1.52-5.25c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.87-9.93 9.87zm5.45-7.43c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/>
              </svg>
              <span>Share on WhatsApp</span>
            </a>

            <button
              id="openAddModalBtn"
              type="button"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
              </svg>
              <span>Suggest Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- ==================== MAIN CONTENT ==================== -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

    <!-- Search & Filters Card -->
    <section class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-6 space-y-4">
      <div class="flex flex-col md:flex-row gap-3">
        <!-- Search Input -->
        <div class="relative flex-1">
          <svg class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            id="searchInput"
            type="search"
            placeholder="Search by name, service, area, or phone number..."
            class="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          />
        </div>

        <!-- City Filter & Saved Favorites Toggle -->
        <div class="flex flex-wrap items-center gap-2">
          <div class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80" role="group" aria-label="Filter by city">
            <button type="button" data-city="All" class="city-btn px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer">All</button>
            <button type="button" data-city="Kolar" class="city-btn px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer">Kolar</button>
            <button type="button" data-city="Chintamani" class="city-btn px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer">Chintamani</button>
          </div>

          <button
            id="favToggleBtn"
            type="button"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>Saved (<span id="favCountBadge">0</span>)</span>
          </button>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5" id="categoryPillsContainer">
        <button type="button" data-category="All" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer">All Services</button>
        <button type="button" data-category="Plumbers" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer">Plumbers</button>
        <button type="button" data-category="Electricians" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer">Electricians</button>
        <button type="button" data-category="Painters" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer">Painters</button>
        <button type="button" data-category="Carpenters" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer">Carpenters</button>
        <button type="button" data-category="AC & Appliance Repair" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer">AC &amp; Appliance Repair</button>
        <button type="button" data-category="Welding & Fabrication" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer">Welding &amp; Fabrication</button>
      </div>
    </section>

    <!-- Results Count Bar -->
    <div class="flex items-center justify-between mb-4 px-1">
      <p id="resultsSummary" class="text-sm font-medium text-slate-600">Showing 36 contacts</p>
      <button
        id="resetFiltersBtn"
        type="button"
        class="hidden text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
      >
        Reset all filters
      </button>
    </div>

    <!-- Listings Grid (Pre-rendered for immediate SEO crawlability & First Contentful Paint) -->
    <section id="listingsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
${preRenderedCards}
    </section>

    <!-- Empty State -->
    <section id="emptyState" class="hidden bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto my-8">
      <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <h2 class="text-base font-bold text-slate-900">No matching contacts found</h2>
      <p class="text-sm text-slate-500 mt-1">Try adjusting your search keywords, city, or category filters—or suggest a new local contact.</p>
      <div class="mt-5 flex items-center justify-center gap-3">
        <button
          id="emptyResetBtn"
          type="button"
          class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
        <button
          id="emptyAddBtn"
          type="button"
          class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          Suggest Contact
        </button>
      </div>
    </section>

    <!-- ==================== ABOUT & REMOVAL REQUEST SECTION ==================== -->
    <section class="mt-12 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      <div class="max-w-3xl">
        <div class="flex items-center gap-2.5 mb-2">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <h2 class="text-base sm:text-lg font-bold text-slate-900">About &amp; Directory Information</h2>
        </div>
        <p class="text-sm text-slate-600 leading-relaxed">
          The <strong>Kolar &amp; Chintamani Service Phonebook</strong> is a local public directory built to help residents find reliable plumbers, electricians, painters, carpenters, AC repair specialists, and welders across Kolar and Chintamani, Karnataka. Numbers are compiled from publicly available business boards, local shops, and verified user recommendations.
        </p>

        <div class="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 class="text-sm font-semibold text-slate-800">Technician or Business Owner?</h3>
            <p class="text-xs text-slate-500 mt-0.5">Want your listing updated, marked with a "Confirmed by phone" badge, or completely removed?</p>
          </div>
          <a
            href="https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent('Hello, I would like to update or remove my listing from the Kolar & Chintamani phonebook.')}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-semibold transition-all shrink-0 shadow-sm"
          >
            <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.47 0 .11 5.36.11 11.95c0 2.1.55 4.15 1.59 5.96L0 24l6.26-1.64a11.93 11.93 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.5-8.41zm-8.46 18.35h-.01a9.92 9.92 0 0 1-5.06-1.39l-.36-.22-3.71.97.99-3.62-.24-.37a9.91 9.91 0 0 1-1.52-5.25c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.87-9.93 9.87zm5.45-7.43c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/>
            </svg>
            <span>Message on WhatsApp (8550093816)</span>
          </a>
        </div>
      </div>
    </section>
  </main>

  <!-- ==================== FOOTER ==================== -->
  <footer class="bg-white border-t border-slate-200 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <div>
        <p class="font-medium text-slate-700">Kolar &amp; Chintamani Local Service Phonebook — All listed numbers are callable.</p>
        <p class="mt-1 text-slate-500">Numbers are collected from public sources and may change. Found a mistake? <a href="https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent('Hello, I found a mistake in the Kolar & Chintamani phonebook: ')}" target="_blank" rel="noopener noreferrer" class="font-semibold text-indigo-600 hover:text-indigo-800 underline">Tell us</a>.</p>
      </div>
      <div class="flex items-center gap-4 shrink-0 text-slate-400">
        <a href="/admin" class="hover:text-slate-700 font-medium transition-colors">Admin Login</a>
        <span>·</span>
        <span>Tip: Tap <strong>Save .vcf</strong> to import to contacts</span>
      </div>
    </div>
  </footer>

  <!-- ==================== SUGGEST CONTACT MODAL (FOR PUBLIC REVIEW) ==================== -->
  <div
    id="addContactModal"
    class="hidden fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm p-3 sm:p-6"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modalTitle"
  >
    <div id="modalBackdropWrapper" class="min-h-full flex items-center justify-center py-4 sm:py-8 pointer-events-auto">
      <div id="addContactModalCard" class="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-5 sm:px-6 py-4 bg-slate-900 text-white shrink-0">
          <div>
            <h2 id="modalTitle" class="text-base sm:text-lg font-bold">Suggest a Local Contact</h2>
            <p class="text-xs text-slate-300 mt-0.5">Submissions are reviewed before appearing publicly in the directory</p>
          </div>
          <button
            id="closeModalBtn"
            type="button"
            aria-label="Close modal"
            class="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Scrollable Form Body -->
        <form id="addContactForm" class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <!-- Inline Error Banner -->
          <div id="modalErrorBanner" class="hidden p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2">
            <svg class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span id="modalErrorText"></span>
          </div>

          <!-- Dummy bot trap -->
          <div style="display:none !important; position:absolute; left:-9999px;" aria-hidden="true">
            <input type="text" name="b_fax_num" id="b_fax_num" tabindex="-1" autocomplete="off" />
          </div>

          <div>
            <label for="inputName" class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">Business / Technician Name *</label>
            <input
              id="inputName"
              type="text"
              required
              maxlength="100"
              placeholder="e.g., Sri Balaji Plumbing Works"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="inputCity" class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">City *</label>
              <select
                id="inputCity"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Kolar">Kolar</option>
                <option value="Chintamani">Chintamani</option>
              </select>
            </div>
            <div>
              <label for="inputPhone" class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">Primary Phone Number *</label>
              <input
                id="inputPhone"
                type="tel"
                required
                maxlength="20"
                placeholder="e.g., 9876543210 or 080..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label for="inputAltPhone" class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">Alternate Phone Number (Optional)</label>
            <input
              id="inputAltPhone"
              type="tel"
              maxlength="20"
              placeholder="e.g., 091234 56789"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <span class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Categories * <span class="font-normal normal-case text-slate-400">(Tap one or more)</span></span>
            <div id="categoryCheckboxes" class="grid grid-cols-2 gap-2">
              <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 cursor-pointer text-xs sm:text-sm font-medium text-slate-700 select-none">
                <input type="checkbox" value="Plumbers" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                <span>Plumbers</span>
              </label>
              <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 cursor-pointer text-xs sm:text-sm font-medium text-slate-700 select-none">
                <input type="checkbox" value="Electricians" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                <span>Electricians</span>
              </label>
              <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 cursor-pointer text-xs sm:text-sm font-medium text-slate-700 select-none">
                <input type="checkbox" value="Painters" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                <span>Painters</span>
              </label>
              <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 cursor-pointer text-xs sm:text-sm font-medium text-slate-700 select-none">
                <input type="checkbox" value="Carpenters" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                <span>Carpenters</span>
              </label>
              <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 cursor-pointer text-xs sm:text-sm font-medium text-slate-700 select-none">
                <input type="checkbox" value="AC & Appliance Repair" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                <span>AC &amp; Repair</span>
              </label>
              <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 cursor-pointer text-xs sm:text-sm font-medium text-slate-700 select-none">
                <input type="checkbox" value="Welding & Fabrication" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                <span>Welding</span>
              </label>
            </div>
          </div>

          <div>
            <label for="inputAddress" class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">Address / Area *</label>
            <input
              id="inputAddress"
              type="text"
              required
              maxlength="200"
              placeholder="e.g., MG Road, near Bus Stand, Kolar"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label for="inputHours" class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">Operating Hours (Optional)</label>
            <input
              id="inputHours"
              type="text"
              maxlength="100"
              placeholder="e.g., Mon–Sat 9:00 AM–8:00 PM"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label for="inputDesc" class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">Notes / Short Description (Optional)</label>
            <textarea
              id="inputDesc"
              rows="2"
              maxlength="300"
              placeholder="Briefly describe services offered..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            ></textarea>
          </div>

          <!-- Sticky Modal Footer -->
          <div class="sticky bottom-0 bg-white/95 backdrop-blur-sm flex items-center justify-end gap-3 pt-3 pb-1 border-t border-slate-100">
            <button
              id="cancelModalBtn"
              type="button"
              class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submitContactBtn"
              type="submit"
              class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              Submit for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- ==================== TOAST NOTIFICATION ==================== -->
  <div
    id="toastContainer"
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex flex-col gap-2 items-center w-full max-w-sm px-4"
    aria-live="polite"
  ></div>

  <!-- ==================== APPLICATION SCRIPT ==================== -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
    import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
    import { getFirestore, doc, setDoc, addDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

    // 1. BASE DIRECTORY DATA (36 CALLABLE LISTINGS)
    const DEFAULT_LISTINGS = ${JSON.stringify(DEFAULT_LISTINGS, null, 6)};

    // 2. CONFIGURATION & STATE
    const firebaseConfig = ${FIREBASE_CONFIG_LITERAL};
    const appId = "kolar-chintamani-phonebook";

    let db = null;
    let auth = null;
    let currentUser = null;
    let communityListings = [];
    let baseOverrides = {};
    let favorites = new Set();

    const filterState = {
      search: '',
      city: 'All',
      category: 'All',
      onlyFavorites: false
    };

    // DOM Elements
    const syncStatusDot = document.getElementById('syncStatusDot');
    const syncStatusText = document.getElementById('syncStatusText');
    const statTotal = document.getElementById('statTotal');
    const statKolar = document.getElementById('statKolar');
    const statChintamani = document.getElementById('statChintamani');
    const favCountBadge = document.getElementById('favCountBadge');

    const searchInput = document.getElementById('searchInput');
    const cityButtons = document.querySelectorAll('.city-btn');
    const categoryPills = document.querySelectorAll('.cat-pill');
    const favToggleBtn = document.getElementById('favToggleBtn');
    const resultsSummary = document.getElementById('resultsSummary');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const listingsGrid = document.getElementById('listingsGrid');
    const emptyState = document.getElementById('emptyState');
    const emptyResetBtn = document.getElementById('emptyResetBtn');
    const emptyAddBtn = document.getElementById('emptyAddBtn');

    const addContactModal = document.getElementById('addContactModal');
    const openAddModalBtn = document.getElementById('openAddModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const addContactForm = document.getElementById('addContactForm');
    const submitContactBtn = document.getElementById('submitContactBtn');
    const toastContainer = document.getElementById('toastContainer');

    // 3. FIREBASE INITIALIZATION & REAL-TIME CLOUD SYNC
    function setSyncStatus(mode, text) {
      syncStatusText.textContent = text;
      syncStatusDot.className = 'w-1.5 h-1.5 rounded-full ';
      if (mode === 'live') {
        syncStatusDot.className += 'bg-emerald-400';
      } else if (mode === 'error') {
        syncStatusDot.className += 'bg-rose-400';
      } else {
        syncStatusDot.className += 'bg-amber-400';
      }
    }

    async function initCloudSync() {
      try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        // 1. Listen to shared public approved contacts immediately (works for public read)
        const contactsRef = collection(db, 'artifacts', appId, 'public', 'data', 'contacts');
        onSnapshot(
          contactsRef,
          (snapshot) => {
            const loaded = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              // Public site ONLY shows approved contacts
              if (data.status !== 'approved') return;

              loaded.push({
                id: docSnap.id,
                name: data.name || 'Unnamed Contact',
                city: data.city || 'Kolar',
                categories: Array.isArray(data.categories) && data.categories.length > 0 ? data.categories : ['Plumbers'],
                phone: data.phone || '',
                altPhone: data.altPhone || '',
                address: data.address || '',
                hours: data.hours || 'Call to confirm availability',
                desc: data.desc || '',
                verified: Boolean(data.verified),
                createdBy: data.createdBy || null,
                createdAt: data.createdAt || 0,
                isCommunity: true
              });
            });
            loaded.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            communityListings = loaded;
            setSyncStatus('live', 'Live Cloud Sync Active');
            renderListings();
          },
          (error) => {
            console.warn('Contacts snapshot warning:', error);
          }
        );

        // 2. Listen to base listings overrides & soft-deletes
        const overridesRef = collection(db, 'artifacts', appId, 'public', 'data', 'base_overrides');
        onSnapshot(
          overridesRef,
          (snapshot) => {
            const nextOverrides = {};
            snapshot.forEach((docSnap) => {
              nextOverrides[docSnap.id] = docSnap.data();
            });
            baseOverrides = nextOverrides;
            renderListings();
          },
          (error) => {
            console.warn('Base overrides snapshot warning:', error);
          }
        );

        // 3. Authenticate visitor anonymously in background (non-blocking)
        signInAnonymously(auth)
          .then((cred) => {
            currentUser = cred.user;
            setSyncStatus('live', 'Live Cloud Sync Active');

            if (currentUser) {
              const favDocRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'favorites', 'saved');
              onSnapshot(
                favDocRef,
                (docSnap) => {
                  if (docSnap.exists()) {
                    const ids = docSnap.data().ids;
                    favorites = new Set(Array.isArray(ids) ? ids : []);
                    renderListings();
                  }
                },
                (error) => {
                  console.warn('Favorites snapshot warning:', error);
                }
              );
            }
          })
          .catch((authErr) => {
            console.warn('Anonymous auth note (domain not whitelisted or offline):', authErr);
            // Public viewing continues without crashing
            setSyncStatus('live', 'Live Cloud Sync Active');
          });

      } catch (err) {
        console.error('Firebase init failed, running in offline mode:', err);
        setSyncStatus('offline', 'Offline Mode');
      }
    }

    async function persistFavorites() {
      if (!db || !currentUser) return;
      try {
        const favDocRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'favorites', 'saved');
        await setDoc(favDocRef, { ids: Array.from(favorites), updatedAt: Date.now() }, { merge: true });
      } catch (err) {
        console.error('Failed to save favorites:', err);
      }
    }

    // 4. UTILITY HELPERS
    function getAllListings() {
      const mergedDefaults = DEFAULT_LISTINGS.reduce((acc, base) => {
        const override = baseOverrides[base.id];
        if (override && override.deleted) {
          return acc;
        }
        if (override) {
          acc.push({
            ...base,
            name: override.name || base.name,
            city: override.city || base.city,
            categories: Array.isArray(override.categories) && override.categories.length > 0 ? override.categories : base.categories,
            phone: override.phone || base.phone,
            altPhone: override.altPhone || '',
            address: override.address || base.address,
            hours: override.hours || base.hours,
            desc: override.desc !== undefined ? override.desc : base.desc,
            verified: Boolean(override.verified !== undefined ? override.verified : base.verified),
            isEdited: true
          });
        } else {
          acc.push({ ...base, altPhone: '', verified: Boolean(base.verified) });
        }
        return acc;
      }, []);

      return [...communityListings, ...mergedDefaults];
    }

    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function formatTelHref(phone) {
      return 'tel:' + String(phone || '').replace(/[^\\d+]/g, '');
    }

    function formatSmsHref(phone, name) {
      const cleaned = String(phone || '').replace(/[^\\d+]/g, '');
      const body = encodeURIComponent(\`Hello \${name}, I found your contact on the Kolar & Chintamani Service Phonebook and need assistance.\`);
      return \`sms:\${cleaned}?body=\${body}\`;
    }

    function getWhatsAppUrl(phone, name) {
      let digits = String(phone || '').replace(/\\D/g, '');
      if (digits.startsWith('91') && digits.length === 12) {
        digits = digits.slice(2);
      } else if (digits.startsWith('0') && digits.length === 11) {
        digits = digits.slice(1);
      }
      if (!/^[6-9]\\d{9}$/.test(digits)) {
        return null;
      }
      const msg = encodeURIComponent(\`Hello \${name}, I found your number in the Kolar & Chintamani Service Phonebook. Are you available for service?\`);
      return \`https://wa.me/91\${digits}?text=\${msg}\`;
    }

    function getGoogleMapsUrl(item) {
      const query = encodeURIComponent(\`\${item.name}, \${item.address}, \${item.city}, Karnataka\`);
      return \`https://www.google.com/maps/search/?api=1&query=\${query}\`;
    }

    function downloadVCard(item) {
      try {
        const cleanVcf = (val) => String(val || '').replace(/\\r?\\n/g, ' ').replace(/;/g, '\\\\;');
        const telPrimary = String(item.phone || '').replace(/[^\\d+]/g, '');
        const telAlt = item.altPhone ? String(item.altPhone).replace(/[^\\d+]/g, '') : '';
        const notes = \`Category: \${item.categories.join(', ')} | Hours: \${item.hours || 'Call to confirm'}\${item.desc ? ' | ' + item.desc : ''}\`;

        const lines = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          \`FN:\${cleanVcf(item.name)}\`,
          \`ORG:\${cleanVcf(item.categories.join(' / '))}\`,
          \`TEL;TYPE=CELL,VOICE:\${telPrimary}\`,
          ...(telAlt ? [\`TEL;TYPE=WORK,VOICE:\${telAlt}\`] : []),
          \`ADR;TYPE=WORK:;;\${cleanVcf(item.address)};\${cleanVcf(item.city)};Karnataka;;India\`,
          \`NOTE:\${cleanVcf(notes)}\`,
          'END:VCARD'
        ];

        const blob = new Blob([lines.join('\\r\\n')], { type: 'text/vcard;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const safeName = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        link.href = url;
        link.download = \`\${safeName || 'contact'}.vcf\`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast(\`Saved "\${item.name}.vcf" to phone contacts\`);
      } catch (err) {
        showToast('Could not generate vCard file', 'error');
      }
    }

    async function shareContact(item) {
      const shareText = [
        \`\${item.name} (\${item.categories.join(', ')})\`,
        \`Phone: \${item.phone}\${item.altPhone ? ' / ' + item.altPhone : ''}\`,
        \`City: \${item.city}\`,
        \`Address: \${item.address}\`,
        \`Hours: \${item.hours || 'Call to confirm availability'}\`
      ].join('\\n');

      if (navigator.share) {
        try {
          await navigator.share({
            title: \`\${item.name} - Kolar & Chintamani Phonebook\`,
            text: shareText
          });
          showToast('Contact shared successfully');
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') return;
        }
      }
      copyTextToClipboard(shareText, 'Contact details copied to share');
    }

    function getCityBadgeClasses(city) {
      return city === 'Kolar'
        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
        : 'bg-teal-50 text-teal-700 border-teal-200';
    }

    function getCategoryBadgeClasses(category) {
      switch (category) {
        case 'Plumbers':
          return 'bg-sky-50 text-sky-700 border-sky-200';
        case 'Electricians':
          return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'Painters':
          return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
        case 'Carpenters':
          return 'bg-orange-50 text-orange-700 border-orange-200';
        case 'AC & Appliance Repair':
          return 'bg-cyan-50 text-cyan-700 border-cyan-200';
        case 'Welding & Fabrication':
          return 'bg-slate-100 text-slate-700 border-slate-300';
        default:
          return 'bg-slate-50 text-slate-700 border-slate-200';
      }
    }

    function copyTextToClipboard(text, customMessage) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (success) {
          showToast(customMessage || \`Copied \${text} to clipboard\`, 'success');
        } else {
          showToast('Could not copy to clipboard', 'error');
        }
      } catch (err) {
        showToast('Could not copy to clipboard', 'error');
      }
    }

    function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      const bgClass = type === 'error' ? 'bg-rose-600' : 'bg-slate-900';
      toast.className = \`pointer-events-auto \${bgClass} text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-white/10 transition-all duration-300 translate-y-2 opacity-0\`;
      toast.textContent = message;
      toastContainer.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
      });

      setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // 5. FILTERING & RENDERING
    function getFilteredListings() {
      const query = filterState.search.trim().toLowerCase();
      return getAllListings().filter((item) => {
        if (filterState.city !== 'All' && item.city !== filterState.city) {
          return false;
        }
        if (filterState.category !== 'All' && !item.categories.includes(filterState.category)) {
          return false;
        }
        if (filterState.onlyFavorites && !favorites.has(item.id)) {
          return false;
        }
        if (!query) return true;

        const inName = item.name.toLowerCase().includes(query);
        const inCity = item.city.toLowerCase().includes(query);
        const inCats = item.categories.some((c) => c.toLowerCase().includes(query));
        const inPhone = item.phone.toLowerCase().includes(query) || (item.altPhone && item.altPhone.toLowerCase().includes(query));
        const inAddr = item.address.toLowerCase().includes(query);
        const inDesc = item.desc ? item.desc.toLowerCase().includes(query) : false;

        return inName || inCity || inCats || inPhone || inAddr || inDesc;
      });
    }

    function updateStats() {
      const all = getAllListings();
      statTotal.textContent = all.length;
      statKolar.textContent = all.filter((i) => i.city === 'Kolar').length;
      statChintamani.textContent = all.filter((i) => i.city === 'Chintamani').length;
      favCountBadge.textContent = favorites.size;
    }

    function updateFilterButtonStyles() {
      cityButtons.forEach((btn) => {
        const active = btn.getAttribute('data-city') === filterState.city;
        btn.className = \`city-btn px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer \${
          active
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }\`;
      });

      categoryPills.forEach((pill) => {
        const active = pill.getAttribute('data-category') === filterState.category;
        pill.className = \`cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer \${
          active
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }\`;
      });

      favToggleBtn.className = \`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer \${
        filterState.onlyFavorites
          ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
      }\`;

      const hasActiveFilter =
        filterState.search.trim() !== '' ||
        filterState.city !== 'All' ||
        filterState.category !== 'All' ||
        filterState.onlyFavorites;
      resetFiltersBtn.classList.toggle('hidden', !hasActiveFilter);
    }

    function renderListings() {
      updateStats();
      updateFilterButtonStyles();

      const filtered = getFilteredListings();
      resultsSummary.textContent = \`Showing \${filtered.length} contact\${filtered.length === 1 ? '' : 's'}\`;

      if (filtered.length === 0) {
        listingsGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
      }

      emptyState.classList.add('hidden');
      listingsGrid.innerHTML = filtered.map((item) => {
        const isFav = favorites.has(item.id);
        const waUrl = getWhatsAppUrl(item.phone, item.name);
        const mapsUrl = getGoogleMapsUrl(item);

        const categoryBadgesHtml = item.categories
          .map(
            (cat) =>
              \`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border \${getCategoryBadgeClasses(cat)}">\${escapeHtml(cat)}</span>\`
          )
          .join('');

        const confirmedBadgeHtml = item.verified
          ? \`<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200" title="Contact number confirmed by phone call">
               <svg class="w-3 h-3 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
               </svg>
               <span>Confirmed by phone</span>
             </span>\`
          : '';

        const altPhoneRowHtml = item.altPhone
          ? \`
            <div class="flex items-center justify-between gap-2 mb-3 px-3 py-1.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-[11px] font-semibold uppercase tracking-wide text-slate-400 shrink-0">Alt</span>
                <a href="\${escapeHtml(formatTelHref(item.altPhone))}" class="text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 truncate">\${escapeHtml(item.altPhone)}</a>
              </div>
              <button
                type="button"
                data-copy-phone="\${escapeHtml(item.altPhone)}"
                class="copy-btn inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 border border-slate-200 bg-white transition-colors shrink-0 cursor-pointer"
                title="Copy alternate number"
              >
                <span>Copy</span>
              </button>
            </div>
          \`
          : '';

        const primaryActionsHtml = waUrl
          ? \`
            <div class="grid grid-cols-2 gap-2">
              <a
                href="\${escapeHtml(formatTelHref(item.phone))}"
                class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-600/20 transition-all"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Call Now</span>
              </a>
              <a
                href="\${escapeHtml(waUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-green-600/20 transition-all"
              >
                <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.47 0 .11 5.36.11 11.95c0 2.1.55 4.15 1.59 5.96L0 24l6.26-1.64a11.93 11.93 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.5-8.41zm-8.46 18.35h-.01a9.92 9.92 0 0 1-5.06-1.39l-.36-.22-3.71.97.99-3.62-.24-.37a9.91 9.91 0 0 1-1.52-5.25c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.87-9.93 9.87zm5.45-7.43c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          \`
          : \`
            <a
              href="\${escapeHtml(formatTelHref(item.phone))}"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm font-semibold shadow-sm shadow-emerald-600/20 transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Call Now</span>
            </a>
          \`;

        const removalMsg = encodeURIComponent(\`Hello, I want my listing changed/removed from the Kolar & Chintamani phonebook. Name: \${item.name}, Phone: \${item.phone}\`);
        const removalUrl = \`https://wa.me/${ADMIN_WHATSAPP}?text=\${removalMsg}\`;

        return \`
          <article class="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between p-5" data-contact-id="\${escapeHtml(item.id)}">
            <div>
              <!-- Badges & Favorite Action Row (NO edit or delete on public cards) -->
              <div class="flex items-start justify-between gap-2 mb-3">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border \${getCityBadgeClasses(item.city)}">
                    \${escapeHtml(item.city)}
                  </span>
                  \${categoryBadgesHtml}
                  \${confirmedBadgeHtml}
                </div>
                <div class="flex items-center gap-0.5 shrink-0 -mt-1 -mr-1">
                  <button
                    type="button"
                    data-fav-id="\${escapeHtml(item.id)}"
                    aria-label="\${isFav ? 'Remove from favorites' : 'Save to favorites'}"
                    title="\${isFav ? 'Remove from saved' : 'Save contact'}"
                    class="fav-btn p-2 rounded-xl transition-colors cursor-pointer \${
                      isFav
                        ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
                        : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                    }"
                  >
                    <svg class="w-4 h-4" fill="\${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Business Name & Description -->
              <h3 class="text-base font-bold text-slate-900 leading-snug">\${escapeHtml(item.name)}</h3>
              <p class="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">\${escapeHtml(item.desc)}</p>

              <!-- Address & Hours -->
              <div class="mt-3.5 space-y-2 text-xs text-slate-500">
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>\${escapeHtml(item.address)}</span>
                </div>
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" />
                  </svg>
                  <span>\${escapeHtml(item.hours)}</span>
                </div>
              </div>
            </div>

            <!-- Phone & Action Controls -->
            <div class="mt-5 pt-4 border-t border-slate-100">
              <div class="flex items-center justify-between gap-2 mb-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <div class="flex items-center gap-2 min-w-0">
                  <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span class="text-sm font-bold text-slate-900 tracking-wide truncate">\${escapeHtml(item.phone)}</span>
                </div>
                <button
                  type="button"
                  data-copy-phone="\${escapeHtml(item.phone)}"
                  class="copy-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 border border-slate-200 bg-white transition-colors shrink-0 cursor-pointer"
                  title="Copy phone number"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </button>
              </div>

              \${altPhoneRowHtml}
              \${primaryActionsHtml}

              <!-- Secondary Phone Utility Bar: SMS, Save vCard, Share, Google Maps -->
              <div class="mt-2.5 grid grid-cols-4 gap-1.5">
                <a
                  href="\${escapeHtml(formatSmsHref(item.phone, item.name))}"
                  class="inline-flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200/80 text-[11px] font-semibold transition-colors"
                  title="Send SMS"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>SMS</span>
                </a>
                <button
                  type="button"
                  data-vcard-id="\${escapeHtml(item.id)}"
                  class="vcard-btn inline-flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200/80 text-[11px] font-semibold transition-colors cursor-pointer"
                  title="Save to phone contacts (.vcf)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 8v6M23 11h-6" />
                  </svg>
                  <span>Save .vcf</span>
                </button>
                <button
                  type="button"
                  data-share-id="\${escapeHtml(item.id)}"
                  class="share-btn inline-flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200/80 text-[11px] font-semibold transition-colors cursor-pointer"
                  title="Share contact details"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
                  </svg>
                  <span>Share</span>
                </button>
                <a
                  href="\${escapeHtml(mapsUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200/80 text-[11px] font-semibold transition-colors"
                  title="Open in Google Maps"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Maps</span>
                </a>
              </div>

              <!-- Opt-Out / Removal Request Link -->
              <div class="mt-2.5 pt-2 text-center border-t border-slate-100/80">
                <a
                  href="\${removalUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                  title="Request update or removal of this listing"
                >
                  <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Request change or removal</span>
                </a>
              </div>
            </div>
          </article>
        \`;
      }).join('');
    }

    // 6. EVENT LISTENERS
    searchInput.addEventListener('input', (e) => {
      filterState.search = e.target.value;
      renderListings();
    });

    cityButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterState.city = btn.getAttribute('data-city');
        renderListings();
      });
    });

    categoryPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterState.category = pill.getAttribute('data-category');
        renderListings();
      });
    });

    favToggleBtn.addEventListener('click', () => {
      filterState.onlyFavorites = !filterState.onlyFavorites;
      renderListings();
    });

    function resetAllFilters() {
      filterState.search = '';
      filterState.city = 'All';
      filterState.category = 'All';
      filterState.onlyFavorites = false;
      searchInput.value = '';
      renderListings();
    }

    resetFiltersBtn.addEventListener('click', resetAllFilters);
    emptyResetBtn.addEventListener('click', resetAllFilters);
    emptyAddBtn.addEventListener('click', openAddModal);

    // Delegated clicks for contacts
    listingsGrid.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.copy-btn');
      if (copyBtn) {
        const phone = copyBtn.getAttribute('data-copy-phone');
        if (phone) copyTextToClipboard(phone);
        return;
      }

      const vcardBtn = e.target.closest('.vcard-btn');
      if (vcardBtn) {
        const id = vcardBtn.getAttribute('data-vcard-id');
        const contact = getAllListings().find((item) => item.id === id);
        if (contact) downloadVCard(contact);
        return;
      }

      const shareBtn = e.target.closest('.share-btn');
      if (shareBtn) {
        const id = shareBtn.getAttribute('data-share-id');
        const contact = getAllListings().find((item) => item.id === id);
        if (contact) shareContact(contact);
        return;
      }

      const favBtn = e.target.closest('.fav-btn');
      if (favBtn) {
        const id = favBtn.getAttribute('data-fav-id');
        if (favorites.has(id)) {
          favorites.delete(id);
          showToast('Removed from saved contacts');
        } else {
          favorites.add(id);
          showToast('Saved to favorites');
        }
        persistFavorites();
        renderListings();
      }
    });

    // 7. PUBLIC SUBMISSION MODAL
    function showModalError(msg) {
      const banner = document.getElementById('modalErrorBanner');
      const text = document.getElementById('modalErrorText');
      if (banner && text) {
        text.textContent = msg;
        banner.classList.remove('hidden');
        banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        showToast(msg, 'error');
      }
    }

    function clearModalError() {
      const banner = document.getElementById('modalErrorBanner');
      const text = document.getElementById('modalErrorText');
      if (banner && text) {
        text.textContent = '';
        banner.classList.add('hidden');
      }
    }

    function openAddModal() {
      clearModalError();
      addContactForm.reset();
      addContactModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      // Only autofocus on desktop; avoids jumping viewport on mobile
      if (window.innerWidth >= 640) {
        const firstInput = document.getElementById('inputName');
        if (firstInput) firstInput.focus();
      }
    }

    function closeModal() {
      clearModalError();
      addContactModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      addContactForm.reset();
    }

    openAddModalBtn.addEventListener('click', openAddModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    // Prevent backdrop click dismiss on mobile touch scroll:
    // Only close if user clicks directly on the outer backdrop wrapper, NOT inside the card
    const modalBackdropWrapper = document.getElementById('modalBackdropWrapper');
    if (modalBackdropWrapper) {
      modalBackdropWrapper.addEventListener('click', (e) => {
        if (e.target === modalBackdropWrapper || e.target === addContactModal) {
          closeModal();
        }
      });
    }

    const modalCard = document.getElementById('addContactModalCard');
    if (modalCard) {
      modalCard.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !addContactModal.classList.contains('hidden')) {
        closeModal();
      }
    });

    addContactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearModalError();

      // Bot honeypot check (obscure name immune to normal browser autofill)
      const botTrap = document.getElementById('b_fax_num');
      if (botTrap && botTrap.value && botTrap.value.trim().length > 0) {
        closeModal();
        return; // Silently drop bot submissions
      }

      const name = document.getElementById('inputName').value.trim();
      const city = document.getElementById('inputCity').value;
      const selectedCategories = Array.from(
        document.querySelectorAll('#categoryCheckboxes input[type="checkbox"]:checked')
      ).map((cb) => cb.value);
      const phoneRaw = document.getElementById('inputPhone').value.trim();
      const altPhoneRaw = document.getElementById('inputAltPhone').value.trim();
      const hoursRaw = document.getElementById('inputHours').value.trim();
      const address = document.getElementById('inputAddress').value.trim();
      const desc = document.getElementById('inputDesc').value.trim();

      if (!name) {
        showModalError('Please enter a business or technician name.');
        return;
      }
      if (!address) {
        showModalError('Please enter an address or area (e.g. MG Road, Kolar).');
        return;
      }
      if (!phoneRaw) {
        showModalError('Please enter a mobile phone number.');
        return;
      }

      // Flexible mobile number validation:
      let phoneDigits = phoneRaw.replace(/\\D/g, '');
      if (phoneDigits.startsWith('91') && phoneDigits.length === 12) {
        phoneDigits = phoneDigits.slice(2);
      } else if (phoneDigits.startsWith('0') && phoneDigits.length === 11) {
        phoneDigits = phoneDigits.slice(1);
      }

      if (phoneDigits.length !== 10 || !/^[6-9]\\d{9}$/.test(phoneDigits)) {
        showModalError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 98765 43210).');
        return;
      }

      if (selectedCategories.length === 0) {
        showModalError('Please select at least one service category.');
        return;
      }

      const formattedPhone = '+91 ' + phoneDigits.slice(0, 5) + ' ' + phoneDigits.slice(5);
      const defaultDesc = selectedCategories.join(' & ') + ' service in ' + city + '.';

      const contactPayload = {
        name: name.slice(0, 100),
        city,
        categories: selectedCategories,
        phone: formattedPhone,
        altPhone: altPhoneRaw ? altPhoneRaw.slice(0, 25) : '',
        address: address.slice(0, 200),
        hours: hoursRaw ? hoursRaw.slice(0, 100) : 'Call to confirm availability',
        desc: desc ? desc.slice(0, 300) : defaultDesc,
        status: 'pending',
        verified: false,
        createdAt: Date.now(),
        createdBy: currentUser ? currentUser.uid : 'visitor'
      };

      if (!db) {
        showModalError('Database connection is not ready. Please check your internet connection.');
        return;
      }

      try {
        submitContactBtn.disabled = true;
        submitContactBtn.innerHTML = '<span class="inline-block animate-spin mr-1">&#9696;</span> Submitting...';

        // If anonymous auth was delayed or failed earlier, attempt once more before writing
        if (!currentUser && auth) {
          try {
            const cred = await signInAnonymously(auth);
            currentUser = cred.user;
            if (currentUser) {
              contactPayload.createdBy = currentUser.uid;
            }
          } catch (authErr) {
            console.warn('Anonymous auth retry note:', authErr);
          }
        }

        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'contacts'), contactPayload);
        closeModal();
        showToast('Thank you! Contact submitted for review. It will appear once approved by admin.');
      } catch (err) {
        console.error('Submission error:', err);
        let errMsg = 'Failed to submit contact. ';
        if (err && err.code === 'permission-denied') {
          errMsg += 'Database permission denied. (Please verify firestore.rules allow pending submissions or verify Firebase Authorized Domains).';
        } else if (err && err.code === 'unavailable') {
          errMsg += 'Network unavailable. Please check your internet connection.';
        } else if (err && err.message) {
          errMsg += err.message;
        } else {
          errMsg += 'Please check your connection and try again.';
        }
        showModalError(errMsg);
      } finally {
        submitContactBtn.disabled = false;
        submitContactBtn.textContent = 'Submit for Review';
      }
    });

    // 8. BOOTSTRAP
    renderListings();
    initCloudSync();
  </script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// 2. BUILD ADMIN PORTAL admin.html
// ---------------------------------------------------------------------------
function buildAdminHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Portal | Kolar &amp; Chintamani Phonebook</title>
  <meta name="robots" content="noindex, nofollow" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col antialiased">

  <!-- ==================== LOGIN VIEW ==================== -->
  <div id="loginView" class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md backdrop-blur-md">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-md">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-bold text-white">Phonebook Admin</h1>
          <p class="text-xs text-slate-400">Sign in to review and manage listings</p>
        </div>
      </div>

      <!-- Google Sign In Button -->
      <button
        id="googleLoginBtn"
        type="button"
        class="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-900 text-sm font-semibold transition-all shadow-md cursor-pointer mb-5"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
        <span>Sign in with Google</span>
      </button>

      <div class="flex items-center gap-3 my-4 text-xs text-slate-500 uppercase tracking-wider">
        <span class="flex-1 h-px bg-slate-700"></span>
        <span>Or email &amp; password</span>
        <span class="flex-1 h-px bg-slate-700"></span>
      </div>

      <!-- Email / Password Form -->
      <form id="emailLoginForm" class="space-y-4">
        <div>
          <label for="adminEmail" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Admin Email</label>
          <input
            id="adminEmail"
            type="email"
            required
            placeholder="admin@example.com"
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label for="adminPassword" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Password</label>
          <input
            id="adminPassword"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          id="emailLoginBtn"
          type="submit"
          class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white text-sm font-semibold transition-all shadow-md cursor-pointer"
        >
          Sign In
        </button>
      </form>

      <div id="loginErrorMsg" class="hidden mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300"></div>

      <div class="mt-6 pt-4 border-t border-slate-700/60 text-center">
        <a href="/" class="text-xs text-slate-400 hover:text-white transition-colors">&larr; Return to Public Directory</a>
      </div>
    </div>
  </div>

  <!-- ==================== AUTHENTICATED DASHBOARD VIEW ==================== -->
  <div id="dashboardView" class="hidden flex-1 flex flex-col">
    <!-- Admin TopBar -->
    <header class="bg-slate-800 border-b border-slate-700 sticky top-0 z-30 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-sm shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 class="text-base font-bold text-white">Phonebook Admin Dashboard</h1>
            <p id="adminUserBadge" class="text-xs text-slate-400">Signed in as: <span class="text-indigo-300 font-mono">admin</span></p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-xs text-slate-300 font-medium border border-slate-600 transition-colors"
          >
            <span>View Public Site</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <button
            id="logoutBtn"
            type="button"
            class="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Main Admin Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <!-- Stats Bar -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
          <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Pending Reviews</p>
          <p id="adminStatPending" class="text-2xl font-extrabold text-amber-400 mt-1">0</p>
        </div>
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
          <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active Listings</p>
          <p id="adminStatActive" class="text-2xl font-extrabold text-white mt-1">36</p>
        </div>
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
          <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Confirmed by Phone</p>
          <p id="adminStatConfirmed" class="text-2xl font-extrabold text-emerald-400 mt-1">0</p>
        </div>
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
          <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Deleted Defaults</p>
          <p id="adminStatDeleted" class="text-2xl font-extrabold text-rose-400 mt-1">0</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-2 border-b border-slate-700 pb-2 overflow-x-auto">
        <button
          id="tabBtnPending"
          type="button"
          class="admin-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-indigo-600 text-white"
        >
          Pending Reviews (<span id="tabCountPending">0</span>)
        </button>
        <button
          id="tabBtnActive"
          type="button"
          class="admin-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-slate-800 text-slate-400 hover:text-white"
        >
          All Active Listings (<span id="tabCountActive">36</span>)
        </button>
        <button
          id="tabBtnTrash"
          type="button"
          class="admin-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-slate-800 text-slate-400 hover:text-white"
        >
          Trash &amp; Defaults (<span id="tabCountTrash">0</span>)
        </button>
        <button
          id="tabBtnExport"
          type="button"
          class="admin-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-slate-800 text-slate-400 hover:text-white ml-auto"
        >
          Export CSV
        </button>
      </div>

      <!-- TAB 1: PENDING REVIEWS -->
      <section id="panelPending" class="space-y-4">
        <div id="pendingList" class="space-y-4">
          <!-- Pending items injected here -->
        </div>
      </section>

      <!-- TAB 2: ACTIVE LISTINGS & MODERATION -->
      <section id="panelActive" class="hidden space-y-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <input
            id="adminSearchInput"
            type="search"
            placeholder="Search active listings..."
            class="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select id="adminCityFilter" class="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white">
            <option value="All">All Cities</option>
            <option value="Kolar">Kolar</option>
            <option value="Chintamani">Chintamani</option>
          </select>
        </div>

        <div id="activeList" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Active listings injected here -->
        </div>
      </section>

      <!-- TAB 3: TRASH & DELETED DEFAULTS -->
      <section id="panelTrash" class="hidden space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-200">Deleted Base Listings</h2>
          <button
            id="adminRestoreAllBtn"
            type="button"
            class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            Restore All Defaults
          </button>
        </div>
        <div id="trashList" class="space-y-3">
          <!-- Deleted base listings -->
        </div>
      </section>

      <!-- TAB 4: EXPORT TOOLS -->
      <section id="panelExport" class="hidden bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4 max-w-xl">
        <h2 class="text-base font-bold text-white">Export Directory Data (Admin Only)</h2>
        <p class="text-xs text-slate-400">Download formatted CSV reports of public directory contacts and pending review submissions.</p>
        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            id="downloadActiveCsvBtn"
            type="button"
            class="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            Export Active Listings CSV
          </button>
          <button
            id="downloadPendingCsvBtn"
            type="button"
            class="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Export Pending Reviews CSV
          </button>
        </div>
      </section>
    </main>
  </div>

  <!-- ==================== ADMIN EDIT CONTACT MODAL ==================== -->
  <div
    id="adminEditModal"
    class="hidden fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
  >
    <div class="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 my-8">
      <div class="flex items-center justify-between pb-3 border-b border-slate-700">
        <h3 id="adminEditModalTitle" class="text-base font-bold text-white">Edit Contact</h3>
        <button id="closeAdminEditModalBtn" type="button" class="text-slate-400 hover:text-white p-1">&times;</button>
      </div>

      <form id="adminEditForm" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase mb-1">Business Name</label>
          <input id="editName" type="text" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1">City</label>
            <select id="editCity" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white">
              <option value="Kolar">Kolar</option>
              <option value="Chintamani">Chintamani</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase mb-1">Primary Phone</label>
            <input id="editPhone" type="text" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase mb-1">Alternate Phone</label>
          <input id="editAltPhone" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase mb-1">Address</label>
          <input id="editAddress" type="text" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase mb-1">Operating Hours</label>
          <input id="editHours" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
          <textarea id="editDesc" rows="2" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white resize-none"></textarea>
        </div>

        <!-- Confirmed by Phone Switch -->
        <div class="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-700">
          <input id="editVerified" type="checkbox" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
          <label for="editVerified" class="text-xs sm:text-sm font-semibold text-emerald-300 cursor-pointer">Mark as "Confirmed by phone"</label>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
          <button id="cancelAdminEditBtn" type="button" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white">Cancel</button>
          <button id="saveAdminEditBtn" type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Toast -->
  <div id="adminToastContainer" class="fixed bottom-5 right-5 z-50 pointer-events-none flex flex-col gap-2 items-end"></div>

  <!-- ==================== ADMIN SCRIPT ==================== -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
    import {
      getAuth,
      signInWithEmailAndPassword,
      GoogleAuthProvider,
      signInWithPopup,
      signOut,
      onAuthStateChanged
    } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
    import {
      getFirestore,
      doc,
      setDoc,
      updateDoc,
      deleteDoc,
      collection,
      onSnapshot
    } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

    const DEFAULT_LISTINGS = ${JSON.stringify(DEFAULT_LISTINGS, null, 6)};
    const DEFAULT_ID_SET = new Set(DEFAULT_LISTINGS.map(item => item.id));

    const firebaseConfig = ${FIREBASE_CONFIG_LITERAL};
    const appId = "kolar-chintamani-phonebook";

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    let currentAdminUser = null;
    let rawCommunityContacts = [];
    let baseOverrides = {};
    let editingItem = null;

    // DOM Elements
    const loginView = document.getElementById('loginView');
    const dashboardView = document.getElementById('dashboardView');
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const emailLoginForm = document.getElementById('emailLoginForm');
    const adminEmailInput = document.getElementById('adminEmail');
    const adminPasswordInput = document.getElementById('adminPassword');
    const loginErrorMsg = document.getElementById('loginErrorMsg');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminUserBadge = document.getElementById('adminUserBadge');

    const adminStatPending = document.getElementById('adminStatPending');
    const adminStatActive = document.getElementById('adminStatActive');
    const adminStatConfirmed = document.getElementById('adminStatConfirmed');
    const adminStatDeleted = document.getElementById('adminStatDeleted');

    const tabBtnPending = document.getElementById('tabBtnPending');
    const tabBtnActive = document.getElementById('tabBtnActive');
    const tabBtnTrash = document.getElementById('tabBtnTrash');
    const tabBtnExport = document.getElementById('tabBtnExport');
    const tabCountPending = document.getElementById('tabCountPending');
    const tabCountActive = document.getElementById('tabCountActive');
    const tabCountTrash = document.getElementById('tabCountTrash');

    const panelPending = document.getElementById('panelPending');
    const panelActive = document.getElementById('panelActive');
    const panelTrash = document.getElementById('panelTrash');
    const panelExport = document.getElementById('panelExport');

    const pendingList = document.getElementById('pendingList');
    const activeList = document.getElementById('activeList');
    const trashList = document.getElementById('trashList');
    const adminSearchInput = document.getElementById('adminSearchInput');
    const adminCityFilter = document.getElementById('adminCityFilter');
    const adminRestoreAllBtn = document.getElementById('adminRestoreAllBtn');

    const adminEditModal = document.getElementById('adminEditModal');
    const closeAdminEditModalBtn = document.getElementById('closeAdminEditModalBtn');
    const cancelAdminEditBtn = document.getElementById('cancelAdminEditBtn');
    const adminEditForm = document.getElementById('adminEditForm');
    const editName = document.getElementById('editName');
    const editCity = document.getElementById('editCity');
    const editPhone = document.getElementById('editPhone');
    const editAltPhone = document.getElementById('editAltPhone');
    const editAddress = document.getElementById('editAddress');
    const editHours = document.getElementById('editHours');
    const editDesc = document.getElementById('editDesc');
    const editVerified = document.getElementById('editVerified');

    const downloadActiveCsvBtn = document.getElementById('downloadActiveCsvBtn');
    const downloadPendingCsvBtn = document.getElementById('downloadPendingCsvBtn');
    const adminToastContainer = document.getElementById('adminToastContainer');

    function showAdminToast(msg, type = 'success') {
      const toast = document.createElement('div');
      const bg = type === 'error' ? 'bg-rose-600' : 'bg-indigo-600';
      toast.className = \`pointer-events-auto \${bg} text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-white/10 transition-all duration-300 translate-y-2 opacity-0\`;
      toast.textContent = msg;
      adminToastContainer.appendChild(toast);
      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
      });
      setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // 1. AUTHENTICATION LISTENER
    onAuthStateChanged(auth, (user) => {
      // Must be non-anonymous to access admin panel
      if (user && !user.isAnonymous) {
        currentAdminUser = user;
        loginView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        adminUserBadge.innerHTML = \`Signed in as: <span class="text-indigo-300 font-mono font-semibold">\${user.email || user.displayName || user.uid}</span>\`;
        initAdminData();
      } else {
        currentAdminUser = null;
        dashboardView.classList.add('hidden');
        loginView.classList.remove('hidden');
      }
    });

    function formatAuthError(err) {
      if (!err) return 'An unknown error occurred.';
      if (err.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname || 'your current domain';
        return 'Domain unauthorized: "' + domain + '" is not in your Firebase Authorized Domains. In Firebase Console, go to Authentication > Settings > Authorized domains and add "' + domain + '".';
      }
      if (err.code === 'auth/popup-blocked') {
        return 'Sign-in popup was blocked by browser. Please enable popups or sign in with Email & Password.';
      }
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        return 'Invalid admin email or password.';
      }
      return err.message || 'Authentication failed. Please try again.';
    }

    // Google Sign-In
    googleLoginBtn.addEventListener('click', async () => {
      loginErrorMsg.classList.add('hidden');
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        showAdminToast('Welcome to Admin Portal');
      } catch (err) {
        console.error('Google sign-in error:', err);
        loginErrorMsg.textContent = formatAuthError(err);
        loginErrorMsg.classList.remove('hidden');
      }
    });

    // Email & Password Sign-In
    emailLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginErrorMsg.classList.add('hidden');
      const email = adminEmailInput.value.trim();
      const password = adminPasswordInput.value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        showAdminToast('Signed in successfully');
      } catch (err) {
        console.error('Email sign-in error:', err);
        loginErrorMsg.textContent = formatAuthError(err);
        loginErrorMsg.classList.remove('hidden');
      }
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
      await signOut(auth);
      showAdminToast('Signed out');
    });

    // 2. DATA SUBSCRIPTIONS
    function initAdminData() {
      // Listen to all contacts in public collection
      onSnapshot(
        collection(db, 'artifacts', appId, 'public', 'data', 'contacts'),
        (snapshot) => {
          const list = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() });
          });
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          rawCommunityContacts = list;
          renderAdminViews();
        },
        (err) => console.error('Admin contacts error:', err)
      );

      // Listen to base overrides
      onSnapshot(
        collection(db, 'artifacts', appId, 'public', 'data', 'base_overrides'),
        (snapshot) => {
          const overrides = {};
          snapshot.forEach((docSnap) => {
            overrides[docSnap.id] = docSnap.data();
          });
          baseOverrides = overrides;
          renderAdminViews();
        },
        (err) => console.error('Admin overrides error:', err)
      );
    }

    // 3. MERGE & CALCULATE LISTS
    function getMergedActiveListings() {
      const activeDefaults = DEFAULT_LISTINGS.reduce((acc, base) => {
        const ovr = baseOverrides[base.id];
        if (ovr && ovr.deleted) return acc;
        if (ovr) {
          acc.push({
            ...base,
            name: ovr.name || base.name,
            city: ovr.city || base.city,
            categories: Array.isArray(ovr.categories) && ovr.categories.length > 0 ? ovr.categories : base.categories,
            phone: ovr.phone || base.phone,
            altPhone: ovr.altPhone || '',
            address: ovr.address || base.address,
            hours: ovr.hours || base.hours,
            desc: ovr.desc !== undefined ? ovr.desc : base.desc,
            verified: Boolean(ovr.verified !== undefined ? ovr.verified : base.verified),
            isBase: true
          });
        } else {
          acc.push({ ...base, altPhone: '', verified: Boolean(base.verified), isBase: true });
        }
        return acc;
      }, []);

      const approvedCommunity = rawCommunityContacts.filter((c) => c.status === 'approved').map((c) => ({
        ...c,
        isCommunity: true
      }));

      return [...approvedCommunity, ...activeDefaults];
    }

    function getPendingSubmissions() {
      return rawCommunityContacts.filter((c) => c.status === 'pending');
    }

    function getDeletedBaseListings() {
      return DEFAULT_LISTINGS.filter((base) => baseOverrides[base.id] && baseOverrides[base.id].deleted);
    }

    // 4. RENDER ADMIN VIEWS
    function renderAdminViews() {
      const pending = getPendingSubmissions();
      const active = getMergedActiveListings();
      const deleted = getDeletedBaseListings();
      const confirmedCount = active.filter((i) => i.verified).length;

      // Update counters
      adminStatPending.textContent = pending.length;
      adminStatActive.textContent = active.length;
      adminStatConfirmed.textContent = confirmedCount;
      adminStatDeleted.textContent = deleted.length;

      tabCountPending.textContent = pending.length;
      tabCountActive.textContent = active.length;
      tabCountTrash.textContent = deleted.length;

      // Render Pending Tab
      renderPendingTab(pending);

      // Render Active Tab
      renderActiveTab(active);

      // Render Trash Tab
      renderTrashTab(deleted);
    }

    function renderPendingTab(pending) {
      if (pending.length === 0) {
        pendingList.innerHTML = \`
          <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 text-center">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-white">Pending Review Queue is Empty</h3>
            <p class="text-xs text-slate-400 mt-1">All visitor submissions have been reviewed and processed.</p>
          </div>
        \`;
        return;
      }

      pendingList.innerHTML = pending.map((item) => {
        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent';
        return \`
          <div class="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending Review</span>
                  <span class="text-xs text-slate-400">Submitted: \${dateStr}</span>
                </div>
                <h3 class="text-base font-bold text-white mt-1">\${item.name}</h3>
              </div>
              <div class="text-xs font-mono text-indigo-300 bg-slate-900 px-2.5 py-1 rounded-lg">City: \${item.city}</div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <p><span class="text-slate-500">Primary Phone:</span> <strong class="text-white">\${item.phone}</strong></p>
              \${item.altPhone ? \`<p><span class="text-slate-500">Alt Phone:</span> \${item.altPhone}</p>\` : ''}
              <p><span class="text-slate-500">Categories:</span> \${(item.categories || []).join(', ')}</p>
              <p><span class="text-slate-500">Address:</span> \${item.address}</p>
              \${item.hours ? \`<p><span class="text-slate-500">Hours:</span> \${item.hours}</p>\` : ''}
              \${item.desc ? \`<p class="sm:col-span-2"><span class="text-slate-500">Notes:</span> \${item.desc}</p>\` : ''}
            </div>

            <div class="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-700">
              <button
                type="button"
                data-reject-id="\${item.id}"
                class="reject-btn px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
              >
                Reject / Delete
              </button>
              <button
                type="button"
                data-edit-pending-id="\${item.id}"
                class="edit-pending-btn px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Edit Details
              </button>
              <button
                type="button"
                data-approve-id="\${item.id}"
                class="approve-btn px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Approve (Publish Live)
              </button>
              <button
                type="button"
                data-approve-confirmed-id="\${item.id}"
                class="approve-confirmed-btn px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Approve &amp; Mark Confirmed
              </button>
            </div>
          </div>
        \`;
      }).join('');
    }

    function renderActiveTab(active) {
      const search = adminSearchInput.value.trim().toLowerCase();
      const city = adminCityFilter.value;

      const filtered = active.filter((i) => {
        if (city !== 'All' && i.city !== city) return false;
        if (!search) return true;
        return (
          i.name.toLowerCase().includes(search) ||
          i.phone.toLowerCase().includes(search) ||
          i.address.toLowerCase().includes(search) ||
          i.categories.some((c) => c.toLowerCase().includes(search))
        );
      });

      if (filtered.length === 0) {
        activeList.innerHTML = \`<p class="text-xs text-slate-400 col-span-2 text-center py-8">No matching active contacts.</p>\`;
        return;
      }

      activeList.innerHTML = filtered.map((item) => {
        return \`
          <div class="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900 text-slate-300 border border-slate-700">\${item.city}</span>
                  \${item.verified ? \`<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Confirmed by phone</span>\` : ''}
                </div>
                <label class="inline-flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    data-toggle-verify="\${item.id}"
                    \${item.verified ? 'checked' : ''}
                    class="rounded text-emerald-500 focus:ring-emerald-400"
                  />
                  <span>Confirmed</span>
                </label>
              </div>

              <h4 class="text-sm font-bold text-white">\${item.name}</h4>
              <p class="text-xs text-slate-400 mt-0.5">\${item.categories.join(' · ')}</p>
              <p class="text-xs text-indigo-300 font-mono mt-1.5">\${item.phone}\${item.altPhone ? ' / ' + item.altPhone : ''}</p>
              <p class="text-xs text-slate-400 mt-1 truncate">\${item.address}</p>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-700">
              <button
                type="button"
                data-edit-active-id="\${item.id}"
                class="edit-active-btn px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                data-delete-active-id="\${item.id}"
                class="delete-active-btn px-3 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-medium border border-rose-500/30 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        \`;
      }).join('');
    }

    function renderTrashTab(deleted) {
      if (deleted.length === 0) {
        trashList.innerHTML = \`<p class="text-xs text-slate-400 text-center py-6">No deleted base listings.</p>\`;
        adminRestoreAllBtn.disabled = true;
        adminRestoreAllBtn.classList.add('opacity-50', 'cursor-not-allowed');
        return;
      }

      adminRestoreAllBtn.disabled = false;
      adminRestoreAllBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      trashList.innerHTML = deleted.map((item) => {
        return \`
          <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-800 border border-slate-700 gap-3">
            <div>
              <p class="text-sm font-bold text-white">\${item.name}</p>
              <p class="text-xs text-slate-400">\${item.city} · \${item.phone}</p>
            </div>
            <button
              type="button"
              data-restore-base-id="\${item.id}"
              class="restore-base-btn px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Restore
            </button>
          </div>
        \`;
      }).join('');
    }

    // Tab Switcher
    function switchTab(tab) {
      [tabBtnPending, tabBtnActive, tabBtnTrash, tabBtnExport].forEach(b => {
        b.className = 'admin-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-slate-800 text-slate-400 hover:text-white';
      });
      [panelPending, panelActive, panelTrash, panelExport].forEach(p => p.classList.add('hidden'));

      if (tab === 'pending') {
        tabBtnPending.className = 'admin-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-indigo-600 text-white';
        panelPending.classList.remove('hidden');
      } else if (tab === 'active') {
        tabBtnActive.className = 'admin-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-indigo-600 text-white';
        panelActive.classList.remove('hidden');
      } else if (tab === 'trash') {
        tabBtnTrash.className = 'admin-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-indigo-600 text-white';
        panelTrash.classList.remove('hidden');
      } else if (tab === 'export') {
        tabBtnExport.className = 'admin-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-indigo-600 text-white';
        panelExport.classList.remove('hidden');
      }
    }

    tabBtnPending.addEventListener('click', () => switchTab('pending'));
    tabBtnActive.addEventListener('click', () => switchTab('active'));
    tabBtnTrash.addEventListener('click', () => switchTab('trash'));
    tabBtnExport.addEventListener('click', () => switchTab('export'));

    adminSearchInput.addEventListener('input', () => renderActiveTab(getMergedActiveListings()));
    adminCityFilter.addEventListener('change', () => renderActiveTab(getMergedActiveListings()));

    // 5. ACTIONS: APPROVE / REJECT / TOGGLE VERIFIED / EDIT / DELETE
    pendingList.addEventListener('click', async (e) => {
      const approveBtn = e.target.closest('.approve-btn');
      if (approveBtn) {
        const id = approveBtn.getAttribute('data-approve-id');
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'contacts', id), {
          status: 'approved',
          approvedAt: Date.now(),
          approvedBy: currentAdminUser.email
        });
        showAdminToast('Listing approved and published live!');
        return;
      }

      const approveConfBtn = e.target.closest('.approve-confirmed-btn');
      if (approveConfBtn) {
        const id = approveConfBtn.getAttribute('data-approve-confirmed-id');
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'contacts', id), {
          status: 'approved',
          verified: true,
          approvedAt: Date.now(),
          approvedBy: currentAdminUser.email
        });
        showAdminToast('Approved with "Confirmed by phone" badge!');
        return;
      }

      const rejectBtn = e.target.closest('.reject-btn');
      if (rejectBtn) {
        const id = rejectBtn.getAttribute('data-reject-id');
        if (confirm('Permanently reject and delete this submission?')) {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'contacts', id));
          showAdminToast('Submission rejected and removed');
        }
        return;
      }

      const editBtn = e.target.closest('.edit-pending-btn');
      if (editBtn) {
        const id = editBtn.getAttribute('data-edit-pending-id');
        const item = rawCommunityContacts.find((c) => c.id === id);
        if (item) openAdminEditModal(item);
      }
    });

    activeList.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('.edit-active-btn');
      if (editBtn) {
        const id = editBtn.getAttribute('data-edit-active-id');
        const item = getMergedActiveListings().find((c) => c.id === id);
        if (item) openAdminEditModal(item);
        return;
      }

      const deleteBtn = e.target.closest('.delete-active-btn');
      if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-delete-active-id');
        const item = getMergedActiveListings().find((c) => c.id === id);
        if (!item) return;

        if (confirm(\`Delete "\${item.name}" from public directory?\`)) {
          if (DEFAULT_ID_SET.has(id)) {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'base_overrides', id), {
              deleted: true,
              deletedAt: Date.now(),
              deletedBy: currentAdminUser.email
            }, { merge: true });
          } else {
            await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'contacts', id));
          }
          showAdminToast(\`Deleted "\${item.name}"\`);
        }
      }
    });

    activeList.addEventListener('change', async (e) => {
      const toggle = e.target.closest('input[data-toggle-verify]');
      if (toggle) {
        const id = toggle.getAttribute('data-toggle-verify');
        const isChecked = toggle.checked;
        if (DEFAULT_ID_SET.has(id)) {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'base_overrides', id), {
            verified: isChecked,
            updatedAt: Date.now(),
            updatedBy: currentAdminUser.email
          }, { merge: true });
        } else {
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'contacts', id), {
            verified: isChecked,
            updatedAt: Date.now(),
            updatedBy: currentAdminUser.email
          });
        }
        showAdminToast(isChecked ? 'Marked Confirmed by Phone' : 'Removed Confirmed badge');
      }
    });

    trashList.addEventListener('click', async (e) => {
      const restoreBtn = e.target.closest('.restore-base-btn');
      if (restoreBtn) {
        const id = restoreBtn.getAttribute('data-restore-base-id');
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'base_overrides', id), {
          deleted: false,
          restoredAt: Date.now(),
          restoredBy: currentAdminUser.email
        }, { merge: true });
        showAdminToast('Restored listing to directory');
      }
    });

    adminRestoreAllBtn.addEventListener('click', async () => {
      const deleted = getDeletedBaseListings();
      if (deleted.length === 0) return;
      await Promise.all(
        deleted.map((item) =>
          setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'base_overrides', item.id), {
            deleted: false,
            restoredAt: Date.now(),
            restoredBy: currentAdminUser.email
          }, { merge: true })
        )
      );
      showAdminToast(\`Restored \${deleted.length} default listings\`);
    });

    // 6. EDIT MODAL
    function openAdminEditModal(item) {
      editingItem = item;
      editName.value = item.name || '';
      editCity.value = item.city || 'Kolar';
      editPhone.value = item.phone || '';
      editAltPhone.value = item.altPhone || '';
      editAddress.value = item.address || '';
      editHours.value = item.hours || '';
      editDesc.value = item.desc || '';
      editVerified.checked = Boolean(item.verified);
      adminEditModal.classList.remove('hidden');
    }

    function closeAdminEditModal() {
      editingItem = null;
      adminEditModal.classList.add('hidden');
    }

    closeAdminEditModalBtn.addEventListener('click', closeAdminEditModal);
    cancelAdminEditBtn.addEventListener('click', closeAdminEditModal);

    adminEditForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!editingItem) return;

      const payload = {
        name: editName.value.trim(),
        city: editCity.value,
        phone: editPhone.value.trim(),
        altPhone: editAltPhone.value.trim(),
        address: editAddress.value.trim(),
        hours: editHours.value.trim() || 'Call to confirm availability',
        desc: editDesc.value.trim(),
        verified: editVerified.checked,
        updatedAt: Date.now(),
        updatedBy: currentAdminUser.email
      };

      const isBase = DEFAULT_ID_SET.has(editingItem.id);
      if (isBase) {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'base_overrides', editingItem.id), {
          ...payload,
          deleted: false
        }, { merge: true });
      } else {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'contacts', editingItem.id), payload);
      }

      closeAdminEditModal();
      showAdminToast('Changes saved successfully');
    });

    // 7. CSV EXPORT (ADMIN ONLY)
    function exportCsv(data, filename) {
      const escapeCsv = (str) => \`"\${String(str || '').replace(/"/g, '""')}"\`;
      const headers = ['ID', 'Name', 'City', 'Phone', 'Alt Phone', 'Address', 'Categories', 'Hours', 'Status', 'Verified', 'Description'];
      const rows = data.map((item) => [
        item.id,
        item.name,
        item.city,
        item.phone,
        item.altPhone || '',
        item.address,
        (item.categories || []).join(' / '),
        item.hours || '',
        item.status || 'approved',
        item.verified ? 'Yes' : 'No',
        item.desc || ''
      ].map(escapeCsv).join(','));

      const csvContent = [headers.map(escapeCsv).join(','), ...rows].join('\\r\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showAdminToast(\`Exported \${data.length} listings to CSV\`);
    }

    downloadActiveCsvBtn.addEventListener('click', () => {
      exportCsv(getMergedActiveListings(), 'kolar-chintamani-active-listings.csv');
    });

    downloadPendingCsvBtn.addEventListener('click', () => {
      exportCsv(getPendingSubmissions(), 'kolar-chintamani-pending-reviews.csv');
    });
  </script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// 3. BUILD CITY & TRADE SPECIALIZED LANDING PAGES FOR SEO
// ---------------------------------------------------------------------------
function buildSpecializedPage({ city, trade, title, description, pathSlug, canonicalUrl }) {
  const filtered = DEFAULT_LISTINGS.filter((item) => {
    if (city && item.city !== city) return false;
    if (trade && !item.categories.includes(trade)) return false;
    return true;
  });

  const cardsHtml = filtered.map((item) => generateCardHtml(item)).join('\n');
  const jsonLd = generateJsonLd(filtered);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | Kolar &amp; Chintamani Phonebook</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${SITE_URL}/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${SITE_URL}/og-image.png" />

  <script type="application/ld+json">
${jsonLd}
  </script>

  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style> body { font-family: 'Inter', system-ui, sans-serif; } </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
  <header class="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <a href="/" class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-md">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
        <div>
          <h1 class="text-base sm:text-lg font-bold text-white">${escapeHtml(title)}</h1>
          <p class="text-xs text-slate-400">Local service directory &middot; <a href="/" class="text-indigo-300 hover:underline">&larr; View All Services</a></p>
        </div>
      </div>
      <a
        href="https://api.whatsapp.com/send?text=${encodeURIComponent('Find ' + title + ': ' + canonicalUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-semibold shadow-sm transition-all"
      >
        <span>Share on WhatsApp</span>
      </a>
    </div>
  </header>

  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <nav class="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <a href="/" class="hover:text-indigo-600">Home</a>
          <span>&rsaquo;</span>
          ${city ? `<a href="/${city.toLowerCase()}" class="hover:text-indigo-600">${escapeHtml(city)}</a><span>&rsaquo;</span>` : ''}
          <span class="font-semibold text-slate-800">${escapeHtml(trade || city)}</span>
        </nav>
        <h2 class="text-xl font-extrabold text-slate-900">${escapeHtml(title)}</h2>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">${escapeHtml(description)}</p>
      </div>
      <a href="/" class="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors">
        Browse All Services &rarr;
      </a>
    </div>

    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
${cardsHtml}
    </section>
  </main>

  <footer class="bg-white border-t border-slate-200 mt-12 py-5 text-center text-xs text-slate-500">
    <p>Kolar &amp; Chintamani Local Service Phonebook &middot; <a href="/" class="text-indigo-600 hover:underline">Full Directory</a> &middot; <a href="/admin" class="hover:underline">Admin Login</a></p>
  </footer>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// 4. MAIN BUILD PROCESS
// ---------------------------------------------------------------------------
function runBuild() {
  console.log('--- STARTING BUILD PROCESS ---');

  // 1. Write index.html
  const indexHtml = buildIndexHtml();
  fs.writeFileSync('index.html', indexHtml);
  fs.writeFileSync('kolar_chintamani_service_phonebook.html', indexHtml);
  console.log('✓ Created index.html and synced kolar_chintamani_service_phonebook.html');

  // 2. Write admin.html
  const adminHtml = buildAdminHtml();
  fs.writeFileSync('admin.html', adminHtml);
  console.log('✓ Created admin.html');

  // 3. Write og-image.png (1200x630 binary PNG)
  const ogImageBuf = generateOgImagePng();
  fs.writeFileSync('og-image.png', ogImageBuf);
  console.log('✓ Created og-image.png (1200x630)');

  // 4. Write Netlify Configs
  const { redirects, toml } = generateNetlifyConfig();
  fs.writeFileSync('_redirects', redirects);
  fs.writeFileSync('netlify.toml', toml);
  console.log('✓ Created _redirects and netlify.toml');

  // 5. Write Firestore Security Rules
  const firestoreRules = generateFirestoreRules();
  fs.writeFileSync('firestore.rules', firestoreRules);
  console.log('✓ Created firestore.rules');

  // 6. Generate Specialized Landing Pages
  const specializedPages = [
    // City Landing Pages
    {
      city: 'Kolar',
      title: 'Plumbers, Electricians & Technicians in Kolar',
      description: 'Directory of verified local plumbers, electricians, painters, carpenters, AC repair and welders in Kolar, Karnataka.',
      dir: 'kolar',
      path: '/kolar',
      priority: '0.9'
    },
    {
      city: 'Chintamani',
      title: 'Plumbers, Electricians & Technicians in Chintamani',
      description: 'Directory of verified local plumbers, electricians, painters, carpenters, AC repair and welders in Chintamani, Karnataka.',
      dir: 'chintamani',
      path: '/chintamani',
      priority: '0.9'
    },
    // Kolar Trades
    {
      city: 'Kolar',
      trade: 'Plumbers',
      title: 'Plumbers in Kolar',
      description: 'Find contact numbers, addresses, and WhatsApp links for plumbers in Kolar, Karnataka.',
      dir: 'kolar/plumbers',
      path: '/kolar/plumbers',
      priority: '0.8'
    },
    {
      city: 'Kolar',
      trade: 'Electricians',
      title: 'Electricians in Kolar',
      description: 'Find contact numbers, addresses, and WhatsApp links for electricians in Kolar, Karnataka.',
      dir: 'kolar/electricians',
      path: '/kolar/electricians',
      priority: '0.8'
    },
    {
      city: 'Kolar',
      trade: 'Painters',
      title: 'Painters in Kolar',
      description: 'Find contact numbers, addresses, and WhatsApp links for building and house painters in Kolar, Karnataka.',
      dir: 'kolar/painters',
      path: '/kolar/painters',
      priority: '0.8'
    },
    {
      city: 'Kolar',
      trade: 'AC & Appliance Repair',
      title: 'AC & Appliance Repair in Kolar',
      description: 'Find contact numbers, addresses, and WhatsApp links for AC and appliance repair technicians in Kolar, Karnataka.',
      dir: 'kolar/ac-repair',
      path: '/kolar/ac-repair',
      priority: '0.8'
    },
    {
      city: 'Kolar',
      trade: 'Welding & Fabrication',
      title: 'Welding & Fabrication in Kolar',
      description: 'Find contact numbers, addresses, and WhatsApp links for welding and fabrication workshops in Kolar, Karnataka.',
      dir: 'kolar/welding',
      path: '/kolar/welding',
      priority: '0.8'
    },
    // Chintamani Trades
    {
      city: 'Chintamani',
      trade: 'Electricians',
      title: 'Electricians in Chintamani',
      description: 'Find contact numbers, addresses, and WhatsApp links for electricians in Chintamani, Karnataka.',
      dir: 'chintamani/electricians',
      path: '/chintamani/electricians',
      priority: '0.8'
    },
    {
      city: 'Chintamani',
      trade: 'Painters',
      title: 'Painters in Chintamani',
      description: 'Find contact numbers, addresses, and WhatsApp links for painters in Chintamani, Karnataka.',
      dir: 'chintamani/painters',
      path: '/chintamani/painters',
      priority: '0.8'
    },
    {
      city: 'Chintamani',
      trade: 'Carpenters',
      title: 'Carpenters in Chintamani',
      description: 'Find contact numbers, addresses, and WhatsApp links for carpenters in Chintamani, Karnataka.',
      dir: 'chintamani/carpenters',
      path: '/chintamani/carpenters',
      priority: '0.8'
    },
    {
      city: 'Chintamani',
      trade: 'AC & Appliance Repair',
      title: 'AC & Appliance Repair in Chintamani',
      description: 'Find contact numbers, addresses, and WhatsApp links for AC and appliance repair technicians in Chintamani, Karnataka.',
      dir: 'chintamani/ac-repair',
      path: '/chintamani/ac-repair',
      priority: '0.8'
    },
    {
      city: 'Chintamani',
      trade: 'Welding & Fabrication',
      title: 'Welding & Fabrication in Chintamani',
      description: 'Find contact numbers, addresses, and WhatsApp links for welding and fabrication workshops in Chintamani, Karnataka.',
      dir: 'chintamani/welding',
      path: '/chintamani/welding',
      priority: '0.8'
    }
  ];

  specializedPages.forEach((p) => {
    fs.mkdirSync(p.dir, { recursive: true });
    const pageHtml = buildSpecializedPage({
      city: p.city,
      trade: p.trade,
      title: p.title,
      description: p.description,
      pathSlug: p.path,
      canonicalUrl: `${SITE_URL}${p.path}`
    });
    fs.writeFileSync(path.join(p.dir, 'index.html'), pageHtml);
    console.log(`✓ Generated landing page: ${p.path}`);
  });

  // 7. Write robots.txt and sitemap.xml
  const sitemapRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    ...specializedPages.map((p) => ({ path: p.path, priority: p.priority, changefreq: 'weekly' }))
  ];
  fs.writeFileSync('robots.txt', generateRobotsTxt());
  fs.writeFileSync('sitemap.xml', generateSitemapXml(sitemapRoutes));
  console.log('✓ Created robots.txt and sitemap.xml');

  console.log('--- BUILD COMPLETE ---');
}

runBuild();
